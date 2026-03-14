'use client';

import { Button, ButtonProps } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type PlayButtonToggleProps = Pick<ButtonProps, 'className'| 'variant'>

export const PlayToggleButton = ({ ...buttonProps }: PlayButtonToggleProps) => {
  const { playing, toggle } = usePlayer();

  return (
    <Button
      type="button"
      variant="default"
      aria-label={playing ? 'Pause' : 'Play'}
      onClick={() => toggle()}
      {...buttonProps}
    >
      <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={22} color="currentColor" />
    </Button>
  )
}