'use client';

import { Slider, SliderProps } from '@/components/ui/slider';
import { useHydrated } from '@/lib/useHydrated';
import { cn } from '@/lib/utils';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type VolumeSliderProps = Pick<SliderProps, 'className' | 'orientation'>

export function VolumeSlider({ ...sliderProps }: VolumeSliderProps) {
  const hydrated = useHydrated();
  const { ready, muted, volume, setMuted, setVolume } = usePlayer();

  const isReady = hydrated && ready;

  const v = muted ? 0 : volume;
  const sliderValue = isReady ? [Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0] : [0];

  return (
    <Slider
      aria-label="Volume"
      aria-disabled={!isReady}
      max={1}
      disabled={!isReady}
      onValueChange={(next) => {
        if (!isReady) return;
        const v = next[0] ?? 0;
        setVolume(v);
        setMuted(v === 0);
      }}
      step={0.01}
      value={sliderValue}
      {...sliderProps}
      className={cn(!isReady && 'invisible pointer-events-none', sliderProps.className)}
    />
);
}
