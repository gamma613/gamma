'use client';

import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { useHydrated } from '@/lib/useHydrated';
import { cn } from '@/lib/utils';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

export function SeekBar({
  className,
}: {
  className?: string;
}) {
  const hydrated = useHydrated();
  const { ready, track, positionSeconds, durationSeconds, seek } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubSeconds, setScrubSeconds] = useState(0);

  const canSeek = Boolean(track) && Number.isFinite(durationSeconds) && durationSeconds > 0;
  const displayPosition = isScrubbing ? scrubSeconds : positionSeconds;

  const isReady = hydrated && ready && canSeek;
  const value = useMemo(() => [isReady ? displayPosition : 0], [displayPosition, isReady]);

  return (
    <Slider
      aria-label="Seek"
      aria-disabled={!isReady}
      disabled={!isReady}
      value={value}
      max={isReady ? durationSeconds : 0}
      step={0.25}
      onValueChange={(next) => {
        if (!isReady) return;
        setIsScrubbing(true);
        setScrubSeconds(next[0] ?? 0);
      }}
      onValueCommit={(next) => {
        if (!isReady) return;
        setIsScrubbing(false);
        seek(next[0] ?? 0);
      }}
      className={cn(
        'w-full',
        !isReady && 'invisible pointer-events-none',
        // Rectangular seekbar (no radius).
        '[&_[data-slot=slider-track]]:rounded-none',
        className,
      )}
    />
  );
}
