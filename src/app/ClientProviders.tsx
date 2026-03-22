import "@/app/fontawesome";
import { BokehBackground, TooltipProvider } from "@/components";
import { HeaderProvider } from "@/modules/header";
import { PlayerProvider } from "@/modules/player";

// ----------------------------------------------------------------------

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <BokehBackground>
      <TooltipProvider>
        <PlayerProvider>
          <HeaderProvider>{children}</HeaderProvider>
        </PlayerProvider>
      </TooltipProvider>
    </BokehBackground>
  );
}
