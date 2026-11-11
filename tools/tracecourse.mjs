import { TRACKS } from "../src/tracks.js";
const D = Math.PI / 180;
const def = TRACKS.find((t) => t.id === (process.argv[2] || "tsukuba"));
let x = 0, y = 0, h = 0, z = 0;
console.log("0: (0,0) h=0");
def.course.forEach((c, i) => {
  const t = c.t ?? c.turn ?? 0;
  const len = c.s ?? c.len ?? 0;
  const r = Math.abs(c.r ?? 45);
  z += c.dz ?? 0;
  if (!t) {
    x += Math.cos(h * D) * len; y += Math.sin(h * D) * len;
  } else {
    // chord form, matches applySeg in src/tracks.js
    const chord = 2 * r * Math.sin(Math.abs(t) * D / 2);
    const mid = (h + t / 2) * D;
    x += Math.cos(mid) * chord; y += Math.sin(mid) * chord;
    h += t;
  }
  console.log(`${i + 1}: ${JSON.stringify(c)} -> (${x.toFixed(1)},${y.toFixed(1)}) h=${h.toFixed(1)}`);
});
