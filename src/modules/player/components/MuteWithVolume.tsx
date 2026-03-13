'use client';

import { useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { VolumeHighIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { usePlayer } from '../context/usePlayer';

export type VolumePopoverAnchor = 'top' | 'bottom';

export function MuteWithVolume({
  anchor = 'top',
  className,
}: {
  anchor?: VolumePopoverAnchor;
  className?: string;
}) {
  const { muted, volume, setMuted, setVolume } = usePlayer();

  const sliderValue = useMemo(() => {
    const v = muted ? 0 : volume;
    if (!Number.isFinite(v)) return [0];
    return [Math.max(0, Math.min(1, v))];
  }, [muted, volume]);

  const popoverPositionClassName =
    anchor === 'top'
      ? 'left-1/2 top-full -translate-x-1/2 mt-0'
      : 'left-1/2 bottom-full -translate-x-1/2 mb-0';

  return (
    <div className={cn('relative group', className)}>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-11 md:h-9 md:w-9 p-0"
        aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
        title={muted || volume === 0 ? 'Unmute' : 'Mute'}
        onClick={() => setMuted(!muted)}
      >
        <HugeiconsIcon icon={muted || volume === 0 ? VolumeMute02Icon : VolumeHighIcon} size={22} color="currentColor" />
      </Button>

      <div
        className={cn(
          'absolute z-40 hidden group-hover:block group-focus-within:block',
          // Keep the slider close to the icon so we don't lose hover on the way down.
          'rounded-lg border bg-background/80 p-2 text-popover-foreground shadow-md supports-[backdrop-filter]:backdrop-blur-md',
          'w-14',
          popoverPositionClassName,
        )}
      >
        <div className="h-24 w-full flex items-center justify-center">
          <Slider
            aria-label="Volume"
            orientation="vertical"
            value={sliderValue}
            max={1}
            step={0.01}
            onValueChange={(next) => {
              const v = next[0] ?? 0;
              setVolume(v);
              setMuted(v === 0);
            }}
            className="h-24 w-6 flex-col"
            trackClassName="h-full w-2"
            rangeClassName="w-full"
            thumbClassName="h-4 w-4"
          />
        </div>
      </div>
    </div>
  );
}
