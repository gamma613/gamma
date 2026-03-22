"use client";

import { allMusic } from "content-collections";
import type { PlayerTrackId } from "./context/types";

export function getRecentTrackIds(): PlayerTrackId[] {
  const items = allMusic
    .map((item) => ({ slug: item.slug, ts: item.date.getTime() }))
    .sort((a, b) => b.ts - a.ts || a.slug.localeCompare(b.slug));

  return items.map((x) => x.slug);
}
