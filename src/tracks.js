// Track definitions: 3 real circuits. Courses authored as ordered segments
// {len meters, turn degrees (+ = left, - = right), r radius (default 45),
//  dz elevation gain, name for HUD}. Waypoints are generated from arcs,
// then smoothed with a closed centripetal Catmull-Rom and resampled at 1 m.

export const TRACKS = [
  {
    id: 'tsukuba',
    name: 'Tsukuba Circuit',
    place: 'Shimotsuma, Ibaraki, Japan',
    realLength: 2045,
    roadHalf: 6.0,
    theme: { grass: [0.36, 0.52, 0.26], sky: [0.56, 0.72, 0.92], trees: 'sparse', standAt: 0.03, standSides: [-1], pitSides: [1], pitAt: 0.10 },
    course: [
      { len: 430, turn: 0, dz: 0, name: 'Pit Straight' },
      { len: 80, turn: 38, r: 70, dz: 0, name: 'Turn 1' },
      { len: 60, turn: -85, r: 50, dz: 0, name: 'S-Curve' },
      { len: 90, turn: -80, r: 45, dz: 0 },
      { len: 150, turn: 32, r: 60, dz: -2 },
      { len: 250, turn: 0, dz: -2 },
      { len: 110, turn: -98, r: 62, dz: -2, name: '100R' },
      { len: 180, turn: 0, dz: -2 },
      { len: 60, turn: -46, r: 40, dz: -2, name: 'S-Hairpin' },
      { len: 55, turn: 188, r: 24, dz: -2 },
      { len: 55, turn: -142, r: 34, dz: -2 },
      { len: 240, turn: 0, dz: -2 },
      { len: 90, turn: 34, r: 55, dz: 2, name: 'Esse' },
      { len: 100, turn: -34, r: 55, dz: 2 },
      { len: 240, turn: 0, dz: 2 },
      { len: 130, turn: 105, r: 42, dz: 2, name: 'Last Corner' },
      { len: 120, turn: 0, dz: 0 },
    ],
  },
  {
    id: 'suzuka',
    name: 'Suzuka Circuit',
    place: 'Suzuka, Mie, Japan — figure-eight',
    realLength: 5807,
    roadHalf: 7.5,
    theme: {
      grass: [0.40, 0.55, 0.28], sky: [0.53, 0.71, 0.93], trees: 'sparse',
      standAt: 0.965, standSides: [-1], pitSides: [-1], pitAt: 0.03,
      bridge: null, ferris: null,
    },
    course: [
      { len: 540, turn: 0, dz: 0, name: 'Start Straight' },
      { len: 95, turn: -62, r: 50, dz: 0, name: 'S-Curve' },
      { len: 80, turn: 95, r: 55, dz: 0 },
      { len: 210, turn: 0, dz: 1 },
      { len: 80, turn: 55, r: 45, dz: 2, name: '1st Degner' },
      { len: 90, turn: 40, r: 50, dz: 3, name: 'Spoon Curve' },
      { len: 230, turn: 0, dz: 3 },
      { len: 300, turn: 165, r: 120, dz: 0, name: '130R' },
      { len: 620, turn: 0, dz: -3, name: 'Back Straight' },
      { len: 90, turn: 65, r: 42, dz: 0, name: 'Casio Triangle' },
      { len: 95, turn: -80, r: 42, dz: 0 },
      { len: 140, turn: 0, dz: -2 },
      { len: 170, turn: 150, r: 60, dz: -2, name: '2nd Degner' },
      { len: 230, turn: 0, dz: -1 },
      { len: 200, turn: -165, r: 80, dz: 0, name: '1st Corner' },
      { len: 90, turn: -178, r: 60, dz: 0 },
      { len: 80, turn: 0, dz: 0 },
    ],
  },
  {
    id: 'nordschleife',
    name: 'Nürburgring Nordschleife',
    place: 'Nürburg, Germany — highlight loop',
    realLength: 20832,
    condensed: true,
    roadHalf: 5.6,
    theme: {
      grass: [0.30, 0.46, 0.24], sky: [0.62, 0.74, 0.88], trees: 'dense',
      standAt: 0.02, standSides: [-1], pitSides: [1], pitAt: 0.06,
      bank: [], concrete: [],
    },
    course: [
      { len: 520, turn: 0, dz: 0, name: 'Pit Straight' },
      { len: 60, turn: -20, r: 80, dz: 0, name: 'Turn 1' },
      { len: 110, turn: -35, r: 85, dz: 0, name: 'Hatzenbach' },
      { len: 130, turn: -20, r: 80, dz: 0 },
      { len: 150, turn: -20, r: 110, dz: 2, name: 'Schwedenkreuz' },
      { len: 80, turn: -50, r: 70, dz: 2 },
      { len: 330, turn: 0, dz: 8, name: 'Fuchsfarm Link' },
      { len: 150, turn: 75, r: 130, dz: 10, name: 'Fuchsfarm' },
      { len: 440, turn: 0, dz: 12, name: 'Döttinger Höhe' },
      { len: 150, turn: -50, r: 100, dz: 8, name: 'Flugplatz' },
      { len: 110, turn: -25, r: 85, dz: 2 },
      { len: 140, turn: -25, r: 110, dz: -2, name: 'Adenauer Forst' },
      { len: 170, turn: 75, r: 95, dz: -4, name: 'Metzgesfeld' },
      { len: 140, turn: -35, r: 90, dz: -4 },
      { len: 100, turn: -65, r: 70, dz: -6, name: 'Kallenhard' },
      { len: 130, turn: 45, r: 100, dz: -6, name: 'Weichenwäldchen' },
      { len: 110, turn: -60, r: 70, dz: -10, name: 'Bergwerk' },
      { len: 170, turn: 130, r: 42, dz: -12, bank: 0.5, concrete: true, name: 'Karussell' },
      { len: 130, turn: -10, r: 110, dz: -14 },
      { len: 100, turn: -50, r: 70, dz: -12, name: 'Pflanzgarten' },
      { len: 90, turn: -45, r: 65, dz: -10 },
      { len: 120, turn: -55, r: 75, dz: -14, name: 'Schwalbenschwanz' },
      { len: 380, turn: 95, r: 190, dz: -22, name: 'Galgenkopf' },
      { len: 260, turn: 0, dz: -10 },
      { len: 140, turn: -20, r: 95, dz: -5, name: 'Herzblich-Junkersdorf' },
      { len: 190, turn: 0, dz: 0 },
      { len: 110, turn: 50, r: 85, dz: 0 },
      { len: 120, turn: -55, r: 70, dz: 2, name: 'Hatzenbach' },
      { len: 210, turn: 0, dz: 2 },
      { len: 150, turn: 50, r: 120, dz: 2, name: 'Bräschemich' },
      { len: 170, turn: -18, r: 120, dz: 2 },
      { len: 170, turn: 0, dz: 0 },
    ],
  },
];

// integrate one course segment from state s {x,y,z,h}
function applySeg(s, seg) {
  const t = seg.turn || 0;
  const dz = seg.dz || 0;
  if (t === 0) {
    const rad = (s.h * Math.PI) / 180;
    s.x += Math.cos(rad) * seg.len;
    s.y += Math.sin(rad) * seg.len;
    s.z += dz;
  } else {
    const d = (t * Math.PI) / 180;
    const r = seg.r || 45;
    const sgn = Math.sign(t);
    const cx = s.x - Math.sin(s.h * Math.PI / 180) * r * sgn;
    const cy = s.y + Math.cos(s.h * Math.PI / 180) * r * sgn;
    const px = s.x - cx, py = s.y - cy;
    const c = Math.cos(d), sn = Math.sin(d);
    s.x = cx + px * c - py * sn;
    s.y = cy + px * sn + py * c;
    s.z += dz;
    s.h += t;
  }
}

// solve closing connector: arc(d1,r1) + straight(L) + arc(d2,r2) returning
// exactly to (0,0) with heading 0 (d1+d2 = -h by construction).
// Damped Gauss-Newton over (d1, r1, L, r2) with multistart + regularization.
function solveCloser(x, y, h) {
  const eod = (v) => {
    const s = { x, y, z: 0, h };
    const d2 = -h - v[0];
    applySeg(s, { turn: v[0], r: Math.max(8, v[1]) });
    applySeg(s, { len: Math.max(0, v[2]), turn: 0 });
    applySeg(s, { turn: d2, r: Math.max(8, v[3]) });
    return [s.x, s.y];
  };
  const costOf = (v) => {
    const e = eod(v);
    const pen = (r, lo, hi) => Math.max(0, lo - r) * 50 + Math.max(0, r - hi) * 0.5;
    return e[0] * e[0] + e[1] * e[1]
      + pen(v[1], 20, 900) + pen(v[3], 20, 900)
      + Math.max(0, v[2] - 900) * 400
      + Math.max(0, Math.abs(v[0]) - 250) * 300
      + Math.max(0, Math.abs(-h - v[0]) - 250) * 300
      + 0.02 * (v[0] * v[0] + (-h - v[0]) * (-h - v[0]));
  };
  let best = null;
  const rnd = (() => { let a = 12345; return () => (a = (a * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
  const seeds = [];
  for (const d1 of [-90, 0, 90]) for (const r of [40, 120, 400]) seeds.push([d1, r, 120, r]);
  for (let i = 0; i < 40; i++) seeds.push([(rnd() * 2 - 1) * 200, 20 + rnd() * 500, rnd() * 600, 20 + rnd() * 500]);
  for (const seed of seeds) {
    const v = seed.slice();
    for (let it = 0; it < 40; it++) {
      const e = eod(v);
      if (Math.hypot(e[0], e[1]) < 0.01) break;
      const h1 = 1e-3;
      const j = [[0, 0, 0, 0], [0, 0, 0, 0]];
      for (let k = 0; k < 4; k++) {
        const dv = v.slice();
        dv[k] += h1;
        const e2 = eod(dv);
        j[0][k] = (e2[0] - e[0]) / h1;
        j[1][k] = (e2[1] - e[1]) / h1;
      }
      // normal equations J J^T d = e  (underdetermined: min-norm step)
      const A = [[0, 0], [0, 0]], g = [0, 0];
      for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) A[a][b] = j[a][0] * j[b][0] + j[a][1] * j[b][1] + (a === b ? 1e-4 : 0);
      g[0] = e[0]; g[1] = e[1];
      const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      if (Math.abs(det) < 1e-12) break;
      const yv = [(A[1][1] * g[0] - A[0][1] * g[1]) / det, (-A[1][0] * g[0] + A[0][0] * g[1]) / det];
      const step = [
        j[0][0] * yv[0] + j[1][0] * yv[1],
        j[0][1] * yv[0] + j[1][1] * yv[1],
        j[0][2] * yv[0] + j[1][2] * yv[1],
        j[0][3] * yv[0] + j[1][3] * yv[1],
      ];
      const cur = costOf(v);
      let lam = 1, improved = false;
      for (let k = 0; k < 24; k++) {
        const nv = v.map((q, i2) => Math.min(3000, Math.max(-360, q - lam * step[i2])));
        nv[1] = Math.max(8, nv[1]); nv[3] = Math.max(8, nv[3]); nv[2] = Math.max(0, nv[2]);
        if (costOf(nv) < cur) { for (let i2 = 0; i2 < 4; i2++) v[i2] = nv[i2]; improved = true; break; }
        lam *= 0.5;
      }
      if (!improved) break;
    }
    const c = costOf(v);
    if (!best || c < best.cost) best = { v: v.slice(), cost: c };
  }
  const v = best.v;
  return { d1: v[0], r1: Math.max(8, v[1]), L: Math.max(0, v[2]), r2: Math.max(8, v[3]), d2: -h - v[0] };
}

export function compileCourse(course) {
  const wps = [];
  const meta = [];
  const s = { x: 0, y: 0, z: 0, h: 0 };
  let totalTurn = 0;
  wps.push([s.x, s.y, s.z]);
  const emit = (seg) => {
    if (seg.name || seg.bank || seg.concrete) meta.push({ wp: wps.length - 1, name: seg.name || null, bank: seg.bank || 0, concrete: !!seg.concrete });
    const before = [s.x, s.y, s.z, s.h];
    applySeg(s, seg);
    if ((seg.turn || 0) !== 0) {
      const midS = { x: before[0], y: before[1], z: before[2], h: before[3] };
      applySeg(midS, { turn: seg.turn / 2, r: seg.r || 45, dz: (seg.dz || 0) / 2 });
      wps.push([midS.x, midS.y, midS.z]);
    }
    wps.push([s.x, s.y, s.z]);
    totalTurn += seg.turn || 0;
  };
  for (const seg of course) emit(seg);
  const namedTurn = totalTurn;
  const zEnd = s.z;
  const closer = solveCloser(s.x, s.y, s.h);
  const l1 = closer.r1 * Math.abs(closer.d1 * Math.PI / 180);
  const l2 = closer.L;
  const l3 = closer.r2 * Math.abs(closer.d2 * Math.PI / 180);
  const lt = l1 + l2 + l3 || 1;
  const dzk = -zEnd;
  emit({ turn: closer.d1, r: closer.r1, dz: dzk * l1 / lt, name: null });
  emit({ len: closer.L, turn: 0, dz: dzk * l2 / lt, name: null });
  emit({ turn: closer.d2, r: closer.r2, dz: dzk * l3 / lt, name: null });
  return { wps, meta, totalTurn: namedTurn, closer, endHeading: s.h, gap: Math.hypot(s.x, s.y), endX: s.x, endY: s.y };
}

const EPS = 1e-6;

function catmull(p0, p1, p2, p3, t, alpha) {
  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1], (b[2] || 0) - (a[2] || 0));
  const t0 = 0;
  const t1 = t0 + Math.pow(dist(p0, p1), alpha);
  const t2 = t1 + Math.pow(dist(p1, p2), alpha);
  const t3 = t2 + Math.pow(dist(p2, p3), alpha);
  const tt = t1 + t * (t2 - t1);
  const A1 = lerpP(p0, p1, (tt - t0) / (t1 - t0 + EPS));
  const A2 = lerpP(p1, p2, (tt - t1) / (t2 - t1 + EPS));
  const A3 = lerpP(p2, p3, (tt - t2) / (t3 - t2 + EPS));
  const B1 = lerpP(A1, A2, (tt - t0) / (t2 - t0 + EPS));
  const B2 = lerpP(A2, A3, (tt - t1) / (t3 - t1 + EPS));
  return lerpP(B1, B2, (tt - t1) / (t2 - t1 + EPS));
}
function lerpP(a, b, u) {
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, (a[2] || 0) + ((b[2] || 0) - (a[2] || 0)) * u];
}

export function buildTrack(def) {
  const cc = compileCourse(def.course);
  const wps = cc.wps;
  const n = wps.length;
  const dense = [];
  const SUB = 40;
  for (let i = 0; i < n; i++) {
    const p0 = wps[(i - 1 + n) % n], p1 = wps[i], p2 = wps[(i + 1) % n], p3 = wps[(i + 2) % n];
    for (let k = 0; k < SUB; k++) dense.push(catmull(p0, p1, p2, p3, k / SUB, 0.5));
  }
  const step = 1.0;
  const pts = [];
  let carry = 0;
  let prev = dense[0];
  pts.push(prev.slice());
  for (let i = 1; i <= dense.length; i++) {
    let cur = dense[i % dense.length];
    let seg = Math.hypot(cur[0] - prev[0], cur[1] - prev[1], cur[2] - prev[2]);
    while (carry + seg >= step) {
      const need = (step - carry) / seg;
      const np = lerpP(prev, cur, need);
      pts.push(np);
      prev = np;
      seg = Math.hypot(cur[0] - prev[0], cur[1] - prev[1], cur[2] - prev[2]);
      carry = 0;
    }
    carry += seg;
    prev = cur;
  }
  if (pts.length > 1) {
    const last = pts[pts.length - 1], first = pts[0];
    if (Math.hypot(last[0] - first[0], last[1] - first[1]) < step * 0.5) pts.pop();
  }
  const m = pts.length;
  const z = pts.map(p => p[2]);
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < m; i++) z[i] = (z[(i - 1 + m) % m] + z[i] * 2 + z[(i + 1) % m]) / 4;
  }
  const S = [];
  for (let i = 0; i < m; i++) {
    const a = pts[(i - 1 + m) % m], b = pts[(i + 1) % m];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const hl = Math.hypot(dx, dy) || 1;
    const dz = (z[(i + 1) % m] - z[(i - 1 + m) % m]) / 2;
    S.push({
      x: pts[i][0], y: pts[i][1], z: z[i],
      tx: dx / hl, ty: dy / hl,
      yaw: Math.atan2(dy, dx),
      pitch: Math.atan2(dz, hl),
      s: i * step,
    });
  }
  for (let i = 0; i < m; i++) {
    const a = S[(i - 3 + m) % m], b = S[i], c = S[(i + 3) % m];
    const a1 = Math.atan2(b.y - a.y, b.x - a.x);
    const a2 = Math.atan2(c.y - b.y, c.x - b.x);
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    b.curv = d / (6 * step);
  }
  const length = m * step;
  // name spans: map meta wp positions onto spline arc length
  const segments = [];
  const metaWp = cc.meta;
  const wpAt = metaWp.map((mm) => {
    const w = wps[mm.wp];
    let best = 0, bd = Infinity;
    for (let i = 0; i < m; i++) {
      const d = (S[i].x - w[0]) ** 2 + (S[i].y - w[1]) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  });
  for (let k = 0; k < metaWp.length; k++) {
    const mm = metaWp[k];
    const i0 = wpAt[k];
    const i1 = k + 1 < metaWp.length ? wpAt[k + 1] : m;
    for (let i = 0; i < m; i++) {
      let j = i;
      if (j < i0) j += m;
      if (j >= i0 && j < i1) {
        if (mm.bank) S[i].bank = mm.bank;
        if (mm.concrete) S[i].concrete = true;
      }
    }
  }
  for (let k = 0; k < metaWp.length; k++) {
    if (!metaWp[k].name) continue;
    const s0 = wpAt[k];
    let s1 = length;
    for (let j = k + 1; j < metaWp.length; j++) {
      if (metaWp[j].name) { s1 = Math.max(wpAt[j], s0 + 1); break; }
    }
    segments.push({ s0, s1, name: metaWp[k].name });
  }
  return { def, samples: S, length, step, segments, halfW: def.roadHalf, totalTurn: cc.totalTurn };
}

export function buildIndex(track, cell = 48) {
  const { samples } = track;
  let minx = Infinity, miny = Infinity;
  for (const s of samples) {
    if (s.x < minx) minx = s.x;
    if (s.y < miny) miny = s.y;
  }
  const gw = 1e7;
  const grid = new Map();
  samples.forEach((s, i) => {
    const cx = Math.floor((s.x - minx) / cell), cy = Math.floor((s.y - miny) / cell);
    const k = cy * gw + cx;
    let a = grid.get(k);
    if (!a) { a = []; grid.set(k, a); }
    a.push(i);
  });
  return {
    query(x, y) {
      const cx = Math.floor((x - minx) / cell), cy = Math.floor((y - miny) / cell);
      let best = -1, bd = Infinity;
      for (let r = 1; r <= 12 && best < 0; r++) {
        for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) {
          const a = grid.get((cy + oy) * gw + (cx + ox));
          if (!a) continue;
          for (const i of a) {
            const s = samples[i];
            const d = (s.x - x) ** 2 + (s.y - y) ** 2;
            if (d < bd) { bd = d; best = i; }
          }
        }
      }
      return best;
    },
  };
}
