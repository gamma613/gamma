"use client";

import { Button } from "@/components/ui/button";
import { usePlayer } from "../context/usePlayer";
import type { PlayerTrackId } from "../context/types";

// ----------------------------------------------------------------------

export function PlayNextButton({
  trackId,
  className,
}: {
  trackId: PlayerTrackId;
  className?: string;
}) {
  const { queue, queueNext } = usePlayer();
  const isAlreadyNext = queue[0] === trackId;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isAlreadyNext}
      aria-disabled={isAlreadyNext}
      onClick={() => queueNext(trackId)}
      className={className}
    >
      Play next
    </Button>
  );
}
