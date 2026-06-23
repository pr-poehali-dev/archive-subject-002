import { useRef, useState } from 'react';

type Event = {
  year: string;
  title: string;
  text: string;
  kind: 'fleet' | 'memory';
};

const EVENTS: Event[] = [
  { year: '2034', title: 'Sealed in Dust', text: 'Первая смерть. Бабушка. Он узнал, что значит терять.', kind: 'memory' },
  { year: 'Школа', title: 'Borrowed Promise', text: 'Качели на закате. Сцепленные мизинцы. «Обещай, что вернёшься».', kind: 'memory' },
  { year: 'Академия', title: 'Выпускной', text: 'Поцелуй в щёку при всех. Он не отвёл взгляд.', kind: 'memory' },
  { year: 'Флот', title: 'Крушение в Туннеле', text: 'Взрыв. Кулон падает на землю и трескается.', kind: 'fleet' },
  { year: 'Флот', title: 'Воссоединение', text: '«Я Калеб, и я всегда буду рядом».', kind: 'memory' },
  { year: '∞', title: 'Decoherence', text: 'Космос. Две души. Рождение звезды.', kind: 'fleet' },
];

const FogCard = ({ ev }: { ev: Event }) => {
  const [cleared, setCleared] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const moves = useRef(0);

  const isMemory = ev.kind === 'memory';

  const wipe = () => {
    moves.current += 1;
    if (moves.current > 12 && !revealed) {
      setCleared(true);
      setTimeout(() => setRevealed(true), 400);
    }
  };

  return (
    <div className="relative pl-10">
      <span
        className="absolute left-2 top-3 h-3 w-3 -translate-x-1/2 rounded-full"
        style={{ background: isMemory ? '#FFB347' : '#1A2A5A', boxShadow: `0 0 10px ${isMemory ? '#FFB347' : '#3a5ab0'}` }}
      />
      <div
        className={`relative overflow-hidden rounded-lg border p-5 transition-colors duration-700 ${
          revealed ? 'scanlines' : ''
        }`}
        style={{
          borderColor: isMemory ? 'rgba(255,179,71,0.35)' : 'rgba(26,42,90,0.8)',
          background: revealed
            ? isMemory
              ? 'linear-gradient(160deg,#2a1c08,#1a1305)'
              : 'linear-gradient(160deg,#0e1a3a,#0a1128)'
            : '#0a1128',
        }}
      >
        <p
          className={`font-fira text-[11px] tracking-widest ${
            isMemory ? 'text-gold/70' : 'text-cold/50'
          }`}
        >
          {ev.year}
        </p>
        <h4
          className={`mt-1 ${
            isMemory ? 'font-cormorant text-2xl italic text-gold' : 'font-orbitron text-base text-cold'
          }`}
        >
          {ev.title}
        </h4>
        <p
          className={`mt-2 ${
            isMemory ? 'font-cormorant text-lg italic text-warm/90' : 'font-fira text-xs text-cold/70'
          }`}
        >
          {ev.text}
        </p>

        {!revealed && (
          <div
            onMouseMove={wipe}
            onTouchMove={wipe}
            className="absolute inset-0 cursor-crosshair backdrop-blur-md transition-opacity duration-500"
            style={{
              background: 'rgba(10,17,40,0.92)',
              opacity: cleared ? 0 : 1,
              pointerEvents: cleared ? 'none' : 'auto',
            }}
          >
            <p className="flex h-full items-center justify-center font-fira text-[11px] tracking-widest text-cold/40">
              ✦ води курсором — стирай туман
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Timeline = () => (
  <section className="relative z-10 mx-auto max-w-2xl px-6 py-24">
    <div className="flex items-center gap-4">
      <span className="font-fira text-xs text-gold/60">02</span>
      <span className="h-px flex-1 bg-cold/20" />
      <span className="font-orbitron text-sm tracking-[0.3em] text-cold">ЛЕНТА РАСПАДА</span>
    </div>
    <div className="relative mt-12 space-y-8 border-l border-cold/15">
      {EVENTS.map((ev) => (
        <FogCard key={ev.title} ev={ev} />
      ))}
    </div>
  </section>
);

export default Timeline;
