import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Moon, Sun, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useTheme } from '../hooks/useTheme';
import { useLang } from '../i18n';
import { Magnetic } from './Magnetic';

const SECTIONS = ['about', 'stack', 'projects', 'journey', 'contact'];

export function Navbar({ start }: { start: boolean }) {
  const active = useActiveSection(SECTIONS);
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useLang();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Ẩn khi cuộn xuống, hiện khi cuộn lên
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300);
    setScrolled(y > 40);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: start && !hidden ? 0 : -100 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-3 z-40 px-3"
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex h-14 max-w-[1100px] items-center gap-4 rounded-full border px-3 pl-5 transition-colors duration-500 ${
          scrolled ? 'border-line bg-bg/70 backdrop-blur-xl' : 'border-transparent'
        }`}
      >
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          L<span className="text-accent">.</span>C<span className="text-accent">.</span>L
        </a>

        <ul className="relative ml-auto hidden items-center md:flex">
          {SECTIONS.slice(0, 4).map((id) => (
            <li key={id} className="relative">
              {active === id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-surface-2" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <a
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={`relative block rounded-full px-4 py-2 text-sm transition-colors ${active === id ? 'text-fg' : 'text-muted hover:text-fg'}`}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="relative flex rounded-full border border-line p-0.5 font-mono text-xs" role="group" aria-label="Language">
            {(['vi', 'en'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`relative rounded-full px-2.5 py-1 uppercase ${lang === l ? 'text-on-accent' : 'text-muted hover:text-fg'}`}>
                {lang === l && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-accent" />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event('open-terminal'))}
            aria-label="Terminal (Ctrl+K)"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-fg sm:inline-flex"
          >
            <TerminalSquare size={14} /> ⌘K
          </button>
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
            className="grid size-9 place-items-center overflow-hidden rounded-full border border-line text-muted transition-colors hover:text-fg"
          >
            <motion.span key={theme} initial={{ y: 20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </motion.span>
          </button>
          <Magnetic className="hidden sm:inline-block">
            <a href="#contact" className="inline-block rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent hover:text-on-accent">
              {t('nav.contact')}
            </a>
          </Magnetic>
        </div>
      </nav>
    </motion.header>
  );
}
