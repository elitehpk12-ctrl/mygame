import { aabbIntersect } from '../physics/Physics.js';

function radialIntersect(hitbox, target) {
  const cx = hitbox.x;
  const cy = hitbox.y;
  const radius = hitbox.width / 2;
  const nearestX = Math.max(target.x, Math.min(cx, target.x + target.width));
  const nearestY = Math.max(target.y, Math.min(cy, target.y + target.height));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= radius * radius;
}

function hits(hitbox, target) {
  return hitbox.radial ? radialIntersect(hitbox, target) : aabbIntersect(hitbox, target);
}

/**
 * Evaluates the player's currently-active attack hitbox against all living
 * enemies, and each enemy's currently-active attack hitbox against the
 * player. Damage is applied at most once per attack "instance" (tracked via
 * Entity._hitEntitiesThisAction) so a 4-frame swing doesn't multi-hit.
 *
 * Returns an array of log-worthy event strings for the Event Log HUD panel.
 */
export function resolveCombat(player, enemies) {
  const events = [];

  const playerHitbox = player.getAttackHitbox();
  if (playerHitbox) {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (player._hitEntitiesThisAction.has(enemy.instanceId)) continue;
      if (hits(playerHitbox, enemy)) {
        player._hitEntitiesThisAction.add(enemy.instanceId);
        const dmg = player.currentActionKey === 'heavy_attack' ? player.damage * 1.6 : player.damage;
        enemy.takeDamage(Math.round(dmg));
        events.push(
          enemy.alive
            ? `You hit ${enemy.label} for ${Math.round(dmg)}!`
            : `${enemy.label} has been defeated!`
        );
      }
    }
  }

  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const enemyHitbox = enemy.getAttackHitbox();
    if (!enemyHitbox) continue;
    if (enemy._hitEntitiesThisAction.has(player.instanceId)) continue;
    if (hits(enemyHitbox, player)) {
      enemy._hitEntitiesThisAction.add(player.instanceId);
      const wasAlive = player.alive;
      player.takeDamage(enemy.damage);
      events.push(`${enemy.label} hits you for ${enemy.damage}!`);
      if (wasAlive && !player.alive) events.push('You have fallen...');
    }
  }

  return events;
}
