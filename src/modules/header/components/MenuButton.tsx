"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHeader } from "../context/useHeader";

// ----------------------------------------------------------------------

export function MenuButton() {
  const { setNavOpen } = useHeader();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-11"
          aria-label="Navigate"
          onClick={() => setNavOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Navigate</TooltipContent>
    </Tooltip>
  );
}
