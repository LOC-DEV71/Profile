import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { Terminal } from './components/Terminal';
import { useLang } from './i18n';
import { initSmoothScroll, lockScroll } from './lib/scroll';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Journey } from './sections/Journey';
import { Projects } from './sections/Projects';
import { Stack } from './sections/Stack';
import { TechMarquee } from './sections/TechMarquee';

const skipIntro = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || sessionStorage.getItem('booted') === '1';

export default function App() {
  const { t } = useLang();
  const [loading, setLoading] = useState(() => !skipIntro());

  useEffect(() => initSmoothScroll(), []);
  useEffect(() => {
    lockScroll(loading);
    if (!loading) sessionStorage.setItem('booted', '1');
  }, [loading]);

  const done = useCallback(() => setLoading(false), []);

  return (
    // reducedMotion="user": tự tắt chuyển động khi hệ điều hành bật "giảm chuyển động"
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <a href="#main" className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t('skip')}
      </a>
      <ScrollProgress />
      <Cursor />
      <Terminal />
      <Navbar start={!loading} />
      {/* main nằm trên footer (z-10, có nền) để tạo hiệu ứng màn kéo */}
      <main id="main" className="relative z-10 bg-bg shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
        <Hero start={!loading} />
        <TechMarquee />
        <About />
        <Stack />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
