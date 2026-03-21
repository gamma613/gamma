"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { usePlayerControlsReady } from "../context/usePlayerControlsReady";
import { usePlayer } from "../context/usePlayer";

// ----------------------------------------------------------------------

type MuteButtonProps = Pick<ButtonProps, "className" | "variant">;

export function MuteButton({ className, ...buttonProps }: MuteButtonProps) {
  const { isReady, disabled, gateClassName } = usePlayerControlsReady();
  const { muted, volume, setMuted, setVolume } = usePlayer();

  const lastNonZeroVolumeRef = useRef(1);
  useEffect(() => {
    if (Number.isFinite(volume) && volume > 0) lastNonZeroVolumeRef.current = volume;
  }, [volume]);

  const effectivelyMuted = muted || volume === 0;
  const label = effectivelyMuted ? "Unmute" : "Mute";
  const icon = effectivelyMuted ? faVolumeXmark : faVolumeHigh;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-disabled={disabled}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!isReady) return;
            if (effectivelyMuted) {
              setMuted(false);
              if (volume === 0) {
                const nextVol =
                  lastNonZeroVolumeRef.current > 0 ? lastNonZeroVolumeRef.current : 0.5;
                setVolume(nextVol);
              }
              return;
            }
            setMuted(true);
          }}
          variant="outline"
          className={cn(gateClassName, className)}
          {...buttonProps}
        >
          <FontAwesomeIcon icon={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
