import { WORLDMAP_ART } from '../../assets/index.js';

export default function IslandCard({ level, onSelect }) {
  const art = WORLDMAP_ART[level.islandArt] || WORLDMAP_ART.island_01;
  const enemyCount = level.enemies?.length ?? 0;

  return (
    <button
      onClick={() => onSelect(level.id)}
      className="group flex w-52 flex-col items-center rounded-lg border border-white/15 bg-panel p-4 text-left shadow-panel transition hover:scale-105 hover:border-gold/60"
    >
      <img src={art} alt={level.name} className="h-32 w-32 object-contain transition group-hover:animate-floaty" />
      <h3 className="mt-2 text-sm font-bold text-white">{level.name}</h3>
      <p className="mt-1 text-[10px] text-white/50">
        {enemyCount} {enemyCount === 1 ? 'enemy' : 'enemies'} lurking
      </p>
      <span
        className="mt-2 inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: level.themeColor }}
        title={level.themeColor}
      />
    </button>
  );
}
