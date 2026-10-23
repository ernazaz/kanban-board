import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBoardStore } from '@/store';

export const UNDO_WINDOW_MS = 5000;

export function UndoToast() {
  const lastDeleted = useBoardStore((s) => s.lastDeleted);
  if (!lastDeleted) return null;
  // Keyed by deletion time: a second delete restarts the countdown.
  return <Toast key={lastDeleted.deletedAt} title={lastDeleted.card.title} />;
}

function Toast({ title }: { title: string }) {
  const undoDelete = useBoardStore((s) => s.undoDelete);
  const clearLastDeleted = useBoardStore((s) => s.clearLastDeleted);
  const [secondsLeft, setSecondsLeft] = useState(UNDO_WINDOW_MS / 1000);

  useEffect(() => {
    const tick = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    const expire = setTimeout(clearLastDeleted, UNDO_WINDOW_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(expire);
    };
  }, [clearLastDeleted]);

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 z-30 flex w-80 max-w-[calc(100%-2rem)] items-center gap-3 rounded-lg border border-border bg-foreground px-4 py-3 text-sm text-background shadow-lg"
    >
      <span className="min-w-0 flex-1 truncate">
        Deleted <strong>{title}</strong>
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="text-background hover:bg-background/15"
        onClick={undoDelete}
      >
        Undo
      </Button>
      <span className="w-5 text-right text-xs tabular-nums opacity-70">{secondsLeft}s</span>
    </div>
  );
}
