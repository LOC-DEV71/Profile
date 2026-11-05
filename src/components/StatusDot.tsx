type Props = { status: 'live' | 'in progress' | 'online' };

export function StatusDot({ status }: Props) {
  const live = status !== 'in progress';
  return (
    <span
      aria-hidden
      className={`inline-block size-2 shrink-0 rounded-full ${live ? 'dot-live bg-online' : 'bg-accent'}`}
    />
  );
}
