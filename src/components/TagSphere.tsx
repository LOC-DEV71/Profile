import { useEffect, useRef } from 'react';

type Props = {
  items: string[];
  active: string | null;
  onHover: (x: string | null) => void;
  className?: string;
};

/**
 * Quả cầu 3D các công nghệ: phân bố đều theo xoắn Fibonacci, tự xoay,
 * kéo chuột để quay theo quán tính, rê chuột lên một nhãn thì dừng xoay.
 */
export function TagSphere({ items, active, onHover, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLButtonElement | null)[]>([]);
  const paused = useRef(false);
  paused.current = active !== null;

  useEffect(() => {
    const el = wrap.current!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = items.length;
    const pts = items.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { x: Math.cos(theta) * Math.sin(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(phi) };
    });

    let ax = 0.3;
    let ay = 0;
    let vx = 0.0015;
    let vy = 0.004;
    let drag: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = true;

    const render = () => {
      const R = el.clientWidth * 0.4;
      if (!paused.current && !drag && !reduce) {
        // quay về tốc độ tự xoay
        vx += (0.0015 - vx) * 0.02;
        vy += (0.004 - vy) * 0.02;
      }
      if (!paused.current) {
        ax += vx;
        ay += vy;
      }
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      pts.forEach((p, i) => {
        // xoay quanh Y rồi X
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const scale = (z2 + 2) / 3;
        const t = tags.current[i];
        if (!t) return;
        t.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${0.55 + scale * 0.65})`;
        t.style.opacity = String(0.2 + scale * 0.8);
        t.style.zIndex = String(Math.round(scale * 100));
        t.style.filter = scale < 0.45 ? `blur(${(0.45 - scale) * 4}px)` : '';
      });
      if (visible && !reduce) raf = requestAnimationFrame(render);
    };

    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      vy = (e.clientX - drag.x) * 0.0012;
      vx = -(e.clientY - drag.y) * 0.0012;
      drag = { x: e.clientX, y: e.clientY };
    };
    const up = () => (drag = null);

    render();
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(render);
    });
    io.observe(el);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [items]);

  return (
    <div ref={wrap} data-cursor="drag" className={`relative aspect-square touch-none select-none ${className ?? ''}`}>
      {/* lõi phát sáng */}
      <div aria-hidden className="absolute inset-[22%] rounded-full bg-accent/20 blur-3xl" />
      <div aria-hidden className="absolute inset-[8%] rounded-full border border-dashed border-line" />
      <div aria-hidden className="absolute inset-[30%] rounded-full border border-line/60" />
      {items.map((x, i) => (
        <button
          key={x}
          ref={(el) => {
            tags.current[i] = el;
          }}
          type="button"
          onMouseEnter={() => onHover(x)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(x)}
          onBlur={() => onHover(null)}
          className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-xs transition-colors duration-200 will-change-transform md:text-sm ${
            active === x ? 'bg-accent text-on-accent shadow-[0_0_30px_-2px_var(--accent)]' : 'text-fg hover:text-accent'
          }`}
        >
          {x}
        </button>
      ))}
    </div>
  );
}
