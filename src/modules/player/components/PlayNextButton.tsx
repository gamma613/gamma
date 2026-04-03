'use client';

import { IconButton, IconButtonProps } from '@/components/buttons/IconButton';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons';
import type { PlayerTrackId } from '../context/types';
import { usePlayerMain } from '../context/usePlayerMain';

// ----------------------------------------------------------------------

type Props = Omit<IconButtonProps, 'onClick' | 'icon' | 'label'> & {
  label?: string;
  trackId: PlayerTrackId;
};

export function PlayNextButton({
  disabled,
  label = 'Play next',
  trackId,
  variant = 'ghost',
  ...buttonProps
}: Props) {
  const { queue, queueNext } = usePlayerMain();
  const isAlreadyNext = queue[0] === trackId;

  return (
    <IconButton
      disabled={disabled || isAlreadyNext}
      icon={faForwardStep}
      label={label}
      onClick={() => queueNext(trackId)}
      type="button"
      variant={variant}
      {...buttonProps}
    />
  );
}
