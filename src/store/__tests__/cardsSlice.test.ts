import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY, useBoardStore } from '@/store';
import { TITLE_MAX_LENGTH } from '@/store/cardsSlice';
import { resetStore, store } from './testUtils';

describe('cardsSlice', () => {
  beforeEach(resetStore);

  it('adds a card to To Do by default', () => {
    const id = store().addCard({ title: '  Write tests  ', priority: 'high' });
    const card = store().cardsById[id];
    expect(card).toMatchObject({ title: 'Write tests', priority: 'high', columnId: 'todo' });
    expect(card.createdAt).toBeTypeOf('number');
  });

  it('adds a card to a chosen column', () => {
    const id = store().addCard({ title: 'Ship it', priority: 'low' }, 'done');
    expect(store().cardsById[id].columnId).toBe('done');
  });

  it('rejects an empty title and trims long ones to the limit', () => {
    expect(() => store().addCard({ title: '   ', priority: 'low' })).toThrow();
    const id = store().addCard({ title: 'x'.repeat(120), priority: 'low' });
    expect(store().cardsById[id].title).toHaveLength(TITLE_MAX_LENGTH);
  });

  it('updates only the edited card and keeps other card objects identical', () => {
    const a = store().addCard({ title: 'A', priority: 'low' });
    const b = store().addCard({ title: 'B', priority: 'low' });
    const before = store().cardsById[b];

    store().updateCard(a, { title: 'A2', priority: 'high' });

    expect(store().cardsById[a]).toMatchObject({ title: 'A2', priority: 'high' });
    expect(store().cardsById[b]).toBe(before); // same reference → CardItem B won't re-render
  });

  it('ignores an update that blanks the title', () => {
    const id = store().addCard({ title: 'Keep me', priority: 'low' });
    store().updateCard(id, { title: '  ' });
    expect(store().cardsById[id].title).toBe('Keep me');
  });

  it('moves a card between columns', () => {
    const id = store().addCard({ title: 'Move me', priority: 'medium' });
    store().moveCard(id, 'in-progress');
    expect(store().cardsById[id].columnId).toBe('in-progress');
  });

  it('does not change state when moving to the same column', () => {
    const id = store().addCard({ title: 'Stay', priority: 'medium' });
    const listener = vi.fn();
    const unsubscribe = useBoardStore.subscribe(listener);
    store().moveCard(id, 'todo');
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('deletes a card and remembers it for undo', () => {
    const id = store().addCard({ title: 'Oops', priority: 'low' });
    store().deleteCard(id);
    expect(store().cardsById[id]).toBeUndefined();
    expect(store().lastDeleted?.card.id).toBe(id);
  });

  it('undo restores the exact deleted card', () => {
    const id = store().addCard({ title: 'Oops', priority: 'low' }, 'in-progress');
    const original = store().cardsById[id];
    store().deleteCard(id);
    store().undoDelete();
    expect(store().cardsById[id]).toEqual(original);
    expect(store().lastDeleted).toBeNull();
  });

  it('undo does nothing when nothing was deleted', () => {
    const before = store().cardsById;
    store().undoDelete();
    expect(store().cardsById).toBe(before);
  });

  it('a second delete replaces the undo buffer (single level)', () => {
    const a = store().addCard({ title: 'A', priority: 'low' });
    const b = store().addCard({ title: 'B', priority: 'low' });
    store().deleteCard(a);
    store().deleteCard(b);
    store().undoDelete();
    expect(store().cardsById[b]).toBeDefined();
    expect(store().cardsById[a]).toBeUndefined();
  });

  it('persists cards but not filters or the undo buffer', () => {
    const id = store().addCard({ title: 'Persist me', priority: 'high' });
    store().setSearch('persist');
    store().deleteCard(store().addCard({ title: 'Gone', priority: 'low' }));

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(Object.keys(saved.state)).toEqual(['cardsById']);
    expect(saved.state.cardsById[id].title).toBe('Persist me');
    expect(saved.version).toBe(1);
  });
});
