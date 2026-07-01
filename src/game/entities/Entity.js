import { MOTION_ACTIONS } from '../../config/motionStates.js';

let nextInstanceId = 1;

/**
 * Base class for anything that moves, animates and can be hit: Player and
 * Enemy both extend this. Owns the Blender-style action/timeline system
 * from the project's original prototype (changeAction / update / frame
 * timeline), generalized to any entity.
 */
export class Entity {
  constructor({ x, y, width = 64, height = 64, type = 'entity', hp = 100, damage = 10 }) {
    this.instanceId = nextInstanceId++;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.direction = 1; // 1 = facing right, -1 = facing left

    this.maxHp = hp;
    this.hp = hp;
    this.damage = damage;
    this.alive = true;
    this.invulnerable = false;
    this.invulnerableUntil = 0;

    this.currentActionKey = 'idle';
    this.currentAction = MOTION_ACTIONS.idle;
    this.currentFrame = 0;
    this.frameTimer = 0;

    // Attacks/skills already resolved this action instance (prevents multi-hit per swing)
    this._hitEntitiesThisAction = new Set();
  }

  get bottom() {
    return this.y + this.height;
  }
  get centerX() {
    return this.x + this.width / 2;
  }
  get centerY() {
    return this.y + this.height / 2;
  }

  changeAction(actionKey, { force = false } = {}) {
    const nextAction = MOTION_ACTIONS[actionKey];
    if (!nextAction) return false;

    if (
      !force &&
      !this.currentAction.interruptible &&
      this.currentFrame < this.currentAction.totalFrames - 1
    ) {
      return false; // current action hasn't finished and can't be interrupted
    }

    if (this.currentActionKey !== actionKey) {
      this.currentActionKey = actionKey;
      this.currentAction = nextAction;
      this.currentFrame = 0;
      this.frameTimer = 0;
      this._hitEntitiesThisAction.clear();
      if (nextAction.invulnerable) {
        this.invulnerable = true;
      }
    }
    return true;
  }

  /** Advance the action timeline by one logic tick (called at fixed-timestep). */
  tickAnimation() {
    this.frameTimer++;
    if (this.frameTimer >= this.currentAction.frameRate) {
      this.frameTimer = 0;
      if (this.currentFrame < this.currentAction.totalFrames - 1) {
        this.currentFrame++;
      } else if (this.currentAction.loop) {
        this.currentFrame = 0;
      } else {
        if (this.currentAction.invulnerable) this.invulnerable = false;
        this.changeAction('idle', { force: true });
      }
    }
  }

  /** Returns the world-space AABB for the currently-active attack hitbox, or null. */
  getAttackHitbox() {
    const action = this.currentAction;
    if (!action.hasHitbox) return null;
    const kf = action.keyframes;
    if (!kf.activeHitboxFrames.includes(this.currentFrame)) return null;

    const o = kf.hitboxOffsets;
    if (o.radial) {
      return {
        x: this.centerX + o.x,
        y: this.centerY + o.y,
        width: o.width,
        height: o.height,
        radial: true,
      };
    }
    return {
      x: this.direction === 1 ? this.x + o.x : this.x - o.x - o.width,
      y: this.y + o.y,
      width: o.width,
      height: o.height,
    };
  }

  takeDamage(amount) {
    if (!this.alive || this.invulnerable) return false;
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.alive = false;
      this.changeAction('die', { force: true });
    } else {
      this.changeAction('hit', { force: true });
    }
    return true;
  }
}
