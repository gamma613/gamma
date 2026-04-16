import { cn } from '@/lib/utils';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { TooltipButton, type TooltipButtonProps } from './TooltipButton';

// ----------------------------------------------------------------------

type ButtonSize = TooltipButtonProps['size'];

const defaultIconClassNameBySize: Partial<Record<NonNullable<ButtonSize>, string>> = {
  'icon-xs': 'size-3',
  'icon-sm': 'size-3.5',
  icon: 'size-4',
  'icon-lg': 'size-5',
};

export type IconButtonProps = Omit<TooltipButtonProps, 'children'> & {
  icon: IconProp;
  iconClassName?: string;
  iconProps?: Omit<FontAwesomeIconProps, 'icon' | 'className'>;
};

export function IconButton({
  icon,
  iconClassName,
  iconProps,
  label,
  size = 'icon-sm',
  ...buttonProps
}: IconButtonProps) {
  const effectiveSize = size ?? 'icon-sm';
  return (
    <TooltipButton label={label} size={effectiveSize} {...buttonProps}>
      <FontAwesomeIcon
        icon={icon}
        className={cn(defaultIconClassNameBySize[effectiveSize] ?? 'size-4', iconClassName)}
        {...iconProps}
      />
    </TooltipButton>
  );
}
