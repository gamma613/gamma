'use client';

import { useContext } from 'react';
import { PlayerMediaContext, type PlayerMediaContextValue } from './PlayerMediaContext';

// ----------------------------------------------------------------------

export function usePlayerMedia(): PlayerMediaContextValue {
  const ctx = useContext(PlayerMediaContext);
  if (!ctx) throw new Error('usePlayerMedia must be used within <PlayerProvider>');
  return ctx;
}
