import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BigTitle } from '../components/BigTitle';
import { ProjectModal } from '../components/ProjectModal';
import { ProjectVisual, hueOf } from '../components/ProjectVisual';
import { StatusDot } from '../components/StatusDot';
import { TiltCard } from '../components/TiltCard';
import { projects, type Project } from '../data/projects';
import { useLang } from '../i18n';


function Card({ p, i, onOpen, horizontal }: { p: Project; i: number; onOpen: (p: Project) => void; horizontal: boolean }) {
  const { t, pick } = useLang();
  const [a] = hueOf(p.id);
  const wide = p.size === 'xl';

  return (
    <TiltCard
      max={horizontal ? 6 : 3}
      glow={a}
      className={`shrink-0 rounded-3xl ${horizontal ? (wide ? 'w-[min(720px,60vw)]' : 'w-[min(460px,38vw)]') : 'w-full'}`}
    >
      <article data-cursor={t('projects.details')} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
        <div className={`relative ${horizontal ? 'h-[42vh] max-h-[400px] min-h-[260px]' : 'aspect-[16/10]'}`}>
          <ProjectVisual project={p} className="absolute inset-0 size-full" />
          <span className="absolute left-5 top-5 font-mono text-xs text-white/70">
            {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
            <StatusDot status={p.status} /> {p.status}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className={`font-display font-bold tracking-tight ${wide ? 'text-4xl' : 'text-2xl'}`}>
              <button type="button" onClick={() => onOpen(p)} className="text-left after:absolute after:inset-0 after:z-10 after:content-['']">
                {p.name}
                <span className="sr-only"> — {t('projects.details')}</span>
              </button>
            </h3>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-accent group-hover:text-on-accent">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <p className="mt-3 leading-relaxed text-muted">{pick(p.summary)}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {p.tech.slice(0, wide ? 8 : 4).map((x) => (
              <li key={x} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
                {x}
              </li>
            ))}
            {p.tech.length > (wide ? 8 : 4) && <li className="px-1 font-mono text-[11px] text-muted">+{p.tech.length - (wide ? 8 : 4)}</li>}
          </ul>
        </div>
      </article>
    </TiltCard>
  );
}
const QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

function useHorizontal() {
  // Đọc ngay khi khởi tạo để lần render đầu đã đúng chế độ
  const [on, setOn] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const f = () => setOn(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return on;
}

/** Chọn bản cuộn ngang (desktop) hoặc lưới (mobile / giảm chuyển động) */
export function Projects() {
  const horizontal = useHorizontal();
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      {horizontal ? <HorizontalProjects onOpen={setOpen} /> : <GridProjects onOpen={setOpen} />}
      <ProjectModal project={open} onClose={close} />
    </>
  );
}

function GridProjects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { t } = useLang();
  return (
    <section id="projects" className="mx-auto max-w-[1240px] px-5 py-28 md:px-8">
      <BigTitle index="03" label={t('nav.projects')} title={t('projects.title')} accentWord={2} subtitle={t('projects.subtitle')} />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            className={p.size === 'xl' ? 'md:col-span-2' : ''}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card p={p} i={i} onOpen={onOpen} horizontal={false} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HorizontalProjects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [idx, setIdx] = useState(0);

  useLayoutEffect(() => {
    if (!track.current) return;
    // track là dải thẻ (w-max) nên đo được chiều rộng thật, kể cả khi font tải xong
    const measure = () => setDist(Math.max(0, track.current!.offsetWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIdx(Math.min(projects.length - 1, Math.floor(v * projects.length))));

  return (
    <section id="projects" ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-8 pl-[max(2rem,calc((100vw-1240px)/2+2rem))] pr-[8vw]">
          <div className="flex w-[min(440px,34vw)] shrink-0 flex-col justify-center">
            <BigTitle index="03" label={t('nav.projects')} title={t('projects.title')} accentWord={2} subtitle={t('projects.subtitle')} className="!mb-8" />
            <p className="font-mono text-xs text-muted">scroll ↓ →</p>
          </div>
          {projects.map((p, i) => (
            <Card key={p.id} p={p} i={i} onOpen={onOpen} horizontal />
          ))}
        </motion.div>

        {/* thanh tiến trình */}
        <div className="mx-auto mt-10 flex w-full max-w-[1240px] items-center gap-5 px-8 font-mono text-xs text-muted">
          <span className="tabular-nums text-fg">{String(idx + 1).padStart(2, '0')}</span>
          <div className="relative h-px flex-1 bg-line">
            <motion.div className="absolute inset-0 origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3" style={{ scaleX: bar }} />
          </div>
          <span className="tabular-nums">{String(projects.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
