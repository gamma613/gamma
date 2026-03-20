import React from 'react';
import { PlayerProvider } from '@/modules/player';
import { BokehBackground } from '@/components/ui/bokeh';
import { HeaderProvider } from '@/modules/header';
import { getMix } from '@/lib/mixes/getMix';
import '@/app/fontawesome';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const mix = getMix('repossession');
  if (!mix) throw new Error('Default mix not found: repossession');

  return (
    <BokehBackground>
      <TooltipProvider>
        <PlayerProvider
          defaultTrack={{
            kind: mix.kind,
            src: mix.src,
            title: mix.title,
            artist: mix.artist,
            cover: mix.artwork.cover,
          }}
        >
          <HeaderProvider>{children}</HeaderProvider>
        </PlayerProvider>
      </TooltipProvider>
    </BokehBackground>
  );
}
