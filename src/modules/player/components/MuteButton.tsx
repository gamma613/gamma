'use client';

import { ButtonProps } from '@/components';
import { IconButton } from '@/components/buttons/IconButton';
import { cn } from '@/lib/utils';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';
import { usePlayerVolume } from '../context/usePlayerVolume';

// ----------------------------------------------------------------------

type MuteButtonProps = Pick<ButtonProps, 'className' | 'variant'>;

export function MuteButton({ className, variant = 'outline', ...buttonProps }: MuteButtonProps) {
  const { isReady, disabled, gateClassName } = usePlayerControlsReady();
  const { muted, volume, setMuted, setVolume } = usePlayerVolume();

  const lastNonZeroVolumeRef = useRef(1);
  useEffect(() => {
    if (Number.isFinite(volume) && volume > 0) lastNonZeroVolumeRef.current = volume;
  }, [volume]);

  const effectivelyMuted = muted || volume === 0;
  const label = effectivelyMuted ? 'Unmute' : 'Mute';
  const icon = effectivelyMuted ? faVolumeXmark : faVolumeHigh;

  return (
    <IconButton
      className={cn(gateClassName, className)}
      disabled={disabled}
      label={label}
      icon={icon}
      onClick={() => {
        if (!isReady) return;
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
      size="default"
      type="button"
      variant={variant}
      {...buttonProps}
    />
  );
}
