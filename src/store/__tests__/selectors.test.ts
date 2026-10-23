import { beforeEach, describe, expect, it, vi } from 'vitest';
import { selectColumnTotal, selectHasActiveFilters, selectVisibleCardIds } from '@/store';
import { resetStore, store } from './testUtils';

const visible = (column: 'todo' | 'in-progress' | 'done' = 'todo') => selectVisibleCardIds(column)(store());

describe('selectors', () => {
  let low: string, med: string, high: string;

  beforeEach(() => {
    resetStore();
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    low = store().addCard({ title: 'Buy milk', priority: 'low' });
    vi.setSystemTime(2_000);
    med = store().addCard({ title: 'Write README', priority: 'medium' });
    vi.setSystemTime(3_000);
    high = store().addCard({ title: 'Fix login bug', priority: 'high' });
    store().addCard({ title: 'Deploy', priority: 'high' }, 'done');
    vi.useRealTimers();
  });

  it('returns only the cards of the requested column, newest first by default', () => {
    expect(visible('todo')).toEqual([high, med, low]);
    expect(visible('done')).toHaveLength(1);
    expect(visible('in-progress')).toEqual([]);
  });

  it('searches titles case-insensitively', () => {
    store().setSearch('  WRITE ');
    expect(visible()).toEqual([med]);
  });

  it('filters by several priorities at once', () => {
    store().togglePriority('low');
    store().togglePriority('high');
    expect(visible()).toEqual([high, low]);
    store().togglePriority('high'); // toggling again removes it
    expect(visible()).toEqual([low]);
  });

  it('combines search and priority filters', () => {
    store().setSearch('i');
    store().togglePriority('high');
    expect(visible()).toEqual([high]);
  });

  it('sorts by oldest first and by priority', () => {
    store().setSortBy('oldest');
    expect(visible()).toEqual([low, med, high]);
    store().setSortBy('priority');
    expect(visible()).toEqual([high, med, low]);
  });

  it('applies filters to every column', () => {
    store().togglePriority('low');
    expect(visible('done')).toEqual([]);
  });

  it('column total ignores filters', () => {
    store().setSearch('nothing matches');
    expect(visible()).toEqual([]);
    expect(selectColumnTotal('todo')(store())).toBe(3);
  });

  it('reports whether any filter is active and resets them', () => {
    expect(selectHasActiveFilters(store())).toBe(false);
    store().togglePriority('medium');
    expect(selectHasActiveFilters(store())).toBe(true);
    store().resetFilters();
    expect(selectHasActiveFilters(store())).toBe(false);
  });
});
