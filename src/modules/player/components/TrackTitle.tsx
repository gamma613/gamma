'use client';

import type React from 'react';
import { usePlayerMain } from '../context/usePlayerMain';

// ----------------------------------------------------------------------

type TrackTitleProps<T extends React.ElementType = 'span'> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function TrackTitle<T extends React.ElementType = 'span'>({
  as,
  ...props
}: TrackTitleProps<T>) {
  const { track } = usePlayerMain();

  if (!track?.title) return null;

  const Comp = (as ?? 'span') as React.ElementType;
  return <Comp {...props}>{track.title}</Comp>;
}
