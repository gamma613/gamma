"use client";

import * as React from "react";
import { Button, type ButtonProps, Tooltip, TooltipContent, TooltipTrigger } from "@/components";

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
