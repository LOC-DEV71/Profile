import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { useLang } from '../i18n';

// Ngày build được Vite chèn vào lúc build (xem vite.config.ts)
declare const __BUILD_DATE__: string;

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
}

/**
 * Footer "màn kéo": nằm dính dưới đáy (sticky) phía sau nội dung,
 * main có nền và z-index cao hơn nên khi cuộn hết, main trượt lên để lộ footer.
 */
export function Footer() {
  const { t, lang } = useLang();
  const time = useClock();
  const words = profile.name.toUpperCase().split(' ');

  return (
    <footer className="sticky bottom-0 z-0 overflow-hidden bg-bg">
      <div aria-hidden className="blob bottom-[-40%] left-[20%] size-[700px] bg-accent !opacity-25" />
      <div aria-hidden className="blob bottom-[-50%] right-[0%] size-[500px] bg-accent-3 !opacity-20" style={{ animationDelay: '-9s' }} />
      <div className="relative mx-auto flex min-h-[80vh] max-w-[1240px] flex-col justify-between px-5 pb-8 pt-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{lang === 'vi' ? 'Giờ địa phương' : 'Local time'}</p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
              {time} <span className="text-sm text-muted">GMT+7</span>
            </p>
            <p className="mt-1 text-sm text-muted">{lang === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City'}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Socials</p>
            <ul className="mt-3 space-y-2">
              {[
                { href: `mailto:${profile.email}`, icon: Mail, label: profile.email },
                { href: profile.github, icon: Github, label: 'GitHub' },
                { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group inline-flex items-center gap-2 hover:text-accent">
                    <Icon size={15} /> <span className="relative">{label}<span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:text-right">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Terminal</p>
            <button onClick={() => window.dispatchEvent(new Event('open-terminal'))} className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-sm hover:border-accent hover:text-accent">
              $ sudo hire-me
            </button>
          </div>
        </div>

        {/* tên khổng lồ */}
        <div aria-hidden className="my-10 select-none">
          <p className="whitespace-nowrap py-[0.12em] text-center font-display text-[clamp(2.6rem,11.2vw,11rem)] font-bold leading-none tracking-[-0.06em]">
            {words.map((w, i) => (
              <span key={i} className={`inline-block ${i === words.length - 1 ? 'text-aurora' : i % 2 ? 'text-outline' : ''}`}>
                {w}
                {i < words.length - 1 && ' '}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-6 font-mono text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="flex items-center gap-2">
            <span className="dot-live size-1.5 rounded-full bg-online" />
            {t('footer.built')} · {t('footer.deploy')} {__BUILD_DATE__}
          </p>
          <a href="#top" className="group inline-flex items-center gap-2 hover:text-fg">
            back to top <ArrowUp size={14} className="transition-transform group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
