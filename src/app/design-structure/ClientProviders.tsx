import '@/app/fontawesome';
import { HeaderProvider } from '@/app/design-structure/header';
import { TooltipProvider } from '@/components';
import { PageCollapseProvider } from '@/components/layout';
import { PlayerProvider } from '@/modules/player';

// ----------------------------------------------------------------------

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <PageCollapseProvider>
        <HeaderProvider>
          <PlayerProvider>{children}</PlayerProvider>
        </HeaderProvider>
      </PageCollapseProvider>
    </TooltipProvider>
  );
}
