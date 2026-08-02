import assert from 'node:assert/strict';
import test from 'node:test';

import { reorderQueueItems } from '../src/modules/player/context/queueOrder.ts';

test('reorderQueueItems moves an item down', () => {
  assert.deepEqual(reorderQueueItems(['A', 'B', 'C', 'D'], 1, 3), ['A', 'C', 'D', 'B']);
});

test('reorderQueueItems moves an item up', () => {
  assert.deepEqual(reorderQueueItems(['A', 'B', 'C', 'D'], 3, 1), ['A', 'D', 'B', 'C']);
});

test('reorderQueueItems returns the original queue for no-op moves', () => {
  const queue = ['A', 'B', 'C'];
  assert.equal(reorderQueueItems(queue, 1, 1), queue);
});

test('reorderQueueItems returns the original queue for invalid indices', () => {
  const queue = ['A', 'B', 'C'];
  assert.equal(reorderQueueItems(queue, -1, 1), queue);
  assert.equal(reorderQueueItems(queue, 1, -1), queue);
  assert.equal(reorderQueueItems(queue, 3, 1), queue);
  assert.equal(reorderQueueItems(queue, 1, 3), queue);
});
