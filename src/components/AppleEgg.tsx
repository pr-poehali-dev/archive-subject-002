import { useEffect, useRef, useState } from 'react';

type Phase = 'apple' | 'dragging' | 'seed' | 'sprout';

const AppleEgg = () => {
  const [phase, setPhase] = useState<Phase>('apple');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const appleRef = useRef<HTMLDivElement>(null);

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    setPhase('dragging');
    const pt = 'touches' in e ? e.touches[0] : e;
    const rect = appleRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPos({ x: rect.left, y: rect.top });
      setPos({ x: rect.left, y: rect.top });
    }
  };

  useEffect(() => {
    if (phase !== 'dragging') return;

    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const pt = 'touches' in e ? e.touches[0] : e;
      setPos({ x: pt.clientX - 32, y: pt.clientY - 32 });
    };

    const up = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      const pt = 'changedTouches' in e ? e.changedTouches[0] : e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = pt.clientX - cx;
      const dy = pt.clientY - cy;
      if (Math.sqrt(dx * dx + dy * dy) < 120) {
        setPhase('seed');
        setTimeout(() => setPhase('sprout'), 2000);
      } else {
        setPhase('apple');
        setPos({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [phase]);

  if (phase === 'seed' || phase === 'sprout') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 animate-fade-up">
        {phase === 'seed' ? (
          <>
            <div className="animate-fade-up">
              <SeedIcon />
            </div>
            <p className="mt-8 max-w-xs text-center font-cormorant text-2xl italic text-warm">
              Он хранил это семя 10 лет.
            </p>
            <p className="font-cormorant text-xl italic text-gold">Не потерял. Не забудь.</p>
          </>
        ) : (
          <>
            <SproutIcon />
            <p className="mt-8 max-w-xs text-center font-cormorant text-2xl italic text-gold">
              «Когда ты вернёшься?»
            </p>
            <p className="mt-2 font-cormorant text-xl italic text-warm/80">
              кулон ждёт на ветке яблони
            </p>
            <button
              onClick={() => setPhase('apple')}
              className="mt-10 font-fira text-[11px] tracking-widest text-cold/50 hover:text-cold"
            >
              [ ВЕРНУТЬ ЯБЛОКО ]
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* fixed apple in corner */}
      {phase === 'apple' && (
        <div
          ref={appleRef}
          onMouseDown={onDown}
          onTouchStart={onDown}
          className="fixed bottom-6 left-6 z-[75] cursor-grab select-none text-4xl transition-transform hover:scale-110 active:cursor-grabbing"
          title="Перетащи меня в центр..."
        >
          🍎
        </div>
      )}

      {/* dragging ghost */}
      {phase === 'dragging' && (
        <div
          className="fixed z-[75] cursor-grabbing select-none text-4xl"
          style={{ left: pos.x, top: pos.y, pointerEvents: 'none' }}
        >
          🍎
        </div>
      )}

      {/* center drop target hint */}
      {phase === 'dragging' && (
        <div
          className="fixed left-1/2 top-1/2 z-[74] -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full border-2 border-dashed border-gold/40"
          style={{ boxShadow: '0 0 40px rgba(255,179,71,0.15)' }}
        />
      )}
    </>
  );
};

const SeedIcon = () => (
  <svg viewBox="0 0 80 80" className="h-24 w-24">
    <ellipse
      cx="40" cy="40" rx="18" ry="28"
      fill="none"
      stroke="#C0C0C0"
      strokeWidth="2"
      style={{ filter: 'drop-shadow(0 0 16px #C0C0C0)' }}
    />
    <ellipse cx="40" cy="40" rx="10" ry="18" fill="#C0C0C0" opacity="0.4" />
    <line x1="40" y1="12" x2="40" y2="4" stroke="#FFB347" strokeWidth="1.5" />
    <circle cx="40" cy="3" r="2" fill="#FFB347" />
  </svg>
);

const SproutIcon = () => (
  <svg viewBox="0 0 100 120" className="h-40 w-32">
    <line x1="50" y1="110" x2="50" y2="30" stroke="#4a7a4a" strokeWidth="2" />
    <path d="M50 60 Q30 40 20 20 Q40 25 50 45" fill="#3a6a3a" opacity="0.8" />
    <path d="M50 50 Q70 30 80 10 Q60 15 50 35" fill="#3a6a3a" opacity="0.8" />
    <path d="M50 78 Q25 65 15 45 Q38 52 50 70" fill="#4a7a4a" opacity="0.9" />
    {/* pendant */}
    <line x1="66" y1="22" x2="66" y2="35" stroke="#FFB347" strokeWidth="1" />
    <circle cx="66" cy="39" r="5" fill="none" stroke="#FFB347" strokeWidth="1.5"
      style={{ filter: 'drop-shadow(0 0 6px #FFB347)' }} />
    <text x="62" y="42" fontSize="6" fill="#FFB347">♾</text>
  </svg>
);

export default AppleEgg;
