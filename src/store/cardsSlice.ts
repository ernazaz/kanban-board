import type { StateCreator } from 'zustand';
import type { BoardMutators, BoardState, Card, CardsSlice } from './types';

export const TITLE_MAX_LENGTH = 80;

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const now = Date.now();
const seed: Card[] = [
  { id: 'seed-1', title: 'Scaffold Vite + TS app', priority: 'low', columnId: 'done', createdAt: now - 4000 },
  { id: 'seed-2', title: 'Build filter bar', priority: 'medium', columnId: 'in-progress', createdAt: now - 3000 },
  { id: 'seed-3', title: 'Set up Zustand store', description: 'Slices, devtools, persist', priority: 'high', columnId: 'todo', createdAt: now - 2000 },
  { id: 'seed-4', title: 'Write store unit tests', priority: 'medium', columnId: 'todo', createdAt: now - 1000 },
];

export const initialCards: Record<string, Card> = Object.fromEntries(seed.map((c) => [c.id, c]));

const cleanTitle = (title: string) => title.trim().slice(0, TITLE_MAX_LENGTH);

export const createCardsSlice: StateCreator<BoardState, BoardMutators, [], CardsSlice> = (set, get) => ({
  cardsById: initialCards,
  lastDeleted: null,

  addCard: (draft, columnId = 'todo') => {
    const title = cleanTitle(draft.title);
    if (!title) throw new Error('Card title is required');
    const card: Card = {
      id: newId(),
      title,
      description: draft.description?.trim() || undefined,
      priority: draft.priority,
      columnId,
      createdAt: Date.now(),
    };
    set((s) => ({ cardsById: { ...s.cardsById, [card.id]: card } }), false, 'cards/add');
    return card.id;
  },

  updateCard: (id, patch) => {
    const card = get().cardsById[id];
    if (!card) return;
    const next: Card = { ...card, ...patch };
    if (patch.title !== undefined) {
      next.title = cleanTitle(patch.title);
      if (!next.title) return;
    }
    if (patch.description !== undefined) next.description = patch.description.trim() || undefined;
    set((s) => ({ cardsById: { ...s.cardsById, [id]: next } }), false, 'cards/update');
  },

  moveCard: (id, columnId) => {
    const card = get().cardsById[id];
    if (!card || card.columnId === columnId) return;
    set((s) => ({ cardsById: { ...s.cardsById, [id]: { ...card, columnId } } }), false, 'cards/move');
  },

  deleteCard: (id) => {
    const card = get().cardsById[id];
    if (!card) return;
    set(
      (s) => {
        const { [id]: _removed, ...rest } = s.cardsById;
        return { cardsById: rest, lastDeleted: { card, deletedAt: Date.now() } };
      },
      false,
      'cards/delete',
    );
  },

  undoDelete: () => {
    const deleted = get().lastDeleted;
    if (!deleted) return;
    set(
      (s) => ({ cardsById: { ...s.cardsById, [deleted.card.id]: deleted.card }, lastDeleted: null }),
      false,
      'cards/undoDelete',
    );
  },

  clearLastDeleted: () => set({ lastDeleted: null }, false, 'cards/clearLastDeleted'),
});
