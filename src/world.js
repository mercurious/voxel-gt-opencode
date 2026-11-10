// Builds all static voxel geometry for a track into the renderer.
import { hexToRgb, yawPitchRoll as yawPRB } from './renderer.js';

const ASPHALT = '#2c2c31', CONCRETE = '#8d8d90', CURB_A = '#c23434', CURB_B = '#e8e8e8';
const BARRIER = '#aeb3ba', POST = '#5a5e66', WHITE = '#e6e6e6', BLACK = '#181818';

const CROWD = ['#8a8f98', '#5a6672', '#b05a4a', '#4a6ab0', '#c8a24a', '#3a7a4a'];

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a * 1103515245 + 12345) & 0x7fffffff; return a / 0x7fffffff; };
}

function terrainZ(track, idx, x, y) {
  const i = idx.query(x, y);
  if (i < 0) return null;
  const S = track.samples, m = S.length;
  let zmin = S[i].z;
  for (let k = -25; k <= 25; k++) {
    const j = (i + k + m) % m;
    const s = S[j];
    if ((s.x - x) ** 2 + (s.y - y) ** 2 < 484 && s.z < zmin) zmin = s.z;
  }
  return zmin;
}

function inRanges(s, len, ranges) {
  for (const [a, b] of ranges) {
    let u = s;
    if (u < a) u += len;
    if (u >= a && u <= b) return true;
  }
  return false;
}

export function buildWorld(r, track) {
  const S = track.samples, m = S.length, len = track.length, hw = track.halfW;
  const th = track.def.theme;
  const idx = track.index;
  const add = r.add.bind(r);

  const keepClear = [];
  const standAts = Array.isArray(th.standAt) ? th.standAt : [th.standAt];
  const standRanges = [];
  for (const sa of standAts) {
    const s0 = sa * len, s1 = s0 + 52;
    standRanges.push([s0, s1]);
  }
  const pitLen = 300;
  const pitRanges = th.pitAt != null ? [[th.pitAt * len - 20, th.pitAt * len + pitLen]] : [];

  // road + curbs + barriers
  const stepR = 2.0;
  for (let i = 0; i < m; i += 2) {
    const s = S[i];
    const bank = s.bank ? Math.atan(s.bank) : 0;
    const col = s.concrete ? CONCRETE : ASPHALT;
    add(s.x, s.y, s.z - 0.05, 2.1, hw * 2, 0.2, col, yawPRB(s.yaw, s.pitch, bank));
    if (s.concrete) continue;
    for (const sd of [1, -1]) {
      const cA = ((i / 6) | 0) % 2 === 0;
      const nx = -s.ty * sd, ny = s.tx * sd;
      const cx = s.x + nx * (hw + 0.4), cy = s.y + ny * (hw + 0.4);
      add(cx, cy, s.z + 0.02, 6.05, 0.8, 0.1, cA ? CURB_A : CURB_B, yawPRB(s.yaw, s.pitch, bank));
      if (!inRanges(s.s, len, standRanges) || th.standSides.indexOf(sd) < 0) {
        if (!inRanges(s.s, len, pitRanges) || th.pitSides.indexOf(sd) < 0) {
          const bx = s.x + nx * (hw + 2.2), by = s.y + ny * (hw + 2.2);
          add(bx, by, s.z + 0.55, 4.0, 0.18, 0.5, BARRIER, yawPRB(s.yaw, s.pitch, 0));
          add(bx, by, s.z + 0.12, 0.3, 0.3, 0.75, POST, yawPRB(s.yaw, 0, 0));
        }
      }
    }
  }

  // start/finish checkers + gantry
  {
    const s = S[0];
    for (let row = 0; row < 2; row++) {
      for (let cIdx = 0; cIdx < 10; cIdx++) {
        const lat = -hw + (cIdx + 0.5) * (hw * 2 / 10);
        const nx = -s.ty, ny = s.tx;
        const px = s.x + s.tx * (row * 1.0 - 0.5) + nx * lat;
        const py = s.y + s.ty * (row * 1.0 - 0.5) + ny * lat;
        add(px, py, s.z + 0.06, 1.0, hw * 2 / 10, 0.02, (row + cIdx) % 2 ? WHITE : BLACK, yawPRB(s.yaw, 0, 0));
      }
    }
    for (const sd of [1, -1]) {
      const px = s.x - s.ty * sd * (hw + 1.8), py = s.y + s.tx * sd * (hw + 1.8);
      add(px, py, s.z + 2.8, 0.5, 0.5, 5.6, '#4a4f58', null);
    }
    add(s.x, s.y, s.z + 5.9, 1.0, hw * 2 + 5, 0.8, '#31353c', yawPRB(s.yaw, 0, 0));
    add(s.x, s.y, s.z + 6.2, 0.4, hw * 2 + 1, 0.3, '#d8c86a', yawPRB(s.yaw, 0, 0));
  }

  // grandstands
  for (const sd of th.standSides) {
    for (const sa of standAts) {
      const i0 = Math.round((sa * len) / track.step);
      for (let row = 0; row < 9; row++) {
        const zBase = S[i0].z + 1.0 + row * 0.62;
        const latOff = hw + 5 + row * 1.5;
        for (let k = 0; k < 11; k++) {
          const i = (i0 + k * 5) % m;
          const s = S[i];
          const px = s.x - s.ty * sd * latOff, py = s.y + s.tx * sd * latOff;
          add(px, py, zBase, 10.2, 1.5, 0.45 + row * 0.2, '#41474f', yawPRB(s.yaw, 0, 0));
          const rand = rng((i0 + k * 5) * 7919 + row);
          if (rand() < 0.7) add(px, py, zBase + 0.55 + row * 0.1, 9.4, 0.9, 0.55, CROWD[(rand() * CROWD.length) | 0], yawPRB(s.yaw, 0, 0));
        }
      }
    }
  }

  // pit buildings
  for (const sd of (th.pitSides || [])) {
    const s0 = th.pitAt * len, s1 = s0 + pitLen;
    for (let s = s0; s < s1; s += 8) {
      const i = Math.round(s / track.step) % m;
      const sm = S[i];
      const px = sm.x - sm.ty * sd * (hw + 11), py = sm.y + sm.tx * sd * (hw + 11);
      add(px, py, sm.z + 2.6, 8.1, 9, 5.2, '#464c56', yawPRB(sm.yaw, 0, 0));
      add(px, py, sm.z + 3.4, 8.2, 9.2, 1.3, '#1f252e', yawPRB(sm.yaw, 0, 0));
      add(px, py, sm.z + 5.6, 8.15, 8.4, 0.6, '#2b303a', yawPRB(sm.yaw, 0, 0));
    }
  }

  // terrain cells
  let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
  for (const s of S) {
    if (s.x < minx) minx = s.x; if (s.x > maxx) maxx = s.x;
    if (s.y < miny) miny = s.y; if (s.y > maxy) maxy = s.y;
  }
  const cell = 7, margin = 150;
  const grass = th.grass;
  const gcols = {};
  let gi = 0;
  for (let gy = miny - margin; gy < maxy + margin; gy += cell) {
    for (let gx = minx - margin; gx < maxx + margin; gx += cell) {
      const cx = gx + cell / 2, cy = gy + cell / 2;
      const tz = terrainZ(track, idx, cx, cy);
      if (tz == null) continue;
      const i = idx.query(cx, cy);
      const s = S[i];
      const d = Math.hypot(s.x - cx, s.y - cy);
      if (d > margin + 30) continue;
      const h = rng((gi++ * 2654435761) >>> 0);
      const j = 0.9 + h() * 0.2;
      const near = d < hw + 14;
      const key = near ? 'r' : (h() < 0.35 ? 'd' : 'n');
      let col = gcols[key];
      if (!col) {
        const base = key === 'r' ? [grass[0] + 0.12, grass[1] + 0.05, grass[2] + 0.02]
          : key === 'd' ? [grass[0] * 0.8, grass[1] * 0.78, grass[2] * 0.7] : grass;
        gcols[key] = base;
        col = base;
      }
      add(cx, cy, tz - 0.45, cell + 0.1, cell + 0.1, 1.2, [col[0] * j, col[1] * j, col[2] * j], null);
    }
  }

  // trees
  const dens = th.trees === 'dense' ? 0.06 : th.trees === 'sparse' ? 0.02 : 0.035;
  for (let i = 0; i < m; i += 3) {
    const s = S[i];
    const h = rng(i * 40503 + 1234);
    if (h() > dens * 3) continue;
    const sd = h() < 0.5 ? 1 : -1;
    if (inRanges(s.s, len, standRanges) || inRanges(s.s, len, pitRanges)) continue;
    const off = hw + 14 + h() * 95;
    const px = s.x - s.ty * sd * off, py = s.y + s.tx * sd * off;
    const tz = terrainZ(track, idx, px, py);
    if (tz == null) continue;
    const ht = 4 + h() * 5;
    add(px, py, tz + ht / 2, 0.7, 0.7, ht, '#5a4632', null);
    const lc = h() < 0.4 ? '#2f5a2c' : h() < 0.7 ? '#3b6b32' : '#4a7a3a';
    const w = 2.4 + h() * 2.2;
    add(px, py, tz + ht + 0.8, w, w, 2.6, lc, null);
    add(px, py, tz + ht + 2.6, w * 0.62, w * 0.62, 1.9, lc, null);
  }

  // bridge: elevated lane crossing a lower lane (Suzuka overpass)
  const deckFlag = new Uint8Array(m);
  const deckLow = new Float64Array(m);
  for (let i = 0; i < m; i += 2) {
    const a = S[i];
    for (let j = 0; j < m; j += 4) {
      const b = S[j];
      const ds = Math.abs(a.s - b.s);
      if (ds < 600 || len - ds < 600) continue;
      const dx = a.x - b.x, dy = a.y - b.y;
      if (dx * dx + dy * dy > (hw + 10) ** 2) continue;
      if (a.z - b.z > 4.5) { deckFlag[i] = 1; deckLow[i] = b.z; break; }
    }
  }
  for (let i = 0; i < m; i += 2) {
    if (!deckFlag[i]) continue;
    const a = S[i];
    const h0 = a.z - deckLow[i];
    for (const sd of [1, -1]) {
      const px = a.x - a.ty * sd * (hw + 0.5), py = a.y + a.tx * sd * (hw + 0.5);
      const n = Math.max(1, Math.ceil(h0 / 4));
      for (let k = 0; k < n; k++) {
        const segH = h0 / n;
        add(px, py, deckLow[i] + segH * (k + 0.5), 1.0, 1.0, segH, '#7c7f85', null);
      }
      add(px, py, a.z + 0.9, 2.1, 0.25, 0.9, '#c9ccd2', yawPRB(a.yaw, a.pitch, 0));
    }
  }
}

export { hexToRgb };
