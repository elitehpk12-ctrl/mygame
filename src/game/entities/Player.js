import { Entity } from './Entity.js';
import { PHYSICS } from '../../config/physicsConstants.js';
import { MOTION_ACTIONS } from '../../config/motionStates.js';

const SKILL_KEYS = ['dash', 'hook', 'spinAttack'];
const SKILL_TO_ACTION = { dash: 'dash', hook: 'hook', spinAttack: 'spin_attack' };

export class Player extends Entity {
  constructor({ x, y, hp = 100, mana = 60, gold = 24500 }) {
    super({ x, y, width: 56, height: 72, type: 'hero', hp, damage: 18 });
    this.maxMana = mana;
    this.mana = mana;
    this.gold = gold;
    this.healPotions = 3;

    this.cooldowns = { dash: 0, hook: 0, spinAttack: 0 };
    this._coyoteTimer = 0;
    this._jumpBuffer = 0;
    this._hookTargetX = null;
  }

  get cooldownRatios() {
    const out = {};
    for (const key of SKILL_KEYS) {
      const actionKey = SKILL_TO_ACTION[key];
      const total = MOTION_ACTIONS[actionKey].cooldown || 1;
      out[key] = Math.max(0, Math.min(1, this.cooldowns[key] / total));
    }
    return out;
  }

  canUseSkill(key) {
    return this.cooldowns[key] <= 0 && this.alive;
  }

  handleInput(input, dt, enemies = []) {
    if (!this.alive) return;

    const isAttacking = ['light_attack', 'heavy_attack', 'spin_attack', 'dash', 'hook'].includes(
      this.currentActionKey
    );

    // --- horizontal movement ---
    let moveDir = 0;
    if (input.isDown('left')) moveDir -= 1;
    if (input.isDown('right')) moveDir += 1;

    if (!isAttacking) {
      const control = this.grounded ? 1 : PHYSICS.airControl;
      if (moveDir !== 0) {
        this.vx = moveDir * PHYSICS.moveSpeed * control;
        this.direction = moveDir;
      } else {
        this.vx *= PHYSICS.friction;
        if (Math.abs(this.vx) < 0.05) this.vx = 0;
      }
    }

    // --- jump (with tiny coyote + buffer window for forgiving platforming) ---
    this._coyoteTimer = this.grounded ? PHYSICS.coyoteTimeMs : Math.max(0, this._coyoteTimer - dt);
    if (input.wasPressed('jump')) this._jumpBuffer = PHYSICS.jumpBufferMs;
    else this._jumpBuffer = Math.max(0, this._jumpBuffer - dt);

    if (this._jumpBuffer > 0 && this._coyoteTimer > 0 && !isAttacking) {
      this.vy = PHYSICS.jumpVelocity;
      this.grounded = false;
      this._jumpBuffer = 0;
      this._coyoteTimer = 0;
      this.changeAction('jump', { force: true });
    }

    // --- combat actions ---
    if (input.wasPressed('attack')) {
      this.changeAction('light_attack');
    } else if (input.wasPressed('heavyAttack')) {
      this.changeAction('heavy_attack');
    } else if (input.wasPressed('spinAttack') && this.canUseSkill('spinAttack')) {
      this.changeAction('spin_attack');
      this.cooldowns.spinAttack = MOTION_ACTIONS.spin_attack.cooldown;
    } else if (input.wasPressed('dash') && this.canUseSkill('dash')) {
      this.changeAction('dash');
      this.vx = MOTION_ACTIONS.dash.impulse * this.direction;
      this.cooldowns.dash = MOTION_ACTIONS.dash.cooldown;
    } else if (input.wasPressed('hook') && this.canUseSkill('hook')) {
      const nearest = findNearestEnemy(this, enemies, MOTION_ACTIONS.hook.range);
      if (nearest) {
        this.changeAction('hook');
        this.direction = nearest.centerX >= this.centerX ? 1 : -1;
        this._hookTargetX = nearest.centerX;
        this.cooldowns.hook = MOTION_ACTIONS.hook.cooldown;
      }
    }

    // apply hook pull while the hook action is active
    if (this.currentActionKey === 'hook' && this._hookTargetX != null) {
      const pull = MOTION_ACTIONS.hook.pullForce * this.direction;
      this.vx = pull * PHYSICS.moveSpeed;
    } else {
      this._hookTargetX = null;
    }

    // idle/run/fall visual state (only when not mid-committed-action)
    if (!isAttacking && this.currentActionKey !== 'jump') {
      if (!this.grounded) {
        if (this.vy > 0.5) this.changeAction('fall');
      } else if (Math.abs(this.vx) > 0.15) {
        this.changeAction('run');
      } else {
        this.changeAction('idle');
      }
    } else if (this.grounded && (this.currentActionKey === 'jump' || this.currentActionKey === 'fall')) {
      this.changeAction('idle');
    }

    // cooldown ticking
    for (const key of SKILL_KEYS) {
      this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
    }

    // mana regen
    this.mana = Math.min(this.maxMana, this.mana + dt * 0.004);
  }

  usePotion() {
    if (this.healPotions <= 0 || !this.alive) return false;
    this.healPotions -= 1;
    this.hp = Math.min(this.maxHp, this.hp + Math.round(this.maxHp * 0.4));
    return true;
  }
}

function findNearestEnemy(player, enemies, range) {
  let best = null;
  let bestDist = range;
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const dist = Math.abs(enemy.centerX - player.centerX);
    if (dist < bestDist) {
      best = enemy;
      bestDist = dist;
    }
  }
  return best;
}
