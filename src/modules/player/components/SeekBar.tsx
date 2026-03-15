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

  const value = useMemo(() => [displayPosition], [displayPosition]);

  // Avoid SSR/client attribute mismatches and initial "wrong track" paint:
  // render nothing until hydration + persisted state + duration are ready.
  if (!hydrated || !ready || !canSeek) return null;

  return (
    <Slider
      aria-label="Seek"
      value={value}
      max={durationSeconds}
      step={0.25}
      disabled={false}
      onValueChange={(next) => {
        setIsScrubbing(true);
        setScrubSeconds(next[0] ?? 0);
      }}
      onValueCommit={(next) => {
        setIsScrubbing(false);
        seek(next[0] ?? 0);
      }}
      className={cn(
        'w-full',
        // Rectangular seekbar (no radius).
        '[&_[data-slot=slider-track]]:rounded-none',
        className,
      )}
    />
  );
}
