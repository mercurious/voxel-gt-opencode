import { TRACKS, buildTrack, buildIndex } from './tracks.js';
import { CARS } from './cars.js';
import { Renderer, yawPitchRoll } from './renderer.js';
import { buildWorld } from './world.js';
import { Car } from './physics.js';
import { input } from './input.js';
import { Audio } from './audio.js';

const $ = (id) => document.getElementById(id);
const screens = ['title', 'carSelect', 'trackSelect', 'pause', 'results'];
function show(name) {
  for (const s of screens) $(s).classList.toggle('hidden', s !== name);
}
const fmt = (t) => {
  if (t == null || !isFinite(t)) return '--:--.---';
  const m = Math.floor(t / 60), s = Math.floor(t % 60), ms = Math.floor((t % 1) * 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

const glCanvas = $('gl');
const hudCanvas = $('hud');
const hud = hudCanvas.getContext('2d');
let renderer = null;
const bootErr = (m) => {
  const b = document.getElementById('booterr');
  if (b) { b.textContent = '\u26a0 ' + m; b.style.display = 'block'; }
};
try {
  renderer = new Renderer(glCanvas);
} catch (e) {
  bootErr('Renderer failed: ' + e.message + ' — enable WebGL2 in this browser (hardware acceleration / recent Chrome, Edge or Firefox needed).');
}
const sound = new Audio();

let selCar = 0, selTrack = 0;
let race = null;
let last = 0;

// ---------- selection menus ----------
function drawCarPreview(cv, car) {
  const c = cv.getContext('2d');
  const w = cv.width = cv.clientWidth * 2, h = cv.height = cv.clientHeight * 2;
  c.clearRect(0, 0, w, h);
  c.fillStyle = 'rgba(255,255,255,0.04)';
  c.fillRect(0, 0, w, h);
  const k = Math.min(w / 5.2, h / 2.4) * 0.75;
  c.save();
  c.translate(w * 0.5, h * 0.5);
  for (const b of car.boxes) {
    c.fillStyle = b.c;
    c.fillRect((b.x - b.sx / 2) * k, (-b.y - b.sy / 2) * k, b.sx * k, b.sy * k);
  }
  c.restore();
}

function statRow(label, v) {
  return `<div class="stat"><i>${label}</i><span class="bar"><em style="width:${Math.round(v * 100)}%"></em></span></div>`;
}

function buildCarList() {
  const list = $('carList');
  list.innerHTML = '';
  CARS.forEach((car, i) => {
    const d = document.createElement('div');
    d.className = 'card' + (i === selCar ? ' sel' : '');
    d.innerHTML = `<canvas></canvas><div class="name">${car.name}</div><div class="sub">${car.sub}</div>
      <div class="stats">${statRow('POWER', car.stats.power)}${statRow('GRIP', car.stats.grip)}${statRow('BRAKE', car.stats.brake)}${statRow('DOWNFORCE', car.stats.downforce)}</div>`;
    d.onclick = () => { selCar = i; buildCarList(); sound.init(); sound.resume(); sound.beep(440, 0.06, 0.12); };
    list.appendChild(d);
    drawCarPreview(d.querySelector('canvas'), car);
  });
}

function buildTrackList() {
  const list = $('trackList');
  list.innerHTML = '';
  TRACKS.forEach((def, i) => {
    const t = getTrack(i);
    const d = document.createElement('div');
    d.className = 'card' + (i === selTrack ? ' sel' : '');
    d.innerHTML = `<canvas></canvas><div class="name">${def.name}</div><div class="sub">${def.loc}</div>
      <div class="trackmeta">${t.length.toFixed(0)} m${def.condensed ? ' · condensed' : ' · full'}</div>`;
    d.onclick = () => { selTrack = i; buildTrackList(); sound.init(); sound.resume(); sound.beep(440, 0.06, 0.12); };
    list.appendChild(d);
    drawMinimap(d.querySelector('canvas'), t, null);
  });
}

const trackCache = new Map();
function getTrack(i) {
  let t = trackCache.get(i);
  if (!t) {
    t = buildTrack(TRACKS[i]);
    t.index = buildIndex(t);
    trackCache.set(i, t);
  }
  return t;
}

function drawMinimap(cv, t, car) {
  const c = cv.getContext('2d');
  const w = cv.width = cv.clientWidth * 2, h = cv.height = cv.clientHeight * 2;
  let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
  for (const s of t.samples) {
    if (s.x < minx) minx = s.x; if (s.x > maxx) maxx = s.x;
    if (s.y < miny) miny = s.y; if (s.y > maxy) maxy = s.y;
  }
  const sc = Math.min(w / (maxx - minx + 60), h / (maxy - miny + 60)) * 0.9;
  const tx = (x) => (x - (minx + maxx) / 2) * sc + w / 2;
  const ty = (y) => -(y - (miny + maxy) / 2) * sc + h / 2;
  c.strokeStyle = '#6a707c';
  c.lineWidth = Math.max(1.5, t.halfW * 2 * sc * 0.5);
  c.lineJoin = 'round';
  c.beginPath();
  for (let i = 0; i < t.samples.length; i += 6) {
    const s = t.samples[i];
    if (i === 0) c.moveTo(tx(s.x), ty(s.y)); else c.lineTo(tx(s.x), ty(s.y));
  }
  c.closePath();
  c.stroke();
  const s0 = t.samples[0];
  c.strokeStyle = '#c8a24a';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(tx(s0.x - s0.ty * 8), ty(s0.y + s0.tx * 8));
  c.lineTo(tx(s0.x + s0.ty * 8), ty(s0.y - s0.tx * 8));
  c.stroke();
  if (car) {
    c.fillStyle = '#e04040';
    c.beginPath();
    c.arc(tx(car.x), ty(car.y), 4, 0, 7);
    c.fill();
  }
}

// ---------- race ----------
function startRace() {
  if (!renderer) return;
  const track = getTrack(selTrack);
  renderer.pending = [];
  renderer.chunks = [];
  buildWorld(renderer, track);
  renderer.finalize(96);
  const car = new Car(track, track.index, CARS[selCar].phys);
  const key = `voxelgt.best.${track.def.id}.${CARS[selCar].id}`;
  race = {
    track, car, key,
    best: parseFloat(localStorage.getItem(key) || 'NaN'),
    laps: [], curLap: 0, lapStart: 0, time: 0,
    state: 'count', countdown: 3.4,
    cam: { x: car.x - 9, y: car.y, z: car.z + 3.4, yaw: car.yaw, pitch: -0.12 },
    hood: false, halfway: false, totalLaps: 3, msg: '', msgT: 0,
  };
  car.resetAt(5);
  hudCanvasMini().style.display = '';
  show(null);
}

function endRace() {
  const body = $('resBody');
  const best = race.best;
  const rows = race.laps.map((l, i) => `<div class="stat"><i>LAP ${i + 1}</i><span>${fmt(l)}</span></div>`).join('');
  body.innerHTML = `<div class="name" style="font-size:18px">${race.track.def.name} · ${CARS[selCar].name}</div>
    ${rows}<div class="stat"><i>BEST</i><span>${fmt(Math.min(best, ...race.laps))}</span></div>
    ${race.laps.some((l) => l < best) ? '<div class="sub" style="color:#c8a24a;margin-top:8px">NEW COURSE RECORD!</div>' : ''}`;
  if (mini) mini.style.display = 'none';
  show('results');
  race = null;
}

function stepRace(dt) {
  const r = race;
  const c = r.car;
  if (r.state === 'count') {
    const prev = Math.ceil(r.countdown);
    r.countdown -= dt;
    const now = Math.ceil(r.countdown);
    if (now !== prev && now >= 0) sound.beep(now === 0 ? 880 : 550, 0.15, 0.3);
    if (r.countdown <= 0) { r.state = 'drive'; r.lapStart = 0; }
    return;
  }
  if (input.tapped('KeyC')) r.hood = !r.hood;
  if (input.tapped('KeyR')) { c.respawn(); r.msg = 'RESPAWN'; r.msgT = 1; }
  if (r.state === 'drive') {
    r.time += dt;
    c.step(dt, input.steer(), input.throttle(), input.brake(), input.hand());
    const sPos = c.sIdx * r.track.step;
    if (sPos > r.track.length * 0.5) r.halfway = true;
    const L = r.track.length;
    if (r.halfway && r.prevS != null && r.prevS > L * 0.9 && sPos < L * 0.1) {
      const lapT = r.time - r.lapStart;
      r.laps.push(lapT);
      r.lapStart = r.time;
      r.halfway = false;
      if (lapT < r.best) {
        r.best = lapT;
        localStorage.setItem(r.key, String(lapT));
        r.msg = 'NEW BEST ' + fmt(lapT);
      } else {
        r.msg = 'LAP ' + fmt(lapT);
      }
      r.msgT = 2.2;
      sound.beep(700, 0.15, 0.25);
      if (r.laps.length >= r.totalLaps) { endRace(); return; }
    }
    r.prevS = sPos;
  }
  r.msgT = Math.max(0, r.msgT - dt);

  // camera
  const s = r.track.samples[c.sIdx];
  const cf = Math.cos(c.yaw), sf = Math.sin(c.yaw);
  let camT;
  if (r.hood) {
    camT = { x: c.x + cf * 0.4 - sf * 0.35, y: c.y + sf * 0.4 + cf * 0.35, z: c.z + 1.15, yaw: c.yaw, pitch: s.pitch - 0.05 };
  } else {
    const back = 9.5 + Math.min(4, c.speed() * 0.05);
    camT = { x: c.x - cf * back, y: c.y - sf * back, z: c.z + 3.6, yaw: c.yaw, pitch: -0.14 + s.pitch };
  }
  const k = r.hood ? 1 : Math.min(1, 5.5 * dt);
  r.cam.x += (camT.x - r.cam.x) * k;
  r.cam.y += (camT.y - r.cam.y) * k;
  r.cam.z += (camT.z - r.cam.z) * k;
  let dy = camT.yaw - r.cam.yaw;
  while (dy > Math.PI) dy -= 2 * Math.PI;
  while (dy < -Math.PI) dy += 2 * Math.PI;
  r.cam.yaw += dy * (r.hood ? 1 : Math.min(1, 6 * dt));
  r.cam.pitch += (camT.pitch - r.cam.pitch) * Math.min(1, 6 * dt);
}

function drawDynamic() {
  const c = race.car;
  const s = race.track.samples[c.sIdx];
  const roll = Math.max(-0.12, Math.min(0.12, 0.0));
  const q = yawPitchRoll(c.yaw, s.pitch, roll);
  const items = [];
  for (const b of CARS[selCar].boxes) {
    const lx = b.x, ly = b.y, lz = b.z - 0.33;
    const ca = Math.cos(c.yaw), sa = Math.sin(c.yaw);
    items.push({
      x: c.x + lx * ca - ly * sa,
      y: c.y + lx * sa + ly * ca,
      z: c.z + lz,
      sx: b.sx, sy: b.sy, sz: b.sz,
      c: b.c, q,
    });
  }
  renderer.setDynamic(items);
}

function drawHUD() {
  const r = race;
  const w = hudCanvas.width = glCanvas.width, h = hudCanvas.height = glCanvas.height;
  const sc = w / 1280;
  hud.clearRect(0, 0, w, h);
  hud.save();
  hud.scale(sc, sc);
  hud.font = 'bold 46px monospace';
  hud.textAlign = 'right';
  hud.fillStyle = '#fff';
  hud.shadowColor = '#000';
  hud.shadowBlur = 6;
  const spd = Math.round(r.car.kmh());
  hud.fillText(String(spd), 1218, 690);
  hud.font = 'bold 20px monospace';
  hud.fillText('km/h', 1218, 716);
  hud.font = 'bold 40px monospace';
  hud.fillText('G' + r.car.gear(), 1218, 620);
  // rpm bar
  const rpm = r.car.rpm01();
  hud.fillStyle = '#222';
  hud.fillRect(1058, 730, 160, 10);
  hud.fillStyle = rpm > 0.85 ? '#e04040' : '#c8a24a';
  hud.fillRect(1058, 730, 160 * rpm, 10);
  // times
  hud.textAlign = 'left';
  hud.font = 'bold 26px monospace';
  hud.fillStyle = '#fff';
  hud.fillText('LAP ' + Math.min(r.laps.length + 1, r.totalLaps) + '/' + r.totalLaps, 62, 60);
  hud.fillText(fmt(r.state === 'count' ? 0 : r.time - r.lapStart), 62, 96);
  hud.fillStyle = '#9ab';
  hud.font = '18px monospace';
  hud.fillText('BEST ' + fmt(r.best), 62, 124);
  if (r.laps.length) hud.fillText('LAST ' + fmt(r.laps[r.laps.length - 1]), 62, 150);
  // corner name
  const sPos = r.car.sIdx * r.track.step;
  const seg = r.track.segments.find((g) => sPos >= g.s0 && sPos < g.s1);
  if (seg && r.state === 'drive') {
    hud.textAlign = 'center';
    hud.fillStyle = 'rgba(232,232,236,0.85)';
    hud.font = '600 22px sans-serif';
    hud.fillText(seg.name.toUpperCase(), 640, 770);
  }
  // message
  if (r.msgT > 0) {
    hud.textAlign = 'center';
    hud.fillStyle = '#c8a24a';
    hud.font = 'bold 34px monospace';
    hud.fillText(r.msg, 640, 330);
  }
  // countdown
  if (r.state === 'count') {
    hud.textAlign = 'center';
    hud.fillStyle = '#fff';
    hud.font = 'bold 120px monospace';
    const n = Math.ceil(r.countdown);
    hud.fillText(n <= 0 ? 'GO' : String(n), 640, 420);
  }
  // minimap
  drawMinimap(hudCanvasMini(), r.track, r.car);
  hud.restore();
}

let mini = null;
function hudCanvasMini() {
  if (!mini) {
    mini = document.createElement('canvas');
    mini.style.cssText = 'position:fixed;right:24px;top:24px;width:220px;height:160px;z-index:6;pointer-events:none;background:rgba(10,12,16,0.55)';
    document.body.appendChild(mini);
  }
  return mini;
}

// ---------- main loop ----------
function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
  last = t;
  const vis = (n) => !$(n).classList.contains('hidden');
  if (input.tapped('Enter') || input.tapped('NumpadEnter')) {
    if (vis('title')) $('btnStart').click();
    else if (vis('carSelect')) $('btnCarNext').click();
    else if (vis('trackSelect')) $('btnTrackGo').click();
    else if (vis('pause')) $('btnResume').click();
    else if (vis('results')) $('btnRetry').click();
  }
  if (race && renderer) {
    const paused = !$('pause').classList.contains('hidden');
    if (paused) {
      if (input.tapped('Escape')) show(null);
    } else if (input.tapped('Escape')) {
      show('pause');
    } else {
      stepRace(dt);
      sound.init();
      sound.resume();
      if (race) {
        if (race.state === 'drive') sound.setEngine(race.car.rpm01(), input.throttle());
        else sound.idle();
        sound.setSkid(race.car.onTrack ? race.car.slip : Math.min(1, race.car.slip + race.car.offAmt * 0.1));
      }
    }
    if (race) {
      drawDynamic();
      const c = race.cam;
      renderer.render({ x: c.x, y: c.y, z: c.z, yaw: c.yaw, pitch: c.pitch, sky: race.track.def.theme.sky });
      drawHUD();
    }
  }
  input.endFrame();
  requestAnimationFrame(frame);
}

// wiring
$('btnStart').onclick = () => { sound.init(); sound.resume(); show('carSelect'); buildCarList(); };
$('btnCarBack').onclick = () => show('title');
$('btnCarNext').onclick = () => { show('trackSelect'); buildTrackList(); };
$('btnTrackBack').onclick = () => show('carSelect');
$('btnTrackGo').onclick = () => { sound.init(); sound.resume(); startRace(); };
$('btnResume').onclick = () => show(null);
$('btnQuit').onclick = () => { race = null; if (mini) mini.style.display = 'none'; show('title'); };
$('btnRetry').onclick = () => startRace();
$('btnResultsQuit').onclick = () => show('title');

show('title');
requestAnimationFrame(frame);
