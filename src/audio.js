export class Audio {
  constructor() { this.ctx = null; }
  init() {
    if (this.ctx) return;
    const C = new (window.AudioContext || window.webkitAudioContext)();
    this.ctx = C;
    const master = C.createGain();
    master.gain.value = 0.5;
    master.connect(C.destination);
    this.master = master;

    this.lp = C.createBiquadFilter();
    this.lp.type = 'lowpass';
    this.lp.frequency.value = 2400;
    this.lp.connect(master);
    this.eg = C.createGain();
    this.eg.gain.value = 0.0;
    this.eg.connect(this.lp);
    this.o1 = C.createOscillator();
    this.o1.type = 'sawtooth';
    this.o2 = C.createOscillator();
    this.o2.type = 'sawtooth';
    this.o2.detune.value = 11;
    this.o3 = C.createOscillator();
    this.o3.type = 'square';
    const og = C.createGain();
    og.gain.value = 0.35;
    this.o3.connect(og);
    og.connect(this.eg);
    this.o1.connect(this.eg);
    this.o2.connect(this.eg);
    this.o1.start(); this.o2.start(); this.o3.start();

    const nb = C.createBuffer(1, C.sampleRate, C.sampleRate);
    const d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = C.createBufferSource();
    this.noise.buffer = nb;
    this.noise.loop = true;
    const bp = C.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1300;
    bp.Q.value = 0.7;
    this.sg = C.createGain();
    this.sg.gain.value = 0;
    this.noise.connect(bp);
    bp.connect(this.sg);
    this.sg.connect(master);
    this.noise.start();
  }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  setEngine(rpm01, load) {
    if (!this.ctx) return;
    const f = 55 + rpm01 * 430;
    const t = this.ctx.currentTime;
    this.o1.frequency.setTargetAtTime(f, t, 0.03);
    this.o2.frequency.setTargetAtTime(f * 1.005, t, 0.03);
    this.o3.frequency.setTargetAtTime(f * 0.5, t, 0.03);
    this.lp.frequency.setTargetAtTime(700 + rpm01 * 3600, t, 0.05);
    this.eg.gain.setTargetAtTime(0.028 + 0.05 * load + 0.03 * rpm01, t, 0.05);
  }
  idle() { if (this.ctx) this.eg.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1); }
  setSkid(a) { if (this.ctx) this.sg.gain.setTargetAtTime(Math.min(0.35, a * 0.3), this.ctx.currentTime, 0.05); }
  beep(freq, dur = 0.12, vol = 0.25) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur);
  }
}
