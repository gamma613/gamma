'use client';

import React from 'react';
import { PlayerProvider } from '@/modules/player';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider defaultTrack={{ src: '/api/stream/mixes/repossession', title: 'Repossession' }}>
      {children}
    </PlayerProvider>
  );
}

