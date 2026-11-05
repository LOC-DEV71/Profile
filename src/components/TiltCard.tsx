import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/** Thẻ nghiêng 3D theo con trỏ + vệt sáng chạy theo chuột trên viền và nền */
export function TiltCard({ children, className, max = 8, glow = 'var(--accent)' }: { children: ReactNode; className?: string; max?: number; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={`group/tilt relative [transform-style:preserve-3d] ${className ?? ''}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        px.set(x);
        py.set(y);
        ref.current.style.setProperty('--sx', `${x * 100}%`);
        ref.current.style.setProperty('--sy', `${y * 100}%`);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {/* viền sáng */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--sx,50%) var(--sy,50%), ${glow}, transparent 45%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: 1,
        }}
      />
      {children}
      {/* vệt sáng nền */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ background: `radial-gradient(500px circle at var(--sx,50%) var(--sy,50%), color-mix(in oklab, ${glow} 12%, transparent), transparent 50%)` }}
      />
    </motion.div>
  );
}
