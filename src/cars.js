// local axes: +x forward, +y left, +z up, wheels touch z=0. meters.
const b = (x, y, z, sx, sy, sz, c) => ({ x, y, z, sx, sy, sz, c });
const WHEEL = '#141414', GLASS = '#1c222c', DARK = '#1a1c20';

function coupe({ L, W, H, cab, spoiler, roof, color }) {
  const bx = [];
  bx.push(b(0, 0, H * 0.42, L, W, H * 0.84, color));
  bx.push(b(0, 0, H * 0.9, L * 0.98, W * 0.96, H * 0.2, color));
  const cl = L * cab;
  bx.push(b(-L * 0.06, 0, H + roof * 0.45, cl, W * 0.86, roof, color));
  bx.push(b(-L * 0.06, 0, H + roof * 0.45, cl * 0.92, W * 0.82, roof * 0.9, GLASS));
  bx.push(b(L * 0.42, 0, H * 0.55, L * 0.16, W * 0.9, H * 0.5, color));
  bx.push(b(-L * 0.44, 0, H * 0.55, L * 0.12, W * 0.92, H * 0.5, color));
  bx.push(b(L * 0.49, W * 0.34, H * 0.62, 0.08, 0.3, 0.14, '#f5e9c8'));
  bx.push(b(L * 0.49, -W * 0.34, H * 0.62, 0.08, 0.3, 0.14, '#f5e9c8'));
  bx.push(b(-L * 0.49, W * 0.36, H * 0.6, 0.06, 0.34, 0.16, '#c23b3b'));
  bx.push(b(-L * 0.49, -W * 0.36, H * 0.6, 0.06, 0.34, 0.16, '#c23b3b'));
  bx.push(b(0, W * 0.5 - 0.14, 0.33, 0.72, 0.26, 0.66, WHEEL));
  bx.push(b(0, -W * 0.5 + 0.14, 0.33, 0.72, 0.26, 0.66, WHEEL));
  bx.push(b(L * 0.33, W * 0.5 - 0.14, 0.33, 0.7, 0.26, 0.66, WHEEL));
  bx.push(b(L * 0.33, -W * 0.5 + 0.14, 0.33, 0.7, 0.26, 0.66, WHEEL));
  bx.push(b(0, 0, 0.16, L * 0.92, W * 0.9, 0.14, DARK));
  if (spoiler) {
    bx.push(b(-L * 0.47, W * 0.36, H + 0.18, 0.1, 0.12, 0.34, DARK));
    bx.push(b(-L * 0.47, -W * 0.36, H + 0.18, 0.1, 0.12, 0.34, DARK));
    bx.push(b(-L * 0.47, 0, H + 0.36, 0.34, W * 0.92, 0.08, spoiler === true ? color : spoiler));
  }
  return bx;
}

export const CARS = [
  {
    id: 'fd3s', name: 'Mazda RX-7 Spirit FD', sub: 'RX-7 (FD3S) Type R',
    color: '#c02632',
    stats: { power: 0.72, grip: 0.78, brake: 0.7, downforce: 0.55 },
    phys: { top: 69, accel: 8.8, grip: 10.4, handGrip: 3.2, wb: 2.42, under: 0.9 },
    boxes: coupe({ L: 4.3, W: 1.78, H: 1.2, cab: 0.5, spoiler: true, roof: 0.5, color: '#c02632' }),
  },
  {
    id: 'supra', name: 'Toyota Supra RZ', sub: 'Supra (JZA80) 2dr Turbo',
    color: '#e0752a',
    stats: { power: 0.84, grip: 0.72, brake: 0.72, downforce: 0.6 },
    phys: { top: 72, accel: 9.3, grip: 9.8, handGrip: 3.0, wb: 2.55, under: 1.0 },
    boxes: coupe({ L: 4.6, W: 1.8, H: 1.22, cab: 0.52, spoiler: true, roof: 0.52, color: '#e0752a' }),
  },
  {
    id: 'r34', name: 'Nissan Skyline GT-R', sub: 'Skyline GT-R (BNR34) V·Spec',
    color: '#2a5a9e',
    stats: { power: 0.88, grip: 0.9, brake: 0.8, downforce: 0.7 },
    phys: { top: 71, accel: 9.9, grip: 11.2, handGrip: 3.6, wb: 2.53, under: 0.75 },
    boxes: coupe({ L: 4.6, W: 1.78, H: 1.28, cab: 0.55, spoiler: '#2a2c31', roof: 0.56, color: '#2a5a9e' }),
  },
  {
    id: 'nsxr', name: 'Honda NSX Type R', sub: 'NSX-R (NA1)',
    color: '#e9e9ee',
    stats: { power: 0.75, grip: 0.82, brake: 0.78, downforce: 0.5 },
    phys: { top: 75, accel: 8.5, grip: 10.8, handGrip: 3.4, wb: 2.53, under: 0.85 },
    boxes: coupe({ L: 4.4, W: 1.84, H: 1.17, cab: 0.5, spoiler: false, roof: 0.46, color: '#e9e9ee' }),
  },
  {
    id: 'evo6', name: 'Lancer Evolution VI', sub: 'Lancer Evolution VI TME',
    color: '#28488e',
    stats: { power: 0.86, grip: 0.92, brake: 0.82, downforce: 0.75 },
    phys: { top: 68, accel: 9.6, grip: 11.5, handGrip: 3.8, wb: 2.51, under: 0.7 },
    boxes: coupe({ L: 4.4, W: 1.77, H: 1.37, cab: 0.56, spoiler: '#e8e8ee', roof: 0.6, color: '#28488e' }),
  },
];
