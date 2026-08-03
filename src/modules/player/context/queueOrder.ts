import { arrayMove } from '@dnd-kit/sortable';

export function reorderQueueItems<T>(queue: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return queue;
  if (fromIndex < 0 || fromIndex >= queue.length) return queue;
  if (toIndex < 0 || toIndex >= queue.length) return queue;
  return arrayMove(queue, fromIndex, toIndex);
}
