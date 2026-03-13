export type PlayerTrack = {
  src: string;
  title?: string;
};

export type PlayerState = {
  track: PlayerTrack | null;
  playing: boolean;
  positionSeconds: number;
  durationSeconds: number;
};

export type PlayerActions = {
  play: (track: PlayerTrack, opts?: { seekSeconds?: number }) => void;
  pause: () => void;
  toggle: () => void;
  setPlaying: (playing: boolean) => void;
  seek: (seconds: number) => void;
  setDurationSeconds: (seconds: number) => void;
  setPositionSeconds: (seconds: number) => void;
};

export type PlayerContextValue = PlayerState & PlayerActions & { tabId: string; };
