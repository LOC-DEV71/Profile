import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { BigTitle } from '../components/BigTitle';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { stack } from '../data/stack';
import { useCountUp } from '../hooks/useCountUp';
import { useLang } from '../i18n';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ['blur(4px)', 'blur(0px)']);
  return (
    <motion.span style={{ opacity, filter: blur }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/** Đoạn văn sáng dần từng chữ theo thanh cuộn */
function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em]" aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Stat({ value, label, start, i }: { value: number; label: string; start: boolean; i: number }) {
  const n = useCountUp(value, start, 1600);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border-t border-line pt-6"
    >
      <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
      <p className="font-display text-6xl font-bold tabular-nums tracking-tighter md:text-7xl">
        {n}
        <span className="text-aurora">+</span>
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
    </motion.div>
  );
}

export function About() {
  const { t, pick } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { value: projects.length, label: t('about.stats.projects') },
    { value: stack.reduce((n, l) => n + l.items.length, 0), label: t('about.stats.tech') },
    { value: stack.length, label: t('about.stats.layers') },
    { value: 3, label: t('about.stats.models') },
  ];

  return (
    <section id="about" className="relative mx-auto max-w-[1240px] px-5 py-28 md:px-8 md:py-40">
      <BigTitle index="01" label={t('nav.about')} title={t('about.title')} />
      <div className="space-y-10">
        {profile.about.map((p, i) => (
          <div key={i} className={i % 2 ? 'md:pl-[16%]' : 'md:pr-[10%]'}>
            <ScrollWords text={pick(p)} />
          </div>
        ))}
      </div>
      <div ref={ref} className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {stats.map((s, i) => (
          <Stat key={s.label} {...s} i={i} start={inView} />
        ))}
      </div>
    </section>
  );
}
