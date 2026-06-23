import { useCallback, useEffect, useRef, useState } from 'react';

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  r: number; color: string;
};

const COLORS = ['#FFB347', '#FFF5E6', '#7aa0ff', '#ffffff', '#FFD580'];

const DecoherenceSection = () => {
  const [merge, setMerge] = useState(0);
  const [born, setBorn] = useState(false);
  const [flash, setFlash] = useState(false);
  const rafRef = useRef<number>();
  const bornRef = useRef(false);
  const mergeRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animating = useRef(false);

  const stars = useRef(
    Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      d: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
    }))
  );

  const explode = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const count = 180;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = Math.random() * 8 + 2;
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 0.6 + Math.random() * 0.6,
        r: Math.random() * 4 + 1,
        color: col,
      });
    }
    if (!animating.current) {
      animating.current = true;
      renderParticles();
    }
  }, []);

  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.current = particles.current.filter((p) => p.life > 0);
    for (const p of particles.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.vx *= 0.98;
      p.life -= 0.014 / p.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (particles.current.length > 0) {
      requestAnimationFrame(renderParticles);
    } else {
      animating.current = false;
    }
  }, []);

  const hold = useCallback(() => {
    const tick = () => {
      mergeRef.current = Math.min(mergeRef.current + 0.01, 1);
      setMerge(mergeRef.current);
      if (mergeRef.current >= 1 && !bornRef.current) {
        bornRef.current = true;
        setBorn(true);
        setFlash(true);
        setTimeout(() => setFlash(false), 700);
        const canvas = canvasRef.current;
        if (canvas) {
          explode(canvas.width / 2, canvas.height / 2);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [explode]);

  const release = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!bornRef.current) {
      mergeRef.current = 0;
      setMerge(0);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const gap = (1 - merge) * 90;

  return (
    <section
      id="decoherence"
      className="relative z-10 flex min-h-screen select-none flex-col items-center justify-center overflow-hidden px-6 py-24"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #1a1640 0%, #080614 60%, #030210 100%)' }}
      onMouseDown={hold}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={hold}
      onTouchEnd={release}
    >
      {/* canvas for particle explosion */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* stars */}
      {stars.current.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.d}px`,
            height: `${s.d}px`,
            opacity: 0.3 + Math.sin(i) * 0.3,
            animation: `twinkle ${2 + s.delay}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* title */}
      <div className="relative z-10 flex items-center gap-4 self-stretch">
        <span className="font-fira text-xs text-gold/60">04</span>
        <span className="h-px flex-1 bg-gold/20" />
        <span className="font-cormorant text-2xl italic text-gold">DECOHERENCE</span>
      </div>

      {!born ? (
        <div className="relative z-10 mt-16 flex flex-col items-center">
          {/* silhouettes */}
          <div className="relative flex h-48 w-full max-w-xs items-center justify-center">
            <Silhouette
              color="#7aa0ff"
              glow={merge}
              style={{ transform: `translateX(-${gap}px) scale(${0.9 + merge * 0.1})` }}
            />
            {/* heart glow */}
            <div
              className="absolute h-4 w-4 rounded-full"
              style={{
                opacity: merge * merge,
                background: '#FFF5E6',
                boxShadow: `0 0 ${merge * 80}px ${merge * 40}px rgba(255,179,71,0.8), 0 0 ${merge * 160}px ${merge * 60}px rgba(120,160,255,0.4)`,
                transform: `scale(${1 + merge * 3})`,
              }}
            />
            <Silhouette
              color="#FFB347"
              glow={merge}
              style={{ transform: `translateX(${gap}px) scale(${0.9 + merge * 0.1})` }}
            />
          </div>

          <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-none"
              style={{
                width: `${merge * 100}%`,
                background: `linear-gradient(90deg, #7aa0ff, #FFB347)`,
                boxShadow: `0 0 12px rgba(255,179,71,${merge})`,
              }}
            />
          </div>
          <p className="mt-6 font-fira text-xs tracking-widest text-warm/50">
            ⌖ ЗАЖМИ — два сердца притягиваются
          </p>
        </div>
      ) : (
        <div className="relative z-10 mt-16 flex flex-col items-center text-center animate-fade-up">
          <span
            className="h-20 w-20 animate-star-pulse rounded-full"
            style={{
              background: 'radial-gradient(circle, #fff 0%, #FFD580 40%, #FFB347 100%)',
              boxShadow: '0 0 120px 60px rgba(255,179,71,0.6), 0 0 200px 80px rgba(255,255,255,0.2)',
            }}
          />
          <p className="mt-12 max-w-md font-cormorant text-3xl italic leading-relaxed text-warm">
            Он целует её в первый и последний раз.
            <br />
            <span className="text-gold">Из их сердец рождается новая звезда.</span>
          </p>
          <p className="mt-6 font-cormorant text-xl italic text-gold/70">
            «В жизни и смерти мы никогда не будем разлучены»
          </p>
        </div>
      )}

      {flash && (
        <div
          className="fixed inset-0 z-[95] bg-white"
          style={{ animation: 'flicker 0.6s ease-out forwards' }}
        />
      )}
    </section>
  );
};

const Silhouette = ({
  color,
  glow,
  style,
}: {
  color: string;
  glow: number;
  style: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 60 100"
    className="absolute h-36 w-24 transition-none"
    style={{ ...style, filter: `drop-shadow(0 0 ${8 + glow * 30}px ${color})` }}
  >
    <ellipse cx="30" cy="18" rx="12" ry="13" fill={color} opacity={0.7 + glow * 0.3} />
    <path
      d="M10 90 Q15 55 22 48 Q26 45 30 45 Q34 45 38 48 Q45 55 50 90 Z"
      fill={color}
      opacity={0.6 + glow * 0.3}
    />
    <path d="M10 55 Q2 60 6 75 Q10 82 14 78" fill={color} opacity={0.5 + glow * 0.3} />
    <path d="M50 55 Q58 60 54 75 Q50 82 46 78" fill={color} opacity={0.5 + glow * 0.3} />
  </svg>
);

export default DecoherenceSection;
