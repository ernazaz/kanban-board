import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { RenderBadge } from '@/components/RenderBadge';
import { selectColumnTotal, selectVisibleCardIds, useBoardStore } from '@/store';
import type { ColumnId } from '@/store/types';
import { CardItem } from './CardItem';

/**
 * Subscribes to the ids of its visible cards. `useShallow` compares the arrays item by item,
 * so the column re-renders only when a card enters, leaves or changes position.
 */
export const Column = memo(function Column({ id, title }: { id: ColumnId; title: string }) {
  const ids = useBoardStore(useShallow(selectVisibleCardIds(id)));
  const total = useBoardStore(selectColumnTotal(id));
  const headingId = `column-${id}`;
  const filtered = ids.length !== total;

  return (
    <section
      aria-labelledby={headingId}
      data-testid={`column-${id}`}
      className="flex min-h-64 flex-col rounded-xl border border-border bg-muted/50 p-3"
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 id={headingId} className="font-semibold">
          {title}
        </h2>
        <div className="flex items-center gap-1.5">
          <RenderBadge label={`column-${id}`} />
          <span
            data-testid={`count-${id}`}
            className="rounded-full border border-border bg-background px-2 text-xs tabular-nums"
            aria-label={filtered ? `${ids.length} of ${total} cards shown` : `${total} cards`}
          >
            {filtered ? `${ids.length}/${total}` : total}
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-2">
        {ids.map((cardId) => (
          <CardItem key={cardId} id={cardId} />
        ))}
        {ids.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            {total === 0 ? 'No cards yet' : 'No cards match the filters'}
          </p>
        )}
      </div>
    </section>
  );
});
