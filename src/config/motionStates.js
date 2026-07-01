/**
 * MOTION STATES — action / animation state-machine config.
 *
 * Each entry describes one "action" an entity can be in: how many logic
 * frames each animation frame lasts (frameRate), how many frames the
 * action has (totalFrames), whether it loops, whether another action can
 * interrupt it, and — for attacks — exactly which frames the hitbox is
 * "live" on (activeHitboxFrames) plus where that hitbox sits relative to
 * the entity (hitboxOffsets).
 *
 * `spriteRow` is kept so this config can drive a real row-based
 * spritesheet the moment one is dropped in. Until then, SpriteAnimator.js
 * uses these same timings to drive procedural transform animation
 * (bob / squash / lunge / flash) on the single reference art we have.
 */

export const MOTION_ACTIONS = {
  idle: {
    name: 'IDLE',
    loop: true,
    frameRate: 8,
    totalFrames: 4,
    spriteRow: 0,
    interruptible: true,
    hasHitbox: false,
  },

  run: {
    name: 'RUN',
    loop: true,
    frameRate: 6,
    totalFrames: 8,
    spriteRow: 1,
    interruptible: true,
    hasHitbox: false,
  },

  jump: {
    name: 'JUMP',
    loop: false,
    frameRate: 5,
    totalFrames: 3,
    spriteRow: 2,
    interruptible: false,
    hasHitbox: false,
  },

  fall: {
    name: 'FALL',
    loop: true,
    frameRate: 6,
    totalFrames: 2,
    spriteRow: 3,
    interruptible: true,
    hasHitbox: false,
  },

  light_attack: {
    name: 'LIGHT_ATTACK',
    loop: false,
    frameRate: 4,
    totalFrames: 5,
    spriteRow: 4,
    interruptible: false,
    hasHitbox: true,
    keyframes: {
      activeHitboxFrames: [2, 3],
      hitboxOffsets: { x: 46, y: 8, width: 58, height: 42 },
    },
  },

  heavy_attack: {
    name: 'HEAVY_ATTACK',
    loop: false,
    frameRate: 7,
    totalFrames: 6,
    spriteRow: 5,
    interruptible: false,
    hasHitbox: true,
    keyframes: {
      activeHitboxFrames: [3, 4],
      hitboxOffsets: { x: 40, y: -6, width: 80, height: 70 },
    },
  },

  spin_attack: {
    name: 'SPIN_ATTACK',
    loop: false,
    frameRate: 4,
    totalFrames: 8,
    spriteRow: 6,
    interruptible: false,
    hasHitbox: true,
    keyframes: {
      activeHitboxFrames: [2, 3, 4, 5],
      // Spin attack hits everything around the entity: radial hitboxes are
      // centered on the entity (x/y = 0) with `width` used as the diameter.
      hitboxOffsets: { x: 0, y: 0, width: 150, height: 150, radial: true },
    },
    cooldown: 6000,
  },

  dash: {
    name: 'DASH',
    loop: false,
    frameRate: 3,
    totalFrames: 4,
    spriteRow: 7,
    interruptible: false,
    hasHitbox: false,
    invulnerable: true,
    impulse: 9.5,
    cooldown: 2500,
  },

  hook: {
    name: 'HOOK',
    loop: false,
    frameRate: 4,
    totalFrames: 6,
    spriteRow: 8,
    interruptible: false,
    hasHitbox: false,
    pullForce: 0.85,
    range: 260,
    cooldown: 4500,
  },

  hit: {
    name: 'TAKE_HIT',
    loop: false,
    frameRate: 4,
    totalFrames: 3,
    spriteRow: 9,
    interruptible: false,
    hasHitbox: false,
  },

  die: {
    name: 'DIE',
    loop: false,
    frameRate: 8,
    totalFrames: 7,
    spriteRow: 10,
    interruptible: false,
    hasHitbox: false,
  },
};

// Skill -> action key, matches the HUD's "Skill Cooldown" tray (Dash / Hook / Spin Attack)
export const SKILL_ACTIONS = {
  dash: 'dash',
  hook: 'hook',
  spinAttack: 'spin_attack',
};
