import { ROUTES } from '@/lib/routes';
import { allMusic } from 'content-collections';
import { cache } from 'react';

export const getMusicItem = cache((slug: string) => {
  const item = allMusic.find((doc) => doc.slug === slug);
  if (!item) return undefined;

  return {
    ...item,
    src: `/api/stream/music/${item.slug}`,
    // Normalize nullable fields to `undefined` for easier consumption in UI.
    artist: item.artist ?? undefined,
    artwork: {
      cover: ROUTES.music(item.slug).art('cover'),
    },
  };
});
