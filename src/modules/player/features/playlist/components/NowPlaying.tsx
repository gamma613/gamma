'use client';

import { H2 } from '@/components';
import { getMusicBySlug } from '@/lib/music/allMusicIndex';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { MusicRow } from './MusicRow';

// ----------------------------------------------------------------------

export function NowPlaying() {
  const { track } = usePlayerMain();
  if (!track?.slug) return null;
  const item = track?.slug ? getMusicBySlug(track.slug) : null;

  return (
    <div className="space-y-2">
      <H2>Now playing</H2>
      <MusicRow
        trackId={track.slug}
        item={
          item
            ? {
                slug: item.slug,
                title: item.title,
                artist: item.artist,
                type: item.type,
                genres: item.genres,
              }
            : {
                slug: track.slug,
                title: track.title ?? track.slug,
                artist: track.artist,
              }
        }
        left={<PlayInPlayerButton slug={track.slug} className="size-9 shrink-0" />}
      />
    </div>
  );
}
