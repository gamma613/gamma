'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger, type ButtonProps } from '@/components';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';
import { usePlayerMain } from '../context/usePlayerMain';

type NextButtonProps = Pick<ButtonProps, 'className' | 'variant'>;

export function NextButton({ className, ...buttonProps }: NextButtonProps) {
  const { isReady } = usePlayerControlsReady();
  const { track, playNext } = usePlayerMain();

  const disabled = !isReady || !track;
  const label = 'Next';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            playNext();
          }}
          className={className}
          {...buttonProps}
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
