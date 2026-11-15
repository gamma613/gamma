'use client';

import { cn } from '@/lib/utils';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import * as React from 'react';

const TooltipProvider = TooltipPrimitive.Provider;
const TOUCH_OPEN_DELAY = 700;

type TouchTooltipActions = { openTouch: () => void };
const TouchTooltipContext = React.createContext<TouchTooltipActions | null>(null);

function Tooltip({
  disableHoverableContent = true,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const [touchOpen, setTouchOpen] = React.useState(false);
  const touchOpenRef = React.useRef(false);
  const isOpen = (open ?? internalOpen) || touchOpen;

  const openTouch = React.useCallback(() => {
    if (touchOpenRef.current) return;
    touchOpenRef.current = true;
    setTouchOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  React.useEffect(() => {
    if (!touchOpen) return;

    const closeOnClick = () => {
      touchOpenRef.current = false;
      setTouchOpen(false);
      if (open === undefined) setInternalOpen(false);
      onOpenChange?.(false);
    };
    document.addEventListener('click', closeOnClick);
    return () => document.removeEventListener('click', closeOnClick);
  }, [onOpenChange, open, touchOpen]);

  return (
    <TouchTooltipContext.Provider value={{ openTouch }}>
      <TooltipPrimitive.Root
        {...props}
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (open === undefined) setInternalOpen(nextOpen);
          onOpenChange?.(nextOpen);
        }}
        disableHoverableContent={disableHoverableContent}
        delayDuration={delayDuration}
      />
    </TouchTooltipContext.Provider>
  );
}

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
  const touchTooltip = React.useContext(TouchTooltipContext);
  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const didOpenOnTouch = React.useRef(false);
  const suppressClick = React.useRef(false);

  React.useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
    },
    []
  );

  return (
    <TooltipPrimitive.Trigger
      {...props}
      ref={ref}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        if (event.defaultPrevented || event.pointerType !== 'touch') return;
        didOpenOnTouch.current = false;
        if (openTimer.current) clearTimeout(openTimer.current);
        openTimer.current = setTimeout(() => {
          didOpenOnTouch.current = true;
          touchTooltip?.openTouch();
        }, TOUCH_OPEN_DELAY);
      }}
      onPointerUp={(event) => {
        props.onPointerUp?.(event);
        if (openTimer.current) clearTimeout(openTimer.current);
        if (didOpenOnTouch.current) suppressClick.current = true;
      }}
      onPointerCancel={(event) => {
        props.onPointerCancel?.(event);
        if (openTimer.current) clearTimeout(openTimer.current);
        didOpenOnTouch.current = false;
      }}
      onClickCapture={(event) => {
        props.onClickCapture?.(event);
        if (!suppressClick.current) return;
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
    />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, sideOffset = 0, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    data-slot="tooltip-content"
    className={cn(
      'z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md',
      'pointer-events-none',
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  >
    {children}
    <TooltipPrimitive.Arrow className="fill-popover" />
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
