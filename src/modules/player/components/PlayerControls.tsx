'use client';

import { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PauseIcon, PlayIcon, VolumeHighIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePlayer } from '../context/usePlayer';

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function PlayerControls({ className }: { className?: string }) {
  const {
    track,
    playing,
    toggle,
    muted,
    volume,
    setMuted,
    setVolume,
    positionSeconds,
    durationSeconds,
    seek,
  } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubSeconds, setScrubSeconds] = useState(0);

  const displayPosition = isScrubbing ? scrubSeconds : positionSeconds;
  const canSeek = Number.isFinite(durationSeconds) && durationSeconds > 0;

  const volumePct = useMemo(() => {
    const v = muted ? 0 : volume;
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(100, v * 100));
  }, [muted, volume]);

  const pct = useMemo(() => {
    if (!canSeek) return 0;
    return Math.max(0, Math.min(100, (displayPosition / durationSeconds) * 100));
  }, [canSeek, displayPosition, durationSeconds]);

  const rangeBaseClassName = cn(
    // Prevent layout shift and use consistent focus rings across browsers.
    'appearance-none rounded-full outline-none',
    'focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // WebKit track/thumb.
    '[&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
    '[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary',
    '[&::-webkit-slider-thumb]:shadow-sm',
    // Firefox track/progress/thumb.
    '[&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted',
    '[&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary',
    '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background',
    '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-sm',
  );

  const scrubStyle = useMemo(() => {
    if (!canSeek) return undefined;
    return {
      background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%)`,
    } as const;
  }, [canSeek, pct]);

  const volumeStyle = useMemo(() => {
    return {
      background: `linear-gradient(to right, hsl(var(--primary)) ${volumePct}%, hsl(var(--muted)) ${volumePct}%)`,
    } as const;
  }, [volumePct]);

  if (!track) return null;

  return (
    <div className={cn('select-none', className)}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="default"
          className="h-11 w-11 md:h-9 md:w-9 p-0"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={() => toggle()}
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={22} color="currentColor" />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-11 md:h-9 md:w-9 p-0 bg-background/60 hover:bg-muted"
          aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
          onClick={() => setMuted(!muted)}
        >
          <HugeiconsIcon icon={muted || volume === 0 ? VolumeMute02Icon : VolumeHighIcon} size={22} color="currentColor" />
        </Button>

        <div className="hidden md:flex items-center gap-2 min-w-[180px]">
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
            className={cn('w-full h-2 bg-muted', rangeBaseClassName, '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4', '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4')}
            style={volumeStyle}
          />
        </div>

        <div className="ml-auto flex items-center gap-2 tabular-nums text-xs text-muted-foreground">
          <span className="text-foreground">{formatTime(displayPosition)}</span>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline">{formatTime(durationSeconds)}</span>
        </div>
      </div>

      <div className="mt-2">
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
            'w-full h-3 bg-muted',
            rangeBaseClassName,
            '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
            '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5',
          )}
          style={scrubStyle}
        />
      </div>
    </div>
  );
}
