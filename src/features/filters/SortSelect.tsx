import { useBoardStore } from '@/store';
import type { SortBy } from '@/store/types';

const OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority', label: 'Priority' },
];

export function SortSelect() {
  const sortBy = useBoardStore((s) => s.sortBy);
  const setSortBy = useBoardStore((s) => s.setSortBy);

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Sort</span>
      <select
        aria-label="Sort cards"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
        className="h-9 cursor-pointer rounded-md border border-border bg-background px-2 text-sm"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
