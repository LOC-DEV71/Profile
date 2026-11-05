import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BigTitle } from '../components/BigTitle';
import { StatusDot } from '../components/StatusDot';
import { TagSphere } from '../components/TagSphere';
import { projects } from '../data/projects';
import { stack } from '../data/stack';
import { useLang } from '../i18n';

function projectsUsing(tech: string) {
  return projects.filter((p) => p.tech.includes(tech) || (tech === 'Node.js' && p.tech.includes('Express'))).map((p) => p.id);
}

const ALL = stack.flatMap((l) => l.items);
const EASE = [0.22, 1, 0.36, 1] as const;

export function Stack() {
  const { t, pick } = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const lit = hover ? projectsUsing(hover) : [];

  return (
    <section id="stack" className="relative overflow-hidden border-y border-line bg-surface/30">
      <div aria-hidden className="blob right-[-15%] top-[10%] size-[420px] bg-accent-2 !opacity-15" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-28 md:px-8 md:py-36">
        <BigTitle index="02" label="stack" title={t('stack.title')} accentWord={1} subtitle={t('stack.subtitle')} />

        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Quả cầu + dự án đang sáng */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }}>
              <TagSphere items={ALL} active={hover} onHover={setHover} className="mx-auto max-w-[540px]" />
            </motion.div>

            <div className="mt-4 rounded-2xl border border-line bg-bg/70 p-4 backdrop-blur">
              <p id="stack-used" className="mb-3 h-5 font-mono text-[11px] text-muted" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.span key={hover ?? 'idle'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-block">
                    {hover ? (
                      <>
                        <span className="text-accent">{hover}</span> {t('stack.usedIn')} {lit.length}
                      </>
                    ) : (
                      '$ systemctl list-units  # drag the sphere ↻'
                    )}
                  </motion.span>
                </AnimatePresence>
              </p>
              <ul className="flex flex-wrap gap-2">
                {projects.map((p) => {
                  const on = lit.includes(p.id);
                  const dim = hover && !on;
                  return (
                    <motion.li
                      key={p.id}
                      animate={{ opacity: dim ? 0.25 : 1, scale: on ? 1.06 : 1 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${on ? 'border-accent bg-accent/15' : 'border-line'}`}
                    >
                      <StatusDot status={p.status} />
                      {p.name}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Các tầng */}
          <ol className="border-t border-line">
            {stack.map((layer, i) => (
              <motion.li
                key={layer.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
                className="group relative border-b border-line py-6"
              >
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-accent/10 to-transparent transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
                <div className="relative mb-3 flex items-baseline gap-4">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2">{pick(layer.label)}</h3>
                  <span className="ml-auto font-mono text-[11px] text-muted">{layer.items.length}</span>
                </div>
                <ul className="relative flex flex-wrap gap-2 pl-8">
                  {layer.items.map((x) => {
                    const used = projectsUsing(x).length;
                    const active = hover === x;
                    return (
                      <li key={x}>
                        <button
                          type="button"
                          onMouseEnter={() => setHover(x)}
                          onMouseLeave={() => setHover(null)}
                          onFocus={() => setHover(x)}
                          onBlur={() => setHover(null)}
                          aria-describedby="stack-used"
                          className={`rounded-full border px-3 py-1 font-mono text-xs transition-all duration-300 ${
                            active ? 'scale-110 border-accent bg-accent text-on-accent shadow-[0_0_24px_-4px_var(--accent)]' : 'border-line bg-bg/60 text-muted hover:border-accent/60 hover:text-fg'
                          }`}
                        >
                          {x}
                          {used > 0 && <sup className={`ml-1 text-[9px] ${active ? '' : 'text-accent'}`}>{used}</sup>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
