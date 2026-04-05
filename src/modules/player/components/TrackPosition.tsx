'use client';

import { cn } from '@/lib/utils';
import type React from 'react';
import { usePlayerMain } from '../context/usePlayerMain';
import { usePlayerProgress } from '../context/usePlayerProgress';
import { formatTrackTime } from '../utils';

// ----------------------------------------------------------------------

type TrackPositionProps<T extends React.ElementType = 'span'> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function TrackPosition<T extends React.ElementType = 'span'>({
  as,
  className,
  ...props
}: TrackPositionProps<T>) {
  const { track } = usePlayerMain();
  const { positionSeconds } = usePlayerProgress();

  if (!track) return null;

  const formattedTime = formatTrackTime(positionSeconds);

  const Comp = (as ?? 'span') as React.ElementType;
  return (
    <Comp
      aria-label={`Track position: ${formattedTime}`}
      className={cn('tabular-nums', className)}
      {...props}
    >
      {formattedTime}
    </Comp>
  );
}
