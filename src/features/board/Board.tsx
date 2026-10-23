import { COLUMNS } from '@/lib/constants';
import { Column } from './Column';

/** Layout only — subscribes to nothing, so it never re-renders after mount. */
export function Board() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((c) => (
        <Column key={c.id} id={c.id} title={c.title} />
      ))}
    </div>
  );
}
