import { useGameStore } from '../../state/useGameStore.js';

export default function PauseMenu() {
  const paused = useGameStore((s) => s.paused);
  const togglePause = useGameStore((s) => s.togglePause);
  const goToWorldMap = useGameStore((s) => s.goToWorldMap);

  if (!paused) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-72 rounded-lg border border-gold/50 bg-panel p-6 text-center shadow-panel">
        <h2 className="mb-6 text-xl font-bold tracking-widest text-gold">PAUSED</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={togglePause}
            className="rounded-md border border-white/20 bg-black/40 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Resume
          </button>
          <button
            onClick={goToWorldMap}
            className="rounded-md border border-hpred/50 bg-black/40 py-2 text-sm font-semibold text-white hover:bg-hpred/20"
          >
            Quit to World Map
          </button>
        </div>
        <p className="mt-6 text-[10px] leading-relaxed text-white/40">
          Move: WASD / Arrows &middot; Jump: Space &middot; Attack: J &middot; Heavy: K
          <br />
          Dash: Shift &middot; Hook: F &middot; Spin Attack: L &middot; Potion: H
        </p>
      </div>
    </div>
  );
}
