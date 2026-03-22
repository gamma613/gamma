"use client";

import type React from "react";
import { usePlayer } from "../context/usePlayer";
import { TitleArtist, TitleArtistProps } from "@/components/music";

// ----------------------------------------------------------------------

type TrackTitleArtistProps = Omit<TitleArtistProps, "artist" | "title">;

export function TrackTitleArtist({ ...props }: TrackTitleArtistProps) {
  const { track } = usePlayer();
  if (!track) return null;

  return <TitleArtist artist={track.artist} title={track.title} {...props} />;
}
