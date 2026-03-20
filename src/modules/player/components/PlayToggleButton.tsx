'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type PlayButtonToggleProps = Pick<ButtonProps, 'className' | 'variant'>;

export const PlayToggleButton = ({ ...buttonProps }: PlayButtonToggleProps) => {
  const { playing, toggle } = usePlayer();
  const label = playing ? 'Pause' : 'Play';
  const icon = playing ? faPause : faPlay;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={label} type="button" onClick={() => toggle()} {...buttonProps}>
          <FontAwesomeIcon icon={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
};
