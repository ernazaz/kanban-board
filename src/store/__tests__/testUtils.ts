import { useBoardStore } from '@/store';

/** Fresh, empty board before each test — no seed cards, default filters. */
export function resetStore() {
  localStorage.clear();
  useBoardStore.setState({ ...useBoardStore.getInitialState(), cardsById: {} }, true);
}

export const store = () => useBoardStore.getState();
