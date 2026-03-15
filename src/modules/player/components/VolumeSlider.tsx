'use client';

import { Slider, SliderProps } from '@/components/ui/slider';
import { useHydrated } from '@/lib/useHydrated';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type VolumeSliderProps = Pick<SliderProps, 'className' | 'orientation'>

export function VolumeSlider({ ...sliderProps }: VolumeSliderProps) {
  const hydrated = useHydrated();
  const { ready, muted, volume, setMuted, setVolume } = usePlayer();

  if (!hydrated || !ready) return null;

  const v = muted ? 0 : volume;
  const sliderValue = [Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0];

  return (
    <Slider
      aria-label="Volume"
      max={1}
      onValueChange={(next) => {
        const v = next[0] ?? 0;
        setVolume(v);
        setMuted(v === 0);
      }}
      step={0.01}
      value={sliderValue}
      {...sliderProps}
    />
);
}
