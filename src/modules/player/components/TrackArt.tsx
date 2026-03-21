"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo } from "react";
import { ROUTES } from "@/lib/routes";
import { usePlayer } from "../context/usePlayer";

// ----------------------------------------------------------------------

export type TrackArtProps = Omit<ImageProps, "src" | "alt"> & {
  alt?: string;
  type?: string;
};

export function TrackArt(props: TrackArtProps) {
  const { track } = usePlayer();

  const trackKind = track?.kind;
  const trackSlug = track?.slug;
  const trackCover = track?.cover;
  const { type: artType = "cover", alt, ...imageProps } = props;

  const artSrc = useMemo(() => {
    // Prefer explicit metadata over deriving URLs from the stream src.
    if (artType === "cover" && trackCover) return trackCover;

    if (!trackSlug || !trackKind) return null;
    const routeFactory = ROUTES[trackKind as keyof typeof ROUTES];
    if (!routeFactory) return null;
    return routeFactory(encodeURIComponent(trackSlug)).art(artType);
  }, [artType, trackCover, trackKind, trackSlug]);

  if (!artSrc) return null;

  const resolvedAlt = alt ?? `${artType} art${track?.title ? ` for ${track.title}` : ""}`;

  return <Image src={artSrc} alt={resolvedAlt} {...imageProps} />;
}
