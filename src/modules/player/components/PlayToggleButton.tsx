'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type PlayButtonToggleProps = Pick<ButtonProps, 'className' | 'variant'>;

export const PlayToggleButton = ({ className, ...buttonProps }: PlayButtonToggleProps) => {
  const { isReady, disabled } = usePlayerControlsReady();
  const { playing, toggle } = usePlayer();
  const label = playing ? 'Pause' : 'Play';
  const icon = playing ? faPause : faPlay;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-disabled={disabled}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!isReady) return;
            toggle();
          }}
          className={className}
          {...buttonProps}
        >
          <FontAwesomeIcon icon={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
};
