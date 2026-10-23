import { memo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RenderBadge } from '@/components/RenderBadge';
import { cn } from '@/lib/utils';
import { selectCard, useBoardStore } from '@/store';
import { CardDialog } from './CardDialog';
import { DeleteConfirm } from './DeleteConfirm';
import { PRIORITY_LABEL, PRIORITY_STYLE, neighbourColumn } from '@/lib/constants';

/**
 * Subscribes to its own card only. Editing or moving another card leaves this
 * card object untouched, so this component does not re-render.
 */
export const CardItem = memo(function CardItem({ id }: { id: string }) {
  const card = useBoardStore(selectCard(id));
  const moveCard = useBoardStore((s) => s.moveCard);
  const deleteCard = useBoardStore((s) => s.deleteCard);
  const [editing, setEditing] = useState(false);

  if (!card) return null;

  const prev = neighbourColumn(card.columnId, -1);
  const next = neighbourColumn(card.columnId, 1);

  return (
    <article
      aria-label={card.title}
      data-testid="card"
      className="group rounded-lg border border-border bg-background p-3 shadow-xs"
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="cursor-pointer text-left text-sm font-semibold break-words hover:underline"
        >
          {card.title}
        </button>
        <RenderBadge label={`card-${id}`} />
      </div>
      {card.description && <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>}

      <div className="mt-3 flex items-center justify-between">
        <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', PRIORITY_STYLE[card.priority])}>
          {PRIORITY_LABEL[card.priority]}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Move left"
            disabled={!prev}
            onClick={() => prev && moveCard(id, prev)}
          >
            <ArrowLeft className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Move right"
            disabled={!next}
            onClick={() => next && moveCard(id, next)}
          >
            <ArrowRight className="size-3.5" />
          </Button>
          <DeleteConfirm title={card.title} onConfirm={() => deleteCard(id)} />
        </div>
      </div>

      <CardDialog open={editing} onOpenChange={setEditing} card={card} />
    </article>
  );
});
