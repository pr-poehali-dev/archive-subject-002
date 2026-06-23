import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const AudioEngine = ({ isFleet }: { isFleet: boolean }) => {
  const [active, setActive] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const masterRef = useRef<GainNode | null>(null);

  const getCtx = useCallback(() => {
    if (!ctx.current) ctx.current = new AudioContext();
    if (ctx.current.state === 'suspended') ctx.current.resume();
    return ctx.current;
  }, []);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try { (n as OscillatorNode).stop?.(); } catch (_e) { /* already stopped */ }
    });
    nodesRef.current = [];
    masterRef.current?.disconnect();
    masterRef.current = null;
  }, []);

  const playClick = useCallback(() => {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const env = ac.createGain();
    const t = ac.currentTime;
    osc.type = 'square';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.06);
    env.gain.setValueAtTime(0.25, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(env);
    env.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }, [getCtx]);

  const playCosmos = useCallback((ac: AudioContext, master: GainNode) => {
    const freqs = [40, 60, 80, 110];
    freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.value = 0.28 - i * 0.05;
      osc.connect(g);
      g.connect(master);
      osc.start();
      nodesRef.current.push(osc, g);
    });
    const beat = () => {
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const env = ac.createGain();
      osc.frequency.value = 55;
      osc.type = 'sine';
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.35, t + 0.05);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.connect(env);
      env.connect(master);
      osc.start(t);
      osc.stop(t + 0.4);
    };
    const beatId = setInterval(beat, 1000);
    nodesRef.current.push({ disconnect: () => clearInterval(beatId) } as unknown as AudioNode);
  }, []);

  const playRain = useCallback((ac: AudioContext, master: GainNode) => {
    const bufLen = ac.sampleRate * 2;
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900;
    bp.Q.value = 0.6;
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4000;
    src.connect(bp);
    bp.connect(lp);
    lp.connect(master);
    src.start();
    nodesRef.current.push(src, bp, lp);
  }, []);

  const startAudio = useCallback((fleet: boolean) => {
    stopAll();
    const ac = getCtx();
    const master = ac.createGain();
    master.gain.value = fleet ? 0.12 : 0.18;
    master.connect(ac.destination);
    masterRef.current = master;
    if (fleet) playCosmos(ac, master);
    else playRain(ac, master);
  }, [getCtx, stopAll, playCosmos, playRain]);

  useEffect(() => {
    if (!active) return;
    startAudio(isFleet);
  }, [isFleet, active, startAudio]);

  const toggle = () => {
    playClick();
    if (active) {
      stopAll();
      setActive(false);
    } else {
      setActive(true);
      startAudio(isFleet);
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-[75] flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all"
      style={{
        borderColor: active ? '#FFB347' : '#1A2A5A',
        background: active ? 'rgba(255,179,71,0.15)' : 'rgba(26,42,90,0.35)',
        boxShadow: active ? '0 0 20px rgba(255,179,71,0.3)' : 'none',
      }}
      title={active ? 'Выключить аудио' : 'Включить аудио'}
    >
      <Icon
        name={active ? 'Volume2' : 'VolumeX'}
        size={18}
        className={active ? 'text-gold' : 'text-cold/60'}
      />
    </button>
  );
};

export default AudioEngine;