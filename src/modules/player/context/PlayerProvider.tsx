'use client';

import { getMusicBySlug } from '@/lib/music/allMusicIndex';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHANNEL_NAME, CLAIM_KEY, STORAGE_KEY } from '../config';
import { getRecentTrackIds } from '../library';
import { resolveTrack } from '../resolveTrack';
import { PlayerMainContext } from './PlayerMainContext';
import { PlayerMediaContext } from './PlayerMediaContext';
import { PlayerProgressContext } from './PlayerProgressContext';
import { PlayerVolumeContext } from './PlayerVolumeContext';
import {
  PlayerActions,
  PlayerMainContextValue,
  PlayerProgressContextValue,
  PlayerState,
  PlayerTrack,
  PlayerTrackId,
  PlayerVolumeContextValue,
} from './types';

function computeOnDeck({
  libraryIds,
  queue,
  history,
  currentSlug,
}: {
  libraryIds: PlayerTrackId[];
  queue: PlayerTrackId[];
  history: PlayerTrackId[];
  currentSlug: string | null;
}): PlayerTrackId[] {
  // "History" is most-recent-first. OnDeck should be unique and exclude the current track,
  // with "most recently played" sinking toward the bottom. Queued items sink just above the current.
  // The current track is placed last.
  const lastPlayedRank = new Map<PlayerTrackId, number>();
  for (let i = 0; i < history.length; i += 1) {
    const id = history[i]!;
    if (!lastPlayedRank.has(id)) lastPlayedRank.set(id, i);
  }

  const queuePos = new Map<PlayerTrackId, number>();
  for (let i = 0; i < queue.length; i += 1) {
    const id = queue[i]!;
    if (!queuePos.has(id)) queuePos.set(id, i);
  }

  const libraryIndex = new Map<PlayerTrackId, number>();
  for (let i = 0; i < libraryIds.length; i += 1) libraryIndex.set(libraryIds[i]!, i);

  const MAX_RANK = 1_000_000_000;

  const sorted = libraryIds.slice().sort((a, b) => {
    const aIsCurrent = Boolean(currentSlug && a === currentSlug);
    const bIsCurrent = Boolean(currentSlug && b === currentSlug);
    if (aIsCurrent !== bIsCurrent) return aIsCurrent ? 1 : -1;

    const aQueued = queuePos.has(a);
    const bQueued = queuePos.has(b);
    if (aQueued !== bQueued) return aQueued ? 1 : -1;

    if (aQueued && bQueued) {
      // queue[0] should be closest to the tail, so sort queued items by position descending.
      return (queuePos.get(b) ?? 0) - (queuePos.get(a) ?? 0);
    }

    const ra = lastPlayedRank.get(a) ?? MAX_RANK;
    const rb = lastPlayedRank.get(b) ?? MAX_RANK;
    if (ra !== rb) return rb - ra; // higher index (less recent) comes first
    return (libraryIndex.get(a) ?? 0) - (libraryIndex.get(b) ?? 0);
  });

  return sorted;
}

function getTabId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'gamma.player.tabId.v1';
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const created = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  window.sessionStorage.setItem(key, created);
  return created;
}

function loadPersisted(): unknown | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

type PersistedPlayerStateV2 = Pick<
  PlayerState,
  'playing' | 'muted' | 'volume' | 'positionSeconds' | 'durationSeconds' | 'queue' | 'history'
> & {
  trackId: PlayerTrackId | null;
};

function persist(state: PlayerState) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        trackId: state.track?.slug ?? null,
        playing: state.playing,
        muted: state.muted,
        volume: state.volume,
        positionSeconds: state.positionSeconds,
        durationSeconds: state.durationSeconds,
        queue: state.queue,
        history: state.history,
      } satisfies PersistedPlayerStateV2)
    );
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

function slugFromSrc(src: string): string | null {
  const pathname = (() => {
    try {
      return new URL(src, 'http://example.local').pathname;
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
  if (typeof track !== 'object') return null;

  const { src } = track as { src?: unknown };
  const { slug } = track as { slug?: unknown };
  if (typeof src !== 'string') return null;

  if (typeof slug === 'string' && slug) return normalizeTrack({ ...(track as PlayerTrack), slug });

  const derived = slugFromSrc(src);
  if (!derived) return normalizeTrack({ ...(track as PlayerTrack), slug: src });
  return normalizeTrack({ ...(track as PlayerTrack), slug: derived });
}

function getPersistedTrackId(persisted: unknown): PlayerTrackId | null {
  if (!persisted || typeof persisted !== 'object') return null;

  const p = persisted as { trackId?: unknown; track?: unknown };

  // v2 format (preferred)
  if (typeof p.trackId === 'string' && p.trackId) return p.trackId;

  // v1 format (back-compat): persisted `track` object
  const normalized = normalizePersistedTrack(p.track);
  if (normalized?.slug) return normalized.slug;

  // v0-ish format: persisted `track` as a string
  if (typeof p.track === 'string' && p.track) return p.track;

  return null;
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
    if (typeof defaultTrack === 'string') return resolveAndNormalize(defaultTrack);
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
    queue: [],
    onDeck: [],
    history: [],
  }));
  const [didLoadPersisted, setDidLoadPersisted] = useState(false);

  useEffect(() => {
    const persisted = loadPersisted();

    const fallbackTrack = (() => {
      if (resolvedDefaultTrack) return resolvedDefaultTrack;
      const mostRecent = recentTrackIds[0];
      return mostRecent ? resolveAndNormalize(mostRecent) : null;
    })();

    setState((s) => {
      const persistedTrackId = getPersistedTrackId(persisted);

      const track = (() => {
        if (persistedTrackId) {
          const d = resolvedDefaultTrack;
          if (d && d.slug === persistedTrackId) return d;
          return resolveAndNormalize(persistedTrackId);
        }
        return fallbackTrack;
      })();

      const queue =
        persisted && Array.isArray((persisted as { queue?: unknown }).queue)
          ? ((persisted as { queue: unknown[] }).queue.filter(
              (x) => typeof x === 'string'
            ) as string[])
          : s.queue;

      const history =
        persisted && Array.isArray((persisted as { history?: unknown }).history)
          ? ((persisted as { history: unknown[] }).history.filter(
              (x) => typeof x === 'string'
            ) as string[])
          : s.history;

      return {
        ...s,
        track,
        // Restore "playing" state from persistence (browser may still block autoplay).
        playing:
          persisted && typeof (persisted as { playing?: unknown }).playing === 'boolean'
            ? (persisted as { playing: boolean }).playing
            : s.playing,
        muted:
          persisted && typeof (persisted as { muted?: unknown }).muted === 'boolean'
            ? (persisted as { muted: boolean }).muted
            : s.muted,
        volume:
          persisted && typeof (persisted as { volume?: unknown }).volume === 'number'
            ? (persisted as { volume: number }).volume
            : s.volume,
        positionSeconds:
          persisted &&
          typeof (persisted as { positionSeconds?: unknown }).positionSeconds === 'number'
            ? (persisted as { positionSeconds: number }).positionSeconds
            : s.positionSeconds,
        durationSeconds:
          persisted &&
          typeof (persisted as { durationSeconds?: unknown }).durationSeconds === 'number'
            ? (persisted as { durationSeconds: number }).durationSeconds
            : s.durationSeconds,
        queue,
        history,
        onDeck: computeOnDeck({
          libraryIds: recentTrackIds,
          queue,
          history,
          currentSlug: track?.slug ?? null,
        }),
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
      if (document.visibilityState === 'hidden') flush();
    };

    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Best-effort: ensure only one tab plays at a time.
    const channel = typeof window !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;
    if (!channel) return;

    const onMessage = (event: MessageEvent) => {
      const msg = event.data as { type?: string; tabId?: string } | null;
      if (!msg || msg.tabId === tabId) return;
      if (msg.type === 'PLAY') setState((s) => ({ ...s, playing: false }));
    };

    channel.addEventListener('message', onMessage);
    return () => {
      channel.removeEventListener('message', onMessage);
      channel.close();
    };
  }, [tabId]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CLAIM_KEY || !event.newValue) return;
      try {
        const msg = JSON.parse(event.newValue) as { type?: string; tabId?: string } | null;
        if (!msg || msg.tabId === tabId) return;
        if (msg.type === 'PLAY') setState((s) => ({ ...s, playing: false }));
      } catch {
        // Ignore invalid payloads.
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [tabId]);

  const broadcastPlay = useCallback(() => {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: 'PLAY', tabId });
      channel.close();
    } catch {
      // Ignore (unsupported / blocked).
    }

    try {
      window.localStorage.setItem(
        CLAIM_KEY,
        JSON.stringify({ type: 'PLAY', tabId, ts: Date.now() })
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

  const play: PlayerActions['play'] = useCallback(
    (track, opts) => {
      const normalized = normalizeTrack(track);
      setState((s) => {
        const prevSlug = s.track?.slug ?? null;
        const nextHistory =
          prevSlug && prevSlug !== normalized.slug
            ? [prevSlug, ...s.history].slice(0, 500)
            : s.history;

        const nextQueue = s.queue.filter((x) => x !== normalized.slug);
        const nextOnDeck = computeOnDeck({
          libraryIds: recentTrackIds,
          queue: nextQueue,
          history: nextHistory,
          currentSlug: normalized.slug,
        });

        return {
          ...s,
          history: nextHistory,
          onDeck: nextOnDeck,
          queue: nextQueue,
          track: normalized,
          playing: true,
          durationSeconds: normalized.slug === s.track?.slug ? s.durationSeconds : 0,
          positionSeconds: (() => {
            if (typeof opts?.seekSeconds === 'number') return opts.seekSeconds;
            if (normalized.slug === s.track?.slug) return s.positionSeconds;
            return 0;
          })(),
        };
      });
      broadcastPlay();
    },
    [broadcastPlay, recentTrackIds]
  );

  const playId: PlayerActions['playId'] = useCallback(
    (trackId, opts) => {
      const resolved = resolveAndNormalize(trackId);
      play(resolved, opts);
    },
    [play]
  );

  const playNext: PlayerActions['playNext'] = useCallback(() => {
    const queued = stateRef.current.queue;
    if (queued.length > 0) {
      const [nextSlug, ...rest] = queued;
      setState((s) => ({ ...s, queue: rest }));
      playId(nextSlug);
      return;
    }

    const { onDeck } = stateRef.current;
    if (onDeck.length > 0) {
      playId(onDeck[0]!);
      return;
    }

    if (recentTrackIds.length === 0) {
      setState((s) => ({ ...s, playing: false }));
      return;
    }

    const currentSlug = stateRef.current.track?.slug ?? null;
    const nextOnDeck = computeOnDeck({
      libraryIds: recentTrackIds,
      queue: stateRef.current.queue,
      history: stateRef.current.history,
      currentSlug,
    });
    const nextSlug = nextOnDeck[0] ?? null;
    if (!nextSlug) {
      setState((s) => ({ ...s, playing: false }));
      return;
    }
    playId(nextSlug);
  }, [playId, recentTrackIds]);

  const queueNext: PlayerActions['queueNext'] = useCallback(
    (trackId) => {
      setState((s) => {
        const nextQueue = [trackId, ...s.queue.filter((x) => x !== trackId)];
        return {
          ...s,
          queue: nextQueue,
          onDeck: computeOnDeck({
            libraryIds: recentTrackIds,
            queue: nextQueue,
            history: s.history,
            currentSlug: s.track?.slug ?? null,
          }),
        };
      });
    },
    [recentTrackIds]
  );

  const enqueue: PlayerActions['enqueue'] = useCallback(
    (trackId) => {
      setState((s) => {
        const nextQueue = [...s.queue.filter((x) => x !== trackId), trackId];
        return {
          ...s,
          queue: nextQueue,
          onDeck: computeOnDeck({
            libraryIds: recentTrackIds,
            queue: nextQueue,
            history: s.history,
            currentSlug: s.track?.slug ?? null,
          }),
        };
      });
    },
    [recentTrackIds]
  );

  const removeFromQueue: PlayerActions['removeFromQueue'] = useCallback(
    (trackId) => {
      setState((s) => {
        const nextQueue = s.queue.filter((x) => x !== trackId);
        return {
          ...s,
          queue: nextQueue,
          onDeck: computeOnDeck({
            libraryIds: recentTrackIds,
            queue: nextQueue,
            history: s.history,
            currentSlug: s.track?.slug ?? null,
          }),
        };
      });
    },
    [recentTrackIds]
  );

  const clearQueue: PlayerActions['clearQueue'] = useCallback(() => {
    setState((s) => ({
      ...s,
      queue: [],
      onDeck: computeOnDeck({
        libraryIds: recentTrackIds,
        queue: [],
        history: s.history,
        currentSlug: s.track?.slug ?? null,
      }),
    }));
  }, [recentTrackIds]);

  const clearHistory: PlayerActions['clearHistory'] = useCallback(() => {
    setState((s) => ({
      ...s,
      history: [],
      onDeck: computeOnDeck({
        libraryIds: recentTrackIds,
        queue: s.queue,
        history: [],
        currentSlug: s.track?.slug ?? null,
      }),
    }));
  }, [recentTrackIds]);

  const removeHistoryAt: PlayerActions['removeHistoryAt'] = useCallback(
    (index) => {
      setState((s) => {
        const nextHistory = s.history.filter((_, i) => i !== index);
        return {
          ...s,
          history: nextHistory,
          onDeck: computeOnDeck({
            libraryIds: recentTrackIds,
            queue: s.queue,
            history: nextHistory,
            currentSlug: s.track?.slug ?? null,
          }),
        };
      });
    },
    [recentTrackIds]
  );

  const pause: PlayerActions['pause'] = useCallback(() => {
    setState((s) => ({ ...s, playing: false }));
  }, []);

  const toggle: PlayerActions['toggle'] = useCallback(() => {
    setState((s) => {
      const nextPlaying = !s.playing;
      if (nextPlaying) broadcastPlay();
      return { ...s, playing: nextPlaying };
    });
  }, [broadcastPlay]);

  const setPlaying: PlayerActions['setPlaying'] = useCallback(
    (nextPlaying) => {
      setState((s) => ({ ...s, playing: nextPlaying }));
      if (nextPlaying) broadcastPlay();
    },
    [broadcastPlay]
  );

  const setMuted: PlayerActions['setMuted'] = useCallback((nextMuted) => {
    setState((s) => ({ ...s, muted: nextMuted }));
  }, []);

  const setVolume: PlayerActions['setVolume'] = useCallback((nextVolume) => {
    const v = Math.max(0, Math.min(1, nextVolume));
    setState((s) => ({ ...s, volume: v }));
  }, []);

  const seek: PlayerActions['seek'] = useCallback((seconds) => {
    setState((s) => ({ ...s, positionSeconds: Math.max(0, seconds) }));
  }, []);

  const setDurationSeconds: PlayerActions['setDurationSeconds'] = useCallback((seconds) => {
    setState((s) => ({
      ...s,
      durationSeconds: Number.isFinite(seconds) ? seconds : s.durationSeconds,
    }));
  }, []);

  const setPositionSeconds: PlayerActions['setPositionSeconds'] = useCallback((seconds) => {
    setState((s) => ({
      ...s,
      positionSeconds: Number.isFinite(seconds) ? seconds : s.positionSeconds,
    }));
  }, []);

  const mainValue: PlayerMainContextValue = useMemo(
    () => ({
      tabId,
      ready: didLoadPersisted,
      track: state.track,
      music: state.track?.slug ? getMusicBySlug(state.track.slug) : null,
      playing: state.playing,
      durationSeconds: state.durationSeconds,
      queue: state.queue,
      onDeck: state.onDeck,
      history: state.history,
      play,
      playId,
      playNext,
      queueNext,
      enqueue,
      removeFromQueue,
      clearQueue,
      clearHistory,
      removeHistoryAt,
      pause,
      toggle,
      setPlaying,
      setDurationSeconds,
    }),
    [
      tabId,
      didLoadPersisted,
      state.track,
      state.playing,
      state.durationSeconds,
      state.queue,
      state.onDeck,
      state.history,
      play,
      playId,
      playNext,
      queueNext,
      enqueue,
      removeFromQueue,
      clearQueue,
      clearHistory,
      removeHistoryAt,
      pause,
      toggle,
      setPlaying,
      setDurationSeconds,
    ]
  );

  const volumeValue: PlayerVolumeContextValue = useMemo(
    () => ({
      muted: state.muted,
      volume: state.volume,
      setMuted,
      setVolume,
    }),
    [state.muted, state.volume, setMuted, setVolume]
  );

  const progressValue: PlayerProgressContextValue = useMemo(
    () => ({
      positionSeconds: state.positionSeconds,
      seek,
      setPositionSeconds,
    }),
    [state.positionSeconds, seek, setPositionSeconds]
  );

  const [mediaEl, setMediaElState] = useState<HTMLMediaElement | null>(null);
  const setMediaEl = useCallback((el: HTMLMediaElement | null) => {
    setMediaElState((prev) => (prev === el ? prev : el));
  }, []);

  return (
    <PlayerMainContext.Provider value={mainValue}>
      <PlayerMediaContext.Provider value={{ mediaEl, setMediaEl }}>
        <PlayerVolumeContext.Provider value={volumeValue}>
          <PlayerProgressContext.Provider value={progressValue}>
            {children}
          </PlayerProgressContext.Provider>
        </PlayerVolumeContext.Provider>
      </PlayerMediaContext.Provider>
    </PlayerMainContext.Provider>
  );
}
