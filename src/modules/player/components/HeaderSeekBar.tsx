'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { usePlayer } from '../context/usePlayer';

export function HeaderSeekBar({ className }: { className?: string }) {
  const { track, positionSeconds, durationSeconds, seek } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubSeconds, setScrubSeconds] = useState(0);

  const canSeek = Boolean(track) && Number.isFinite(durationSeconds) && durationSeconds > 0;
  const displayPosition = isScrubbing ? scrubSeconds : positionSeconds;

  const pct = useMemo(() => {
    if (!canSeek) return 0;
    return Math.max(0, Math.min(100, (displayPosition / durationSeconds) * 100));
  }, [canSeek, displayPosition, durationSeconds]);

  const trackStyle = useMemo(() => {
    // WebKit uses the input background; Firefox uses ::-moz-range-progress.
    return {
      background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%)`,
    } as const;
  }, [pct]);

  return (
    <input
      aria-label="Seek"
      type="range"
      min={0}
      max={canSeek ? durationSeconds : 0}
      step={0.25}
      value={canSeek ? displayPosition : 0}
      disabled={!canSeek}
      onPointerDown={() => {
        setIsScrubbing(true);
        setScrubSeconds(positionSeconds);
      }}
      onPointerUp={() => {
        setIsScrubbing(false);
        if (canSeek) seek(scrubSeconds);
      }}
      onChange={(e) => {
        const v = Number.parseFloat(e.target.value);
        setScrubSeconds(v);
      }}
      className={cn(
        'w-full h-[10px] appearance-none rounded-full bg-muted outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // WebKit.
        '[&::-webkit-slider-runnable-track]:h-[10px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
        '[&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:w-[22px]',
        '[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary',
        '[&::-webkit-slider-thumb]:shadow-sm',
        '[&::-webkit-slider-thumb]:transition-[width,height] [&::-webkit-slider-thumb]:duration-150',
        'hover:[&::-webkit-slider-thumb]:h-11 hover:[&::-webkit-slider-thumb]:w-11',
        // Firefox.
        '[&::-moz-range-track]:h-[10px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted',
        '[&::-moz-range-progress]:h-[10px] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary',
        '[&::-moz-range-thumb]:h-[22px] [&::-moz-range-thumb]:w-[22px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background',
        '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-sm',
        '[&::-moz-range-thumb]:transition-[width,height] [&::-moz-range-thumb]:duration-150',
        'hover:[&::-moz-range-thumb]:h-11 hover:[&::-moz-range-thumb]:w-11',
        className,
      )}
      style={trackStyle}
    />
  );
}

