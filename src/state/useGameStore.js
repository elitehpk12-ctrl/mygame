import { create } from 'zustand';

const MAX_LOG_ENTRIES = 50;

export const useGameStore = create((set, get) => ({
  // 'worldmap' | 'character' | 'combat' | 'paused' | 'victory' | 'defeat'
  screen: 'worldmap',
  selectedLevelId: null,
  paused: false,
  eventLog: [],
  // Bridge into the live Engine instance so HUD buttons (Attack, skill icons...)
  // can trigger the exact same input path a keypress would. Set by GameCanvas.
  engineActions: null,
  bindEngineActions: (actions) => set({ engineActions: actions }),

  goToWorldMap: () => set({ screen: 'worldmap', paused: false }),
  goToCharacter: () => set({ screen: 'character' }),

  startLevel: (levelId) =>
    set({
      screen: 'combat',
      selectedLevelId: levelId,
      paused: false,
      eventLog: [],
    }),

  togglePause: () => set((state) => ({ paused: !state.paused })),

  setOutcome: (outcome) => set({ screen: outcome, paused: false }), // 'victory' | 'defeat'

  pushLog: (entry) =>
    set((state) => ({
      eventLog: [...state.eventLog, entry].slice(-MAX_LOG_ENTRIES),
    })),

  pushLogBatch: (entries) => {
    if (!entries || entries.length === 0) return;
    set((state) => ({
      eventLog: [...state.eventLog, ...entries].slice(-MAX_LOG_ENTRIES),
    }));
  },
}));
