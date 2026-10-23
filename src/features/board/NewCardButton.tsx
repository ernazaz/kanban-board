import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RenderBadge } from '@/components/RenderBadge';
import { useHotkey } from '@/lib/useHotkey';
import { CardDialog } from './CardDialog';

/** Subscribes to nothing in the store — search keystrokes never re-render it. */
export function NewCardButton() {
  const [open, setOpen] = useState(false);
  useHotkey('n', useCallback(() => setOpen(true), []));

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> New card
        <RenderBadge label="new-card" />
      </Button>
      <CardDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
