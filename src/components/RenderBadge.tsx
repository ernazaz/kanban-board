import { SHOW_RENDERS, useRenderCount } from '@/lib/useRenderCount';

/**
 * Renders whenever its parent renders, so its count = the parent's render count.
 * Visible only with `?renders` in the URL. In dev, StrictMode doubles each count.
 */
export function RenderBadge({ label }: { label: string }) {
  const count = useRenderCount();
  if (!SHOW_RENDERS) return null;
  return (
    <span
      data-testid={`renders-${label}`}
      title={`${label} renders`}
      className="rounded bg-fuchsia-600 px-1.5 font-mono text-[10px] leading-4 text-white"
    >
      {count}
    </span>
  );
}
