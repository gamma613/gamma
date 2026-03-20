"use client";

import type React from "react";
import { usePlayer } from "../context/usePlayer";
import { formatTrackTime } from "../utils";

// ----------------------------------------------------------------------

type TrackDurationProps<T extends React.ElementType = "span"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export function TrackDuration<T extends React.ElementType = "span">({
  as,
  ...props
}: TrackDurationProps<T>) {
  const { durationSeconds, track } = usePlayer();

  if (!track) return null;

  const formattedTime = formatTrackTime(durationSeconds);

  const Comp = (as ?? "span") as React.ElementType;
  return (
    <Comp {...props} aria-label={`Track duration: ${formattedTime}`}>
      {formattedTime}
    </Comp>
  );
}
