'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { VolumeHighIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type MuteButtonProps = Pick<ButtonProps, 'className'| 'variant'>

export function MuteButton({ ...buttonProps }: MuteButtonProps) {
  const { muted, volume, setMuted } = usePlayer();
  const buttonLabel = muted || volume === 0 ?  'Unmute' : 'Mute';

  return (
    <Button
      aria-label={buttonLabel}
      type="button"
      onClick={() => setMuted(!muted)}
      title={buttonLabel}
      variant="outline"
      {...buttonProps}
      >
      <HugeiconsIcon icon={muted || volume === 0 ? VolumeMute02Icon : VolumeHighIcon} size={22} color="currentColor" />
    </Button>
  );
}
