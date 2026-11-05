import type { Project } from '../data/projects';

/** Màu riêng cho từng dự án */
export const HUES: Record<string, [string, string]> = {
  creatorai: ['#4f8cff', '#a78bfa'],
  florenx: ['#f472b6', '#fb923c'],
  voice: ['#22d3ee', '#4f8cff'],
  chitieu: ['#3ddc97', '#22d3ee'],
  hkdn: ['#f59e0b', '#ef4444'],
  ambient: ['#a78bfa', '#f472b6'],
  stylewindow: ['#60a5fa', '#3ddc97'],
};
export const hueOf = (id: string) => HUES[id] ?? ['#4f8cff', '#22d3ee'];

/**
 * Hình minh họa dự án: lưới gradient chuyển động + chữ viết tắt lớn + khung app.
 * Có ảnh thật thì đặt `image` trong projects.ts.
 */
export function ProjectVisual({ project, className = '' }: { project: Project; className?: string }) {
  const [a, b] = hueOf(project.id);

  if (project.image) {
    return <img src={project.image} alt="" loading="lazy" decoding="async" className={`size-full object-cover ${className}`} />;
  }

  const initials = project.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <div aria-hidden className={`relative overflow-hidden bg-bg ${className}`}>
      <div className="blob left-[-20%] top-[-30%] size-[70%] !opacity-60 transition-transform duration-1000 group-hover:translate-x-10" style={{ background: a }} />
      <div className="blob bottom-[-30%] right-[-20%] size-[70%] !opacity-50 transition-transform duration-1000 group-hover:-translate-x-10" style={{ background: b, animationDelay: '-7s' }} />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <span className="absolute -bottom-[0.18em] -right-[0.05em] font-display text-[clamp(7rem,16vw,13rem)] font-bold leading-none tracking-tighter text-white/10 transition-transform duration-700 group-hover:-translate-y-3">
        {initials}
      </span>
      {/* khung app */}
      <div className="absolute left-[8%] top-[14%] w-[62%] rounded-lg border border-white/15 bg-black/40 shadow-2xl backdrop-blur-md transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
        <div className="flex items-center gap-1 border-b border-white/10 px-2.5 py-1.5">
          <span className="size-1.5 rounded-full bg-white/30" />
          <span className="size-1.5 rounded-full bg-white/30" />
          <span className="size-1.5 rounded-full bg-white/30" />
          <span className="ml-2 font-mono text-[9px] text-white/60">{project.id}.app</span>
        </div>
        <div className="space-y-1.5 p-2.5">
          <div className="h-1.5 w-1/3 rounded" style={{ background: a }} />
          <div className="h-1.5 w-3/4 rounded bg-white/20" />
          <div className="h-1.5 w-1/2 rounded bg-white/15" />
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="h-6 rounded bg-white/10" />
            <div className="h-6 rounded bg-white/10" />
            <div className="h-6 rounded" style={{ background: `${b}55` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
