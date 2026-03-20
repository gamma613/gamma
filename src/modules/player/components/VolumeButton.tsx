'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  faVolume,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';
import { usePlayer } from '../context/usePlayer';
// ----------------------------------------------------------------------

type Props = ButtonProps & {
  active?: boolean;
};

export function VolumeButton({ active, className, disabled: disabledProp, ...buttonProps }: Props) {
  const { disabled: playerDisabled } = usePlayerControlsReady();
  const disabled = Boolean(disabledProp) || playerDisabled;
  const { muted, volume } = usePlayer();

  const label = 'Adjust Volume';

  let icon = faVolume;
  if (muted || volume === 0) {
    icon = faVolumeXmark;
  } else if (volume >= 0.66) {
    icon = faVolumeHigh;
  } else if (volume <= 0.33) {
    icon = faVolumeLow;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={label}
          aria-expanded={active}
          aria-disabled={disabled}
          disabled={disabled}
          className={cn(active && 'bg-accent text-accent-foreground', className)}
          {...buttonProps}
        >
          <FontAwesomeIcon icon={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
