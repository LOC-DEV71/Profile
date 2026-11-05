import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

type Props = { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' };

/** Khối hiện dần khi cuộn tới; các con dùng <RevealItem> sẽ xuất hiện lần lượt cách nhau 60ms */
export function Reveal({ children, className, as = 'div' }: Props) {
  const M = motion[as];
  return (
    <M className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
      {children}
    </M>
  );
}

type ItemProps = { children: ReactNode; className?: string; as?: 'div' | 'li' };

export function RevealItem({ children, className, as = 'div' }: ItemProps) {
  const M = motion[as];
  return (
    <M className={className} variants={item}>
      {children}
    </M>
  );
}
