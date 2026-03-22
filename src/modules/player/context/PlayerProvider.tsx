"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEY, CHANNEL_NAME, CLAIM_KEY } from "../config";
import { PlayerContext } from "./PlayerContext";
import {
  PlayerActions,
  PlayerContextValue,
  PlayerState,
  PlayerTrack,
  PlayerTrackId,
} from "./types";
import { resolveTrack } from "../resolveTrack";
import { getRecentTrackIds } from "../library";

function getTabId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "gamma.player.tabId.v1";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const created = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  window.sessionStorage.setItem(key, created);
  return created;
}

function loadPersisted(): Partial<PlayerState> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerState> | null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function persist(state: PlayerState) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        track: state.track,
        playing: state.playing,
        muted: state.muted,
        volume: state.volume,
        positionSeconds: state.positionSeconds,
        durationSeconds: state.durationSeconds,
      } satisfies PlayerState),
    );
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

function slugFromSrc(src: string): string | null {
  const pathname = (() => {
    try {
      return new URL(src, "http://example.local").pathname;
    } catch {
      return src;
    }
  })();

  const m = pathname.match(/^\/api\/stream\/(?:music|mixes)\/([^/]+)\/?$/);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

function normalizeTrack(track: PlayerTrack): PlayerTrack {
  if (track.slug) return track;
  const derived = slugFromSrc(track.src);
  return { ...track, slug: derived ?? track.src };
}

function resolveAndNormalize(trackId: PlayerTrackId): PlayerTrack {
  const resolved = resolveTrack(trackId);
  if (!resolved) {
    return {
      slug: trackId,
      src: `/api/stream/music/${trackId}`,
      title: trackId,
    };
  }
  return normalizeTrack(resolved);
}

function normalizePersistedTrack(track: unknown): PlayerTrack | null {
  if (!track) return null;
  if (typeof track !== "object") return null;

  const src = (track as { src?: unknown }).src;
  const slug = (track as { slug?: unknown }).slug;
  if (typeof src !== "string") return null;

  if (typeof slug === "string" && slug) return normalizeTrack({ ...(track as PlayerTrack), slug });

  const derived = slugFromSrc(src);
  if (!derived) return normalizeTrack({ ...(track as PlayerTrack), slug: src });
  return normalizeTrack({ ...(track as PlayerTrack), slug: derived });
}

export function PlayerProvider({
  children,
  defaultTrack,
}: {
  children: React.ReactNode;
  defaultTrack?: PlayerTrack | PlayerTrackId;
}) {
  const tabId = useMemo(() => getTabId(), []);
  const recentTrackIds = useMemo(() => getRecentTrackIds(), []);
  const resolvedDefaultTrack = useMemo(() => {
    if (!defaultTrack) return null;
    if (typeof defaultTrack === "string") return resolveAndNormalize(defaultTrack);
    return normalizeTrack(defaultTrack);
  }, [defaultTrack]);

  // Important: keep the first client render identical to the server render to
  // avoid hydration mismatches. Persisted state is loaded after mount.
  const [state, setState] = useState<PlayerState>(() => ({
    track: null,
    playing: false,
    muted: false,
    volume: 0.8,
    positionSeconds: 0,
    durationSeconds: 0,
  }));
  const [didLoadPersisted, setDidLoadPersisted] = useState(false);

  useEffect(() => {
    const persisted = loadPersisted();

    const fallbackTrack = (() => {
      if (resolvedDefaultTrack) return resolvedDefaultTrack;
      const mostRecent = recentTrackIds[0];
      return mostRecent ? resolveAndNormalize(mostRecent) : null;
    })();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount to avoid SSR/client mismatch
    setState((s) => {
      const persistedTrack = persisted
        ? normalizePersistedTrack((persisted as { track?: unknown }).track)
        : null;

      const track = (() => {
        if (persistedTrack) {
          const d = resolvedDefaultTrack;
          if (d && persistedTrack.slug === d.slug) {
            return { ...d, ...persistedTrack };
          }
          return persistedTrack;
        }
        return fallbackTrack;
      })();

      return {
        ...s,
        track,
        // Restore "playing" state from persistence (browser may still block autoplay).
        playing:
          persisted && typeof persisted.playing === "boolean" ? persisted.playing : s.playing,
        muted: persisted && typeof persisted.muted === "boolean" ? persisted.muted : s.muted,
        volume: persisted && typeof persisted.volume === "number" ? persisted.volume : s.volume,
        positionSeconds:
          persisted && typeof persisted.positionSeconds === "number"
            ? persisted.positionSeconds
            : s.positionSeconds,
        durationSeconds:
          persisted && typeof persisted.durationSeconds === "number"
            ? persisted.durationSeconds
            : s.durationSeconds,
      };
    });

    setDidLoadPersisted(true);
  }, [recentTrackIds, resolvedDefaultTrack]);

  const stateRef = useRef<PlayerState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const lastPersistMsRef = useRef<number>(0);
  useEffect(() => {
    // Avoid overwriting storage with defaults before we've loaded persisted state.
    if (!didLoadPersisted) return;

    // Throttle persistence to avoid spamming localStorage on progress events.
    const now = Date.now();
    if (now - lastPersistMsRef.current < 1000) return;
    lastPersistMsRef.current = now;
    persist(state);
  }, [didLoadPersisted, state]);

  useEffect(() => {
    const flush = () => {
      persist(stateRef.current);
    };

    const onPageHide = () => flush();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Best-effort: ensure only one tab plays at a time.
    const channel = typeof window !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;
    if (!channel) return;

    const onMessage = (event: MessageEvent) => {
      const msg = event.data as { type?: string; tabId?: string } | null;
      if (!msg || msg.tabId === tabId) return;
      if (msg.type === "PLAY") setState((s) => ({ ...s, playing: false }));
    };

    channel.addEventListener("message", onMessage);
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, [tabId]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CLAIM_KEY || !event.newValue) return;
      try {
        const msg = JSON.parse(event.newValue) as { type?: string; tabId?: string } | null;
        if (!msg || msg.tabId === tabId) return;
        if (msg.type === "PLAY") setState((s) => ({ ...s, playing: false }));
      } catch {
        // Ignore invalid payloads.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [tabId]);

  const broadcastPlay = useCallback(() => {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: "PLAY", tabId });
      channel.close();
    } catch {
      // Ignore (unsupported / blocked).
    }

    try {
      window.localStorage.setItem(
        CLAIM_KEY,
        JSON.stringify({ type: "PLAY", tabId, ts: Date.now() }),
      );
    } catch {
      // Ignore.
    }
  }, [tabId]);

  const didBroadcastInitialPlayRef = useRef(false);
  useEffect(() => {
    if (!didLoadPersisted) return;
    if (didBroadcastInitialPlayRef.current) return;
    if (!state.playing) return;
    if (!state.track) return;
    broadcastPlay();
    didBroadcastInitialPlayRef.current = true;
  }, [broadcastPlay, didLoadPersisted, state.playing, state.track]);

  const play: PlayerActions["play"] = useCallback(
    (track, opts) => {
      const normalized = normalizeTrack(track);
      setState((s) => ({
        ...s,
        track: normalized,
        playing: true,
        durationSeconds: normalized.slug === s.track?.slug ? s.durationSeconds : 0,
        positionSeconds:
          typeof opts?.seekSeconds === "number"
            ? opts.seekSeconds
            : normalized.slug === s.track?.slug
              ? s.positionSeconds
              : 0,
      }));
      broadcastPlay();
    },
    [broadcastPlay],
  );

  const playId: PlayerActions["playId"] = useCallback(
    (trackId, opts) => {
      const resolved = resolveAndNormalize(trackId);
      play(resolved, opts);
    },
    [play],
  );

  const playNext: PlayerActions["playNext"] = useCallback(() => {
    if (recentTrackIds.length === 0) {
      setState((s) => ({ ...s, playing: false }));
      return;
    }

    const current = stateRef.current.track;
    const currentIndex = current ? recentTrackIds.findIndex((t) => t === current.slug) : -1;
    const next = recentTrackIds[currentIndex >= 0 ? (currentIndex + 1) % recentTrackIds.length : 0];
    playId(next);
  }, [playId, recentTrackIds]);

  const pause: PlayerActions["pause"] = useCallback(() => {
    setState((s) => ({ ...s, playing: false }));
  }, []);

  const toggle: PlayerActions["toggle"] = useCallback(() => {
    setState((s) => {
      const nextPlaying = !s.playing;
      if (nextPlaying) broadcastPlay();
      return { ...s, playing: nextPlaying };
    });
  }, [broadcastPlay]);

  const setPlaying: PlayerActions["setPlaying"] = useCallback(
    (nextPlaying) => {
      setState((s) => ({ ...s, playing: nextPlaying }));
      if (nextPlaying) broadcastPlay();
    },
    [broadcastPlay],
  );

  const setMuted: PlayerActions["setMuted"] = useCallback((nextMuted) => {
    setState((s) => ({ ...s, muted: nextMuted }));
  }, []);

  const setVolume: PlayerActions["setVolume"] = useCallback((nextVolume) => {
    const v = Math.max(0, Math.min(1, nextVolume));
    setState((s) => ({ ...s, volume: v }));
  }, []);

  const seek: PlayerActions["seek"] = useCallback((seconds) => {
    setState((s) => ({ ...s, positionSeconds: Math.max(0, seconds) }));
  }, []);

  const setDurationSeconds: PlayerActions["setDurationSeconds"] = useCallback((seconds) => {
    setState((s) => ({
      ...s,
      durationSeconds: Number.isFinite(seconds) ? seconds : s.durationSeconds,
    }));
  }, []);

  const setPositionSeconds: PlayerActions["setPositionSeconds"] = useCallback((seconds) => {
    setState((s) => ({
      ...s,
      positionSeconds: Number.isFinite(seconds) ? seconds : s.positionSeconds,
    }));
  }, []);

  const value: PlayerContextValue = useMemo(
    () => ({
      tabId,
      ready: didLoadPersisted,
      ...state,
      play,
      playId,
      playNext,
      pause,
      toggle,
      setPlaying,
      setMuted,
      setVolume,
      seek,
      setDurationSeconds,
      setPositionSeconds,
    }),
    [
      tabId,
      didLoadPersisted,
      state,
      play,
      playId,
      playNext,
      pause,
      toggle,
      setPlaying,
      setMuted,
      setVolume,
      seek,
      setDurationSeconds,
      setPositionSeconds,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
