import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { projects } from '../data/projects';

const BOOT = [
  'booting devstack kernel',
  'mounting ~/DevStack',
  ...projects.slice(0, 4).map((p) => `starting ${p.id}.service`),
  'all systems running',
];

/** Màn hình khởi động ~1.6s, sau đó kéo màn lên */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t0 = performance.now();
    const D = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / D);
      setPct(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const shown = Math.ceil((pct / 100) * BOOT.length);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col justify-between bg-bg p-6 font-mono text-xs md:p-10"
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      aria-hidden
    >
      <ul className="space-y-1.5 text-muted">
        {BOOT.slice(0, shown).map((l, i) => (
          <li key={l}>
            <span className="text-online">[ ok ]</span> {l}
            {i === shown - 1 && pct < 100 && <span className="caret ml-1 inline-block h-3 w-1.5 bg-accent" />}
          </li>
        ))}
      </ul>
      <div>
        <div className="flex items-end justify-between">
          <span className="text-muted">~/DevStack</span>
          <span className="font-display text-7xl font-bold tabular-nums tracking-tighter text-fg md:text-9xl">
            {pct}
            <span className="text-accent">%</span>
          </span>
        </div>
        <div className="mt-4 h-px w-full bg-line">
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
