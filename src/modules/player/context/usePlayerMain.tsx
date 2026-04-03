'use client';

import { useContext } from 'react';
import { PlayerMainContext } from './PlayerMainContext';
import type { PlayerMainContextValue } from './types';

// ----------------------------------------------------------------------

export function usePlayerMain(): PlayerMainContextValue {
  const ctx = useContext(PlayerMainContext);
  if (!ctx) throw new Error('usePlayerMain must be used within <PlayerProvider>');
  return ctx;
}
