import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const LINES = [
  '> Загрузка Протокола Эфир...',
  '> Сканирование нейро-карты...',
  '> Ошибка. Доступ к 7% памяти заблокирован.',
];

const LoadingScreen = ({ onEnter }: { onEnter: () => void }) => {
  const [typed, setTyped] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const raf = useRef<number>();

  useEffect(() => {
    if (lineIdx >= LINES.length) return;
    const line = LINES[lineIdx];
    if (current.length < line.length) {
      const t = setTimeout(() => setCurrent(line.slice(0, current.length + 1)), 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTyped((p) => [...p, line]);
      setCurrent('');
      setLineIdx((i) => i + 1);
    }, 450);
    return () => clearTimeout(t);
  }, [current, lineIdx]);

  const done = lineIdx >= LINES.length;

  const hold = () => {
    const tick = () => {
      setProgress((p) => {
        const next = Math.min(p + 0.018, 1);
        if (next >= 1) {
          setLeaving(true);
          setTimeout(onEnter, 600);
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const release = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (progress < 1) setProgress(0);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#04060f] px-6 transition-opacity duration-500 scanlines ${
        leaving ? 'opacity-0' : 'opacity-100'
      } ${progress > 0 && progress < 1 ? 'animate-glitch' : ''}`}
    >
      {/* проступающее яблоко */}
      <Icon
        name="Apple"
        size={220}
        className="pointer-events-none absolute text-blood transition-opacity duration-200"
        style={{ opacity: progress * 0.5 }}
      />

      <div className="relative z-10 w-full max-w-lg font-fira text-sm text-cold/80">
        {typed.map((l, i) => (
          <p key={i} className={l.includes('Ошибка') ? 'text-blood' : ''}>
            {l}
          </p>
        ))}
        {!done && (
          <p className={current.includes('Ошибка') ? 'text-blood' : ''}>
            {current}
            <span className="animate-blink">▋</span>
          </p>
        )}
      </div>

      {done && (
        <div className="relative z-10 mt-12 flex flex-col items-center animate-fade-up">
          <button
            onMouseDown={hold}
            onMouseUp={release}
            onMouseLeave={release}
            onTouchStart={hold}
            onTouchEnd={release}
            className="relative overflow-hidden rounded-full border border-blood px-8 py-3 font-fira text-xs tracking-widest text-cold transition-colors"
            style={{ background: `rgba(139,0,0,${progress * 0.5})` }}
          >
            <span
              className="absolute inset-0 origin-left bg-blood/40"
              style={{ transform: `scaleX(${progress})` }}
            />
            <span className="relative">⌖ ОБОЙТИ БЛОКИРОВКУ — УДЕРЖИВАЙ</span>
          </button>
          <p className="mt-4 font-cormorant text-sm italic text-gold/60">
            он сопротивляется чипу ради тебя
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
