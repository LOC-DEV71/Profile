import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { journey } from '../data/journey';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { stack } from '../data/stack';
import { setTheme } from '../hooks/useTheme';
import { useLang } from '../i18n';
import { lockScroll } from '../lib/scroll';

type Line = { id: number; node: ReactNode };

const COMMANDS = ['help', 'whoami', 'about', 'projects', 'open', 'stack', 'journey', 'contact', 'email', 'github', 'linkedin', 'goto', 'theme', 'lang', 'date', 'echo', 'clear', 'sudo', 'exit'];
const SECTIONS = ['about', 'stack', 'projects', 'journey', 'contact'];

/** Bắn pháo giấy cho lệnh sudo hire-me */
function Confetti() {
  const colors = ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)', 'var(--online)', '#f472b6'];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      {Array.from({ length: 90 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 900;
        const y = -200 - Math.random() * 500;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-3 w-1.5 rounded-sm"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x, y: [y, y + 900], rotate: Math.random() * 720, opacity: [1, 1, 0] }}
            transition={{ duration: 2.2 + Math.random(), ease: [0.1, 0.6, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}

/** Terminal tương tác: Ctrl/⌘ + K hoặc phím ` để mở */
export function Terminal() {
  const { lang, pick, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [boom, setBoom] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const vi = lang === 'vi';
  const print = (...nodes: ReactNode[]) => setLines((l) => [...l, ...nodes.map((node) => ({ id: idRef.current++, node }))]);

  const banner = () => [
    <pre key="b" className="text-accent leading-tight">{String.raw` _                  ___ _    _   _
| |   __ _ _ __    / __| |_ (_) | |   ___  __
| |__/ _' | '  \  | (__| ' \| | | |__/ _ \/ _|
|____\__,_|_|_|_|  \___|_||_|_| |____\___/\__|`}</pre>,
    <span key="w" className="text-muted">
      {vi ? 'Chào mừng tới terminal của ' : 'Welcome to the terminal of '}
      <span className="text-fg">{profile.name}</span>. {vi ? 'Gõ ' : 'Type '}
      <span className="text-accent">help</span> {vi ? 'để bắt đầu.' : 'to start.'}
    </span>,
  ];

  // mở/đóng
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '`' && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-terminal', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-terminal', onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    if (lines.length === 0) print(...banner());
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      lockScroll(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const goto = (id: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const run = (raw: string) => {
    const cmdline = raw.trim();
    print(
      <span>
        <span className="text-online">visitor@lcl</span>:<span className="text-accent">~</span>$ {cmdline}
      </span>,
    );
    if (!cmdline) return;
    setHistory((h) => [cmdline, ...h].slice(0, 50));
    setHIdx(-1);
    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        print(
          ...([
            ['whoami', vi ? 'tôi là ai' : 'who am I'],
            ['about', vi ? 'giới thiệu' : 'about me'],
            ['projects', vi ? 'danh sách dự án' : 'list projects'],
            ['open <n|id>', vi ? 'chi tiết một dự án' : 'project details'],
            ['stack', vi ? 'công nghệ theo tầng' : 'tech by layer'],
            ['journey', vi ? 'hành trình' : 'timeline'],
            ['contact', vi ? 'thông tin liên hệ' : 'contact info'],
            ['email | github | linkedin', vi ? 'mở liên kết' : 'open a link'],
            ['goto <section>', SECTIONS.join(' · ')],
            ['theme <dark|light>', vi ? 'đổi giao diện' : 'switch theme'],
            ['lang <vi|en>', vi ? 'đổi ngôn ngữ' : 'switch language'],
            ['clear · exit', vi ? 'xoá màn hình · đóng' : 'clear · close'],
          ] as const).map(([c, d]) => (
            <span>
              <span className="inline-block w-56 text-accent">{c}</span>
              <span className="text-muted">{d}</span>
            </span>
          )),
          <span className="text-muted">{vi ? '💡 thử: ' : '💡 try: '}<span className="text-accent-3">sudo hire-me</span></span>,
        );
        break;
      case 'whoami':
        print(
          <span className="text-fg">{profile.name}</span>,
          <span className="text-accent">{pick(profile.role)}</span>,
          <span className="text-muted">{pick(profile.tagline)}</span>,
        );
        break;
      case 'about':
        print(...profile.about.map((p) => <span className="text-muted">{pick(p)}</span>));
        break;
      case 'ls':
      case 'projects':
        print(
          ...projects.map((p, i) => (
            <span>
              <span className="text-muted">{String(i + 1).padStart(2, '0')} </span>
              <span className={p.status === 'live' ? 'text-online' : 'text-accent'}>● </span>
              <span className="inline-block w-56 text-fg">{p.name}</span>
              <span className="text-muted">{p.version} · {p.status}</span>
            </span>
          )),
          <span className="text-muted">→ open 1</span>,
        );
        break;
      case 'open': {
        const p = projects[Number(arg) - 1] ?? projects.find((x) => x.id === arg.toLowerCase());
        if (!p) {
          print(<span className="text-red-400">open: {vi ? 'không tìm thấy dự án' : 'project not found'} "{arg}"</span>);
          break;
        }
        print(
          <span className="text-fg">
            {p.name} <span className="text-muted">{p.version} · {p.status}</span>
          </span>,
          <span className="text-muted">{pick(p.summary)}</span>,
          <span>
            <span className="text-accent">arch</span> <span className="text-muted">{pick(p.detail.architecture)}</span>
          </span>,
          <span className="text-accent-2">[{p.tech.join(', ')}]</span>,
        );
        break;
      }
      case 'stack':
        print(
          ...stack.map((l) => (
            <span>
              <span className="inline-block w-44 text-accent">{pick(l.label)}</span>
              <span className="text-muted">{l.items.join(' · ')}</span>
            </span>
          )),
        );
        break;
      case 'journey':
        print(
          ...journey.map((m) => (
            <span>
              <span className="inline-block w-24 text-accent">{m.when}</span>
              <span className="inline-block w-44 text-fg">{m.title}</span>
              <span className="text-muted">{pick(m.note)}</span>
            </span>
          )),
        );
        break;
      case 'contact':
        print(
          <span>email    <span className="text-accent">{profile.email}</span></span>,
          <span>github   <span className="text-accent">{profile.github}</span></span>,
          <span>linkedin <span className="text-accent">linkedin.com/in/lâm-chí-lộc</span></span>,
        );
        break;
      case 'email':
        window.location.href = `mailto:${profile.email}`;
        print(<span className="text-online">✓ mailto:{profile.email}</span>);
        break;
      case 'github':
      case 'linkedin':
        window.open(cmd === 'github' ? profile.github : profile.linkedin, '_blank', 'noopener');
        print(<span className="text-online">✓ {vi ? 'đã mở' : 'opened'} {cmd}</span>);
        break;
      case 'cd':
      case 'goto':
        if (SECTIONS.includes(arg)) goto(arg);
        else print(<span className="text-red-400">goto: {SECTIONS.join(' | ')}</span>);
        break;
      case 'theme':
        if (arg === 'dark' || arg === 'light') {
          setTheme(arg);
          print(<span className="text-online">✓ theme → {arg}</span>);
        } else print(<span className="text-red-400">theme: dark | light</span>);
        break;
      case 'lang':
        if (arg === 'vi' || arg === 'en') {
          setLang(arg);
          print(<span className="text-online">✓ lang → {arg}</span>);
        } else print(<span className="text-red-400">lang: vi | en</span>);
        break;
      case 'date':
        print(<span className="text-muted">{new Date().toLocaleString(vi ? 'vi-VN' : 'en-US', { timeZone: 'Asia/Ho_Chi_Minh' })} (GMT+7)</span>);
        break;
      case 'echo':
        print(<span>{arg}</span>);
        break;
      case 'sudo':
        if (arg === 'hire-me' || arg === 'hire me') {
          setBoom((b) => b + 1);
          print(
            <span className="text-online">[sudo] {vi ? 'đã cấp quyền' : 'permission granted'} ✨</span>,
            <span className="text-fg">{vi ? 'Cảm ơn bạn! Đang mở email…' : 'Thank you! Opening email…'}</span>,
          );
          setTimeout(() => (window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Hello Lộc 👋')}`), 1400);
        } else print(<span className="text-red-400">{vi ? 'visitor không có trong sudoers. Sự việc này sẽ được báo cáo 🙂' : 'visitor is not in the sudoers file. This incident will be reported 🙂'}</span>);
        break;
      case 'rm':
        print(<span className="text-red-400">{vi ? 'đừng mà 😅' : 'nice try 😅'}</span>);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        setOpen(false);
        break;
      default:
        print(<span className="text-red-400">{cmd}: command not found. {vi ? 'Gõ' : 'Type'} <span className="text-accent">help</span></span>);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIdx + 1);
      if (history[i]) {
        setHIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(Math.max(-1, i));
      setInput(i >= 0 ? history[i] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const m = COMMANDS.filter((c) => c.startsWith(input.toLowerCase()));
      if (m.length === 1) setInput(m[0] + ' ');
      else if (m.length > 1) print(<span className="text-muted">{m.join('  ')}</span>);
    }
  };

  return (
    <>
      {boom > 0 && <Confetti key={boom} />}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Terminal"
              initial={{ opacity: 0, y: 30, scale: 0.96, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.focus();
              }}
              className="flex h-[min(560px,80vh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-bg/95 shadow-[0_40px_120px_-20px_rgba(79,140,255,0.35)]"
              style={{ transformPerspective: 1200 }}
            >
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <button aria-label="Close" onClick={() => setOpen(false)} className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-auto font-mono text-[11px] text-muted">visitor@lcl — zsh — esc {vi ? 'để đóng' : 'to close'}</span>
              </div>
              <div ref={bodyRef} data-lenis-prevent className="flex-1 space-y-1 overflow-y-auto p-5 font-mono text-[13px] leading-6">
                {lines.map((l) => (
                  <div key={l.id} className="whitespace-pre-wrap break-words">
                    {l.node}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span>
                    <span className="text-online">visitor@lcl</span>:<span className="text-accent">~</span>$
                  </span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    aria-label="Command"
                    className="flex-1 bg-transparent text-fg caret-accent outline-none focus-visible:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
