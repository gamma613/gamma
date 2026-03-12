'use client';

import React from 'react';
import { PlayerProvider } from '@/modules/player';
import { AuroraBackground } from '@/components/ui/aurora';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuroraBackground showRadialGradient={true} animationSpeed={30}>
      <PlayerProvider defaultTrack={{ src: '/api/stream/mixes/repossession', title: 'Repossession' }}>
        {children}
      </PlayerProvider>
    </AuroraBackground>
  );
}
