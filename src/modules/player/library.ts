"use client";

import { allMixes } from "content-collections";
import type { PlayerTrackId } from "./context/types";

type DatedTrackId = PlayerTrackId & { ts: number };

export function getRecentTrackIds(): PlayerTrackId[] {
  const items: DatedTrackId[] = allMixes.map((mix) => ({
    kind: "mixes",
    slug: mix.slug,
    ts: mix.date.getTime(),
  }));

  items.sort((a, b) => b.ts - a.ts || a.kind.localeCompare(b.kind) || a.slug.localeCompare(b.slug));

  return items.map(({ kind, slug }) => ({ kind, slug }));
}
