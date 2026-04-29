'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger, type ButtonProps } from '@/components';
import { faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';
import { usePlayerMain } from '../context/usePlayerMain';

type PreviousButtonProps = Pick<ButtonProps, 'className' | 'variant'>;

export function PreviousButton({ className, ...buttonProps }: PreviousButtonProps) {
  const { isReady } = usePlayerControlsReady();
  const { track, playPrevious } = usePlayerMain();

  const disabled = !isReady || !track;
  const label = 'Previous';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            playPrevious();
          }}
          className={className}
          {...buttonProps}
        >
          <FontAwesomeIcon icon={faBackwardStep} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
