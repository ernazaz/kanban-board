import { useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useHotkey } from '@/lib/useHotkey';
import { useBoardStore } from '@/store';

export function SearchInput() {
  const search = useBoardStore((s) => s.search);
  const setSearch = useBoardStore((s) => s.setSearch);
  const ref = useRef<HTMLInputElement>(null);

  useHotkey('/', useCallback(() => ref.current?.focus(), []));

  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        type="search"
        aria-label="Search cards by title"
        placeholder="Search titles…  ( / )"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && ref.current?.blur()}
        className="pl-8"
      />
    </div>
  );
}
