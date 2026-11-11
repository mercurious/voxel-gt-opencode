// Tuner: integrate a course array (same math as compileCourse) and report
// turn sum, arc/straight lengths, and the preEnd approach state vs origin.
// Usage: node tools/coursetune.mjs [trackId]
import { TRACKS } from "../src/tracks.js";

const D = Math.PI / 180;
function integrate(course, h0 = 0) {
  let x = 0, y = 0, h = h0, z = 0, arc = 0, str = 0, turn = 0;
  for (const c of course) {
    const t = c.t ?? c.turn ?? 0;
    const len = c.s ?? c.len ?? 0;
    const r = Math.abs(c.r ?? 45);
    z += c.dz ?? 0;
    turn += t;
    if (!t) { str += len; x += Math.cos(h * D) * len; y += Math.sin(h * D) * len; continue; }
    arc += r * Math.abs(t) * D;
    // chord form, matches applySeg in src/tracks.js: 2r sin(|t|/2) at h + t/2
    const chord = 2 * r * Math.sin(Math.abs(t) * D / 2);
    const mid = (h + t / 2) * D;
    x += Math.cos(mid) * chord; y += Math.sin(mid) * chord;
    h += t;
  }
  return { x, y, h, z, arc, str, turn };
}
const id = process.argv[2];
const defs = id ? [TRACKS.find((t) => t.id === id)] : TRACKS;
for (const def of defs) {
  const s = integrate(def.course);
  const dist = Math.hypot(s.x, s.y);
  const home = Math.atan2(-s.y, -s.x) / D;
  const headErr = ((s.h - home + 540) % 360) - 180;
  const needCloser = (def.wind || 0) * 360 - s.turn;
  console.log(`${def.name}  wind=${def.wind}`);
  console.log(`turn sum=${s.turn.toFixed(1)}  arc=${s.arc.toFixed(0)}m straight=${s.str.toFixed(0)}m total=${(s.arc + s.str).toFixed(0)}m  zEnd=${s.z}`);
  console.log(`closer must turn: ${needCloser.toFixed(1)} deg`);
  console.log(`preEnd: pos=(${s.x.toFixed(0)},${s.y.toFixed(0)}) dist=${dist.toFixed(0)}m h=${s.h.toFixed(0)} headErrToHome=${headErr.toFixed(0)} zEnd=${s.z}`);
  const want = (def.wind || 0) * 360;
  // a single closer arc of turn T heads home exactly when home bearing = h + T/2
  const align = ((home - (s.h + needCloser / 2) + 540) % 360) - 180;
  console.log(`arc-align error (single closer arc): ${align.toFixed(0)} deg (ideally +/-35)`);
  console.log(`advisory: for wind ${def.wind}, turn sum should be near ${want} ± 400; dist 300..1500`);
  console.log();
}
