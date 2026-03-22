"use client";

import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

export function RemoveButton({
  onClick,
  disabled,
  className,
  label = "Remove",
}: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-disabled={disabled}
          aria-label={label}
          onClick={onClick}
          className={cn("text-muted-foreground hover:text-foreground", className)}
        >
          <FontAwesomeIcon icon={faCircleXmark} className="size-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
