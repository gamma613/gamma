import '@/app/fontawesome';
import { BokehBackground, TooltipProvider } from '@/components';
import { VisualizerBars } from '@/components/animation/VisualizerBars';
import { PageCollapseProvider } from '@/components/layout';
import { HeaderProvider } from '@/modules/header';
import { PlayerProvider } from '@/modules/player';

// ----------------------------------------------------------------------

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <PageCollapseProvider>
        <div className="relative min-h-screen">
          <BokehBackground className="z-0" />

          <PlayerProvider>
            <VisualizerBars
              className="fixed inset-x-0 top-0 bottom-(--header-height) z-10"
              config={{
                decibelsMax: -10,
                decibelsMin: -90,
                double: 'left',
                fftSize: 512,
                hzMax: 22000,
                mirror: true,
                opacity: 0.45,
                palette: 'rainbow',
                sensitivity: 1,
                smoothing: 0,
              }}
            />
            <div className="relative z-20">
              <HeaderProvider>{children}</HeaderProvider>
            </div>
          </PlayerProvider>
        </div>
      </PageCollapseProvider>
    </TooltipProvider>
  );
}
