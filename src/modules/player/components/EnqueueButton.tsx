"use client";

import { Button } from "@/components";
import { usePlayer } from "../context/usePlayer";
import type { PlayerTrackId } from "../context/types";

// ----------------------------------------------------------------------

export function EnqueueButton({
  trackId,
  className,
}: {
  trackId: PlayerTrackId;
  className?: string;
}) {
  const { queue, enqueue } = usePlayer();
  const isAlreadyQueued = queue.includes(trackId);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isAlreadyQueued}
      aria-disabled={isAlreadyQueued}
      onClick={() => enqueue(trackId)}
      className={className}
    >
      Enqueue
    </Button>
  );
}
