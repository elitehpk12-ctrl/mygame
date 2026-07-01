const STEP_MS = 1000 / 60; // fixed logic timestep, independent of render framerate
const MAX_ACCUMULATED_MS = 250; // avoid spiral-of-death on tab-switch/lag spikes

/**
 * Standard fixed-timestep loop: accumulates real elapsed time and calls
 * `update(stepMs)` in fixed STEP_MS chunks (deterministic physics/combat),
 * then calls `render()` once per animation frame (smooth visuals even if
 * update ran 0, 1, or several times that frame).
 */
export class GameLoop {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this._raf = null;
    this._lastTime = 0;
    this._accumulator = 0;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._lastTime = performance.now();
    this._accumulator = 0;
    this._raf = requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _tick = (now) => {
    if (!this.running) return;
    let delta = now - this._lastTime;
    this._lastTime = now;
    if (delta > MAX_ACCUMULATED_MS) delta = MAX_ACCUMULATED_MS;
    this._accumulator += delta;

    while (this._accumulator >= STEP_MS) {
      this.update(STEP_MS);
      this._accumulator -= STEP_MS;
    }

    this.render(now);
    this._raf = requestAnimationFrame(this._tick);
  };
}

export { STEP_MS };
