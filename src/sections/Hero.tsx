import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Download } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Magnetic } from '../components/Magnetic';
import { ParticlePortrait } from '../components/ParticlePortrait';
import { ShaderBackground } from '../components/ShaderBackground';
import { ScrambleText } from '../components/ScrambleText';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { useTypewriter } from '../hooks/useTypewriter';
import { useLang } from '../i18n';

const EASE = [0.22, 1, 0.36, 1] as const;
const FLOAT_TAGS = [
  { t: 'React', c: 'left-[-14%] top-[12%]', d: 0 },
  { t: 'Node.js', c: 'right-[-12%] top-[26%]', d: 0.8 },
  { t: 'MongoDB', c: 'left-[-10%] top-[52%]', d: 1.6 },
  { t: 'llama.cpp', c: 'right-[-16%] top-[64%]', d: 2.4 },
];

export function Hero({ start }: { start: boolean }) {
  const { t, pick } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yPhoto = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const lines = useMemo(() => ['$ whoami', 'fullstack · MERN · local AI', '$ uptime', `${projects.length} services running`], []);
  const { out, done } = useTypewriter(start ? lines : [''], { instant: !!reduce, speed: 35 });

  const nameWords = profile.name.split(' ');
  const [photoMode, setPhotoMode] = useState(false);
  const show = start ? 'show' : 'hidden';

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28">
      {/* nền */}
      <ShaderBackground className="absolute inset-0 size-full" />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <motion.div style={{ opacity: fadeOut }} className="relative mx-auto grid w-full max-w-[1240px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.25fr_1fr]">
        {/* chữ */}
        <motion.div style={{ y: yText }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 font-mono text-xs text-muted backdrop-blur"
          >
            <span className="dot-live size-2 rounded-full bg-online" /> {t('hero.available')} · {pick(profile.location)}
          </motion.p>

          <h1 className="mt-7 font-display text-[clamp(3.4rem,8.4vw,8rem)] font-bold leading-[0.95] tracking-[-0.05em]">
            <span className="sr-only">{profile.name}</span>
            <motion.span aria-hidden className="block" initial="hidden" animate={show} transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}>
              {nameWords.map((word, wi) => (
                <span key={wi} className="mr-[0.22em] inline-block whitespace-nowrap">
                  {word.split('').map((c, i) => (
                    // padding dọc để không cắt dấu tiếng Việt (ộ, ữ…)
                    <span key={i} className="-my-[0.18em] inline-block overflow-hidden py-[0.18em] align-bottom">
                      <motion.span
                        className={`inline-block ${wi === nameWords.length - 1 ? 'text-aurora' : ''}`}
                        variants={{ hidden: { y: '130%', rotate: 10 }, show: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE } } }}
                      >
                        <span className="inline-block transition-[transform,color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-[0.12em] hover:scale-110 hover:text-accent">{c}</span>
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.span>
          </h1>

          <p className="mt-6 font-mono text-base md:text-lg">
            <span className="text-muted">{'> '}</span>
            <ScrambleText text={pick(profile.role)} className="text-aurora font-medium" start={start} delay={0.6} />
          </p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {pick(profile.tagline)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-fg px-7 py-4 text-sm font-semibold text-bg"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                <span className="relative">{t('hero.viewProjects')}</span>
                <ArrowDownRight size={18} className="relative transition-transform duration-500 group-hover:-rotate-45" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.cvUrl} download className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-6 py-4 text-sm font-medium backdrop-blur transition-colors hover:border-accent">
                <Download size={16} /> {t('hero.downloadCv')}
              </a>
            </Magnetic>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-terminal'))}
            initial={{ opacity: 0 }}
            animate={start ? { opacity: 1 } : {}}
            transition={{ delay: 1.4 }}
            className="mt-6 hidden items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg md:inline-flex"
          >
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px]">Ctrl</kbd>
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px]">K</kbd>
            {t('hero.terminalHint')}
          </motion.button>
        </motion.div>

        {/* ảnh */}
        <motion.div
          style={{ y: yPhoto }}
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={start ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="relative mx-auto w-full max-w-[400px] lg:mr-0"
        >
          {/* khung xoay */}
          <div aria-hidden className="absolute -inset-3 rounded-[2rem] border border-dashed border-line" />
          <div aria-hidden className="spin-border absolute -inset-[1px] rounded-[1.75rem]" />
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-bg">
            {profile.photo && (
              <>
                {/* ảnh thật (ẩn sau lớp hạt, hiện khi chọn chế độ photo) */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  fetchPriority="high"
                  className={`absolute inset-0 size-full object-cover object-[50%_20%] transition-[opacity,transform,filter] duration-700 ${
                    photoMode ? 'scale-100 opacity-100 blur-0' : 'scale-110 opacity-0 blur-md'
                  }`}
                />
                {/* chân dung hạt */}
                <ParticlePortrait
                  src={profile.photo}
                  start={start}
                  className={`absolute inset-0 size-full transition-opacity duration-700 ${photoMode ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                />
              </>
            )}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
            {/* scan line */}
            {!reduce && !photoMode && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-accent-2/15 to-transparent"
                animate={{ top: ['-20%', '110%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
              />
            )}
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" /> {photoMode ? 'raw · photo' : 'live · pixel mode'}
            </div>
            {/* chuyển chế độ */}
            <button
              type="button"
              onClick={() => setPhotoMode((v) => !v)}
              aria-pressed={photoMode}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 p-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur"
            >
              <span className={`rounded-full px-2.5 py-1 transition-colors ${!photoMode ? 'bg-accent text-on-accent' : 'text-white/70'}`}>pixel</span>
              <span className={`rounded-full px-2.5 py-1 transition-colors ${photoMode ? 'bg-accent text-on-accent' : 'text-white/70'}`}>photo</span>
            </button>
          </div>

          {/* nhãn trôi nổi */}
          {FLOAT_TAGS.map((f) => (
            <motion.span
              key={f.t}
              className={`absolute hidden rounded-full border border-line bg-surface/80 px-3 py-1.5 font-mono text-xs shadow-lg backdrop-blur md:block ${f.c}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={start ? { opacity: 1, scale: 1, y: reduce ? 0 : [0, -10, 0] } : {}}
              transition={{
                opacity: { delay: 1 + f.d * 0.15, duration: 0.5 },
                scale: { delay: 1 + f.d * 0.15, duration: 0.5, ease: EASE },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: f.d },
              }}
            >
              <span className="text-accent">●</span> {f.t}
            </motion.span>
          ))}

          {/* terminal mini */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={start ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
            className="absolute -bottom-8 -left-4 w-[260px] rounded-xl border border-line bg-bg/85 p-4 font-mono text-[11px] leading-6 shadow-2xl backdrop-blur-md md:-left-16"
            aria-hidden
          >
            {out.map((l, i) => (
              <div key={i} className={lines[i]?.startsWith('$') ? 'text-fg' : 'text-muted'}>
                {lines[i]?.startsWith('$') ? (
                  <>
                    <span className="text-accent">$</span>
                    {l.slice(1)}
                  </>
                ) : (
                  l
                )}
                {i === out.length - 1 && !done && <span className="caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />}
              </div>
            ))}
            {done && (
              <div>
                <span className="text-accent">$</span> <span className="caret inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* gợi ý cuộn */}
      <motion.a
        href="#about"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:flex"
      >
        scroll
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="scroll-hint absolute inset-x-0 top-0 h-1/2 bg-accent" />
        </span>
      </motion.a>
    </section>
  );
}
