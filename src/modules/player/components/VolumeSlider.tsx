'use client';

import { Slider, SliderProps, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { usePlayer } from '../context/usePlayer';
import { usePlayerControlsReady } from '../context/usePlayerControlsReady';

// ----------------------------------------------------------------------

type VolumeSliderProps = {
  className?: string;
  orientation?: SliderProps['orientation'];
  sliderProps?: Pick<SliderProps, 'className' | 'trackClassName'>;
};

export function VolumeSlider({
  className,
  orientation = 'horizontal',
  sliderProps,
}: VolumeSliderProps) {
  const { isReady, gateClassName } = usePlayerControlsReady();
  const { muted, volume, setMuted, setVolume } = usePlayer();

  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [hoverY, setHoverY] = useState(0);
  const [hoverPercent, setHoverPercent] = useState(0);
  const rafRef = useRef<number | null>(null);

  const isVertical = orientation === 'vertical';

  const v = muted ? 0 : volume;
  const sliderValue = isReady ? [Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0] : [0];

  return (
    <div className={cn('relative', gateClassName, className)}>
      <Tooltip open={isReady && hoverOpen}>
        <TooltipTrigger asChild>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={
              isVertical
                ? { right: 0, marginLeft: '-10px', top: hoverY, transform: 'translateX(-50%)' }
                : { left: hoverX, top: 0 }
            }
          />
        </TooltipTrigger>
        <TooltipContent side={isVertical ? 'right' : 'top'} sideOffset={8}>
          {/* {`Adjust volume to ${Math.round(hoverPercent)}%`} */}
          {`${Math.round(hoverPercent)}%`}
        </TooltipContent>
      </Tooltip>

      <Slider
        aria-label="Volume"
        aria-disabled={!isReady}
        max={1}
        disabled={!isReady}
        orientation={orientation}
        trackClassName={sliderProps?.trackClassName}
        onPointerEnter={() => setHoverOpen(true)}
        onPointerLeave={() => setHoverOpen(false)}
        onPointerMove={(e) => {
          if (!isReady) return;

          const el = e.currentTarget as HTMLElement;
          const rect = el.getBoundingClientRect();
          const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

          let pct = 0;
          if (isVertical) {
            pct = rect.height > 0 ? 1 - y / rect.height : 0;
          } else {
            pct = rect.width > 0 ? x / rect.width : 0;
          }

          const percent = Math.max(0, Math.min(100, pct * 100));

          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            setHoverX(x);
            setHoverY(y);
            setHoverPercent(percent);
            rafRef.current = null;
          });
        }}
        onValueChange={(next) => {
          if (!isReady) return;
          const v = next[0] ?? 0;
          setVolume(v);
          setMuted(v === 0);
        }}
        step={0.01}
        value={sliderValue}
        className={cn(
          'w-full h-full',
          '**:data-[slot=slider-thumb]:opacity-0',
          isVertical && 'data-vertical:min-h-0',
          sliderProps?.className
        )}
      />
    </div>
  );
}
