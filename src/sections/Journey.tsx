import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { BigTitle } from '../components/BigTitle';
import { journey } from '../data/journey';
import { useLang } from '../i18n';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Journey() {
  const { t, pick } = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="journey" className="relative overflow-hidden border-y border-line bg-surface/30">
      <div className="mx-auto max-w-[1240px] px-5 py-28 md:px-8 md:py-36">
        <BigTitle index="04" label={t('nav.journey')} title={t('journey.title')} accentWord={1} subtitle={t('journey.subtitle')} />

        <ol ref={ref} className="relative">
          {/* trục: nền + phần đã vẽ theo cuộn */}
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-1/2" />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute bottom-0 left-[11px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-accent via-accent-2 to-accent-3 shadow-[0_0_16px_var(--accent)] md:left-1/2"
          />

          {journey.map((m, i) => {
            const right = i % 2 === 1;
            const last = i === journey.length - 1;
            return (
              <li key={m.title} className="relative grid pb-16 pl-12 last:pb-0 md:grid-cols-2 md:pl-0">
                <motion.span
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-35% 0px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`absolute left-[4px] top-2 grid size-4 place-items-center rounded-full border-2 md:left-1/2 md:-translate-x-1/2 ${
                    last ? 'dot-live border-online bg-online' : 'border-accent bg-bg'
                  }`}
                />
                <motion.div
                  initial={{ opacity: 0, x: right ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-25% 0px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className={right ? 'md:col-start-2 md:pl-14' : 'md:pr-14 md:text-right'}
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">{m.when}</p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{m.title}</h3>
                  <p className={`mt-3 max-w-md text-muted ${right ? '' : 'md:ml-auto'}`}>{pick(m.note)}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
