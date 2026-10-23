export type Priority = 'low' | 'medium' | 'high';
export type ColumnId = 'todo' | 'in-progress' | 'done';
export type SortBy = 'newest' | 'oldest' | 'priority';

export interface Card {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  createdAt: number;
  columnId: ColumnId;
}

/** Fields a user can set when creating or editing a card. */
export interface CardDraft {
  title: string;
  description?: string;
  priority: Priority;
}

export interface DeletedCard {
  card: Card;
  deletedAt: number;
}

export interface CardsSlice {
  /** Normalised by id so editing one card keeps every other card object identical. */
  cardsById: Record<string, Card>;
  lastDeleted: DeletedCard | null;
  addCard: (draft: CardDraft, columnId?: ColumnId) => string;
  updateCard: (id: string, patch: Partial<CardDraft>) => void;
  moveCard: (id: string, columnId: ColumnId) => void;
  deleteCard: (id: string) => void;
  undoDelete: () => void;
  clearLastDeleted: () => void;
}

export interface FiltersSlice {
  search: string;
  priorities: Priority[];
  sortBy: SortBy;
  setSearch: (search: string) => void;
  togglePriority: (priority: Priority) => void;
  setSortBy: (sortBy: SortBy) => void;
  resetFilters: () => void;
}

export type BoardState = CardsSlice & FiltersSlice;

/** Middleware applied around the slices — slices need this to type `set(..., actionName)`. */
export type BoardMutators = [['zustand/devtools', never], ['zustand/persist', unknown]];
