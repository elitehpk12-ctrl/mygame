import { getAllLevels } from '../../game/levels/LevelLoader.js';
import { useGameStore } from '../../state/useGameStore.js';
import IslandCard from './IslandCard.jsx';

export default function WorldMapScreen() {
  const levels = getAllLevels();
  const startLevel = useGameStore((s) => s.startLevel);
  const goToCharacter = useGameStore((s) => s.goToCharacter);

  return (
    <div className="flex h-full w-full flex-col items-center gap-6 overflow-y-auto bg-gradient-to-b from-blue-950 via-slate-950 to-black p-8 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-gold">FORBIDDEN ARCHIPELAGO</h1>
        <p className="mt-1 text-xs text-white/50">Choose an island to challenge.</p>
        <button
          onClick={goToCharacter}
          className="mt-3 rounded-md border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
        >
          View Kael Tharion
        </button>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {levels.map((level) => (
          <IslandCard key={level.id} level={level} onSelect={startLevel} />
        ))}
      </div>
    </div>
  );
}
