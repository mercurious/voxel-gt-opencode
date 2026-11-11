// Layout validator: checks each compiled track for geometric problems:
// turning number, self-proximity/collisions, curvature spikes, seams, gradients.
import { TRACKS, buildTrack, compileCourse } from '../src/tracks.js';

for (const def of TRACKS) {
  const cc = compileCourse(def.course, def.wind || 0);
  const t = buildTrack(def);
  const S = t.samples, m = S.length, len = t.length;
  console.log(`=== ${def.name} (len ${len.toFixed(0)} m) ===`);

  // 1. closure: end of last sample must meet sample 0
  const a = S[m - 1], b = S[0];
  const gapXY = Math.hypot(a.x - b.x, a.y - b.y);
  let yawGap = Math.atan2(S[0].ty, S[0].tx) - Math.atan2(a.ty, a.tx);
  while (yawGap > Math.PI) yawGap -= 2 * Math.PI;
  while (yawGap < -Math.PI) yawGap += 2 * Math.PI;
  console.log(`closure: xy gap ${gapXY.toFixed(2)} m, yaw gap ${(yawGap * 180 / Math.PI).toFixed(1)}°, z gap ${(b.z - a.z).toFixed(2)}`);

  // 2. turning number = sum of heading changes / 360
  let turn = 0;
  for (let i = 0; i < m; i++) {
    const s1 = S[i], s2 = S[(i + 1) % m];
    let d = Math.atan2(s2.ty, s2.tx) - Math.atan2(s1.ty, s1.tx);
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    turn += d;
  }
  console.log(`turning number: ${(turn / (2 * Math.PI)).toFixed(3)} (expected ${def.wind ?? '±1'})`);

  // 3. self-proximity: samples far apart along the track but close in xy
  const near = [];
  for (let i = 0; i < m; i += 3) {
    for (let j = i + 1; j < m; j += 3) {
      const ds = Math.min(Math.abs(S[i].s - S[j].s), len - Math.abs(S[i].s - S[j].s));
      if (ds < 80) continue;
      const d = Math.hypot(S[i].x - S[j].x, S[i].y - S[j].y);
      if (d < t.halfW * 2 + 14) near.push({ i, j, d, dz: Math.abs(S[i].z - S[j].z), s1: S[i].s, s2: S[j].s });
    }
  }
  // cluster by proximity along s, keep worst per cluster
  near.sort((p, q) => p.d - q.d);
  const clusters = [];
  for (const p of near) {
    let hit = false;
    for (const c of clusters) {
      if (Math.abs(c.s1 - p.s1) < 60 && Math.abs(c.s2 - p.s2) < 60) { hit = true; if (p.d < c.d) Object.assign(c, p); break; }
    }
    if (!hit) clusters.push(p);
  }
  if (!clusters.length) console.log('self-proximity: none');
  for (const c of clusters) {
    const clashD = t.halfW * 2 + 4.4; // barrier faces touch at this centerline distance
    console.log(`  proximity @ s=${c.s1.toFixed(0)}/${c.s2.toFixed(0)}: xy ${c.d.toFixed(1)} m, dz ${c.dz.toFixed(1)} m ${c.dz > 4.5 ? (c.dz < 30 ? '(bridged)' : '<-- BRIDGE TOO TALL') : (c.d < clashD ? '<-- INTERSECTION / BARRIER CLASH' : '(tight but clear)')}`);
  }

  // 4. curvature spikes -> implied radius
  let worst = { r: Infinity, s: 0 };
  for (let i = 0; i < m; i++) {
    const k = Math.abs(S[i].curv || 0);
    if (k > 1e-6) {
      const r = 1 / k;
      if (r < worst.r) worst = { r, s: S[i].s };
    }
  }
  console.log(`tightest radius: ${worst.r.toFixed(1)} m @ s=${worst.s.toFixed(0)}`);

  // 5. grade check
  let maxGrade = 0, maxAt = 0;
  for (let i = 0; i < m; i++) {
    const g = Math.abs(Math.tan(S[i].pitch));
    if (g > maxGrade) { maxGrade = g; maxAt = S[i].s; }
  }
  console.log(`max gradient: ${(maxGrade * 100).toFixed(1)}% @ s=${maxAt.toFixed(0)}`);

  // 6. direction reversals: opposite-heading samples within barrier clash range
  let folds = 0, foldAt = [];
  const clash = t.halfW * 2 + 15;
  for (let i = 0; i < m; i += 2) {
    for (let j = i + 30; j < m; j += 2) {
      const ds = Math.abs(S[i].s - S[j].s);
      if (ds > len / 2) break;
      const d = Math.hypot(S[i].x - S[j].x, S[i].y - S[j].y);
      if (d > clash) continue;
      const dot = S[i].tx * S[j].tx + S[i].ty * S[j].ty;
      if (dot < -0.3) { foldAt.push(`${S[i].s.toFixed(0)}/${S[j].s.toFixed(0)} d=${d.toFixed(0)}`); j += 120; folds++; }
    }
    if (foldAt.length > 8) break;
  }
  console.log(`head-on parallel sections (opposite direction, <${clash} m apart): ${folds ? foldAt.slice(0, 8).join(', ') : 'none'}`);
  console.log('');
}
