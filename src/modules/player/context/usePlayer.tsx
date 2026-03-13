'use client';
import { useContext } from 'react';
import { PlayerContext } from './PlayerContext';
import { PlayerContextValue } from './types';


export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider>');
  return ctx;
}
