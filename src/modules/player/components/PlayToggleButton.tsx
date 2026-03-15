'use client';

import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type PlayButtonToggleProps = Pick<ButtonProps, 'className'| 'variant'>

export const PlayToggleButton = ({ ...buttonProps }: PlayButtonToggleProps) => {
  const { playing, toggle } = usePlayer();
  const label = playing ? 'Pause' : 'Play';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="default"
          aria-label={label}
          onClick={() => toggle()}
          {...buttonProps}
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={22} color="currentColor" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
} 
