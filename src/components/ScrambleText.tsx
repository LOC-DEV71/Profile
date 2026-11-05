import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ';

/** Chữ "giải mã" từ ký tự ngẫu nhiên thành chữ thật khi xuất hiện */
export function ScrambleText({ text, className, delay = 0, start = true }: { text: string; className?: string; delay?: number; start?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : '');

  useEffect(() => {
    if (!inView || !start) return;
    if (reduce) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    let timer = 0;
    const total = text.length * 2.2 + 12;
    const run = () => {
      frame++;
      const revealed = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split('')
          .map((c, i) => (i < revealed || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      );
      if (revealed < text.length) raf = requestAnimationFrame(run);
      else setOut(text);
    };
    timer = window.setTimeout(() => (raf = requestAnimationFrame(run)), delay * 1000);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, start, text, reduce, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out || ' '}</span>
    </span>
  );
}
