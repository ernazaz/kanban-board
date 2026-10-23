import { Board } from '@/features/board/Board';
import { NewCardButton } from '@/features/board/NewCardButton';
import { FilterBar } from '@/features/filters/FilterBar';
import { UndoToast } from '@/features/undo/UndoToast';
import { SHOW_RENDERS } from '@/lib/useRenderCount';

/** Layout only. No store subscriptions here, so App renders once. */
export function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 md:p-8">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Kanban</h1>
        <p className="text-xs text-muted-foreground">
          <kbd className="rounded border border-border px-1">n</kbd> new card ·{' '}
          <kbd className="rounded border border-border px-1">/</kbd> search
          {SHOW_RENDERS && ' · render counters on'}
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3">
        <FilterBar />
        <NewCardButton />
      </div>
      <main>
        <Board />
      </main>
      <UndoToast />
    </div>
  );
}
