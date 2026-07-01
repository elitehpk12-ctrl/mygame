import mapConfig from '../../config/mapConfig.json';
import { Enemy } from '../entities/Enemy.js';

export function getAllLevels() {
  return mapConfig.levels;
}

export function getLevelById(id) {
  return mapConfig.levels.find((l) => l.id === id) || mapConfig.levels[0];
}

/** Builds fresh Enemy instances for a level (call every time a level is (re)entered). */
export function instantiateEnemies(levelData) {
  return levelData.enemies.map(
    (e) =>
      new Enemy({
        id: e.id,
        x: e.x,
        y: e.y,
        type: e.type,
        hp: e.hp,
        damage: e.damage,
        patrolRange: e.patrolRange,
        boss: !!e.boss,
        label: e.label,
      })
  );
}

export const globalSettings = mapConfig.globalSettings;
