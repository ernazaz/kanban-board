import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createCardsSlice } from './cardsSlice';
import { createFiltersSlice } from './filtersSlice';
import type { BoardState } from './types';

export const STORAGE_KEY = 'kanban-board';

export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (...a) => ({
        ...createCardsSlice(...a),
        ...createFiltersSlice(...a),
      }),
      {
        name: STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => localStorage),
        // Only the cards survive a reload. Filters and the undo buffer reset.
        partialize: (s) => ({ cardsById: s.cardsById }),
      },
    ),
    { name: 'BoardStore', enabled: import.meta.env.MODE === 'development' },
  ),
);

export type { BoardState } from './types';
export * from './selectors';
