'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VolumeHighIcon, VolumeLowIcon, VolumeMute02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { usePlayer } from '../context/usePlayer';
// ----------------------------------------------------------------------

type Props = ButtonProps & {
  active?: boolean;
};

export function VolumeButton({ active, className, ...buttonProps }: Props) {
  const { muted, volume } = usePlayer();

  const label = 'Adjust Volume';

  let buttonIcon = VolumeHighIcon;
  if (muted || volume === 0) {
    buttonIcon = VolumeMute02Icon;
  } else if (volume < 0.5) {
    buttonIcon = VolumeLowIcon;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={label}
          aria-expanded={active}
          className={cn(active && 'bg-accent text-accent-foreground', className)}
          {...buttonProps}
        >
          <HugeiconsIcon icon={buttonIcon} size={22} color="currentColor" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
