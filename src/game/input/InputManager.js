// InputManager — translates raw keyboard events into a stable set of game
// actions. Framework-agnostic: no React, no DOM assumptions beyond window.

const KEY_MAP = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowUp: 'jump',
  KeyW: 'jump',
  Space: 'jump',
  KeyJ: 'attack',
  KeyK: 'heavyAttack',
  ShiftLeft: 'dash',
  ShiftRight: 'dash',
  KeyF: 'hook',
  KeyL: 'spinAttack',
  KeyH: 'healPotion',
  Escape: 'pause',
  KeyP: 'pause',
};

export class InputManager {
  constructor(target = window) {
    this.target = target;
    this.state = {};
    this.pressedThisFrame = new Set();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  attach() {
    this.target.addEventListener('keydown', this._onKeyDown);
    this.target.addEventListener('keyup', this._onKeyUp);
  }

  detach() {
    this.target.removeEventListener('keydown', this._onKeyDown);
    this.target.removeEventListener('keyup', this._onKeyUp);
  }

  _onKeyDown(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
    if (!this.state[action]) this.pressedThisFrame.add(action);
    this.state[action] = true;
  }

  _onKeyUp(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    this.state[action] = false;
  }

  isDown(action) {
    return !!this.state[action];
  }

  /** Lets on-screen HUD buttons trigger the exact same action a key would. */
  simulatePress(action) {
    this.pressedThisFrame.add(action);
    this.state[action] = true;
    this._releaseQueue = this._releaseQueue || [];
    this._releaseQueue.push(action);
  }

  /** True only on the single logic tick the key transitioned down->true. Consumed after read. */
  wasPressed(action) {
    if (this.pressedThisFrame.has(action)) {
      return true;
    }
    return false;
  }

  /** Call once per tick after all systems have read wasPressed(). */
  endFrame() {
    this.pressedThisFrame.clear();
    if (this._releaseQueue && this._releaseQueue.length) {
      for (const action of this._releaseQueue) this.state[action] = false;
      this._releaseQueue.length = 0;
    }
  }
}
