import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../state/useGameStore.js';

const COLOR_HINTS = [
  { match: /Dragon-Man/i, className: 'text-hpred' },
  { match: /Zombie/i, className: 'text-emerald-400' },
  { match: /defeated|fallen|flee/i, className: 'text-gold' },
  { match: /Ready for fight/i, className: 'text-white' },
];

function colorFor(entry) {
  const hit = COLOR_HINTS.find((h) => h.match.test(entry));
  return hit ? hit.className : 'text-white/80';
}

export default function EventLog() {
  const eventLog = useGameStore((s) => s.eventLog);
  const scrollRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [eventLog]);

  return (
    <div className="pointer-events-auto w-full rounded-lg border border-white/15 bg-panel shadow-panel backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1">
        <span className="text-[10px] font-bold tracking-wide text-white/70">EVENT LOG</span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded px-1.5 text-xs text-white/60 hover:bg-white/10"
        >
          {collapsed ? '▲' : '▼'}
        </button>
      </div>
      {!collapsed && (
        <div ref={scrollRef} className="max-h-24 overflow-y-auto px-3 py-2 text-[11px] leading-relaxed">
          {eventLog.length === 0 && <div className="text-white/30">...</div>}
          {eventLog.map((entry, i) => (
            <div key={i} className={colorFor(entry)}>
              {entry}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
