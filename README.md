# Kanban · React + Zustand

A small Kanban board where all client state lives in one Zustand store, built from slices.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Radix (dialog, alert dialog), Zustand 5, Vitest, Playwright.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # store + selector unit tests (Vitest)
npx playwright install chromium
npm run test:e2e     # builds, serves on :4173, runs the E2E specs
```

Open `http://localhost:5173/?renders` to show render counters (pink badges) on the New card button, every column and every card. In dev, StrictMode renders twice, so counts go up by 2; in `npm run build && npm run preview` they go up by 1.

Shortcuts: <kbd>n</kbd> opens a new card, <kbd>/</kbd> focuses search.

## Features

| Feature | Where |
| --- | --- |
| 3 fixed columns with counts (`shown/total` when filtered) | `features/board/Column.tsx` |
| Create / edit (dialog, title required, max 80) | `features/board/CardDialog.tsx` |
| Delete with confirmation | `features/board/DeleteConfirm.tsx` |
| Move between columns (← →) | `features/board/CardItem.tsx` |
| Search, multi-priority filter, sort (newest, oldest, priority) | `features/filters/*`, `store/selectors.ts` |
| Cards persist, filters don't (`partialize`) | `store/index.ts` |
| Slices pattern | `store/cardsSlice.ts`, `store/filtersSlice.ts` |
| Named devtools actions (`cards/add`, `cards/move`, …) | every `set(..., false, 'name')` call |
| Single-level undo toast, 5 s | `features/undo/UndoToast.tsx` |
| Store unit tests (no React) | `src/store/__tests__/` |
| E2E: create → move to Done → reload | `e2e/board.spec.ts` |
| Keyboard shortcuts | `lib/useHotkey.ts` |

## Structure

```text
src/
├── app/                 # main.tsx, App.tsx (layout only), index.css
├── features/
│   ├── board/           # Board, Column, CardItem, CardDialog, DeleteConfirm, NewCardButton
│   ├── filters/         # FilterBar, SearchInput, PriorityFilter, SortSelect
│   └── undo/            # UndoToast
├── store/               # index.ts, cardsSlice, filtersSlice, selectors, types, __tests__/
├── components/          # ui/ (button, input, dialog primitives), RenderBadge
└── lib/                 # constants, useHotkey, useRenderCount, utils
e2e/board.spec.ts
```

Rules: components never call `set`; selectors are pure functions in `store/selectors.ts`; `components/ui` never imports the store; feature folders don't import each other (shared constants live in `lib/`, `App` composes the features).

## How re-renders are kept down

- **Cards are normalised** (`cardsById: Record<string, Card>`). Editing card A creates a new object for A only; every other card keeps its reference.
- **`CardItem` subscribes to its own card** (`selectCard(id)`) and is wrapped in `memo`. Moving or editing another card doesn't re-render it.
- **`Column` subscribes to an array of ids** via `useShallow(selectVisibleCardIds(columnId))`. The selector returns a new array each time, but `useShallow` compares it item by item, so the column re-renders only when its visible list actually changes.
- **`NewCardButton`, `Board` and `App` subscribe to nothing.** Typing in search re-renders `SearchInput` and the columns whose result changed — not the dialog, not unaffected cards. The E2E test `typing in search does not re-render…` checks this with the render counters.
- **Actions are selected individually** (`useBoardStore((s) => s.moveCard)`). They're stable references, so selecting them never triggers a render.

## Ideas for next steps

Drag and drop with `@dnd-kit` (add an `order` field), user-defined columns, a `migrate` function for a schema change (`version: 2`, add `dueDate`), and moving cards to a mock API with React Query while Zustand keeps UI state only.
