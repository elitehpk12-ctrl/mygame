import { usePlayerStore } from '../../state/usePlayerStore.js';
import { CHARACTER_ART } from '../../assets/index.js';

function StatBar({ value, max, colorClass, icon }) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div className="relative h-4 w-44 overflow-hidden rounded-sm border border-white/20 bg-black/60">
      <div className={`h-full ${colorClass} transition-[width] duration-200 ease-out`} style={{ width: `${ratio * 100}%` }} />
      <div className="absolute inset-0 flex items-center justify-end pr-1 text-[9px] font-bold text-white/90 drop-shadow">
        {icon} {Math.round(value)}/{max}
      </div>
    </div>
  );
}

export default function PlayerStatus() {
  const { hp, maxHp, mana, maxMana, gold } = usePlayerStore();

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-white/15 bg-panel px-3 py-2 shadow-panel backdrop-blur-sm">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 border-gold/80 bg-black/40">
        <img src={CHARACTER_ART.hero.portrait} alt="Kael Tharion" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-1.5">
        <StatBar value={hp} max={maxHp} colorClass="bg-hpred" icon="❤" />
        <StatBar value={mana} max={maxMana} colorClass="bg-manablue" icon="✦" />
        <div className="flex items-center gap-1 text-xs font-bold text-gold">
          <span>🪙</span>
          <span>{gold.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
