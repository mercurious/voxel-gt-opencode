// Real-world track definitions for GranVoxel.
// Courses are described as real-world centerline arcs (measured in meters).
// Each segment: straight = { s, dz, bank }, arc = { r, t, dz, bank } where
// t is the heading change in degrees (positive = right turn). The drawn arc
// length is r*|t| (radians); any `s`/`len` on a turning segment is ignored.
// dz = elevation change across the segment (m).
// `wind` is the topological turning number of the completed lap:
// -1 = one net clockwise revolution (Tsukuba, Nordschleife),
//  0 = figure-eight with odd number of crossings (Suzuka).
// The closer arcs are solved so the spline closes smoothly (matching heading)
// AND the lap realizes that winding number; courses must therefore have turn
// sums close to wind*360 deg.
// World-space z is base + dz (base differs per track); dz values in courses
// are relative heights that the closer brings back to the start elevation.

export const TRACKS = [
  {
    id: "tsukuba",
    name: "Tsukuba Circuit",
    loc: "Mooritsuka, Ibaraki, Japan",
    country: "JP",
    lengthM: 1773, // stylized layout; computed lap of this course
    wind: -1, // clockwise circuit
    roadHalf: 7.0,
    curvK: 0.00035,
    zBase: 40,
    startHeading: 90,
    course: [
      { s: 125, name: "Start/Finish Straight" },
      { r: 55, t: -72.3, bank: 2, name: "Turn 1" },
      { s: 50 },
      { r: 140, t: 28.0, bank: 3, name: "S Curve" },
      { r: 110, t: -30.0 },
      { s: 60, name: "Meadow Straight" },
      { r: 40, t: -90.0, bank: 4, name: "Meadow Corner" },
      { s: 45 },
      { r: 110, t: 52.0, bank: 3, name: "Back Straight Kink" },
      { s: 260, name: "Back Straight" },
      { r: 38, t: -95.5, bank: 5, name: "Hairpin" },
      { s: 165, name: "Downhill Straight" },
      { r: 65, t: -47.4, name: "Last Corner" },
      { s: 80 },
    ],
  },

  {
    id: "suzuka",
    name: "Suzuka Circuit",
    loc: "Suzuka, Mie, Japan",
    country: "JP",
    lengthM: 3550, // stylized layout; computed lap of this course
    full: false,
    condensed: true, // compressed GP layout; one bridged figure-eight crossing
    wind: 0, // figure-eight: crossings cancel the winding
    roadHalf: 7.5,
    curvK: 0.00045,
    zBase: 38,
    startHeading: 105,
    course: [
      { s: 127, name: "Start/Finish Straight" },
      { r: 69, t: -100, bank: 5, name: "Turn 1 (130R)" },
      { s: 43, name: "Casio Triangle Chicane" },
      { r: 62, t: 37.5 },
      { r: 43, t: -32.2 },
      { s: 68, name: "Degner 1 & 2" },
      { r: 47, t: 94, bank: 4, name: "Degner Curve" },
      { s: 28 },
      { r: 187, t: -27.4, bank: 6, name: "Spoon Curve" },
      { s: 43 },
      { r: 41, t: -162.4, bank: 5, name: "S Curve (17R/18R)" },
      { s: 21 },
      { r: 48, t: 51.4, name: "S Curve Exit" },
      { s: 155, dz: 6, name: "1st Curve Straight" }, // climbs toward the crossing
      { r: 47, t: 99.7, bank: 5, name: "1st Curve" },
      { s: 62 },
      { r: 43, t: -58.3, name: "Sunrise Bend" },
      { s: 31 },
      { r: 55, t: -152, bank: 4, name: "Sunrise Hairpin" },
      { s: 28 },
      { r: 66, t: 72.4, name: "130R" },
      { s: 68, name: "Spoon Curve" }, // bridge deck starts after the crossing
      { r: 203, t: 22, bank: 6, name: "S Curve" },
      { s: 74 },
      { r: 47, t: 77, bank: 3, name: "Chicane" },
      { s: 81, dz: -6 }, // descend once clear of the crossing
      { r: 58, t: -66, name: "Chicane" },
      { s: 93 },
      { r: 31, t: 60, name: "2nd Curve" },
      { s: 56, name: "2nd Curve Straight" },
      { r: 70, t: 70, name: "New Dunlop Curve" },
      { s: 37 },
    ],
  },

  {
    id: "nordschleife",
    name: "Nordschleife",
    loc: "Nürburg, Eifel, Germany",
    country: "DE",
    lengthM: 3762, // condensed layout; computed lap of this course (real circuit is 20832)
    full: false,
    condensed: true, // compressed single-loop layout of the 20.8km Nordschleife
    wind: -1,
    roadHalf: 7.0,
    curvK: 0.0005,
    zBase: 320,
    startHeading: 120,
    course: [
      { s: 150, name: "Start/Finish (Treppchen)" },
      { r: 52, t: -72, dz: 2, name: "Hatzenbach" },
      { s: 30, dz: 2 },
      { r: 60, t: 34, name: "S-Feld Linkskurve" },
      { r: 55, t: -58, dz: 3, name: "Schwedenkreuz" },
      { s: 40, dz: 3 },
      { r: 45, t: -38, dz: 4, name: "Amtsblattpipes (AFP)" },
      { r: 70, t: -20, dz: 4, name: "Metternich" },
      { s: 55, dz: -3, name: "Adenauer Forst Straight" },
      { r: 50, t: -80, dz: -6, name: "Hohe Acht" },
      { s: 40, dz: -4 },
      { r: 90, t: 25, name: "Wippermann" },
      { r: 60, t: -30, name: "Steiness-Kuppe" },
      { s: 80, name: "Eulschleife Straight" },
      { r: 55, t: -62, name: "Castellener Bogen" },
      { s: 30 },
      { r: 80, t: 18, name: "Breidscheid" },
      { r: 75, t: -24, dz: -3, name: "Fuchskuhle" },
      { s: 50, dz: -2 },
      { r: 48, t: -70, dz: -2, name: "Schwalbenschwanz" },
      { r: 65, t: 35, dz: 4, name: "Pflanzgarten Kehre" },
      { s: 35, dz: 4 },
      { r: 95, t: -15, dz: 5, name: "Bergwerk" },
      { s: 45, dz: 5, name: "Pflanzgarten Waldsection" },
      { r: 85, t: 30, dz: 5, name: "Kesselchen" },
      { r: 40, t: -95, dz: 4, name: "Waldsection Hairpin" },
      { s: 30, dz: -6 },
      { r: 110, t: 40, dz: -6, name: "Adenauer Forst Kehre" },
      { r: 50, t: -45, dz: -5, name: "Karussell" },
      { s: 50, dz: -5 },
      { r: 70, t: 55, dz: -4, name: "Tiergarten Eckschleife" },
      { r: 60, t: -30, dz: -4, name: "Wehrmaschine" },
      { s: 215 },
      { r: 90, t: 8, name: "Gaevenich" },
      { r: 50, t: -130, dz: -1, name: "Hatzenbach Kehre" },
      { s: 150 },
      { r: 240, t: -120, name: "Hatzenbacher Wand" },
      { s: 350, name: "Hatzenbach Straight" },
    ],
  },
];

function normDeg(a) {
  while (a > 180) a -= 360;
  while (a < -180) a += 360;
  return a;
}

// integrate one course segment in place; s = {x,y,z,h}
function applySeg(s, seg) {
  const t = seg.turn;
  s.z += seg.dz || 0;
  if (!t) {
    s.x += Math.cos(s.h * Math.PI / 180) * seg.len;
    s.y += Math.sin(s.h * Math.PI / 180) * seg.len;
    return;
  }
  const r = Math.abs(seg.r);
  // true circular arc: chord = 2r sin(|t|/2) in the direction of the mid
  // heading (h + t/2). The center-offset form is only correct if the center
  // is placed at h + sign(t)*90; getting that wrong kinks every chunked arc.
  const chord = 2 * r * Math.sin(Math.abs(t) * Math.PI / 360);
  const mid = (s.h + t / 2) * Math.PI / 180;
  s.x += Math.cos(mid) * chord;
  s.y += Math.sin(mid) * chord;
  s.h += t;
}

// Solve the closing maneuver (arc d1, straight L, arc d2) that returns the
// course end to the origin with matching heading. The completed lap must make
// a full revolution (wind * 360 deg) — forcing zero net rotation makes the
// course fold back on itself. With target = wind*360 - courseTurn - hEnd the
// loop closes on its own natural orbit instead of a degenerate r->inf U-turn.
function solveCloser(x, y, h, wind, body = null) {
  const D = Math.PI / 180;
  const dist = (v, tgt) => {
    const [d1, r1, L, r2] = v;
    // integrate the candidate closer forwards from a virtual origin with the
    // course-end heading; the lap closes when the displacement equals -C,
    // and d1 + d2 = windK*360 - h makes heading closure exact by construction,
    // so only the position gap is a free residual
    const s = { x: 0, y: 0, z: 0, h };
    applySeg(s, { len: 0, turn: d1, r: r1, dz: 0 });
    applySeg(s, { len: L, turn: 0 });
    applySeg(s, { len: 0, turn: tgt - d1, r: r2, dz: 0 });
    return { dx: s.x + x, dy: s.y + y };
  };
  // a closing arc never turns more than 200 deg; anything sharper is a
  // spiral drill that intersects the course body, not a corner a car could
  // take. d2 = tgt - d1 must satisfy the same bound, which pins d1.
  const cands = [];
  let seed = 123456789;
  const rnd = () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  for (const windK of [wind || 0, 0, -1, 1, -2, 2, -3, 3, -4]) {
    const tgt = windK * 360 - h;
    const loD1 = Math.max(-200, tgt - 200);
    const hiD1 = Math.min(200, tgt + 200);
    if (loD1 > hiD1) continue; // this winding has no gentle closer
    const LO = [loD1, 50, 0, 50];
    const HI = [hiD1, 1200, 2200, 1200];
    const clip = (v) => {
      for (let i = 0; i < 4; i++) v[i] = Math.min(HI[i], Math.max(LO[i], v[i]));
      return v;
    };
    const clen = (v) => v[1] * Math.abs(v[0]) * D + v[2] + v[3] * Math.abs(tgt - v[0]) * D;
    const pathOf = (v, tg) => {
      const s = { x: 0, y: 0, z: 0, h };
      const pts = [];
      const walk = (turn, r) => {
        if (!turn) return;
        const n = Math.max(1, Math.round(Math.abs(turn) / 10));
        for (let k = 0; k < n; k++) {
          applySeg(s, { len: 0, turn: turn / n, r, dz: 0 });
          pts.push([s.x, s.y]);
        }
      };
      walk(v[0], v[1]);
      const nL = Math.max(1, Math.round(v[2] / 25));
      for (let k = 0; k < nL; k++) {
        applySeg(s, { len: v[2] / nL, turn: 0, dz: 0 });
        pts.push([s.x, s.y]);
      }
      walk(tg - v[0], v[3]);
      return pts;
    };
    const clearance = (v, tg) => {
      if (!body || !body.length) return 0;
      let pen = 0;
      for (const p of pathOf(v, tg)) {
        if (Math.hypot(p[0], p[1]) < 40) continue; // closing on the finish line is the point
        let bd = Infinity;
        for (const b of body) {
          if (Math.hypot(b[0], b[1]) < 80) continue; // start/finish merge zone
          const d = Math.hypot(b[0] - p[0], b[1] - p[1]);
          if (d < bd) bd = d;
        }
        if (bd < 30) pen += (30 - bd) * (30 - bd);
      }
      return pen * 0.5;
    };
    const cost = (v) => {
      const e = dist(v, tgt);
      let c = (e.dx * e.dx + e.dy * e.dy) * 1e-2;
      c += clen(v) * 0.12; // compactness: without this a 1.2 km radius 300 deg sweep "closes" the gap
      c += clearance(v, tgt);
      return c;
    };
    const dist0 = Math.hypot(x, y);
    const homeBrg = Math.atan2(-y, -x) / D;
    const starts = [
      clip([tgt / 2, Math.max(150, dist0 * 0.6), dist0 * 0.7, Math.max(150, dist0 * 0.6)]),
      clip([tgt > 0 ? Math.min(180, tgt) : Math.max(-180, tgt), dist0 * 0.5, dist0 * 0.8, dist0 * 0.8]),
    ];
    // closed-form single-arc seeds: turn tgt on the circle that spans the gap,
    // and a variant whose chord points straight at the finish line
    const arcSeed = (d) => {
      if (Math.abs(d) < 2 || Math.abs(d) > 359) return null;
      const r = dist0 / (2 * Math.sin(Math.abs(d) * D / 2));
      return r <= 1200 ? clip([d, r, 0, 500]) : null;
    };
    for (const s of [arcSeed(tgt), arcSeed(((2 * (homeBrg - h) + 540) % 360) - 180),
      arcSeed(((2 * (homeBrg - h) + 900) % 360) - 180)])
      if (s) starts.push(s);
    // big-angle S-curve seeds: one arc turns a, the other turns tgt - a; the
    // useful basins (e.g. a hairpin straight with a final corner) live far
    // from d1 ~= tgt/2, so sweep d1 across the whole feasible window
    for (const a of [-180, -120, -70, -30, 30, 70, 120, 180])
      starts.push(clip([a, Math.max(120, dist0 * (0.3 + 0.5 * Math.abs(a) / 180)), dist0 * 0.8, Math.max(80, dist0 * 0.15)]));
    for (let k = 0; k < 18; k++)
      starts.push(clip([loD1 + (hiD1 - loD1) * rnd(), 50 + rnd() * 950, dist0 * (0.2 + rnd() * 1.3), 50 + rnd() * 950]));
    // damped Gauss-Newton on the position gap (heading closes exactly by
    // construction); ridge + backtracking handle the rank-deficient directions
    let bestV = null;
    let bestC = Infinity;
    const gap2 = (w) => { const e = dist(w, tgt); return e.dx * e.dx + e.dy * e.dy; };
    for (const st of starts) {
      const v = st.slice();
      let cg = gap2(v);
      let lam = 1;
      for (let it = 0; it < 120; it++) {
        const e0 = dist(v, tgt);
        if (cg < 1e-8) break;
        const J = [[0, 0, 0, 0], [0, 0, 0, 0]];
        for (let i = 0; i < 4; i++) {
          const w = v.slice();
          w[i] += i === 2 ? 1 : 0.1;
          clip(w);
          const e1 = dist(w, tgt);
          const dw = w[i] - v[i];
          if (Math.abs(dw) < 1e-9) continue;
          J[0][i] = (e1.dx - e0.dx) / dw;
          J[1][i] = (e1.dy - e0.dy) / dw;
        }
        const a00 = J[0][0] * J[0][0] + J[1][0] * J[1][0] + lam;
        const a01 = J[0][0] * J[0][1] + J[1][0] * J[1][1];
        const a11 = J[0][1] * J[0][1] + J[1][1] * J[1][1] + lam;
        const det = a00 * a11 - a01 * a01;
        if (!isFinite(det) || Math.abs(det) < 1e-9) break;
        const y0 = (-e0.dx * a11 + e0.dy * a01) / det;
        const y1 = (-e0.dy * a00 + e0.dx * a01) / det;
        let dv = [0, 1, 2, 3].map((i) => J[0][i] * y0 + J[1][i] * y1);
        // drop components pinned against their bound so one clamped variable
        // cannot stall the whole step
        for (let i = 0; i < 4; i++) {
          if ((dv[i] > 0 && v[i] >= HI[i] - 1e-9) || (dv[i] < 0 && v[i] <= LO[i] + 1e-9)) dv[i] = 0;
        }
        let smax = 1;
        for (let i = 0; i < 4; i++) {
          if (dv[i] > 1e-12) smax = Math.min(smax, (HI[i] - v[i]) / dv[i]);
          else if (dv[i] < -1e-12) smax = Math.min(smax, (LO[i] - v[i]) / dv[i]);
        }
        if (smax <= 1e-9 || !isFinite(smax)) break; // fully blocked at bounds
        let moved = false;
        for (let sc = smax; sc > 1e-6; sc *= 0.5) {
          const w = v.slice();
          for (let i = 0; i < 4; i++) w[i] += sc * dv[i];
          clip(w);
          const gw = gap2(w);
          if (gw < cg - 1e-12) {
            for (let i = 0; i < 4; i++) v[i] = w[i];
            cg = gw;
            lam = Math.max(1e-3, lam * 0.5);
            moved = true;
            break;
          }
        }
        if (!moved) lam *= 4;
        if (lam > 1e8) break;
      }
      const c = cost(v);
      if (c < bestC) { bestC = c; bestV = v.slice(); }
    }
    const e = dist(bestV, tgt);
    cands.push({ v: bestV, tgt, posGap: Math.hypot(e.dx, e.dy), len: clen(bestV), declared: windK === (wind || 0) });
  }
  // prefer feasible solutions with the declared winding, shortest first;
  // fall back to least infeasible overall
  const feas = cands.filter((c) => c.posGap < 2.5);
  const declaredFeas = feas.filter((c) => c.declared);
  const pool = declaredFeas.length ? declaredFeas : feas.length ? feas : cands;
  pool.sort((a, b) => a.len - b.len || a.posGap - b.posGap);
  const best = pool[0];
  const [d1, r1, L, r2] = best.v;
  return { d1, r1, L, r2, d2: best.tgt - d1 };
}

export function compileCourse(course, wind = 0) {
  const wps = [];
  const meta = [];
  const s = { x: 0, y: 0, z: 0, h: 0 };
  let totalTurn = 0;
  wps.push([s.x, s.y, s.z]);
  const emit = (raw) => {
    const seg = {
      len: raw.s ?? raw.len ?? 0,
      turn: raw.t ?? raw.turn ?? 0,
      r: raw.r,
      dz: raw.dz ?? 0,
      name: raw.name,
      bank: raw.bank,
      concrete: raw.concrete,
    };
    if (seg.name || seg.bank || seg.concrete) meta.push({ wp: wps.length - 1, name: seg.name || null, bank: seg.bank || 0, concrete: !!seg.concrete });
    // sample arcs densely enough that the smoothing spline follows the true
    // arc; one midpoint for a 188 deg hairpin or a 244 deg closer arc cuts
    // corners badly and kinks the start/finish seam
    const t = seg.turn || 0;
    const n = t ? Math.max(1, Math.ceil(Math.abs(t) / 20)) : 1;
    for (let k = 0; k < n; k++) {
      applySeg(s, { len: (seg.len || 0) / n, turn: t / n, r: seg.r || 45, dz: (seg.dz || 0) / n });
      wps.push([s.x, s.y, s.z]);
    }
    totalTurn += t;
  };
  for (const seg of course) emit(seg);
  const namedTurn = totalTurn;
  const zEnd = s.z;
  const preEnd = { x: s.x, y: s.y, z: s.z, h: s.h };
  const closer = solveCloser(s.x, s.y, s.h, wind, wps);
  const l1 = closer.r1 * Math.abs(closer.d1 * Math.PI / 180);
  const l2 = closer.L;
  const l3 = closer.r2 * Math.abs(closer.d2 * Math.PI / 180);
  const lt = l1 + l2 + l3 || 1;
  const dzk = -zEnd;
  emit({ turn: closer.d1, r: closer.r1, dz: dzk * l1 / lt, name: null });
  emit({ len: closer.L, turn: 0, dz: dzk * l2 / lt, name: null });
  emit({ turn: closer.d2, r: closer.r2, dz: dzk * l3 / lt, name: null });
  return { wps, meta, totalTurn: namedTurn, closer, endHeading: s.h, gap: Math.hypot(s.x, s.y), endX: s.x, endY: s.y, preEnd };
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
  const cc = compileCourse(def.course, def.wind || 0);
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

export function createWorld(track) {
  const halfW = track.halfW;
  const asphalt = [], kerb = [], grass = [], barrier = [];
  const step = 4; // meters
  const S = track.samples;
  const n = S.length;
  const right = (i) => [-S[i].ty, S[i].tx];
  for (let i = 0; i < n; i += step) {
    const a = S[i];
    const b = S[(i + step) % n];
    const ra = right(i), rb = right((i + step) % n);
    const push = (arr, p, q) => arr.push(p[0], p[1], p[2], q[0], q[1], q[2]);
    void push;
    const z0 = a.z + 0.05, z1 = b.z + 0.05;
    const p = (r, sgn) => [a.x + ra[0] * sgn * r, a.y + ra[1] * sgn * r, 0];
    const q = (r, sgn) => [b.x + rb[0] * sgn * r, b.y + rb[1] * sgn * r, 0];
    void p; void q;
    // asphalt strip
    asphalt.push(
      a.x + ra[0] * -halfW, a.y + ra[1] * -halfW, z0,
      a.x + ra[0] * halfW, a.y + ra[1] * halfW, z0,
      b.x + rb[0] * halfW, b.y + rb[1] * halfW, z1,
      a.x + ra[0] * -halfW, a.y + ra[1] * -halfW, z0,
      b.x + rb[0] * halfW, b.y + rb[1] * halfW, z1,
      b.x + rb[0] * -halfW, b.y + rb[1] * -halfW, z1,
    );
    // kerbs
    const kw = 1.4;
    for (const sgn of [-1, 1]) {
      const edge = 0.2;
      const k0 = a.z + 0.16, k1 = b.z + 0.16;
      const t = (r) => [a.x + ra[0] * sgn * r, a.y + ra[1] * sgn * r];
      const u = (r) => [b.x + rb[0] * sgn * r, b.y + rb[1] * sgn * r];
      const alt = (Math.floor(i / step) % 2) === 0;
      const ca = alt ? [2.0, 0.15, 0.1] : [0.95, 0.95, 0.95];
      kerb.push(...t(halfW - edge), k0, ...u(halfW - edge), k1, ...u(halfW + kw), k1,
        ...t(halfW - edge), k0, ...u(halfW + kw), k1, ...t(halfW + kw), k0);
      void ca; // color handled at mesh level via alternating faces
    }
    // grass apron
    const gw = 14;
    for (const sgn of [-1, 1]) {
      const t = (r) => [a.x + ra[0] * sgn * r, a.y + ra[1] * sgn * r, a.z - 0.3];
      const u = (r) => [b.x + rb[0] * sgn * r, b.y + rb[1] * sgn * r, b.z - 0.3];
      grass.push(...t(halfW + 1.4), ...u(halfW + 1.4), ...u(halfW + gw),
        ...t(halfW + 1.4), ...u(halfW + gw), ...t(halfW + gw));
    }
    // barriers every 8 m where curved or edge of track clusters
    if (i % 16 === 0) {
      const bank = Math.abs(a.bank || 0);
      const curved = Math.abs(a.curv) > 0.004 || bank > 0;
      if (curved) {
        for (const sgn of [-1, 1]) {
          const bx = a.x + ra[0] * sgn * (halfW + 2.6), by = a.y + ra[1] * sgn * (halfW + 2.6);
          barrier.push(bx, by, a.z);
        }
      }
    }
  }
  // tire walls / barriers: place as instanced posts via mesh points
  const posts = [];
  for (let i = 0; i < n; i += 10) {
    const a = S[i];
    const ra = right(i);
    const curved = Math.abs(a.curv) > 0.0035 || Math.abs(a.bank || 0) > 0;
    if (!curved) continue;
    for (const sgn of [-1, 1]) {
      posts.push([a.x + ra[0] * sgn * (halfW + 2.4), a.y + ra[1] * sgn * (halfW + 2.4), a.z, a.yaw]);
    }
  }
  // grandstands near start/finish
  const stands = [];
  const start = S[0];
  const sr = right(0);
  stands.push([start.x + sr[0] * (halfW + 16), start.y + sr[1] * (halfW + 16), start.z, start.yaw]);
  stands.push([start.x + sr[0] * (halfW + 16) + Math.cos(start.yaw) * 60, start.y + sr[1] * (halfW + 16) + Math.sin(start.yaw) * 60, start.z, start.yaw]);
  // pit complex on start straight right side
  const pits = [];
  for (let k = 30; k < 120; k += 12) {
    const a = S[k % n];
    const ra = right(k % n);
    pits.push([a.x + ra[0] * (halfW + 10), a.y + ra[1] * (halfW + 10), a.z, a.yaw]);
  }
  // trees: scatter on grass strip, avoid track vicinity
  const trees = [];
  let seed = 987654321;
  const rnd = () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  const bb = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (const s of S) {
    if (s.x < bb.minX) bb.minX = s.x; if (s.x > bb.maxX) bb.maxX = s.x;
    if (s.y < bb.minY) bb.minY = s.y; if (s.y > bb.maxY) bb.maxY = s.y;
  }
  const treeCount = 1400;
  for (let k = 0; k < treeCount * 4 && trees.length < treeCount; k++) {
    const x = bb.minX - 60 + rnd() * (bb.maxX - bb.minX + 120);
    const y = bb.minY - 60 + rnd() * (bb.maxY - bb.minY + 120);
    // distance to polyline (coarse)
    let minD = Infinity;
    for (let i = 0; i < n; i += 8) {
      const d = (S[i].x - x) ** 2 + (S[i].y - y) ** 2;
      if (d < minD) minD = d;
    }
    if (Math.sqrt(minD) < halfW + 20) continue;
    trees.push([x, y, 0, 1.5 + rnd() * 3.5]);
  }
  // over/underpass structures: detect crossings with z separation
  const bridges = [];
  for (let i = 0; i < n; i += 6) {
    for (let j = i + 60; j < n; j += 6) {
      const a = S[i], b = S[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d > halfW + 10) continue;
      const dz = Math.abs(a.z - b.z);
      if (dz > 4.5) bridges.push([a.x, a.y, Math.max(a.z, b.z), Math.atan2(a.y - b.y, a.x - b.x), d]);
    }
  }
  return { asphalt, kerb, grass, barrier, posts, stands, pits, trees, bridges, curvK: track.def.curvK, track };
}

export function nearestPoint(track, x, y) {
  const S = track.samples;
  let best = 0, bd = Infinity;
  for (let i = 0; i < S.length; i += 2) {
    const d = (S[i].x - x) ** 2 + (S[i].y - y) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  const lo = Math.max(0, best - 4), hi = Math.min(S.length - 1, best + 4);
  for (let i = lo; i <= hi; i++) {
    const d = (S[i].x - x) ** 2 + (S[i].y - y) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}

export function headingAt(track, i) {
  return track.samples[i].yaw;
}

export function pointAt(track, i) {
  return track.samples[((i % track.samples.length) + track.samples.length) % track.samples.length];
}

// i0 = index at the start line (s = 0); distance is measured forward from
// there so frac wraps correctly when the car crosses the start/finish line.
// (The old version returned s = n*step just before the line and s = 0 exactly
// on it, so the lap counter never reached 1.0 and progress reset early.)
export function lapAt(track, i) {
  const n = track.samples.length;
  let j = i - track.startIndex;
  if (j < 0) j += n;
  return { s: j * track.step, frac: j / n };
}

const cache = new Map();
export function getTrack(id) {
  if (!cache.has(id)) {
    const def = TRACKS.find((t) => t.id === id);
    if (!def) return null;
    const t = buildTrack(def);
    t.startIndex = 0;
    cache.set(id, t);
  }
  return cache.get(id);
}

// Spatial hash of the centreline samples, with query(x, y) -> nearest sample
// index (-1 when nothing is within reach). physics.js and world.js both call
// query(), so it has to exist here or a race dies on the first frame.
// The optional z argument breaks ties between the two decks of an overpass:
// at Suzuka's figure-of-eight crossing (and the Nordschleife's tiered
// sections) both lanes share the same plan position, and picking the wrong one
// drops the car 6 m onto the lane underneath and jumps its lap progress.
export function buildIndex(track, cell = 48) {
  const S = track.samples;
  let minx = Infinity, miny = Infinity;
  for (const s of S) {
    if (s.x < minx) minx = s.x;
    if (s.y < miny) miny = s.y;
  }
  const GW = 1e7;
  const grid = new Map();
  S.forEach((s, i) => {
    const k = Math.floor((s.y - miny) / cell) * GW + Math.floor((s.x - minx) / cell);
    let a = grid.get(k);
    if (!a) { a = []; grid.set(k, a); }
    a.push(i);
  });
  const query = (x, y, z = null) => {
    const cx = Math.floor((x - minx) / cell), cy = Math.floor((y - miny) / cell);
    let best = -1, bs = Infinity;
    const scan = (ox, oy) => {
      const a = grid.get((cy + oy) * GW + (cx + ox));
      if (!a) return;
      for (let k = 0; k < a.length; k++) {
        const i = a[k], s = S[i];
        let sc = (s.x - x) ** 2 + (s.y - y) ** 2;
        if (z != null) sc += (s.z - z) ** 2 * 2;
        if (sc < bs) { bs = sc; best = i; }
      }
    };
    for (let r = 0; r <= 3; r++) {
      for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) {
        if (r && Math.abs(ox) !== r && Math.abs(oy) !== r) continue;
        scan(ox, oy);
      }
    }
    for (let r = 4; r <= 12 && best < 0; r++) {
      for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) scan(ox, oy);
    }
    return best;
  };
  return { query, cell };
}
