'use client';

import { IconButton, IconButtonProps } from '@/components/buttons/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { PlayerTrackId } from '../context/types';
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type Props = Omit<IconButtonProps, 'onClick' | 'icon' | 'label'> & {
  label?: string;
  trackId: PlayerTrackId;
};

export function EnqueueButton({
  disabled,
  label = 'Enqueue',
  trackId,
  variant = 'ghost',
  ...buttonProps
}: Props) {
  const { queue, enqueue } = usePlayer();
  const isAlreadyQueued = queue.includes(trackId);

  return (
    <IconButton
      disabled={disabled || isAlreadyQueued}
      icon={faPlus}
      label={label}
      onClick={() => enqueue(trackId)}
      type="button"
      variant={variant}
      {...buttonProps}
    />
  );
}
