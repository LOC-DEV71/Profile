import { motion } from 'framer-motion';

type Props = { index: string; label: string; title: string; accentWord?: number; subtitle?: string; className?: string };

/** Tiêu đề section cỡ lớn: từng từ trượt lên từ dưới mặt nạ */
export function BigTitle({ index, label, title, accentWord, subtitle, className }: Props) {
  const words = title.split(' ');
  return (
    <div className={`mb-12 md:mb-16 ${className ?? ''}`}>
      <motion.p
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted"
      >
        <span className="text-accent">{index}</span>
        <span className="h-px w-10 bg-line" />
        {label}
      </motion.p>
      <h2 className="mt-5 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
        {words.map((w, i) => (
          <span key={i} className="-my-[0.15em] inline-block overflow-hidden py-[0.15em] align-bottom">
            <motion.span
              className={`inline-block ${i === accentWord ? 'text-aurora' : ''}`}
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
              {i < words.length - 1 && ' '}
            </motion.span>
          </span>
        ))}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-5 max-w-xl text-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
