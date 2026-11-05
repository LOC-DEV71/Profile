import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../data/projects';
import { lockScroll } from '../lib/scroll';
import { useLang } from '../i18n';
import { StatusDot } from './StatusDot';

type Props = { project: Project | null; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const { t, pick } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lockScroll(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Giữ focus bên trong modal
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      prevFocus?.focus();
    };
  }, [project, onClose]);

  // Portal ra body: main có z-index riêng (hiệu ứng footer) nên modal phải nằm ngoài
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[85] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface p-6 md:p-8"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs text-muted">
                  <StatusDot status={project.status} /> {project.version} · {project.status}
                </p>
                <h3 id="modal-title" className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  {project.name}
                </h3>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label={t('projects.close')}
                className="grid size-9 place-items-center rounded-md border border-line text-muted hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-4 text-muted">{pick(project.summary)}</p>

            <ol className="mt-6 space-y-5 border-l border-line pl-5">
              {(['problem', 'solution', 'architecture', 'learned'] as const).map((k, i) => (
                <li key={k} className="relative">
                  <span className="absolute -left-[25px] top-1.5 size-2 rounded-full border border-accent bg-surface" />
                  <p className="font-mono text-xs text-accent">
                    0{i + 1} · {t(`projects.${k}`)}
                  </p>
                  <p className="mt-1.5 leading-relaxed">{pick(project.detail[k])}</p>
                </li>
              ))}
            </ol>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.tech.map((x) => (
                <li key={x} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                  {x}
                </li>
              ))}
            </ul>

            {(project.demo || project.code) && (
              <div className="mt-6 flex gap-3">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-on-accent">
                    <ExternalLink size={14} /> {t('projects.demo')}
                  </a>
                )}
                {project.code && (
                  <a href={project.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-line px-3.5 py-2 text-sm">
                    <Github size={14} /> {t('projects.code')}
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
