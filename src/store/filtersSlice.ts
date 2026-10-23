import type { StateCreator } from 'zustand';
import type { BoardMutators, BoardState, FiltersSlice } from './types';

export const initialFilters = {
  search: '',
  priorities: [],
  sortBy: 'newest',
} satisfies Pick<FiltersSlice, 'search' | 'priorities' | 'sortBy'>;

export const createFiltersSlice: StateCreator<BoardState, BoardMutators, [], FiltersSlice> = (set) => ({
  ...initialFilters,

  setSearch: (search) => set({ search }, false, 'filters/setSearch'),

  togglePriority: (priority) =>
    set(
      (s) => ({
        priorities: s.priorities.includes(priority)
          ? s.priorities.filter((p) => p !== priority)
          : [...s.priorities, priority],
      }),
      false,
      'filters/togglePriority',
    ),

  setSortBy: (sortBy) => set({ sortBy }, false, 'filters/setSortBy'),

  resetFilters: () => set({ ...initialFilters }, false, 'filters/reset'),
});
