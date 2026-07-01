import { CHARACTER_ART } from '../../assets/index.js';
import { useGameStore } from '../../state/useGameStore.js';

const ABILITIES = [
  { icon: '⚔️', name: 'Attack', desc: 'A quick melee swing. Chain into Heavy Attack for extra damage.' },
  { icon: '💨', name: 'Dash', desc: 'A short burst of speed with brief invulnerability. 2.5s cooldown.' },
  { icon: '🪝', name: 'Hook', desc: 'Yanks you toward the nearest enemy in range. 4.5s cooldown.' },
  { icon: '🌀', name: 'Spin Attack', desc: 'Hits every enemy around you at once. 6s cooldown.' },
];

export default function CharacterPanel() {
  const goToWorldMap = useGameStore((s) => s.goToWorldMap);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-gradient-to-b from-indigo-950 via-slate-950 to-black p-8 text-white">
      <div className="flex w-full max-w-3xl items-center gap-8 rounded-xl border border-gold/40 bg-panel p-6 shadow-panel">
        <img
          src={CHARACTER_ART.hero.reference}
          alt="Kael Tharion"
          className="h-64 w-52 shrink-0 rounded-lg border border-white/10 object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-wide text-gold">Kael Tharion</h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">Wandering Half-Elf Duelist</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Exiled from the mainland, Kael crossed the Forbidden Archipelago in search of the relic said to
            lift his family's curse. Fast, resourceful, and handy with both blade and a stolen bit of
            hook-magic, he fights lean — no armor, no shield, just speed and nerve.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {ABILITIES.map((a) => (
              <div key={a.name} className="flex items-start gap-2 rounded-md border border-white/10 bg-black/30 p-2">
                <span className="text-lg">{a.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-white/90">{a.name}</div>
                  <div className="text-[10px] leading-snug text-white/50">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={goToWorldMap}
        className="rounded-md border border-gold/60 bg-black/40 px-6 py-2 text-sm font-semibold tracking-wide text-gold hover:bg-gold/10"
      >
        Continue to World Map →
      </button>
    </div>
  );
}
