import { Entity } from './Entity.js';

const AGGRO_RANGE = 320;
const ATTACK_RANGE = 70;
const ATTACK_COOLDOWN_MS = 1400;

/**
 * Simple, readable finite-state AI: patrol along a range around its spawn
 * point until the player enters aggro range, then chase and attack when in
 * range. Deliberately simple so it's easy to extend per-enemy-type later.
 */
export class Enemy extends Entity {
  constructor({ id, x, y, type, hp, damage, patrolRange = 150, boss = false, label = null }) {
    const size = boss ? { width: 84, height: 92 } : type === 'zombie' ? { width: 72, height: 78 } : { width: 68, height: 74 };
    super({ x, y, ...size, type, hp, damage });
    this.id = id;
    this.boss = boss;
    this.label = label || defaultLabel(type);
    this.spawnX = x;
    this.patrolRange = patrolRange;
    this.moveSpeed = boss ? 1.6 : type === 'zombie' ? 1.1 : 1.8;
    this._patrolDir = 1;
    this._attackCooldown = 0;
    this._state = 'patrol';
  }

  update(player, dt) {
    if (!this.alive) {
      this.tickAnimation();
      return;
    }

    this._attackCooldown = Math.max(0, this._attackCooldown - dt);
    const distToPlayer = Math.abs(player.centerX - this.centerX);
    const inAggro = distToPlayer < AGGRO_RANGE && player.alive;

    const isBusy = ['hit', 'die', 'light_attack', 'heavy_attack'].includes(this.currentActionKey);

    if (!isBusy) {
      if (inAggro && distToPlayer > ATTACK_RANGE) {
        this._state = 'chase';
        this.direction = player.centerX > this.centerX ? 1 : -1;
        this.vx = this.direction * this.moveSpeed;
        this.changeAction('run');
      } else if (inAggro && distToPlayer <= ATTACK_RANGE) {
        this._state = 'attack';
        this.vx = 0;
        this.direction = player.centerX > this.centerX ? 1 : -1;
        if (this._attackCooldown <= 0) {
          this.changeAction('light_attack', { force: true });
          this._attackCooldown = ATTACK_COOLDOWN_MS;
        } else {
          this.changeAction('idle');
        }
      } else {
        this._state = 'patrol';
        const leash = this.spawnX + this.patrolRange * this._patrolDir;
        if (Math.abs(this.centerX - this.spawnX) > this.patrolRange) {
          this._patrolDir *= -1;
        }
        this.direction = this._patrolDir;
        this.vx = this._patrolDir * this.moveSpeed * 0.5;
        this.changeAction(Math.abs(this.vx) > 0.05 ? 'run' : 'idle');
      }
    }

    this.tickAnimation();
  }
}

function defaultLabel(type) {
  if (type === 'dragon_man') return 'Dragon-Man';
  if (type === 'zombie') return 'Zombie';
  return 'Other';
}
