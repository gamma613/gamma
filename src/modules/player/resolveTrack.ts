"use client";

import { ROUTES } from "@/lib/routes";
import { allMixes } from "content-collections";

import type { PlayerTrack, PlayerTrackId } from "./context/types";

export function resolveTrack(trackId: PlayerTrackId): PlayerTrack | null {
  if (trackId.kind === "mixes") {
    const mix = allMixes.find((item) => item.slug === trackId.slug);
    return {
      kind: "mixes",
      slug: trackId.slug,
      src: `/api/stream/mixes/${trackId.slug}`,
      title: mix?.title ?? trackId.slug,
      artist: mix?.artist ?? undefined,
      cover: ROUTES.mixes(trackId.slug).art("cover"),
    };
  }

  // Future kinds: ensure the player can still function with minimal metadata.
  return {
    kind: trackId.kind,
    slug: trackId.slug,
    src: `/api/stream/${trackId.kind}/${trackId.slug}`,
    title: trackId.slug,
  };
}
