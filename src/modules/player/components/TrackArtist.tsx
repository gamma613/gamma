"use client";

import type React from "react";
import { usePlayer } from "../context/usePlayer";

// ----------------------------------------------------------------------

type TrackArtistProps<T extends React.ElementType = "span"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export function TrackArtist<T extends React.ElementType = "span">({
  as,
  ...props
}: TrackArtistProps<T>) {
  const { track } = usePlayer();

  if (!track?.artist) return null;

  const Comp = (as ?? "span") as React.ElementType;
  return <Comp {...props}>{track.artist}</Comp>;
}
