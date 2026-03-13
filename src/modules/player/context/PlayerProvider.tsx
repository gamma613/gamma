'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { STORAGE_KEY, CHANNEL_NAME, CLAIM_KEY } from '../config';
import { PlayerContext } from './PlayerContext';
import { PlayerActions, PlayerContextValue, PlayerState, PlayerTrack } from './types';

function getTabId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'gamma.player.tabId.v1';
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
    return parsed && typeof parsed === 'object' ? parsed : null;
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

export function PlayerProvider({
  children,
  defaultTrack,
}: {
  children: React.ReactNode;
  defaultTrack?: PlayerTrack;
}) {
  const tabId = useMemo(() => getTabId(), []);
  const [state, setState] = useState<PlayerState>(() => {
    if (typeof window === 'undefined') {
      return {
        track: defaultTrack ?? null,
        playing: false,
        muted: false,
        volume: 1,
        positionSeconds: 0,
        durationSeconds: 0,
      };
    }

    const persisted = loadPersisted();
    return {
      track: persisted?.track ?? defaultTrack ?? null,
      // Don't auto-play on load; restore track + position and let the user hit play.
      playing: false,
      muted: persisted?.muted ?? false,
      volume: typeof persisted?.volume === 'number' ? persisted.volume : 1,
      positionSeconds: persisted?.positionSeconds ?? 0,
      durationSeconds: persisted?.durationSeconds ?? 0,
    };
  });

  const stateRef = useRef<PlayerState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const lastPersistMsRef = useRef<number>(0);
  useEffect(() => {
    // Throttle persistence to avoid spamming localStorage on progress events.
    const now = Date.now();
    if (now - lastPersistMsRef.current < 1000) return;
    lastPersistMsRef.current = now;
    persist(state);
  }, [state]);

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
      window.localStorage.setItem(CLAIM_KEY, JSON.stringify({ type: 'PLAY', tabId, ts: Date.now() }));
    } catch {
      // Ignore.
    }
  }, [tabId]);

  const play: PlayerActions['play'] = useCallback(
    (track, opts) => {
      setState((s) => ({
        ...s,
        track,
        playing: true,
        positionSeconds: typeof opts?.seekSeconds === 'number' ? opts.seekSeconds : track.src === s.track?.src ? s.positionSeconds : 0,
      }));
      broadcastPlay();
    },
    [broadcastPlay],
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
    [broadcastPlay],
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
    setState((s) => ({ ...s, durationSeconds: Number.isFinite(seconds) ? seconds : s.durationSeconds }));
  }, []);

  const setPositionSeconds: PlayerActions['setPositionSeconds'] = useCallback((seconds) => {
    setState((s) => ({ ...s, positionSeconds: Number.isFinite(seconds) ? seconds : s.positionSeconds }));
  }, []);

  const value: PlayerContextValue = useMemo(
    () => ({
      tabId,
      ...state,
      play,
      pause,
      toggle,
      setPlaying,
      setMuted,
      setVolume,
      seek,
      setDurationSeconds,
      setPositionSeconds,
    }),
    [tabId, state, play, pause, toggle, setPlaying, setMuted, setVolume, seek, setDurationSeconds, setPositionSeconds],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
