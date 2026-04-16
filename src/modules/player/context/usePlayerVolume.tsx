'use client';

import { useContext } from 'react';
import { PlayerVolumeContext } from './PlayerVolumeContext';
import type { PlayerVolumeContextValue } from './types';

// ----------------------------------------------------------------------

export function usePlayerVolume(): PlayerVolumeContextValue {
  const ctx = useContext(PlayerVolumeContext);
  if (!ctx) throw new Error('usePlayerVolume must be used within <PlayerProvider>');
  return ctx;
}
