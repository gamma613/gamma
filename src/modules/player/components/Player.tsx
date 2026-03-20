'use client';

import { useHydrated } from '@/lib/useHydrated';
import { useCallback, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

export const Player = () => {
  const hydrated = useHydrated();
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const {
    track,
    playing,
    muted,
    volume,
    positionSeconds,
    setPlaying,
    setPositionSeconds,
    setDurationSeconds,
  } = usePlayer();
  const hasRestoredRef = useRef(false);

  const restoreIfNeeded = useCallback(() => {
    if (hasRestoredRef.current) return;
    if (!playerRef.current) return;
    if (!(positionSeconds > 0)) return;
    // Seeking before metadata is loaded can be ignored by the browser; we also try onLoadedMetadata.
    try {
      playerRef.current.currentTime = positionSeconds;
    } catch {
      // Ignore.
    }
    hasRestoredRef.current = true;
  }, [positionSeconds]);

  // Keep the underlying player in sync when state changes (seek from persisted state, external UI, etc.).
  useEffect(() => {
    if (!playerRef.current) return;
    const current = playerRef.current.currentTime ?? 0;
    // Avoid fighting with `onTimeUpdate` (and avoid tiny jitter due to float precision).
    if (Math.abs(current - positionSeconds) < 0.75) return;
    playerRef.current.currentTime = positionSeconds;
  }, [positionSeconds]);

  // If the user hits play after a refresh, ensure we restore the persisted seek position first.
  useEffect(() => {
    if (!playing) return;
    restoreIfNeeded();
  }, [playing, restoreIfNeeded]);

  useEffect(() => {
    // New track: allow restoring again (typically to 0 unless a seek is set externally).
    hasRestoredRef.current = false;
  }, [track?.src]);

  // Early return if there's no track
  if (!track) return null;

  // Keep SSR + initial hydration deterministic; render the real UI after hydration.
  if (!hydrated) return null;

  return (
    <ReactPlayer
      ref={playerRef}
      src={track.src}
      playing={playing}
      controls={false}
      muted={muted}
      volume={volume}
      preload="metadata"
      playsInline
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)}
      onLoadedMetadata={() => {
        restoreIfNeeded();
      }}
      onDurationChange={() => {
        if (!playerRef.current) return;
        setDurationSeconds(playerRef.current.duration ?? 0);
      }}
      onTimeUpdate={() => {
        if (!playerRef.current) return;
        const t = playerRef.current.currentTime ?? 0;
        // Avoid overwriting a persisted seek target with an initial `0` timeupdate.
        if (!hasRestoredRef.current && positionSeconds > 0 && t < 1) return;
        setPositionSeconds(t);
      }}
    />
  );
};
