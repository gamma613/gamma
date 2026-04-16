'use client';

import { useContext } from 'react';
import { PlayerProgressContext } from './PlayerProgressContext';
import type { PlayerProgressContextValue } from './types';

// ----------------------------------------------------------------------

export function usePlayerProgress(): PlayerProgressContextValue {
  const ctx = useContext(PlayerProgressContext);
  if (!ctx) throw new Error('usePlayerProgress must be used within <PlayerProvider>');
  return ctx;
}
