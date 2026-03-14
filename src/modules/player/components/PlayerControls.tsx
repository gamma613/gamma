'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePlayer } from '../context/usePlayer';
import { MuteWithVolume } from './MuteWithVolume';

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
    positionSeconds,
    durationSeconds,
  } = usePlayer();

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

        <MuteWithVolume anchor="bottom" />

        <div className="ml-auto flex flex-col items-start">
          {track.title ? (
            <div className="w-full max-w-[12rem] sm:max-w-[16rem] truncate text-xs leading-none text-muted-foreground" title={track.title}>
              {track.title}
            </div>
          ) : null}

          <div className="flex items-center gap-2 tabular-nums text-xs leading-none text-muted-foreground">
            <span className="text-foreground">{formatTime(positionSeconds)}</span>
            <span className="hidden sm:inline">/</span>
            <span className="hidden sm:inline">{formatTime(durationSeconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
