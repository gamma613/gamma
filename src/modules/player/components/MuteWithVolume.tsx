'use client';

import { useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { VolumeHighIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
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

  const volumePct = useMemo(() => {
    const v = muted ? 0 : volume;
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(100, v * 100));
  }, [muted, volume]);

  const volumeStyle = useMemo(() => {
    return {
      background: `linear-gradient(to right, hsl(var(--primary)) ${volumePct}%, hsl(var(--muted)) ${volumePct}%)`,
    } as const;
  }, [volumePct]);

  const popoverPositionClassName =
    anchor === 'top' ? 'left-1/2 top-full -translate-x-1/2 mt-2' : 'left-1/2 bottom-full -translate-x-1/2 mb-2';

  const rangeClassName = cn(
    'w-full h-2 bg-muted appearance-none rounded-full outline-none',
    'focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // WebKit track/thumb.
    '[&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
    '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
    '[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary',
    '[&::-webkit-slider-thumb]:shadow-sm',
    // Firefox track/progress/thumb.
    '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted',
    '[&::-moz-range-progress]:h-2 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary',
    '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background',
    '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-sm',
  );

  return (
    <div className={cn('relative group', className)}>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-11 md:h-9 md:w-9 p-0 bg-background/60 hover:bg-muted"
        aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
        title={muted || volume === 0 ? 'Unmute' : 'Mute'}
        onClick={() => setMuted(!muted)}
      >
        <HugeiconsIcon icon={muted || volume === 0 ? VolumeMute02Icon : VolumeHighIcon} size={22} color="currentColor" />
      </Button>

      <div
        className={cn(
          'absolute z-40 hidden group-hover:block group-focus-within:block',
          'w-44 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md',
          popoverPositionClassName,
        )}
      >
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = Number.parseFloat(e.target.value);
            setVolume(v);
            setMuted(v === 0);
          }}
          className={rangeClassName}
          style={volumeStyle}
        />
      </div>
    </div>
  );
}

