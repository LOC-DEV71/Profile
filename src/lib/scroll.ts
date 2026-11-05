import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Cuộn mượt toàn trang. Tắt khi người dùng bật "giảm chuyển động". */
export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 } });
  let raf = 0;
  const loop = (t: number) => {
    lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export const lockScroll = (lock: boolean) => {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.body.style.overflow = lock ? 'hidden' : '';
};
