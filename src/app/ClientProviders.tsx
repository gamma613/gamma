import '@/app/fontawesome';
import { BokehBackground, TooltipProvider } from '@/components';
import { PageCollapseProvider } from '@/components/layout';
import { HeaderProvider } from '@/modules/header';
import { PlayerProvider } from '@/modules/player';

// ----------------------------------------------------------------------

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <BokehBackground>
      <TooltipProvider>
        <PageCollapseProvider>
          <PlayerProvider>
            <HeaderProvider>{children}</HeaderProvider>
          </PlayerProvider>
        </PageCollapseProvider>
      </TooltipProvider>
    </BokehBackground>
  );
}
