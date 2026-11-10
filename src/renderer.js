const VS = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNor;
layout(location=2) in vec3 iPos;
layout(location=3) in vec3 iSize;
layout(location=4) in vec3 iColor;
layout(location=5) in vec4 iQuat;
uniform mat4 uVP;
out vec3 vColor; out vec3 vNor; out float vDist;
mat3 qmat(vec4 q){
  float x=q.x,y=q.y,z=q.z,w=q.w;
  return mat3(
    1.-2.*(y*y+z*z), 2.*(x*y+w*z), 2.*(x*z-w*y),
    2.*(x*y-w*z), 1.-2.*(x*x+z*z), 2.*(y*z+w*x),
    2.*(x*z+w*y), 2.*(y*z-w*x), 1.-2.*(x*x+y*y));
}
void main(){
  mat3 R = qmat(iQuat);
  vec3 world = R*(aPos*iSize) + iPos;
  gl_Position = uVP * vec4(world,1.);
  vNor = R*aNor; vColor = iColor; vDist = gl_Position.w;
}`;

const FS = `#version 300 es
precision mediump float;
in vec3 vColor; in vec3 vNor; in float vDist;
uniform vec3 uFog;
out vec4 o;
void main(){
  vec3 N = normalize(vNor);
  vec3 L = normalize(vec3(-0.35,-0.30,0.88));
  float d = max(dot(N,L),0.0);
  float top = abs(N.z) > 0.7 ? 0.12 : 0.0;
  float lit = 0.38 + 0.62*d + top;
  vec3 c = clamp(vColor*lit, 0.0, 1.0);
  float f = clamp((vDist-140.)/560., 0., 1.);
  o = vec4(mix(c,uFog,f*f),1.);
}`;

export function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function quatAxis(ax, ang) {
  const s = Math.sin(ang / 2), c = Math.cos(ang / 2);
  return [ax[0] * s, ax[1] * s, ax[2] * s, c];
}
export function qmul(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}
export function yawPitchRoll(yaw, pitch, roll) {
  return qmul(qmul(quatAxis([0, 0, 1], yaw), quatAxis([0, 1, 0], -pitch)), quatAxis([1, 0, 0], roll));
}

const IDENT = [0, 0, 0, 1];

function cubeGeo() {
  const p = [], n = [];
  const face = (nx, ny, nz, u, v) => {
    const c = [nx / 2, ny / 2, nz / 2];
    const pts = [
      [c[0] + u[0] * -0.5 + v[0] * -0.5, c[1] + u[1] * -0.5 + v[1] * -0.5, c[2] + u[2] * -0.5 + v[2] * -0.5],
      [c[0] + u[0] * 0.5 + v[0] * -0.5, c[1] + u[1] * 0.5 + v[1] * -0.5, c[2] + u[2] * 0.5 + v[2] * -0.5],
      [c[0] + u[0] * 0.5 + v[0] * 0.5, c[1] + u[1] * 0.5 + v[1] * 0.5, c[2] + u[2] * 0.5 + v[2] * 0.5],
      [c[0] + u[0] * -0.5 + v[0] * 0.5, c[1] + u[1] * -0.5 + v[1] * 0.5, c[2] + u[2] * -0.5 + v[2] * 0.5],
    ];
    const tri = (a, b2, c2) => { for (const v of [a, b2, c2]) { p.push(...v); n.push(nx, ny, nz); } };
    tri(pts[0], pts[1], pts[2]); tri(pts[0], pts[2], pts[3]);
  };
  face(0, 0, 1, [1, 0, 0], [0, 1, 0]);
  face(0, 0, -1, [0, 1, 0], [1, 0, 0]);
  face(1, 0, 0, [0, 1, 0], [0, 0, 1]);
  face(-1, 0, 0, [0, 0, 1], [0, 1, 0]);
  face(0, 1, 0, [1, 0, 0], [0, 0, 1]);
  face(0, -1, 0, [0, 0, 1], [1, 0, 0]);
  return { p: new Float32Array(p), n: new Float32Array(n) };
}

function lookAtVP(out, cam, yaw, pitch, fov, aspect) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const fx = cy * cp, fy = sy * cp, fz = sp;
  const rx = sy, ry = -cy, rz = 0;
  const ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
  const vx = -(rx * cam[0] + ry * cam[1] + rz * cam[2]);
  const vy = -(ux * cam[0] + uy * cam[1] + uz * cam[2]);
  const vz = fx * cam[0] + fy * cam[1] + fz * cam[2];
  const V = [rx, ux, -fx, 0, ry, uy, -fy, 0, rz, uz, -fz, 0, vx, vy, vz, 1];
  const f = 1 / Math.tan(fov / 2), near = 0.1, far = 1400;
  const nf = 1 / (near - far);
  const P = [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    out[c * 4 + r] = P[r] * V[c * 4] + P[4 + r] * V[c * 4 + 1] + P[8 + r] * V[c * 4 + 2] + P[12 + r] * V[c * 4 + 3];
  }
}

function frustumPlanes(vp) {
  const rows = [];
  for (let r = 0; r < 4; r++) rows.push([vp[r], vp[4 + r], vp[8 + r], vp[12 + r]]);
  const add = (a, b, s) => {
    const p = [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s, a[3] + b[3] * s];
    const len = Math.hypot(p[0], p[1], p[2]);
    return p.map((q) => q / len);
  };
  return [
    add(rows[3], rows[0], 1), add(rows[3], rows[0], -1),
    add(rows[3], rows[1], 1), add(rows[3], rows[1], -1),
    add(rows[3], rows[2], 1), add(rows[3], rows[2], -1),
  ];
}

export class Renderer {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: false });
    if (!gl) throw new Error('WebGL2 required');
    this.gl = gl;
    this.canvas = canvas;
    const prog = gl.createProgram();
    const sh = (t, s) => {
      const o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o));
      return o;
    };
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    this.prog = prog;
    this.uVP = gl.getUniformLocation(prog, 'uVP');
    this.uFog = gl.getUniformLocation(prog, 'uFog');
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    const g = cubeGeo();
    const geo = new Float32Array(g.p.length + g.n.length);
    for (let i = 0; i < g.p.length / 3; i++) {
      geo[i * 6] = g.p[i * 3]; geo[i * 6 + 1] = g.p[i * 3 + 1]; geo[i * 6 + 2] = g.p[i * 3 + 2];
      geo[i * 6 + 3] = g.n[i * 3]; geo[i * 6 + 4] = g.n[i * 3 + 1]; geo[i * 6 + 5] = g.n[i * 3 + 2];
    }
    this.geoBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuf);
    gl.bufferData(gl.ARRAY_BUFFER, geo, gl.STATIC_DRAW);
    this.STRIDE = 13 * 4;
    this.pending = [];
    this.chunks = [];
    this.dynCap = 512;
    this.dynBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dynBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.dynCap * this.STRIDE, gl.DYNAMIC_DRAW);
    this.dynVAO = this.makeVAO(this.dynBuf);
    this.vp = new Float32Array(16);
  }

  makeVAO(instBuf) {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
    const S = this.STRIDE;
    const spec = [[2, 3, 0], [3, 3, 12], [4, 3, 24], [5, 4, 36]];
    for (const [loc, sz, off] of spec) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, S, off);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindVertexArray(null);
    return vao;
  }

  add(x, y, z, sx, sy, sz, c, q) {
    if (this.pending.length > 4000000) return;
    this.pending.push({ x, y, z, sx, sy, sz, c: typeof c === 'string' ? hexToRgb(c) : c, q: q || IDENT });
  }

  finalize(CELL = 96) {
    const gl = this.gl;
    const map = new Map();
    for (const it of this.pending) {
      const key = Math.floor(it.x / CELL) + ',' + Math.floor(it.y / CELL);
      let a = map.get(key);
      if (!a) { a = []; map.set(key, a); }
      a.push(it);
    }
    for (const a of map.values()) {
      const arr = new Float32Array(a.length * 13);
      let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
      let k = 0;
      for (const it of a) {
        arr[k++] = it.x; arr[k++] = it.y; arr[k++] = it.z;
        arr[k++] = it.sx; arr[k++] = it.sy; arr[k++] = it.sz;
        arr[k++] = it.c[0]; arr[k++] = it.c[1]; arr[k++] = it.c[2];
        arr[k++] = it.q[0]; arr[k++] = it.q[1]; arr[k++] = it.q[2]; arr[k++] = it.q[3];
        const hx = Math.abs(it.sx), hy = Math.abs(it.sy), hz = Math.abs(it.sz);
        minx = Math.min(minx, it.x - hx); maxx = Math.max(maxx, it.x + hx);
        miny = Math.min(miny, it.y - hy); maxy = Math.max(maxy, it.y + hy);
        minz = Math.min(minz, it.z - hz); maxz = Math.max(maxz, it.z + hz);
      }
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      this.chunks.push({
        vao: this.makeVAO(buf), n: a.length,
        cx: (minx + maxx) / 2, cy: (miny + maxy) / 2, cz: (minz + maxz) / 2,
        r: Math.hypot(maxx - minx, maxy - miny, maxz - minz) / 2,
      });
    }
    this.pending = [];
  }

  setDynamic(items) {
    const gl = this.gl;
    const n = Math.min(items.length, this.dynCap);
    const arr = new Float32Array(n * 13);
    let k = 0;
    for (let i = 0; i < n; i++) {
      const it = items[i];
      const c = typeof it.c === 'string' ? hexToRgb(it.c) : it.c;
      const q = it.q || IDENT;
      arr[k++] = it.x; arr[k++] = it.y; arr[k++] = it.z;
      arr[k++] = it.sx; arr[k++] = it.sy; arr[k++] = it.sz;
      arr[k++] = c[0]; arr[k++] = c[1]; arr[k++] = c[2];
      arr[k++] = q[0]; arr[k++] = q[1]; arr[k++] = q[2]; arr[k++] = q[3];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dynBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, arr);
    this.dynN = n;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(this.canvas.clientWidth * dpr), h = Math.round(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
  }

  render(cam) {
    const gl = this.gl;
    this.resize();
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    const sky = cam.sky || '#8fb4d8';
    const sc = typeof sky === 'string' ? hexToRgb(sky) : sky;
    gl.clearColor(sc[0], sc[1], sc[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.prog);
    lookAtVP(this.vp, [cam.x, cam.y, cam.z], cam.yaw, cam.pitch, cam.fov || 1.08, this.canvas.width / this.canvas.height);
    gl.uniformMatrix4fv(this.uVP, false, this.vp);
    gl.uniform3f(this.uFog, sc[0], sc[1], sc[2]);
    const planes = frustumPlanes(this.vp);
    gl.bindVertexArray(this.progVao || this.chunks[0]?.vao);
    for (const ch of this.chunks) {
      let vis = true;
      for (const p of planes) {
        if (p[0] * ch.cx + p[1] * ch.cy + p[2] * ch.cz + p[3] < -ch.r) { vis = false; break; }
      }
      if (!vis) continue;
      gl.bindVertexArray(ch.vao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, ch.n);
    }
    if (this.dynN) {
      gl.bindVertexArray(this.dynVAO);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, this.dynN);
    }
    gl.bindVertexArray(null);
  }
}
