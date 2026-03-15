import React from 'react';
import { PlayerProvider } from '@/modules/player';
import { BokehBackground } from '@/components/ui/bokeh';
import { HeaderProvider } from '@/modules/header';
import { getMix } from '@/lib/mixes/getMix';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const mix = getMix('repossession');

  return (
    <BokehBackground>
      <TooltipProvider>
        <PlayerProvider
          defaultTrack={{
            kind: 'mixes',
            src: `/api/stream/mixes/${mix?.slug ?? 'repossession'}`,
            title: mix?.title ?? 'Repossession',
            artist: mix?.artist ?? undefined,
            cover: mix?.artwork?.cover,
          }}
        >
          <HeaderProvider>{children}</HeaderProvider>
        </PlayerProvider>
      </TooltipProvider>
    </BokehBackground>
  );
}
