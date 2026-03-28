'use client';

import { TitleArtist, TitleArtistProps } from '@/components';
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

type TrackTitleArtistProps = Omit<TitleArtistProps, 'artist' | 'title'>;

export function TrackTitleArtist({ ...props }: TrackTitleArtistProps) {
  const { track } = usePlayer();
  if (!track) return null;

  return <TitleArtist artist={track.artist} title={track.title} {...props} />;
}
