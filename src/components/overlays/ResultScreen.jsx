import { useGameStore } from '../../state/useGameStore.js';
import { useLevelStore } from '../../state/useLevelStore.js';

export default function ResultScreen({ outcome }) {
  const goToWorldMap = useGameStore((s) => s.goToWorldMap);
  const startLevel = useGameStore((s) => s.startLevel);
  const levelId = useLevelStore((s) => s.levelId);
  const levelName = useLevelStore((s) => s.levelName);

  const isVictory = outcome === 'victory';

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-6 text-white ${
        isVictory ? 'bg-gradient-to-b from-amber-900/60 via-black to-black' : 'bg-gradient-to-b from-red-950/70 via-black to-black'
      }`}
    >
      <h1 className={`text-4xl font-bold tracking-widest ${isVictory ? 'text-gold' : 'text-hpred'}`}>
        {isVictory ? 'VICTORY' : 'YOU HAVE FALLEN'}
      </h1>
      <p className="text-sm text-white/60">
        {isVictory ? `${levelName} has been cleared.` : `Defeated in ${levelName}.`}
      </p>
      <div className="flex gap-4">
        {isVictory && (
          <button
            onClick={() => startLevel(levelId)}
            className="rounded-md border border-gold/60 bg-black/40 px-5 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
          >
            Replay Island
          </button>
        )}
        {!isVictory && (
          <button
            onClick={() => startLevel(levelId)}
            className="rounded-md border border-hpred/60 bg-black/40 px-5 py-2 text-sm font-semibold text-white hover:bg-hpred/20"
          >
            Try Again
          </button>
        )}
        <button
          onClick={goToWorldMap}
          className="rounded-md border border-white/20 bg-black/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          World Map
        </button>
      </div>
    </div>
  );
}
