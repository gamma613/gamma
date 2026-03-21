"use client";

import { allMixes } from "content-collections";
import type { PlayerTrackId } from "./context/types";

type DatedTrackId = PlayerTrackId & { ts: number };

function toTimestamp(dateLike: unknown): number {
  if (!dateLike) return 0;
  if (dateLike instanceof Date) return dateLike.getTime();
  const d = new Date(String(dateLike));
  const ts = d.getTime();
  return Number.isFinite(ts) ? ts : 0;
}

export function getRecentTrackIds(): PlayerTrackId[] {
  const items: DatedTrackId[] = allMixes.map((mix) => ({
    kind: "mixes",
    slug: mix.slug,
    ts: toTimestamp(mix.date),
  }));

  items.sort((a, b) => b.ts - a.ts || a.kind.localeCompare(b.kind) || a.slug.localeCompare(b.slug));

  return items.map(({ kind, slug }) => ({ kind, slug }));
}
