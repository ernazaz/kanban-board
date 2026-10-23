import { useRef } from 'react';

/** Open the app with `?renders` to show render counters on the main components. */
export const SHOW_RENDERS =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('renders');

/** Counts renders of the calling component. Use it to prove selectors prevent extra renders. */
export function useRenderCount(): number {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}
