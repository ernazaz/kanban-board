import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input, Label, Textarea } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store';
import { TITLE_MAX_LENGTH } from '@/store/cardsSlice';
import type { Card, ColumnId, Priority } from '@/store/types';
import { COLUMNS, PRIORITIES, PRIORITY_LABEL, PRIORITY_STYLE } from '@/lib/constants';

interface CardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a card to edit it; omit to create a new one. */
  card?: Card;
}

export function CardDialog({ open, onOpenChange, card }: CardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={card ? 'Edit card' : 'New card'}>
        {/* Mounting the form only while open resets its fields every time. */}
        {open && <CardForm card={card} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function CardForm({ card, onDone }: { card?: Card; onDone: () => void }) {
  // Actions are stable references, so these subscriptions never cause a re-render.
  const addCard = useBoardStore((s) => s.addCard);
  const updateCard = useBoardStore((s) => s.updateCard);

  const [title, setTitle] = useState(card?.title ?? '');
  const [description, setDescription] = useState(card?.description ?? '');
  const [priority, setPriority] = useState<Priority>(card?.priority ?? 'medium');
  const [columnId, setColumnId] = useState<ColumnId>('todo');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (card) updateCard(card.id, { title, description, priority });
    else addCard({ title, description, priority }, columnId);
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="card-title">Title</Label>
          <span className="text-xs text-muted-foreground">
            {title.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>
        <Input
          id="card-title"
          autoFocus
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          aria-invalid={!!error}
          aria-describedby={error ? 'card-title-error' : undefined}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
        />
        {error && (
          <p id="card-title-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="card-description">Description</Label>
        <Textarea id="card-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Priority</legend>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <label
              key={p}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                priority === p ? PRIORITY_STYLE[p] : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={priority === p}
                onChange={() => setPriority(p)}
                className="sr-only"
              />
              {PRIORITY_LABEL[p]}
            </label>
          ))}
        </div>
      </fieldset>

      {!card && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="card-column">Column</Label>
          <select
            id="card-column"
            value={columnId}
            onChange={(e) => setColumnId(e.target.value as ColumnId)}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">{card ? 'Save' : 'Create card'}</Button>
      </div>
    </form>
  );
}
