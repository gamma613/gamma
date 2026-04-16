'use client';

import { useMemo } from 'react';
import { PlayerContextValue } from './types';
import { usePlayerMain } from './usePlayerMain';
import { usePlayerProgress } from './usePlayerProgress';
import { usePlayerVolume } from './usePlayerVolume';

// ----------------------------------------------------------------------

export function usePlayer(): PlayerContextValue {
  const main = usePlayerMain();
  const volume = usePlayerVolume();
  const progress = usePlayerProgress();

  return useMemo(() => ({ ...main, ...volume, ...progress }), [main, volume, progress]);
}
