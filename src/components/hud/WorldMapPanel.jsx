import { useLevelStore } from '../../state/useLevelStore.js';
import { getAllLevels } from '../../game/levels/LevelLoader.js';
import { WORLDMAP_ART } from '../../assets/index.js';

export default function WorldMapPanel() {
  const levelId = useLevelStore((s) => s.levelId);
  const levelName = useLevelStore((s) => s.levelName);
  const levels = getAllLevels();
  const current = levels.find((l) => l.id === levelId) || levels[0];
  const art = WORLDMAP_ART[current?.islandArt] || WORLDMAP_ART.island_01;

  return (
    <div className="pointer-events-auto w-56 rounded-lg border border-white/15 bg-panel shadow-panel backdrop-blur-sm">
      <div className="border-b border-white/10 px-3 py-1 text-center text-[10px] font-bold tracking-wide text-white/70">
        WORLD MAP
      </div>
      <div className="relative flex h-28 items-center justify-center overflow-hidden">
        <img src={art} alt={current?.name} className="h-24 w-24 object-contain opacity-90 animate-floaty" />
        <div className="absolute right-3 top-3 flex flex-col items-center">
          <div className="h-3 w-3 animate-pulse rounded-full border border-white/70 bg-gold shadow-[0_0_10px_2px_rgba(244,197,66,0.7)]" />
          <span className="mt-0.5 text-[8px] font-bold text-white/80">Player</span>
        </div>
      </div>
      <div className="border-t border-white/10 px-3 py-1 text-center text-[10px] font-semibold text-manablue">
        {levelName || current?.name}
      </div>
    </div>
  );
}
