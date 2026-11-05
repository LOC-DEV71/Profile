import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Con trỏ tùy biến: chấm nhỏ + vòng tròn đuổi theo. Phóng to khi hover link/nút, hiện nhãn với [data-cursor]. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState('');
  const [hidden, setHidden] = useState(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea');
      setHover(!!el && !el.matches('input, textarea'));
      setLabel(el?.dataset.cursor ?? '');
    };
    const leave = () => setHidden(true);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 48 : 30;

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[80] transition-opacity ${hidden ? 'opacity-0' : ''}`}>
      <motion.div className="absolute left-0 top-0 size-1.5 rounded-full bg-accent" style={{ x, y, translateX: '-50%', translateY: '-50%' }} />
      <motion.div
        className={`absolute left-0 top-0 grid place-items-center rounded-full border font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 ${
          label ? 'border-accent bg-accent' : hover ? 'border-accent/70 bg-accent/10' : 'border-accent/70 bg-transparent'
        }`}
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {label && <span className="text-on-accent">{label}</span>}
      </motion.div>
    </div>
  );
}
