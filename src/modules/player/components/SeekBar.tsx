'use client';

import { useMemo, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHydrated } from '@/lib/useHydrated';
import { cn } from '@/lib/utils';
//
import { usePlayer } from '../context/usePlayer';
import { formatTrackTime } from '../utils';

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

  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [hoverSeconds, setHoverSeconds] = useState(0);
  const rafRef = useRef<number | null>(null);

  const canSeek = Boolean(track) && Number.isFinite(durationSeconds) && durationSeconds > 0;
  const displayPosition = isScrubbing ? scrubSeconds : positionSeconds;

  const isReady = hydrated && ready && canSeek;
  const value = useMemo(() => [isReady ? displayPosition : 0], [displayPosition, isReady]);

  return (
    <div className={cn('relative w-full', className)}>
      <Tooltip open={isReady && hoverOpen}>
        <TooltipTrigger asChild>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0"
            style={{ left: hoverX }}
          />
        </TooltipTrigger>
        <TooltipContent aria-hidden="true" side="top" sideOffset={8}>
          {`Jump to ${formatTrackTime(hoverSeconds)}`}
        </TooltipContent>
      </Tooltip>

      <Slider
        aria-label="Playback position"
        aria-disabled={!isReady}
        aria-valuemin={0}
        aria-valuemax={durationSeconds}
        aria-valuetext={formatTrackTime(displayPosition)}
        disabled={!isReady}
        value={value}
        max={isReady ? durationSeconds : 0}
        step={0.25}
        onPointerEnter={() => setHoverOpen(true)}
        onPointerLeave={() => setHoverOpen(false)}
        onPointerMove={(e) => {
          if (!isReady) return;

          const el = e.currentTarget as HTMLElement;
          const rect = el.getBoundingClientRect();
          const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const pct = rect.width > 0 ? x / rect.width : 0;
          const seconds = pct * durationSeconds;

          // Throttle to one update per animation frame to reduce render churn.
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            setHoverX(x);
            setHoverSeconds(seconds);
            rafRef.current = null;
          });
        }}
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
        )}
      />
    </div>
  );
}
