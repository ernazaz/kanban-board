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

## What's implemented

| Requirement | Where |
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
| Stretch: keyboard shortcuts | `lib/useHotkey.ts` |

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

## Interview questions

**Why Zustand instead of Context + `useReducer`?**
Every consumer of a Context re-renders when its value changes, so one big context makes a search keystroke re-render the whole board; avoiding that means splitting into many contexts and memoising values by hand. Zustand subscriptions are per selector: a component re-renders only when the slice it selected changes. It also needs no provider, actions can be called outside React (tests, event handlers, `getState()`), and middleware (`persist`, `devtools`) is a line each.

**What causes a component to re-render with a Zustand hook?**
`useBoardStore(selector)` runs the selector on every store change and compares the new result with the previous one using `Object.is`. Different result → re-render. So a selector that builds a new array or object (`filter`, `map`, `{a, b}`) re-renders every time, even when nothing it cares about changed. Fixes used here: select primitives or existing references where possible, wrap selectors that build arrays/objects in `useShallow`, and normalise data so unrelated updates keep references stable.

**Why compute filtered lists and counts in selectors instead of storing them?**
Stored derived data has to be updated in every action that could affect it — add, edit, move, delete, undo, and every filter change. Miss one and the UI is wrong. A selector is a pure function of `cards + filters`, so it can't go stale, it's trivial to unit-test, and it lives in one place. The cost (filtering a few hundred cards) is negligible; if it weren't, memoise the selector rather than storing its result.

**When would you use multiple stores instead of slices?**
When the state has separate lifecycles or owners: e.g. a session/auth store that outlives pages, a store per widget instance (create it with `createStore` in a context provider), or state that should never be persisted together. Slices fit here because cards and filters are read together — the visible-cards selector needs both in one snapshot, which separate stores can't give atomically.

## Ideas for next steps

Drag and drop with `@dnd-kit` (add an `order` field), user-defined columns, a `migrate` function for a schema change (`version: 2`, add `dueDate`), and moving cards to a mock API with React Query while Zustand keeps UI state only.
