# Voxel Grand Tourismo

A real-circuit racing game that runs in the browser with no engine, no assets and no build step.
Every box on screen — road, curbs, barriers, terrain, trees, grandstands, the five cars — is one
instanced oriented box in a single WebGL2 shader. The circuits are typed in as real corner radii and
straight lengths; the loop that closes each lap is solved by code, not drawn by hand.

Everything is plain ES modules (`src/*.js`), DOM menus plus a 2D-canvas HUD and minimap, and WebAudio
for the engine and skid noise. ~2,100 lines of JavaScript, zero dependencies.

> **Status:** the game loads and the three courses close cleanly (`layoutcheck.mjs`: sub-metre
> closure, correct turning numbers, no barrier clashes), but **starting a race currently throws**
> (`Cannot read properties of undefined (reading 'standAt')` in `src/world.js:43`). The per-track
> `theme` block was dropped from `src/tracks.js` in commit `e42f10a`. See
> [AGENTS.md](AGENTS.md) for the exact shape to restore. Layout work is fully verifiable headlessly
> (see [Tools](#tools)) while this is open.

## Play

```bash
python3 -m http.server      # or any static server
```

Open <http://localhost:8000>. ES modules are blocked on `file://`, so opening `index.html`
directly shows a boot error. Needs a WebGL2 browser (recent Chrome, Edge or Firefox with hardware
acceleration on).

| Key | Action |
| --- | --- |
| `W` / `↑` | throttle |
| `S` / `↓` | brake, then reverse |
| `A` `D` / `←` `→` | steer |
| `Space` | handbrake (drift it) |
| `C` | chase cam ↔ hood cam |
| `R` | respawn on the racing line |
| `Esc` | pause |
| `Enter` | confirm in menus |

Race flow: title → pick one of five cars → pick one of three courses → 3-lap stint with a
countdown, live lap/last/best timing, corner-name callouts, a minimap and a results screen. Best lap
per car per course is stored in `localStorage` (`voxelgt.best.<track>.<car>`).

## Courses

Layouts are described as real centreline arcs in metres, then auto-closed into a drivable loop.

| Course | In-game lap | Real circuit | Notes |
| --- | --- | --- | --- |
| Tsukuba Circuit | 1,773 m | 2.045 km | stylized single clockwise loop |
| Suzuka Circuit | 3,550 m | 5.807 km (GP) | condensed, figure-eight with one bridged crossing |
| Nordschleife | 3,762 m | 20.832 km | heavily condensed single loop, elevation and camber |

Named corners are compiled from the course data and shown on the HUD (`Hatzenbach`, `130R`,
`Meadow Corner`, …) and on the minimap. Suzuka's figure-eight crossing and the Nordschleife's tiered
sections are built as real overpasses with piers — the physics index uses height to pick the deck you
are on. Two Nordschleife sections are flagged as running opposite-direction 29 m apart; that is the
one layout wrinkle the checker still reports.

## Cars

Mazda RX-7 Spirit FD · Toyota Supra RZ · Nissan Skyline GT-R (BNR34) · Honda NSX-R (NA1) ·
Lancer Evolution VI TME. Each is a stack of boxes generated from a `coupe()` parametric body, and
each has its own arcade physics preset (`top`, `accel`, `grip`, `wb`).

## How it fits together

```
src/tracks.js    course arcs → compileCourse (+ solved closing loop) → spline → 1 m samples + spatial index
src/world.js     walks the samples and emits every static box (road, curbs, barriers, terrain, grandstands, trees, overpass)
src/renderer.js  one WebGL2 program: instanced boxes, chunked static geometry, per-frame dynamic upload for the car
src/physics.js   bicycle-model arcade car: lateral slip, grip budget, grass, walls, respawn
src/main.js      menus, race state, lap timing, camera, HUD/minimap drawing, main loop
src/cars.js      five cars: body box generator, physics preset, menu stat bars
src/audio.js     WebAudio engine (3 oscillators + lowpass), band-passed noise for skid, menu beeps
src/input.js     key state, `held()` / `tapped()` sampled per frame
tools/*.mjs      headless checkers for the track compiler (no browser needed)
```

The one idea worth knowing before editing: a course is **not** a hand-drawn closed loop. You write
open segments — `{ s: 125 }` for a straight, `{ r: 55, t: -72.3 }` for a 55 m-radius arc turning
72.3° to the left — and `compileCourse` integrates them and *solves* the closing
arc–straight–arc that brings the lap back to the start line with matching heading and the declared
turning number. Corner metadata (`name`, `bank`, `dz`) rides along and becomes HUD spans and camber.

## Tools

All four run on plain `node`, no install, because the track compiler has no DOM dependency:

```bash
node tools/mapcheck.mjs        # ASCII map of each circuit + corner spans with % distance
node tools/layoutcheck.mjs     # closure gap, turning number, self-intersections, bridges, gradient
node tools/coursetune.mjs      # turn sum vs. what the closing loop needs (per track id, or all)
node tools/tracecourse.mjs     # position/heading after every segment — debug one course
```

Example output (`mapcheck.mjs`, Tsukuba; `@` = start/finish, letters = named corners — width and
blank rows cropped here):

```
|             ##@#S#####                                                     |
|            ##        #T                                                    |
|           ##          #                                                    |
|          #             ##                                                  |
|         ##              S#                                                 |
|        #                 ##                                                |
|       ##                  M                                                |
|      #                    #                                                |
|     ##                 ##M#                                                |
|    ##               #B                                                     |
|     #            B#                                                        |
|      ##         #                                                          |
|       ###       #                                                          |
|         #D#    ##                                                          |
|           ###  #                                                           |
|             ##H#                                                           |
```

Rendering can be smoke-tested headlessly too — the `CONSOLE` lines include uncaught page errors:

```bash
google-chrome --headless=new --no-sandbox --enable-unsafe-swiftshader --use-gl=angle \
  --use-angle=swiftshader --enable-logging=stderr --virtual-time-budget=6000 \
  http://localhost:8000/ 2>&1 | grep -i CONSOLE
```

## History and further notes

- `session-*.md` in the repo root are the OpenCode transcripts from the original build and the
  layout-fix pass — the design decisions and the failed attempts are all in there (they are large; grep them).
- [AGENTS.md](AGENTS.md) records the non-obvious constraints for automated work: the current
  regressions, the fields that are stale, and which exports are dead code.
- No license and no upstream plan: this is a private personal experiment. The name is a joke about
  the obvious inspiration.
