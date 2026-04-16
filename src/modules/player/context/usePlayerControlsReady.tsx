'use client';

import { useHydrated } from '@/lib/useHydrated';
import { usePlayerMain } from './usePlayerMain';

export function usePlayerControlsReady() {
  const hydrated = useHydrated();
  const { ready } = usePlayerMain();

  const isReady = hydrated && ready;

  return {
    isReady,
    disabled: !isReady,
    gateClassName: !isReady ? 'invisible pointer-events-none' : undefined,
  };
}
