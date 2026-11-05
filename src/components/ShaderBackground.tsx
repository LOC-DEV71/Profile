import { useEffect, useRef } from 'react';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Cực quang: fbm noise bẻ cong nhiều lớp (domain warping), con trỏ kéo lệch dòng chảy
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_bg, u_c1, u_c2, u_c3;
uniform float u_amt;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 p = uv; p.x *= ar;
  vec2 m = u_mouse; m.x *= ar;
  float md = length(p - m);
  float t = u_time * 0.05;

  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
  vec2 pull = (m - p) * 0.9 * exp(-md * 2.2);
  vec2 r = vec2(fbm(p * 1.3 + 2.2 * q + vec2(1.7, 9.2) + t * 1.4 + pull), fbm(p * 1.3 + 2.2 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.1 + 2.6 * r);

  vec3 col = mix(u_c1, u_c2, clamp(q.x * 1.5 - 0.15, 0.0, 1.0));
  col = mix(col, u_c3, clamp(r.y * 1.4 - 0.35, 0.0, 1.0));

  float ribbon = smoothstep(0.42, 0.98, f);
  float glow = ribbon * (0.35 + 0.65 * uv.y) + 0.35 * exp(-md * 4.0);
  // tối dần ở mép dưới để hoà vào section kế tiếp
  glow *= smoothstep(0.0, 0.35, uv.y);
  vec3 outc = mix(u_bg, col, clamp(glow * u_amt, 0.0, 1.0));
  gl_FragColor = vec4(outc, 1.0);
}`;

function hex(v: string): [number, number, number] {
  const h = v.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Nền WebGL cực quang. Render ở nửa độ phân giải để nhẹ máy, tạm dừng khi khuất màn hình. */
export function ShaderBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U('u_res'), uTime = U('u_time'), uMouse = U('u_mouse'), uAmt = U('u_amt');
    const uBg = U('u_bg'), uC1 = U('u_c1'), uC2 = U('u_c2'), uC3 = U('u_c3');

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      gl.uniform3fv(uBg, hex(s.getPropertyValue('--bg')));
      gl.uniform3fv(uC1, hex(s.getPropertyValue('--accent')));
      gl.uniform3fv(uC2, hex(s.getPropertyValue('--accent-2')));
      gl.uniform3fv(uC3, hex(s.getPropertyValue('--accent-3')));
      gl.uniform1f(uAmt, document.documentElement.classList.contains('light') ? 0.45 : 0.9);
    };

    const SCALE = 0.5;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };

    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const frame = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform1f(uTime, reduce ? 20 : (now - t0) / 1000 + 20);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    readColors();
    resize();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) requestAnimationFrame(frame);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      if (reduce) requestAnimationFrame(frame);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pointermove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
