import { usePlayerStore } from '../../state/usePlayerStore.js';
import { useGameStore } from '../../state/useGameStore.js';

const SKILLS = [
  { key: 'dash', label: 'Dash', icon: '💨' },
  { key: 'hook', label: 'Hook', icon: '🪝' },
  { key: 'spinAttack', label: 'Spin Attack', icon: '🌀' },
];

export default function SkillCooldowns() {
  const cooldownRatios = usePlayerStore((s) => s.cooldownRatios);
  const engineActions = useGameStore((s) => s.engineActions);
  const paused = useGameStore((s) => s.paused);

  return (
    <div className="pointer-events-auto flex flex-col gap-1.5">
      <div className="rounded-t-md border border-b-0 border-white/15 bg-panel px-3 py-1 text-center text-[10px] font-bold tracking-wide text-white/70">
        SKILL COOLDOWN
      </div>
      <div className="flex gap-2 rounded-b-md border border-white/15 bg-panel p-2 shadow-panel">
        {SKILLS.map((skill) => {
          const ratio = cooldownRatios[skill.key] ?? 0;
          const ready = ratio <= 0;
          return (
            <button
              key={skill.key}
              disabled={!ready || paused}
              onClick={() => engineActions?.[skill.key]?.()}
              title={skill.label}
              className={`relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-md border text-lg transition ${
                ready
                  ? 'border-gold/70 bg-black/50 hover:scale-105 hover:border-gold cursor-pointer'
                  : 'border-white/10 bg-black/70 cursor-not-allowed opacity-70'
              }`}
            >
              <span>{skill.icon}</span>
              <span className="mt-0.5 text-[8px] font-semibold text-white/70">{skill.label}</span>
              {!ready && (
                <div
                  className="absolute inset-0 bg-black/70"
                  style={{ clipPath: `inset(${(1 - ratio) * 100}% 0 0 0)` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
