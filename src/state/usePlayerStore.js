import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  hp: 100,
  maxHp: 100,
  mana: 60,
  maxMana: 60,
  gold: 24500,
  healPotions: 3,
  alive: true,
  cooldownRatios: { dash: 0, hook: 0, spinAttack: 0 },

  // Called from Engine's throttled sync tick — never called from React directly.
  syncFromEntity: (player) =>
    set({
      hp: Math.round(player.hp),
      maxHp: player.maxHp,
      mana: Math.round(player.mana),
      maxMana: player.maxMana,
      gold: player.gold,
      healPotions: player.healPotions,
      alive: player.alive,
      cooldownRatios: player.cooldownRatios,
    }),

  reset: () =>
    set({
      hp: 100,
      maxHp: 100,
      mana: 60,
      maxMana: 60,
      alive: true,
      cooldownRatios: { dash: 0, hook: 0, spinAttack: 0 },
    }),
}));
