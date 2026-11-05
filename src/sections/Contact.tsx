import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Magnetic } from '../components/Magnetic';
import { Marquee } from '../components/Marquee';
import { profile } from '../data/profile';
import { useLang } from '../i18n';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = t('contact.errName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('contact.errEmail');
    if (form.message.trim().length < 10) e.message = t('contact.errMessage');
    return e;
  };

  // Không cần backend: mở ứng dụng email với nội dung điền sẵn.
  // Muốn gửi thẳng, thay bằng fetch tới Formspree/Resend/API của bạn.
  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const subject = encodeURIComponent(`[Portfolio] ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} <${form.email}>`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const field = (k: 'name' | 'email' | 'message', type = 'text') => {
    const err = errors[k];
    const cls = `peer w-full border-0 border-b bg-transparent px-0 pb-3 pt-6 text-base outline-none transition-colors focus:border-accent ${err ? 'border-red-500/70' : 'border-line'}`;
    const filled = form[k].length > 0;
    return (
      <div className="relative">
        {k === 'message' ? (
          <textarea
            id={`f-${k}`}
            rows={4}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            aria-invalid={!!err}
            aria-describedby={err ? `e-${k}` : undefined}
            className={`${cls} resize-none`}
          />
        ) : (
          <input
            id={`f-${k}`}
            type={type}
            autoComplete={k === 'email' ? 'email' : 'name'}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            aria-invalid={!!err}
            aria-describedby={err ? `e-${k}` : undefined}
            className={cls}
          />
        )}
        <label
          htmlFor={`f-${k}`}
          className={`pointer-events-none absolute left-0 font-mono text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-accent ${
            filled ? 'top-0 text-[11px]' : 'top-6 text-sm'
          }`}
        >
          {t(`contact.${k}`)}
        </label>
        {err && (
          <p id={`e-${k}`} className="mt-1.5 text-xs text-red-400">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contact" className="relative overflow-hidden pt-28 md:pt-36">
      <div aria-hidden className="blob bottom-[-20%] left-[30%] size-[600px] bg-accent !opacity-20" />

      {/* chữ lớn chạy ngang */}
      <div aria-hidden className="select-none">
        <Marquee duration={30}>
          {[0, 1].map((k) => (
            <span key={k} className="flex items-center">
              <span className="whitespace-nowrap px-8 font-display text-[clamp(4rem,12vw,11rem)] font-bold leading-none tracking-[-0.05em]">{t('contact.big')}</span>
              <span className="text-aurora font-display text-[clamp(3rem,8vw,7rem)]">✦</span>
              <span className="text-outline whitespace-nowrap px-8 font-display text-[clamp(4rem,12vw,11rem)] font-bold leading-none tracking-[-0.05em]">{t('contact.big')}</span>
              <span className="text-aurora font-display text-[clamp(3rem,8vw,7rem)]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative mx-auto grid max-w-[1240px] gap-16 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-accent">05</span>
            <span className="h-px w-10 bg-line" />
            {t('nav.contact')}
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl">{t('contact.title')}</h2>
          <p className="mt-5 max-w-md text-lg text-muted">{t('contact.subtitle')}</p>

          <Magnetic className="mt-10" strength={0.2}>
            <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-3 font-display text-xl font-semibold md:text-2xl">
              <span className="relative">
                {profile.email}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </span>
              <ArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </Magnetic>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-fg" aria-live="polite">
              {copied ? <Check size={15} className="text-online" /> : <Copy size={15} />}
              {copied ? t('contact.copied') : t('contact.copy')}
            </button>
            <Magnetic>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:bg-accent hover:text-on-accent">
                <Github size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:bg-accent hover:text-on-accent">
                <Linkedin size={18} />
              </a>
            </Magnetic>
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="space-y-6 rounded-3xl border border-line bg-surface/70 p-7 backdrop-blur md:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {field('name')}
            {field('email', 'email')}
          </div>
          {field('message')}
          <Magnetic className="w-full" strength={0.12}>
            <button type="submit" className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-fg px-6 py-4 text-sm font-semibold text-bg">
              <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
              <Send size={16} className="relative transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
              <span className="relative">{t('contact.send')}</span>
            </button>
          </Magnetic>
          <p className="min-h-4 text-center text-xs text-online" role="status">
            {sent ? t('contact.opened') : ''}
          </p>
        </motion.form>
      </div>
    </section>
  );
}
