import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import LoadingScreen from '@/components/LoadingScreen';
import Timeline from '@/components/Timeline';
import DecoherenceSection from '@/components/Decoherence';
import AppleEgg from '@/components/AppleEgg';
import AudioEngine from '@/components/AudioEngine';

type Mode = 'fleet' | 'caleb';

const RADIO_DIALOG = [
  { who: 'you', text: 'Я скучаю.' },
  { who: 'sys', text: 'Ошибка. Уровень эмоций превышен.' },
  { who: 'caleb', text: '...Я здесь. Всегда.' },
];

const Index = () => {
  const [mode, setMode] = useState<Mode>('fleet');
  const [glitching, setGlitching] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) return <LoadingScreen onEnter={() => setLoaded(true)} />;

  const toggleMode = () => {
    setGlitching(true);
    setTimeout(() => {
      setMode((m) => (m === 'fleet' ? 'caleb' : 'fleet'));
      setTimeout(() => setGlitching(false), 250);
    }, 200);
  };

  const isFleet = mode === 'fleet';

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden noise-overlay transition-colors duration-700 ${
        glitching ? 'animate-glitch' : ''
      }`}
      style={{ background: isFleet ? '#0A1128' : '#160d04' }}
    >
      <Rain active={isFleet} />

      <button
        onClick={toggleMode}
        className="fixed top-5 right-5 z-[70] flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-md transition-all"
        style={{
          borderColor: isFleet ? '#1A2A5A' : '#FFB347',
          background: isFleet ? 'rgba(26,42,90,0.35)' : 'rgba(255,179,71,0.12)',
        }}
      >
        <span
          className={`font-orbitron text-[10px] tracking-widest transition-opacity ${
            isFleet ? 'text-cold opacity-100' : 'text-cold/40'
          }`}
        >
          ФЛОТ
        </span>
        <span
          className="relative h-5 w-10 rounded-full transition-colors"
          style={{ background: isFleet ? '#1A2A5A' : '#FFB347' }}
        >
          <span
            className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300"
            style={{ left: isFleet ? '2px' : '22px' }}
          />
        </span>
        <span
          className={`font-cormorant text-base italic transition-opacity ${
            !isFleet ? 'text-gold opacity-100' : 'text-warm/40'
          }`}
        >
          Калеб
        </span>
      </button>

      <Hero isFleet={isFleet} />
      <Dossier isFleet={isFleet} />
      <Timeline />
      <Radio isFleet={isFleet} />
      <DecoherenceSection />
      <Footer isFleet={isFleet} />
      <AppleEgg />
      <AudioEngine isFleet={isFleet} />
    </div>
  );
};

const Rain = ({ active }: { active: boolean }) => {
  const [paused, setPaused] = useState(false);
  if (!active) return null;
  const drops = Array.from({ length: 40 });
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-0"
      onMouseMove={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {drops.map((_, i) => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: `${(i / 40) * 100}%`,
            animationDuration: `${0.7 + (i % 5) * 0.25}s`,
            animationDelay: `${(i % 7) * 0.3}s`,
            animationPlayState: paused ? 'paused' : 'running',
            opacity: paused ? 0.15 : 0.6,
          }}
        />
      ))}
    </div>
  );
};

const Hero = ({ isFleet }: { isFleet: boolean }) => (
  <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center scanlines">
    <p
      className={`mb-6 font-fira text-xs tracking-[0.4em] ${
        isFleet ? 'text-cold/60' : 'text-gold/70'
      }`}
    >
      {isFleet ? 'АРХИВ СУБЪЕКТА №002' : 'для той, кто помнит'}
    </p>
    {isFleet ? (
      <h1 className="font-orbitron text-5xl font-black tracking-tight text-cold text-glow-cold sm:text-7xl md:text-8xl animate-fade-up">
        ПРОТОКОЛ
        <br />
        ЭФИР
      </h1>
    ) : (
      <h1 className="font-cormorant text-6xl italic text-gold text-glow-gold sm:text-8xl md:text-9xl animate-fade-up">
        Калеб
      </h1>
    )}
    <p
      className={`mt-8 max-w-md font-cormorant text-xl italic ${
        isFleet ? 'text-cold/70' : 'text-warm/85'
      }`}
    >
      {isFleet
        ? 'Загрузка протокола... Ошибка доступа. 7% памяти запечатаны.'
        : 'Останься. Проведи со мной следующие сто лет.'}
    </p>
    <Icon
      name="ChevronsDown"
      size={28}
      className={`mt-16 animate-flicker ${isFleet ? 'text-cold/40' : 'text-gold/60'}`}
    />
  </section>
);

const Dossier = ({ isFleet }: { isFleet: boolean }) => {
  const [scar, setScar] = useState<null | 'arm' | 'head'>(null);

  const official = [
    ['Рост', '183 см'],
    ['Вес', '78 кг'],
    ['Эвол', 'Контроль погоды'],
    ['Группа крови', 'O (I)'],
    ['Статус', 'Активен'],
  ];
  const personal = [
    ['Рост', 'Всегда был выше меня'],
    ['Эвол', 'Останавливать дождь, чтобы я не промокла'],
    ['Еда', 'То, что приготовил он'],
    ['Голос', 'Тише грозы, теплее солнца'],
    ['Статус', 'Мой'],
  ];
  const rows = isFleet ? official : personal;

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 py-24">
      <SectionTitle isFleet={isFleet} num="01" label={isFleet ? 'ДОСЬЕ' : 'двойное лицо'} />
      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div
          className="relative flex aspect-[3/4] items-center justify-center rounded-lg border"
          style={{
            borderColor: isFleet ? '#1A2A5A' : '#FFB347',
            background: isFleet
              ? 'linear-gradient(160deg,#0e1a3a,#1A2A5A)'
              : 'linear-gradient(160deg,#2a1a08,#3a2509)',
          }}
        >
          <Icon
            name="User"
            size={140}
            className={isFleet ? 'text-cold/30' : 'text-gold/40 blur-[1px]'}
          />
          <button
            onClick={() => setScar('arm')}
            className="absolute right-[28%] top-[45%] h-4 w-4 animate-twinkle rounded-full"
            style={{ background: '#8B0000', boxShadow: '0 0 12px #8B0000' }}
            aria-label="Правая рука"
          />
          <button
            onClick={() => setScar('head')}
            className="absolute left-[38%] top-[15%] h-4 w-4 animate-twinkle rounded-full"
            style={{ background: '#FFB347', boxShadow: '0 0 12px #FFB347' }}
            aria-label="Висок"
          />
        </div>

        <div>
          <div className="space-y-3">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between border-b pb-2"
                style={{ borderColor: isFleet ? 'rgba(224,224,224,0.12)' : 'rgba(255,179,71,0.2)' }}
              >
                <span
                  className={`font-fira text-xs tracking-wider ${
                    isFleet ? 'text-cold/50' : 'text-gold/60'
                  }`}
                >
                  {k}
                </span>
                <span
                  className={`text-right ${
                    isFleet
                      ? 'font-orbitron text-sm text-cold'
                      : 'font-cormorant text-lg italic text-warm'
                  }`}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <p className={`mt-6 font-fira text-[11px] ${isFleet ? 'text-cold/40' : 'text-gold/50'}`}>
            ↑ кликни по точкам на силуэте — шрамы
          </p>
        </div>
      </div>

      {scar && <ScarModal scar={scar} onClose={() => setScar(null)} />}
    </section>
  );
};

const ScarModal = ({ scar, onClose }: { scar: 'arm' | 'head'; onClose: () => void }) => {
  const data =
    scar === 'arm'
      ? {
          title: 'ПРАВАЯ РУКА',
          stats: 'Механическая замена · Чувствительность: 0% · Боль: 100%',
          quote: 'Я хочу быть единственной, кто причиняет тебе такую боль.',
          accent: '#8B0000',
        }
      : {
          title: 'ВИСОК · ТОРИН ЧИП',
          stats: 'Установлен принудительно · Блокировка памяти: 93%',
          quote: 'Оставшиеся 7% — она.',
          accent: '#FFB347',
        };
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6 animate-fade-up"
      onClick={onClose}
      style={{ animationDuration: '0.3s' }}
    >
      <div
        className="max-w-md rounded-lg border p-8 text-center"
        style={{ borderColor: data.accent, background: '#0A1128', boxShadow: `0 0 50px ${data.accent}55` }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-orbitron text-lg tracking-widest text-cold">{data.title}</h3>
        <p className="mt-3 font-fira text-xs text-cold/60">{data.stats}</p>
        <p className="mt-6 font-cormorant text-2xl italic text-warm">«{data.quote}»</p>
        <button
          onClick={onClose}
          className="mt-8 font-fira text-[11px] tracking-widest text-cold/50 hover:text-cold"
        >
          [ ЗАКРЫТЬ ]
        </button>
      </div>
    </div>
  );
};

const SECRET = 'когдатывернёшься';

const Radio = ({ isFleet }: { isFleet: boolean }) => {
  const [visible, setVisible] = useState<number>(0);
  const [started, setStarted] = useState(false);
  const [secret, setSecret] = useState(false);
  const buffer = useRef('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).replace(/[\s,.]/g, '').slice(-SECRET.length);
      if (buffer.current === SECRET) {
        setSecret(true);
        setTimeout(() => setSecret(false), 4000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const start = () => {
    setStarted(true);
    setVisible(0);
    RADIO_DIALOG.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), 1200 * (i + 1));
    });
  };

  return (
    <section className="relative z-10 mx-auto max-w-md px-6 py-24">
      <SectionTitle isFleet={isFleet} num="03" label="РАЦИЯ" />
      <div
        className="mt-12 overflow-hidden rounded-3xl border-2 scanlines"
        style={{ borderColor: '#1A2A5A', background: '#070d1f' }}
      >
        <div className="flex items-center gap-2 border-b px-5 py-3" style={{ borderColor: '#1A2A5A' }}>
          <span className="h-2 w-2 animate-twinkle rounded-full bg-gold" />
          <span className="font-fira text-xs tracking-widest text-cold/70">АБОНЕНТ: КАЛЕБ</span>
        </div>
        <div className="flex min-h-[220px] flex-col gap-3 p-5">
          {!started && (
            <p className="my-auto text-center font-fira text-xs text-cold/40">
              соединение не установлено
            </p>
          )}
          {RADIO_DIALOG.slice(0, visible).map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-2 animate-fade-up ${
                m.who === 'you'
                  ? 'self-end bg-fleet text-cold'
                  : m.who === 'sys'
                  ? 'self-center bg-blood/40 text-warm font-fira text-xs'
                  : 'self-start text-gold'
              }`}
              style={
                m.who === 'caleb'
                  ? { background: 'rgba(255,179,71,0.12)', border: '1px solid rgba(255,179,71,0.3)' }
                  : undefined
              }
            >
              <span
                className={
                  m.who === 'caleb' ? 'font-cormorant text-lg italic' : 'font-fira text-sm'
                }
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t p-4" style={{ borderColor: '#1A2A5A' }}>
          <button
            onClick={start}
            className="w-full rounded-full border py-2 font-fira text-xs tracking-widest text-cold transition-colors hover:bg-fleet/40"
            style={{ borderColor: '#1A2A5A' }}
          >
            ⟳ ЗАПРОСИТЬ СОЕДИНЕНИЕ
          </button>
        </div>
      </div>
      <p className="mt-4 text-center font-fira text-[10px] tracking-widest text-cold/30">
        наберите тайную фразу на клавиатуре...
      </p>

      {secret && <PendantSecret />}
    </section>
  );
};

const PendantSecret = () => {
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBroken(true), 1500);
    const t2 = setTimeout(() => setBroken(false), 2600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/90 animate-fade-up">
      <div className={`animate-pendant-fall ${broken ? 'animate-glitch' : ''}`}>
        <Icon
          name="Gem"
          size={90}
          className={broken ? 'text-blood' : 'text-gold'}
          style={{ filter: `drop-shadow(0 0 24px ${broken ? '#8B0000' : '#FFB347'})` }}
        />
      </div>
      <p className="mt-10 max-w-xs text-center font-cormorant text-2xl italic text-warm">
        {broken
          ? '...разбился. И собрался вновь.'
          : '«Когда ты вернёшься?» — спросила она.'}
      </p>
      <p className="mt-3 font-cormorant text-lg italic text-gold/70">
        «Всегда. Даже после смерти.»
      </p>
    </div>
  );
};


const Footer = ({ isFleet }: { isFleet: boolean }) => {
  const [seconds, setSeconds] = useState(0);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    const g = setInterval(() => {
      setErr(true);
      setTimeout(() => {
        setErr(false);
        setSeconds((s) => Math.max(0, s - 10));
      }, 700);
    }, 17000);
    return () => {
      clearInterval(t);
      clearInterval(g);
    };
  }, []);

  const y = Math.floor(seconds / 31536000);
  const d = Math.floor((seconds % 31536000) / 86400);
  const hh = Math.floor((seconds % 86400) / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <footer
      className="relative z-10 border-t px-6 py-16 text-center"
      style={{ borderColor: isFleet ? '#1A2A5A' : '#FFB347' }}
    >
      <p className="font-cormorant text-xl italic text-warm/80">
        «Останься. Проведи со мной следующие сто лет.»
      </p>
      <div
        className={`mt-6 font-orbitron text-2xl tracking-widest text-gold text-glow-gold sm:text-4xl ${
          err ? 'animate-glitch text-blood' : ''
        }`}
      >
        {err ? 'ОШИБКА · ОШИБКА' : `${pad(y)}л : ${pad(d)}д : ${pad(hh)}:${pad(mm)}:${pad(ss)}`}
      </div>
      <p className="mt-8 font-fira text-[10px] tracking-[0.3em] text-cold/40">
        АРХИВ СУБЪЕКТА №002 · ПРОТОКОЛ ЭФИР
      </p>
    </footer>
  );
};

const SectionTitle = ({
  isFleet,
  num,
  label,
}: {
  isFleet: boolean;
  num: string;
  label: string;
}) => (
  <div className="flex items-center gap-4">
    <span className="font-fira text-xs text-gold/60">{num}</span>
    <span
      className="h-px flex-1"
      style={{ background: isFleet ? 'rgba(224,224,224,0.2)' : 'rgba(255,179,71,0.3)' }}
    />
    <span
      className={
        isFleet
          ? 'font-orbitron text-sm tracking-[0.3em] text-cold'
          : 'font-cormorant text-2xl italic text-gold'
      }
    >
      {label}
    </span>
  </div>
);

export default Index;