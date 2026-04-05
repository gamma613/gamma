'use client';

import { cn } from '@/lib/utils';
import type React from 'react';
import { usePlayerMain } from '../context/usePlayerMain';
import { formatTrackTime } from '../utils';

// ----------------------------------------------------------------------

type TrackDurationProps<T extends React.ElementType = 'span'> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function TrackDuration<T extends React.ElementType = 'span'>({
  as,
  className,
  ...props
}: TrackDurationProps<T>) {
  const { durationSeconds, track } = usePlayerMain();

  if (!track) return null;

  const formattedTime = formatTrackTime(durationSeconds);

  const Comp = (as ?? 'span') as React.ElementType;
  return (
    <Comp
      aria-label={`Track duration: ${formattedTime}`}
      className={cn('tabular-nums', className)}
      {...props}
    >
      {formattedTime}
    </Comp>
  );
}
