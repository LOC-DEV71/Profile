import type { ReactNode } from 'react';

/** Dải chạy ngang vô hạn (nội dung được nhân đôi để lặp liền mạch) */
export function Marquee({ children, reverse, duration = 40, className }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div className={`marquee-wrap overflow-hidden ${className ?? ''}`}>
      <div className={`marquee ${reverse ? 'reverse' : ''}`} style={{ ['--dur' as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
