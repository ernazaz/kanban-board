import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store';
import { PRIORITIES, PRIORITY_LABEL, PRIORITY_STYLE } from '@/lib/constants';

export function PriorityFilter() {
  // The array reference changes only when a priority is toggled, so no useShallow needed.
  const selected = useBoardStore((s) => s.priorities);
  const togglePriority = useBoardStore((s) => s.togglePriority);

  return (
    <div role="group" aria-label="Filter by priority" className="flex gap-1.5">
      {PRIORITIES.map((p) => {
        const active = selected.includes(p);
        return (
          <button
            key={p}
            type="button"
            aria-pressed={active}
            onClick={() => togglePriority(p)}
            className={cn(
              'h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors',
              active ? PRIORITY_STYLE[p] : 'border-border hover:bg-muted',
            )}
          >
            {PRIORITY_LABEL[p]}
          </button>
        );
      })}
    </div>
  );
}
