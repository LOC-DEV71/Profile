import { Marquee } from '../components/Marquee';
import { stack } from '../data/stack';

const all = stack.flatMap((l) => l.items);
const half = Math.ceil(all.length / 2);

function Row({ items, outline }: { items: string[]; outline?: boolean }) {
  return (
    <>
      {items.map((x) => (
        <span key={x} className="flex items-center">
          <span className={`whitespace-nowrap px-6 font-display text-4xl font-bold tracking-tight md:text-6xl ${outline ? 'text-outline' : 'text-fg'}`}>{x}</span>
          <span className="text-2xl text-accent md:text-3xl">✦</span>
        </span>
      ))}
    </>
  );
}

export function TechMarquee() {
  return (
    <div aria-hidden className="relative -my-6 select-none space-y-3 py-10">
      <div className="-rotate-2 border-y border-line bg-surface/60 py-4 backdrop-blur">
        <Marquee duration={50}>
          <Row items={all.slice(0, half)} />
        </Marquee>
      </div>
      <div className="rotate-1 py-2">
        <Marquee duration={60} reverse>
          <Row items={all.slice(half)} outline />
        </Marquee>
      </div>
    </div>
  );
}
