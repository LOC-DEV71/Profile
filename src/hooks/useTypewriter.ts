import { useEffect, useState } from 'react';

/** Gõ lần lượt từng dòng. Nếu reduced motion thì hiện ngay toàn bộ. */
export function useTypewriter(lines: string[], { speed = 28, lineDelay = 350, instant = false } = {}) {
  const [out, setOut] = useState<string[]>(instant ? lines : ['']);
  const [done, setDone] = useState(instant);
  const key = lines.join('\n');

  useEffect(() => {
    if (instant) {
      setOut(lines);
      setDone(true);
      return;
    }
    let line = 0;
    let char = 0;
    let timer = 0;
    setOut(['']);
    setDone(false);

    const tick = () => {
      if (line >= lines.length) {
        setDone(true);
        return;
      }
      char++;
      // Chụp giá trị hiện tại: updater của setState chạy sau, lúc đó line/char có thể đã đổi
      const li = line;
      const text = lines[li].slice(0, char);
      setOut((prev) => {
        const next = [...prev];
        next[li] = text;
        return next;
      });
      if (char >= lines[li].length) {
        line++;
        char = 0;
        if (line < lines.length) setOut((prev) => [...prev, '']);
        timer = window.setTimeout(tick, lineDelay);
      } else {
        timer = window.setTimeout(tick, speed);
      }
    };
    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, instant]);

  return { out, done };
}
