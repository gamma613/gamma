'use client';

import { useMemo } from 'react';
import { Slider, SliderProps } from '@/components/ui/slider';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type VolumeSliderProps = Pick<SliderProps, 'className' | 'orientation'>

export function VolumeSlider({ ...sliderProps }: VolumeSliderProps) {
  const { muted, volume, setMuted, setVolume } = usePlayer();

  const sliderValue = useMemo(() => {
    const v = muted ? 0 : volume;
    if (!Number.isFinite(v)) return [0];
    return [Math.max(0, Math.min(1, v))];
  }, [muted, volume]);

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
