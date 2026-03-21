import React from "react";
import { PlayerProvider } from "@/modules/player";
import { BokehBackground } from "@/components/ui/bokeh";
import { HeaderProvider } from "@/modules/header";
import "@/app/fontawesome";
import { TooltipProvider } from "@/components/ui/tooltip";

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
