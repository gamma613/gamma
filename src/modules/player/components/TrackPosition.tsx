"use client";

import type React from "react";
import { usePlayer } from "../context/usePlayer";
import { formatTrackTime } from "../utils";

// ----------------------------------------------------------------------

type TrackPositionProps<T extends React.ElementType = "span"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export function TrackPosition<T extends React.ElementType = "span">({
  as,
  ...props
}: TrackPositionProps<T>) {
  const { positionSeconds, track } = usePlayer();

  if (!track) return null;

  const formattedTime = formatTrackTime(positionSeconds);

  const Comp = (as ?? "span") as React.ElementType;
  return (
    <Comp {...props} aria-label={`Track position: ${formattedTime}`}>
      {formattedTime}
    </Comp>
  );
}
