'use client';

import { useMemo, useState } from 'react';

import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useHydrated } from '@/lib/useHydrated';
import { usePlayer } from '../context/usePlayer';

export function SeekBar({
  className,
}: {
  className?: string;
}) {
  const hydrated = useHydrated();
  const { track, positionSeconds, durationSeconds, seek } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubSeconds, setScrubSeconds] = useState(0);

  const canSeek = Boolean(track) && Number.isFinite(durationSeconds) && durationSeconds > 0;
  const displayPosition = isScrubbing ? scrubSeconds : positionSeconds;

  const value = useMemo(() => [displayPosition], [displayPosition]);

  // Avoid SSR/client attribute mismatches when persisted position/duration are loaded on the client.
  if (!hydrated) {
    return <div aria-hidden="true" className={cn('w-full h-2 bg-muted', className)} />;
  }

  return (
    <Slider
      aria-label="Seek"
      value={canSeek ? value : [0]}
      max={canSeek ? durationSeconds : 0}
      step={0.25}
      disabled={!canSeek}
      onValueChange={(next) => {
        setIsScrubbing(true);
        setScrubSeconds(next[0] ?? 0);
      }}
      onValueCommit={(next) => {
        setIsScrubbing(false);
        if (canSeek) seek(next[0] ?? 0);
      }}
      className={cn('w-full', className)}
      // Rectangular seekbar (no radius) but otherwise shadcn-slider-like.
      trackClassName="h-2 rounded-none"
      rangeClassName="rounded-none"
      thumbClassName="h-5 w-5"
    />
  );
}
