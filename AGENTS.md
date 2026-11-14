# Voxel Grand Tourismo

Pure-ESM browser voxel racer. No package.json, no build step, no dependencies, no test runner, no CI.
`index.html` + `styles.css` + `src/*.js` are served as-is.

## Run

- Must be served over HTTP — ES modules are blocked on `file://`, and `index.html` prints a boot error when opened that way:
  `python3 -m http.server` → http://localhost:8000
- Controls: WASD/arrows, Space handbrake, C hood cam, R respawn, Esc pause, Enter advances menus.
- Best laps are localStorage keys `voxelgt.best.<trackId>.<carId>`; clear them to reset records.

## Verifying changes

Track/layout math is DOM-free and importable from node (`src/tracks.js`), so course edits are checkable headlessly:

- `node tools/mapcheck.mjs` — ASCII map of each track + named corner spans
- `node tools/layoutcheck.mjs` — closure gap, turning number, self-intersections/bridges, tightest radius, gradient, head-on folds
- `node tools/coursetune.mjs [trackId]` — turn sum vs. what the auto-closer needs, arc/straight totals
- `node tools/tracecourse.mjs [trackId]` — position after every segment while editing a course (default `tsukuba`)

Rendering and UI need a browser; this headless run also prints page errors and proves WebGL2 came up:

```
python3 -m http.server 8731 &
google-chrome --headless=new --no-sandbox --enable-unsafe-swiftshader --use-gl=angle \
  --use-angle=swiftshader --enable-logging=stderr --virtual-time-budget=6000 \
  http://localhost:8731/ 2>&1 | grep -i CONSOLE
```

`--enable-unsafe-swiftshader` is required — without it headless Chrome refuses software WebGL and the page only shows a renderer boot error. This covers the load path only; reaching `buildWorld` requires menu clicks (drive the page with the playwright copy in `~/.npm/_npx`, or click by hand).

## Architecture notes that are not obvious from filenames

- Renderer is a single WebGL2 program drawing instanced oriented boxes (`src/renderer.js`). Static world = `renderer.add(...)` accumulates into `renderer.pending`, then `finalize(CELL)` bakes it into chunks; the car is re-uploaded every frame via `setDynamic(items)`. `startRace()` clears `pending`/`chunks` before `buildWorld` — without that the world is built twice. `add()` silently stops accepting geometry past 4,000,000 boxes.
- World axes: `x`/`y` is the ground plane, `z` is up (camera height is `cam.z`). Car model local axes: `+x` forward, `+y` left, `+z` up, wheels at `z=0` (`src/cars.js`).
- Track pipeline: `course` array → `compileCourse` (integrates segments, then **solves** the closing arc/straight/arc) → Catmull-Rom spline → resampled at 1 m samples by `buildTrack`. Never hand-author the closing segment. The solver also has to hit the def's `wind` turning number, so a course whose turn sum strays far from `wind*360` deg makes it pick a different winding that folds the track back on itself — `coursetune.mjs` prints the target sum and the alignment error.
- Course segment format (`TRACKS[i].course`): straight `{ s }`, arc `{ r, t }` with `t` = heading change in **degrees** (positive = right). `s`/`len` on a turning segment is ignored; drawn arc length is `r*|t|`. `{ dz }` is elevation change across the segment, `{ bank }` is a percent-ish cross-slope (`world.js` applies `atan(bank)`), `{ name }` starts a HUD corner span. Keep `applySeg`'s arc in chord form (`2r·sin(|t|/2)` at heading `h + t/2`); the center-offset form kinks every chunked arc.
- Physics/world need `track.index`, attached separately: `t = buildTrack(def); t.index = buildIndex(t)` (see `getTrack` in `src/main.js`). Both call `idx.query(x, y[, z])`; the optional `z` separates the two decks at an overpass (Suzuka's bridged figure-eight) — drop it and the car drops onto the lane below and its lap progress jumps.
- `src/tracks.js` also exports `createWorld`, `nearestPoint`, `headingAt`, `pointAt`, `lapAt`, `getTrack`. Nothing imports them; `main.js` has its own `getTrack`/`trackCache`. They are not the live path.
- In `src/cars.js`, `stats` are only the select-screen bars. Driving comes from `phys`, and `physics.js` reads only `top`, `accel`, `grip`, `wb` — `phys.handGrip`, `phys.under` and the `stats` values currently change nothing.

## Guardrails that no tool enforces

- Every `TRACKS` entry needs a `theme` block: `world.js` reads `standAt`/`standSides`/`pitAt`/`pitSides`/`grass`/`trees` and `main.js` reads `sky`. No tool checks it, and rewriting the course arrays in `e42f10a` dropped all three — races then threw `Cannot read properties of undefined (reading 'standAt')` at `src/world.js:43`. Shape: `grass`/`sky` as 0..1 rgb (`sky` also accepts a hex string), `trees: 'dense'|'sparse'`, `standAt`/`pitAt` as a lap fraction `0..1` (`standAt` also accepts a list), `standSides`/`pitSides` as `[-1]`/`[1]` (−1 = right of the driving direction).
- `tools/*.mjs` cover layout math only; they never touch scenery, physics or rendering, so a broken `theme` or HUD change still exits 0. Use the headless Chrome check above for those paths. The only expected console noise is a `favicon.ico` 404.
- Static geometry stays around 18k–33k boxes per track (measured), far below the 4,000,000 box cap, so a large jump in that number means scenery is being duplicated, not that the cap is close.
- No test framework exists; the `tools/*.mjs` scripts are the closest thing to one and are expected to keep passing.

## Repo conventions

- The two session transcripts in the repo root total ~1.7 MB. Grep them, never read them whole; they are history, not spec.
- `/home/dave/voxel/*` are sibling, independent experiments of this same game (different models/variants). Do not edit, sync, or copy between them unless asked.
- Private work: commit as the `mercurious` identity, nothing here goes upstream (see `/home/dave/AGENTS.md`).
