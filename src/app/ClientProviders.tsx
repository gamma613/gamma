'use client';

import React from 'react';
import { PlayerProvider } from '@/modules/player';
import { BokehBackground } from '@/components/ui/bokeh';
import { HeaderProvider } from '@/modules/header';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <BokehBackground>
      <PlayerProvider defaultTrack={{ src: '/api/stream/mixes/repossession', title: 'Repossession' }}>
        <HeaderProvider>
          {children}
        </HeaderProvider>
      </PlayerProvider>
    </BokehBackground>
  );
}
