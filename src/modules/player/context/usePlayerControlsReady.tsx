"use client";

import { useHydrated } from "@/lib/useHydrated";
import { usePlayer } from "./usePlayer";

export function usePlayerControlsReady() {
  const hydrated = useHydrated();
  const { ready } = usePlayer();

  const isReady = hydrated && ready;

  return {
    isReady,
    disabled: !isReady,
    gateClassName: !isReady ? "invisible pointer-events-none" : undefined,
  };
}
