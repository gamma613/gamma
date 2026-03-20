"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SliderExtraProps = {
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
};

function Slider({
  className,
  trackClassName,
  rangeClassName,
  thumbClassName,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & SliderExtraProps) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted cursor-pointer data-disabled:cursor-not-allowed data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5",
          trackClassName,
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full",
            rangeClassName,
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 cursor-pointer data-disabled:cursor-not-allowed transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            thumbClassName,
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
export type SliderProps = React.ComponentPropsWithoutRef<typeof Slider>;
