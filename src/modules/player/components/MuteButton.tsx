'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { VolumeHighIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef } from 'react';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type MuteButtonProps = Pick<ButtonProps, 'className'| 'variant'>

export function MuteButton({ ...buttonProps }: MuteButtonProps) {
  const { muted, volume, setMuted, setVolume } = usePlayer();

  const lastNonZeroVolumeRef = useRef(1);
  useEffect(() => {
    if (Number.isFinite(volume) && volume > 0) lastNonZeroVolumeRef.current = volume;
  }, [volume]);

  const effectivelyMuted = muted || volume === 0;
  const buttonLabel = effectivelyMuted ? 'Unmute' : 'Mute';

  return (
    <Button
      aria-label={buttonLabel}
      type="button"
      onClick={() => {
        if (effectivelyMuted) {
          setMuted(false);
          if (volume === 0) {
            const nextVol = lastNonZeroVolumeRef.current > 0 ? lastNonZeroVolumeRef.current : 0.5;
            setVolume(nextVol);
          }
          return;
        }

        setMuted(true);
      }}
      title={buttonLabel}
      variant="outline"
      {...buttonProps}
      >
      <HugeiconsIcon icon={effectivelyMuted ? VolumeMute02Icon : VolumeHighIcon} size={22} color="currentColor" />
    </Button>
  );
}
