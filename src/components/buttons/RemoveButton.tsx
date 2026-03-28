'use client';

import { cn } from '@/lib/utils';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonProps } from './IconButton';

// ----------------------------------------------------------------------

type Props = Omit<IconButtonProps, 'icon' | 'label'> & {
  label?: string;
};

export function RemoveButton({
  className,
  label = 'Remove',
  variant = 'ghost',
  ...buttonProps
}: Props) {
  return (
    <IconButton
      type="button"
      variant={variant}
      className={cn('text-muted-foreground hover:text-foreground', className)}
      label={label}
      icon={faCircleXmark}
      {...buttonProps}
    />
  );
}
