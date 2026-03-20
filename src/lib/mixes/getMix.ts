import { cache } from "react";
import { allMixes } from "content-collections";
import { ROUTES } from "@/lib/routes";

export const getMix = cache((slug: string) => {
  const mix = allMixes.find((item) => item.slug === slug);
  if (!mix) return undefined;

  return {
    ...mix,
    kind: "mixes" as const,
    src: `/api/stream/mixes/${mix.slug}`,
    // Normalize nullable fields to `undefined` for easier consumption in UI.
    artist: mix.artist ?? undefined,
    artwork: {
      cover: ROUTES.mixes(mix.slug).art("cover"),
    },
  };
});
