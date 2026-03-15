'use client';

import { useSyncExternalStore } from 'react';

// Returns `false` during SSR and the first client render, then flips to `true`
// right after hydration without using `setState` in effects.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      queueMicrotask(onStoreChange);
      return () => {};
    },
    () => true,
    () => false,
  );
}

