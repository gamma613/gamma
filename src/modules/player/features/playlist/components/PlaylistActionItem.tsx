'use client';

import { Button, type ButtonProps } from '@/components';
import { cn } from '@/lib/utils';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ----------------------------------------------------------------------

export function PlaylistActionItem({
  icon,
  label,
  className,
  ...buttonProps
}: Omit<ButtonProps, 'children'> & { icon: IconProp; label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('w-full justify-start gap-2 px-3', className)}
      {...buttonProps}
    >
      <FontAwesomeIcon icon={icon} className="size-4 shrink-0" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}
