import { useEffect, useRef } from 'react';

type Props = { src: string; start: boolean; className?: string; focus?: [number, number] };

/**
 * Chân dung dạng hạt halftone: mỗi hạt lấy màu từ ảnh, vùng sáng hạt to, vùng tối hạt nhỏ.
 * Hạt bay vào ghép thành ảnh, bị con trỏ đẩy ra rồi lò xo trở về, thỉnh thoảng glitch.
 * Vẽ thẳng vào ImageData (Uint32) nên ~12k hạt vẫn mượt.
 */
export function ParticlePortrait({ src, start, className, focus = [0.5, 0.2] }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: false })!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    let disposed = false;

    let n = 0;
    let tx = new Float32Array(0), ty = tx, x = tx, y = tx, vx = tx, vy = tx;
    let col = new Uint32Array(0);
    let size = new Uint8Array(0);
    let cw = 0, ch = 0, dpr = 1;
    let img: ImageData | null = null;
    let u32: Uint32Array | null = null;
    const mouse = { x: -9999, y: -9999 };
    let glitchUntil = 0, glitchY = 0, glitchH = 0, glitchShift = 0, nextGlitch = performance.now() + 2500;
    let assembledAt = 0;

    const image = new Image();
    image.decoding = 'async';
    image.src = src;

    const setup = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H || !image.complete || !image.naturalWidth) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.round(W * dpr);
      ch = Math.round(H * dpr);
      canvas.width = cw;
      canvas.height = ch;
      img = ctx.createImageData(cw, ch);
      u32 = new Uint32Array(img.data.buffer);

      const gap = W < 340 ? 3 : 4;
      const cols = Math.floor(W / gap);
      const rows = Math.floor(H / gap);

      // object-cover vào lưới cols x rows
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const o = off.getContext('2d')!;
      const ir = image.naturalWidth / image.naturalHeight;
      const cr = cols / rows;
      let sw = image.naturalWidth, sh = image.naturalHeight, sx = 0, sy = 0;
      if (ir > cr) {
        sw = sh * cr;
        sx = (image.naturalWidth - sw) * focus[0];
      } else {
        sh = sw / cr;
        sy = (image.naturalHeight - sh) * focus[1];
      }
      o.drawImage(image, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = o.getImageData(0, 0, cols, rows).data;

      n = cols * rows;
      tx = new Float32Array(n); ty = new Float32Array(n);
      x = new Float32Array(n); y = new Float32Array(n);
      vx = new Float32Array(n); vy = new Float32Array(n);
      col = new Uint32Array(n);
      size = new Uint8Array(n);

      for (let r = 0, k = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, k++) {
          const i = (r * cols + c) * 4;
          const R = data[i], G = data[i + 1], B = data[i + 2];
          const lum = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
          // mặt nạ elip quanh người: nền xa chủ thể mờ và nhỏ đi để khuôn mặt nổi bật
          const ex = (c / cols - 0.5) / 0.42;
          const ey = (r / rows - 0.5) / 0.62;
          const mask = Math.max(0, Math.min(1, 1.35 - Math.sqrt(ex * ex + ey * ey)));
          const fade = 0.15 + 0.85 * mask * mask;
          tx[k] = c * gap + gap / 2;
          ty[k] = r * gap + gap / 2;
          // bắt đầu: nổ tung từ tâm theo vòng xoáy
          const a = Math.random() * Math.PI * 2;
          const d = 200 + Math.random() * 500;
          x[k] = reduce ? tx[k] : W / 2 + Math.cos(a) * d;
          y[k] = reduce ? ty[k] : H / 2 + Math.sin(a) * d;
          // tăng tương phản nhẹ
          const boost = (v: number) => Math.min(255, Math.max(0, ((v - 128) * 1.3 + 135) * fade));
          col[k] = (255 << 24) | (boost(B) << 16) | (boost(G) << 8) | boost(R);
          size[k] = Math.max(1, Math.round(gap * dpr * (0.2 + 0.75 * lum) * (0.45 + 0.55 * mask)));
        }
      }
    };

    const step = (now: number) => {
      if (disposed) return;
      if (u32 && img) {
        const go = startRef.current;
        if (go && !assembledAt) assembledAt = now;
        const t = assembledAt ? Math.min(1, (now - assembledAt) / 1400) : 0;
        const k = 0.012 + t * 0.06;
        const R = 70;

        if (!reduce && now > nextGlitch) {
          glitchUntil = now + 140 + Math.random() * 120;
          glitchY = Math.random() * ch;
          glitchH = (12 + Math.random() * 40) * dpr;
          glitchShift = (Math.random() - 0.5) * 30 * dpr;
          nextGlitch = now + 2500 + Math.random() * 3500;
        }
        const glitching = now < glitchUntil;

        u32.fill(0);
        for (let i = 0; i < n; i++) {
          if (go && !reduce) {
            let ax = (tx[i] - x[i]) * k;
            let ay = (ty[i] - y[i]) * k;
            const dx = x[i] - mouse.x;
            const dy = y[i] - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / R) * 6;
              ax += (dx / d) * f;
              ay += (dy / d) * f;
            }
            vx[i] = (vx[i] + ax) * 0.8;
            vy[i] = (vy[i] + ay) * 0.8;
            x[i] += vx[i];
            y[i] += vy[i];
          }
          if (!go && !reduce) continue;

          let px = (x[i] * dpr) | 0;
          const py = (y[i] * dpr) | 0;
          let c = col[i];
          if (glitching && py > glitchY && py < glitchY + glitchH) {
            px += glitchShift | 0;
            c = (c & 0xff00ff00) | ((c & 0xff) << 16) | ((c >> 16) & 0xff); // đảo kênh R/B
          }
          const s = size[i];
          if (px < 0 || py < 0 || px + s >= cw || py + s >= ch) continue;
          for (let yy = 0; yy < s; yy++) {
            const row = (py + yy) * cw + px;
            for (let xx = 0; xx < s; xx++) u32[row + xx] = c;
          }
        }
        ctx.putImageData(img, 0, 0);
      }
      if (!reduce && visible) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    image.onload = () => {
      setup();
      raf = requestAnimationFrame(step);
    };
    const ro = new ResizeObserver(() => {
      setup();
      if (reduce) requestAnimationFrame(step);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(step);
    });
    io.observe(canvas);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, focus[0], focus[1]]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
