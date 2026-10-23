import type { ColumnId, Priority } from '@/store/types';

export const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export const PRIORITY_LABEL: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };

export const PRIORITY_STYLE: Record<Priority, string> = {
  low: 'border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  medium: 'border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  high: 'border-red-600/40 bg-red-500/10 text-red-700 dark:text-red-300',
};

export const neighbourColumn = (columnId: ColumnId, step: -1 | 1): ColumnId | undefined =>
  COLUMNS[COLUMNS.findIndex((c) => c.id === columnId) + step]?.id;
