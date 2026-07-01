import { PHYSICS, getPlatformBehavior } from '../../config/physicsConstants.js';

// Simple AABB rectangle intersection test
export function aabbIntersect(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

/**
 * Applies gravity, integrates velocity into position, then resolves
 * collisions against the level's platform list axis-by-axis (X then Y),
 * which avoids tunneling/corner-catching that resolving both axes at once
 * tends to cause.
 *
 * `entity` must expose: x, y, width, height, vx, vy, grounded (bool)
 */
export function stepPhysics(entity, platforms, dt) {
  const scale = dt / (1000 / 60); // normalize to 60hz-equivalent steps

  // --- gravity ---
  if (!entity.grounded) {
    entity.vy = Math.min(entity.vy + PHYSICS.gravity * scale, PHYSICS.maxFallSpeed);
  }

  // --- horizontal integration + resolution ---
  entity.x += entity.vx * scale;
  entity.grounded = false;

  for (const platform of platforms) {
    const behavior = getPlatformBehavior(platform.type);
    if (!behavior.solid || behavior.oneWay) continue; // one-way platforms never block horizontally
    if (!aabbIntersect(entity, platform)) continue;

    if (entity.vx > 0) {
      entity.x = platform.x - entity.width;
    } else if (entity.vx < 0) {
      entity.x = platform.x + platform.width;
    }
    entity.vx = 0;
  }

  // --- vertical integration + resolution ---
  const prevBottom = entity.y + entity.height; // bottom edge before this step's vertical move
  entity.y += entity.vy * scale;

  for (const platform of platforms) {
    const behavior = getPlatformBehavior(platform.type);
    if (!behavior.solid) continue;
    if (!aabbIntersect(entity, platform)) continue;

    if (behavior.oneWay) {
      // Only collide if falling AND we were above the platform last step
      const wasAbove = prevBottom <= platform.y + 1;
      if (entity.vy >= 0 && wasAbove) {
        entity.y = platform.y - entity.height;
        entity.vy = 0;
        entity.grounded = true;
      }
      continue;
    }

    if (entity.vy > 0) {
      entity.y = platform.y - entity.height;
      entity.vy = 0;
      entity.grounded = true;
    } else if (entity.vy < 0) {
      entity.y = platform.y + platform.height;
      entity.vy = 0;
    }
  }

  // Level floor safety net (prevents falling through the world while a level loads)
  return entity;
}

export function clampToLevel(entity, level) {
  entity.x = Math.max(0, Math.min(entity.x, level.dimensions.width - entity.width));
  if (entity.y > level.dimensions.height + 400) {
    // fell into the void -> respawn
    entity.x = level.spawnPoint.x;
    entity.y = level.spawnPoint.y;
    entity.vx = 0;
    entity.vy = 0;
    return true;
  }
  return false;
}
