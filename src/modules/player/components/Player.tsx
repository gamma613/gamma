'use client';

import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

export const Player = () => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const { track, playing, positionSeconds, setPlaying, setPositionSeconds, setDurationSeconds } = usePlayer();

  // Keep the underlying player in sync when state changes (seek from persisted state, external UI, etc.).
  useEffect(() => {
    if (!playerRef.current) return;
    const current = playerRef.current.currentTime ?? 0;
    // Avoid fighting with `onTimeUpdate` (and avoid tiny jitter due to float precision).
    if (Math.abs(current - positionSeconds) < 0.75) return;
    playerRef.current.currentTime = positionSeconds;
  }, [positionSeconds]);

  if (!track) return null;

  return (
    <ReactPlayer
      ref={playerRef}
      src={track.src}
      playing={playing}
      controls={true}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)}
      onLoadedMetadata={() => {
        if (!playerRef.current) return;
        if (positionSeconds > 0) playerRef.current.currentTime = positionSeconds;
      }}
      onDurationChange={() => {
        if (!playerRef.current) return;
        setDurationSeconds(playerRef.current.duration ?? 0);
      }}
      onTimeUpdate={() => {
        if (!playerRef.current) return;
        const t = playerRef.current.currentTime ?? 0;
        setPositionSeconds(t);
      }}
      height="40px"
    />
  );
};
