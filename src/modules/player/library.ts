'use client';

import { allMusic } from 'content-collections';
import type { PlayerTrackId } from './context/types';

let cachedCatalogKey = '';
let cachedTrackIds: PlayerTrackId[] = [];

export function getRecentTrackIds(): PlayerTrackId[] {
  const items = allMusic
    .map((item) => ({ slug: item.slug, ts: item.date.getTime() }))
    .sort((a, b) => b.ts - a.ts || a.slug.localeCompare(b.slug));

  const catalogKey = items.map((item) => `${item.slug}:${item.ts}`).join('|');
  if (catalogKey !== cachedCatalogKey) {
    cachedCatalogKey = catalogKey;
    cachedTrackIds = items.map((item) => item.slug);
  }

  return cachedTrackIds;
}
