import { useLevelStore } from '../../state/useLevelStore.js';
import { CHARACTER_ART } from '../../assets/index.js';

const GROUP_ORDER = ['dragon_man', 'zombie', 'other'];
const GROUP_LABEL = { dragon_man: 'Dragon-Man', zombie: 'Zombie', other: 'Other' };

function groupEnemies(enemies) {
  const groups = {};
  for (const e of enemies) {
    const key = GROUP_ORDER.includes(e.type) ? e.type : 'other';
    if (!groups[key]) groups[key] = { hp: 0, maxHp: 0, count: 0, anyAlive: false };
    groups[key].hp += e.alive ? e.hp : 0;
    groups[key].maxHp += e.maxHp;
    groups[key].count += 1;
    groups[key].anyAlive = groups[key].anyAlive || e.alive;
  }
  return groups;
}

export default function EnemyGroupPanel() {
  const enemies = useLevelStore((s) => s.enemies);
  const groups = groupEnemies(enemies);

  return (
    <div className="pointer-events-auto w-56 rounded-lg border border-white/15 bg-panel shadow-panel backdrop-blur-sm">
      <div className="border-b border-white/10 px-3 py-1 text-center text-[10px] font-bold tracking-wide text-white/70">
        ENEMY GROUP
      </div>
      <div className="flex flex-col divide-y divide-white/10">
        {GROUP_ORDER.filter((key) => groups[key]).map((key) => {
          const g = groups[key];
          const ratio = g.maxHp > 0 ? g.hp / g.maxHp : 0;
          const art = CHARACTER_ART[key];
          return (
            <div key={key} className={`flex items-center gap-2 px-3 py-2 ${!g.anyAlive ? 'opacity-40 grayscale' : ''}`}>
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/50">
                {art ? (
                  <img src={art.portrait || art.idle} alt={GROUP_LABEL[key]} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs">✷</div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-white/90">
                  {GROUP_LABEL[key]} {g.count > 1 ? `x${g.count}` : ''}
                </div>
                <div className="mt-0.5 h-2 w-full overflow-hidden rounded-sm border border-white/10 bg-black/60">
                  <div className="h-full bg-hpred transition-[width] duration-200" style={{ width: `${ratio * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
        {GROUP_ORDER.every((key) => !groups[key]) && (
          <div className="px-3 py-3 text-center text-[10px] text-white/40">No enemies nearby</div>
        )}
      </div>
    </div>
  );
}
