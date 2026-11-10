export const input = {
  keys: new Set(),
  just: new Set(),
  down(e) {
    const k = e.code;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(k)) e.preventDefault();
    if (!this.keys.has(k)) this.just.add(k);
    this.keys.add(k);
  },
  up(e) { this.keys.delete(e.code); },
  held(...codes) { return codes.some((c) => this.keys.has(c)); },
  tapped(code) { return this.just.has(code); },
  endFrame() { this.just.clear(); },
  throttle: () => (input.held('KeyW', 'ArrowUp') ? 1 : 0),
  brake: () => (input.held('KeyS', 'ArrowDown') ? 1 : 0),
  steer: () => (input.held('KeyA', 'ArrowLeft') ? -1 : 0) + (input.held('KeyD', 'ArrowRight') ? 1 : 0),
  hand: () => input.held('Space'),
};
window.addEventListener('keydown', (e) => input.down(e));
window.addEventListener('keyup', (e) => input.up(e));
