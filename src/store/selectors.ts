import type { BoardState, Card, ColumnId, Priority, SortBy } from './types';

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

type Filters = Pick<BoardState, 'search' | 'priorities'>;

export const matchesFilters = (card: Card, { search, priorities }: Filters): boolean => {
  const query = search.trim().toLowerCase();
  if (query && !card.title.toLowerCase().includes(query)) return false;
  if (priorities.length > 0 && !priorities.includes(card.priority)) return false;
  return true;
};

export const compareCards = (sortBy: SortBy) => (a: Card, b: Card): number => {
  switch (sortBy) {
    case 'oldest':
      return a.createdAt - b.createdAt;
    case 'priority':
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt;
    case 'newest':
    default:
      return b.createdAt - a.createdAt;
  }
};

/**
 * Ids of the cards a column should show, filtered and sorted.
 * Returns a new array on every call — subscribe with `useShallow` so the column
 * re-renders only when the list of ids actually changes.
 */
export const selectVisibleCardIds =
  (columnId: ColumnId) =>
  (s: BoardState): string[] =>
    Object.values(s.cardsById)
      .filter((c) => c.columnId === columnId && matchesFilters(c, s))
      .sort(compareCards(s.sortBy))
      .map((c) => c.id);

/** Primitive result, so no `useShallow` needed. */
export const selectColumnTotal =
  (columnId: ColumnId) =>
  (s: BoardState): number =>
    Object.values(s.cardsById).filter((c) => c.columnId === columnId).length;

export const selectCard = (id: string) => (s: BoardState) => s.cardsById[id];

export const selectHasActiveFilters = (s: BoardState): boolean =>
  s.search.trim() !== '' || s.priorities.length > 0;
