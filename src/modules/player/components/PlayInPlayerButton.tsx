'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { cn } from '@/lib/utils';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';
import { usePlayerMain } from '../context/usePlayerMain';
import { usePlayerProgress } from '../context/usePlayerProgress';

// ----------------------------------------------------------------------

export function PlayInPlayerButton({ slug, className }: { slug: string; className?: string }) {
  const { disabled, gateClassName, isReady } = usePlayerControlsReady();
  const { playId, toggle, track, playing, durationSeconds } = usePlayerMain();
  const { positionSeconds } = usePlayerProgress();

  const isCurrent = track?.slug === slug;
  const isCurrentAndPlaying = Boolean(isCurrent && playing);

  const progress =
    isCurrent &&
    Number.isFinite(positionSeconds) &&
    Number.isFinite(durationSeconds) &&
    durationSeconds > 0
      ? Math.max(0, Math.min(1, positionSeconds / durationSeconds))
      : null;

  const label = isCurrentAndPlaying ? 'Pause' : 'Play';
  const icon = isCurrentAndPlaying ? faPause : faPlay;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={label}
          aria-disabled={disabled}
          disabled={disabled}
          className={cn(gateClassName, 'relative rounded-full p-0', className ?? 'size-10')}
          onClick={() => {
            if (!isReady) return;

            if (isCurrent) {
              toggle();
              return;
            }

            playId(slug);
          }}
        >
          {progress !== null && (
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="pointer-events-none absolute -inset-[3px] size-[calc(100%+6px)] -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                className="stroke-muted-foreground/20"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                className="stroke-primary"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={(1 - progress) * 100}
              />
            </svg>
          )}

          <FontAwesomeIcon icon={icon} className="relative z-10 size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
