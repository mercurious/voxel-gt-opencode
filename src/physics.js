export class Car {
  constructor(track, idx, phys) {
    this.track = track;
    this.idx = idx;
    this.phys = phys;
    this.x = 0; this.y = 0; this.z = 0;
    this.yaw = 0; this.vx = 0; this.vy = 0;
    this.slip = 0; this.onTrack = true; this.sIdx = 0; this.offAmt = 0;
  }

  nearest() {
    // z is passed so an overpass hands us the deck we are actually on instead
    // of the lane it crosses over
    const i = this.idx.query(this.x, this.y, this.z);
    this.sIdx = i;
    return this.track.samples[i];
  }

  resetAt(i) {
    const s = this.track.samples[i];
    this.x = s.x; this.y = s.y; this.z = s.z;
    this.yaw = s.yaw; this.vx = 0; this.vy = 0;
    this.slip = 0; this.sIdx = i;
  }

  respawn() {
    this.resetAt(this.nearest() ? this.sIdx : 0);
  }

  speed() { return Math.hypot(this.vx, this.vy); }
  kmh() { return this.speed() * 3.6; }

  step(dt, steer, throttle, brake, hand) {
    const P = this.phys;
    const s = this.nearest();
    const hw = this.track.halfW;
    const dist = Math.hypot(this.x - s.x, this.y - s.y) - hw;
    this.onTrack = dist < 0.6;
    this.offAmt = Math.max(0, dist);
    const grass = !this.onTrack;

    const cf = Math.cos(this.yaw), sf = Math.sin(this.yaw);
    let vF = this.vx * cf + this.vy * sf;
    let vL = -this.vx * sf + this.vy * cf;

    const maxSpeed = P.top * (grass ? 0.55 : 1);
    if (vF < 0 && throttle) vF = Math.min(0, vF) * 0.4;
    const drive = P.accel * throttle * Math.max(0, 1 - Math.max(0, vF) / maxSpeed) * (grass ? 0.6 : 1);
    vF += drive * dt;
    vF -= brake * (vF > 0 ? 13 : 4) * dt * Math.min(1, Math.abs(vF) / 4 + 0.15);
    if (!throttle && !brake) vF -= Math.sign(vF) * Math.min(Math.abs(vF), 2.2 * dt);
    vF -= vF * 0.0022 * Math.abs(vF) * dt;
    if (vF > maxSpeed) vF += (maxSpeed - vF) * Math.min(1, 2.5 * dt);
    vF = Math.max(-14, Math.min(maxSpeed, vF));

    // steering: bicycle kinematics, angle shrinks with speed
    const spd = Math.abs(vF);
    const maxAng = 0.62 / (1 + spd / 26);
    const ang = -steer * maxAng;
    let omega = (vF / P.wb) * Math.tan(ang);
    if (hand) omega *= 1.6;
    omega = Math.max(-2.6, Math.min(2.6, omega));
    const dYaw = omega * dt;
    this.yaw += dYaw;
    // velocity direction lags body rotation: creates lateral slip
    vL += vF * dYaw;

    const cf2 = Math.cos(this.yaw), sf2 = Math.sin(this.yaw);

    const grip = grass ? 4.2 : (hand ? 2.1 : P.grip);
    const decay = Math.exp(-grip * dt);
    const latAccNeeded = Math.abs(omega * vF);
    this.slip = Math.max(0, latAccNeeded - grip * 0.9) / 12 + Math.abs(vL) / 14;
    vL *= decay;
    if (hand) vF -= Math.abs(vL) * 0.25 * dt;

    this.vx = cf2 * vF - sf2 * vL;
    this.vy = sf2 * vF + cf2 * vL;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // terrain / wall
    const s2 = this.nearest();
    const d2 = Math.hypot(this.x - s2.x, this.y - s2.y);
    const tz = s2.z;
    this.z += (tz - this.z) * Math.min(1, 12 * dt);
    const limit = hw + 2.5;
    if (d2 > limit) {
      const nx = (this.x - s2.x) / d2, ny = (this.y - s2.y) / d2;
      this.x = s2.x + nx * limit;
      this.y = s2.y + ny * limit;
      const vn = this.vx * nx + this.vy * ny;
      if (vn > 0) {
        this.vx -= vn * nx * 1.15;
        this.vy -= vn * ny * 1.15;
        this.vx *= 0.86; this.vy *= 0.86;
      }
    }
  }

  gear() {
    const spd = this.speed();
    return Math.max(1, Math.min(6, Math.floor(spd / (this.phys.top / 6)) + 1));
  }

  rpm01() {
    const bin = this.phys.top / 6;
    const inGear = (this.speed() % bin) / bin;
    return Math.min(1, 0.18 + 0.72 * inGear + 0.1 * (this.speed() < 1 ? 1 : 0));
  }
}
