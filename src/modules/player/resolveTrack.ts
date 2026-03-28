'use client';

import { ROUTES } from '@/lib/routes';
import { allMusic } from 'content-collections';
import type { PlayerTrack, PlayerTrackId } from './context/types';

export function resolveTrack(trackId: PlayerTrackId): PlayerTrack | null {
  const item = allMusic.find((doc) => doc.slug === trackId);
  if (item) {
    return {
      slug: trackId,
      src: `/api/stream/music/${trackId}`,
      title: item.title ?? trackId,
      artist: item.artist ?? undefined,
      cover: ROUTES.music(trackId).art('cover'),
    };
  }

  // Fallback: ensure the player can still function with minimal metadata.
  return {
    slug: trackId,
    src: `/api/stream/music/${trackId}`,
    title: trackId,
  };
}
