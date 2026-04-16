'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger, type ButtonProps } from '@/components';
import * as React from 'react';

// ----------------------------------------------------------------------

export type TooltipButtonProps = ButtonProps & {
  label: string;
  children: React.ReactNode;
};

export function TooltipButton({ label, children, ...buttonProps }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={label} {...buttonProps}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
