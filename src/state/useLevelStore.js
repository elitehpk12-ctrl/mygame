import { create } from 'zustand';

export const useLevelStore = create((set) => ({
  levelId: null,
  levelName: '',
  enemies: [], // [{ id, type, label, hp, maxHp, alive, boss }]

  syncFromLevel: (level, enemyEntities) =>
    set({
      levelId: level.id,
      levelName: level.name,
      enemies: enemyEntities.map((e) => ({
        id: e.id,
        type: e.type,
        label: e.label,
        hp: Math.round(e.hp),
        maxHp: e.maxHp,
        alive: e.alive,
        boss: e.boss,
      })),
    }),
}));
