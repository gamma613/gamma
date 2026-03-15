export type PlayerTrack = {
  src: string;
  title?: string;
};

export type PlayerState = {
  track: PlayerTrack | null;
  playing: boolean;
  muted: boolean;
  volume: number; // 0..1
  positionSeconds: number;
  durationSeconds: number;
};

export type PlayerActions = {
  play: (track: PlayerTrack, opts?: { seekSeconds?: number }) => void;
  pause: () => void;
  toggle: () => void;
  setPlaying: (playing: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  seek: (seconds: number) => void;
  setDurationSeconds: (seconds: number) => void;
  setPositionSeconds: (seconds: number) => void;
};

export type PlayerContextValue = PlayerState &
  PlayerActions & {
    tabId: string;
    ready: boolean;
  };
