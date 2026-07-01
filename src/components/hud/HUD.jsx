import PlayerStatus from './PlayerStatus.jsx';
import SkillCooldowns from './SkillCooldowns.jsx';
import WorldMapPanel from './WorldMapPanel.jsx';
import EnemyGroupPanel from './EnemyGroupPanel.jsx';
import CombatActions from './CombatActions.jsx';
import EventLog from './EventLog.jsx';
import { useGameStore } from '../../state/useGameStore.js';

export default function HUD() {
  const togglePause = useGameStore((s) => s.togglePause);

  return (
    <div className="pointer-events-none absolute inset-0 flex select-none flex-col justify-between p-4 font-display">
      {/* top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <PlayerStatus />
          <SkillCooldowns />
        </div>

        <div className="pointer-events-auto flex flex-col items-center">
          <h1 className="rounded-md border border-gold/50 bg-panel px-4 py-1 text-center text-lg font-bold tracking-widest text-gold shadow-panel">
            FORBIDDEN
            <br />
            ARCHIPELAGO
          </h1>
          <button
            onClick={togglePause}
            className="mt-2 rounded-md border border-white/20 bg-panel px-3 py-1 text-[10px] font-semibold text-white/70 hover:bg-white/10"
          >
            ⏸ PAUSE
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <WorldMapPanel />
          <EnemyGroupPanel />
        </div>
      </div>

      {/* bottom row */}
      <div className="flex flex-col items-center gap-2">
        <CombatActions />
        <div className="w-full max-w-2xl">
          <EventLog />
        </div>
      </div>
    </div>
  );
}
