import { useGameStore } from '../../state/useGameStore.js';
import { usePlayerStore } from '../../state/usePlayerStore.js';

export default function CombatActions() {
  const engineActions = useGameStore((s) => s.engineActions);
  const goToWorldMap = useGameStore((s) => s.goToWorldMap);
  const pushLog = useGameStore((s) => s.pushLog);
  const healPotions = usePlayerStore((s) => s.healPotions);

  const handleEscape = () => {
    pushLog('You flee the fight!');
    goToWorldMap();
  };

  return (
    <div className="pointer-events-auto rounded-lg border border-white/15 bg-panel shadow-panel backdrop-blur-sm">
      <div className="border-b border-white/10 px-3 py-1 text-center text-[10px] font-bold tracking-wide text-white/70">
        COMBAT ACTIONS
      </div>
      <div className="flex gap-3 p-3">
        <ActionButton icon="⚔️" label="Attack" onClick={() => engineActions?.attack?.()} />
        <ActionButton
          icon="🧪"
          label={`Heal Potion${healPotions > 0 ? ` (${healPotions})` : ''}`}
          disabled={healPotions <= 0}
          onClick={() => engineActions?.healPotion?.()}
        />
        <ActionButton icon="🏃" label="Escape" onClick={handleEscape} variant="danger" />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, disabled, variant }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-24 flex-col items-center gap-1 rounded-md border px-2 py-2 text-[10px] font-semibold transition ${
        disabled
          ? 'cursor-not-allowed border-white/10 bg-black/40 text-white/30'
          : variant === 'danger'
          ? 'border-hpred/60 bg-black/50 text-white/90 hover:bg-hpred/20 hover:scale-105'
          : 'border-gold/60 bg-black/50 text-white/90 hover:bg-gold/20 hover:scale-105'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}
