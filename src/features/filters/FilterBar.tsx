import { Button } from '@/components/ui/button';
import { selectHasActiveFilters, useBoardStore } from '@/store';
import { PriorityFilter } from './PriorityFilter';
import { SearchInput } from './SearchInput';
import { SortSelect } from './SortSelect';

/** Each child subscribes to its own field, so typing re-renders only SearchInput and the columns. */
export function FilterBar() {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-3">
      <SearchInput />
      <PriorityFilter />
      <ClearFilters />
      <div className="ml-auto">
        <SortSelect />
      </div>
    </div>
  );
}

function ClearFilters() {
  const active = useBoardStore(selectHasActiveFilters);
  const resetFilters = useBoardStore((s) => s.resetFilters);
  if (!active) return null;
  return (
    <Button variant="ghost" size="sm" onClick={resetFilters}>
      Clear filters
    </Button>
  );
}
