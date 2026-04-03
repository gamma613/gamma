'use client';

import type React from 'react';
import { usePlayerMain } from '../context/usePlayerMain';
import { usePlayerProgress } from '../context/usePlayerProgress';
import { formatTrackTime } from '../utils';

// ----------------------------------------------------------------------

type TrackPositionProps<T extends React.ElementType = 'span'> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function TrackPosition<T extends React.ElementType = 'span'>({
  as,
  ...props
}: TrackPositionProps<T>) {
  const { track } = usePlayerMain();
  const { positionSeconds } = usePlayerProgress();

  if (!track) return null;

  const formattedTime = formatTrackTime(positionSeconds);

  const Comp = (as ?? 'span') as React.ElementType;
  return (
    <Comp {...props} aria-label={`Track position: ${formattedTime}`}>
      {formattedTime}
    </Comp>
  );
}
