'use client';

import { TitleArtist, TitleArtistProps } from '@/components';
import { usePlayerMain } from '../context/usePlayerMain';

// ----------------------------------------------------------------------

type TrackTitleArtistProps = Omit<TitleArtistProps, 'artist' | 'title'>;

export function TrackTitleArtist({ ...props }: TrackTitleArtistProps) {
  const { track } = usePlayerMain();
  if (!track) return null;

  return <TitleArtist artist={track.artist} title={track.title} {...props} />;
}
