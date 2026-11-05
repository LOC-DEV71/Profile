import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const current = (): Theme => (document.documentElement.classList.contains('light') ? 'light' : 'dark');

/** Đặt theme từ bất kỳ đâu (navbar, terminal…) */
export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* ignore */
  }
}

export function useTheme() {
  const [theme, set] = useState<Theme>(current);

  // Đồng bộ khi theme bị đổi ở nơi khác
  useEffect(() => {
    const mo = new MutationObserver(() => set(current()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
