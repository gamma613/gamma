'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu } from 'lucide-react';
//
import { useHeader } from '../context/useHeader';

// ----------------------------------------------------------------------

export function MenuButton() {
  const { setNavOpen } = useHeader();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-11 p-0 md:h-9 md:w-9"
          aria-label="Navigate"
          onClick={() => setNavOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Navigate</TooltipContent>
    </Tooltip>
  );
}
