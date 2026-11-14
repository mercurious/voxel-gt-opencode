import { TRACKS, buildTrack, compileCourse } from '../src/tracks.js';

const W = 88, H = 38;
for (const def of TRACKS) {
  const cc = compileCourse(def.course, def.wind || 0);
  const t = buildTrack(def);
  console.log(`=== ${def.name} — sampled ${t.length.toFixed(0)} m (declared ${def.lengthM} m${def.condensed ? ' CONDENSED' : ''}), totalTurn ${cc.totalTurn}, closer d1 ${cc.closer.d1.toFixed(0)}/r${cc.closer.r1.toFixed(0)} L${cc.closer.L.toFixed(0)} d2 ${cc.closer.d2.toFixed(0)}/r${cc.closer.r2.toFixed(0)} ===`);
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
  for (const s of t.samples) {
    minx = Math.min(minx, s.x); maxx = Math.max(maxx, s.x);
    miny = Math.min(miny, s.y); maxy = Math.max(maxy, s.y);
  }
  const scale = Math.min((W - 8) / (maxx - minx), (H - 8) / (maxy - miny));
  const gx = x => Math.round((x - minx) * scale + 4);
  const gy = y => H - 1 - Math.round((y - miny) * scale + 4);
  const grid = Array.from({ length: H }, () => Array(W).fill(' '));
  const set = (x, y, ch) => { if (x >= 0 && x < W && y >= 0 && y < H && !(ch === '#' && grid[y][x] !== ' ')) grid[y][x] = ch; };
  let prev = null;
  t.samples.forEach((s, i) => {
    const X = gx(s.x), Y = gy(s.y);
    if (prev) {
      const n = Math.max(Math.abs(X - prev[0]), Math.abs(Y - prev[1]), 1);
      for (let k = 0; k <= n; k++) set(Math.round(prev[0] + (X - prev[0]) * k / n), Math.round(prev[1] + (Y - prev[1]) * k / n), '#');
    }
    prev = [X, Y];
  });
  set(gx(t.samples[0].x), gy(t.samples[0].y), '@');
  // mark named corners
  for (const seg of t.segments) {
    const s = t.samples[Math.round((seg.s0 + seg.s1) / 2) % t.samples.length];
    set(gx(s.x), gy(s.y), seg.name[0]);
  }
  for (const row of grid) console.log('|' + row.join('') + '|');
  console.log(t.segments.map(s => `${s.name}@${(s.s0 / t.length * 100).toFixed(0)}%`).join(' · '));
  console.log('');
}
