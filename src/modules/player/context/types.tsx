import type { Music } from 'content-collections';

export type PlayerTrackId = string;

export type PlayerTrack = {
  slug: string;
  src: string;
  title?: string;
  artist?: string;
  cover?: string;
};

export type PlayerState = {
  track: PlayerTrack | null;
  playing: boolean;
  muted: boolean;
  volume: number; // 0..1
  positionSeconds: number;
  durationSeconds: number;
  queue: PlayerTrackId[];
  onDeck: PlayerTrackId[];
  history: PlayerTrackId[];
};

export type PlayerActions = {
  play: (track: PlayerTrack, opts?: { seekSeconds?: number }) => void;
  playId: (track: PlayerTrackId, opts?: { seekSeconds?: number }) => void;
  playPrevious: () => void;
  playNext: () => void;
  queueNext: (trackId: PlayerTrackId) => void;
  enqueue: (trackId: PlayerTrackId) => void;
  removeFromQueue: (trackId: PlayerTrackId) => void;
  clearQueue: () => void;
  clearHistory: () => void;
  removeHistoryAt: (index: number) => void;
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

export type PlayerProgressContextValue = Pick<PlayerState, 'positionSeconds'> &
  Pick<PlayerActions, 'seek' | 'setPositionSeconds'>;

export type PlayerVolumeContextValue = Pick<PlayerState, 'muted' | 'volume'> &
  Pick<PlayerActions, 'setMuted' | 'setVolume'>;

type PlayerMainContextValueBase = Pick<
  PlayerContextValue,
  | 'tabId'
  | 'ready'
  | 'track'
  | 'playing'
  | 'durationSeconds'
  | 'queue'
  | 'onDeck'
  | 'history'
  | 'play'
  | 'playId'
  | 'playPrevious'
  | 'playNext'
  | 'queueNext'
  | 'enqueue'
  | 'removeFromQueue'
  | 'clearQueue'
  | 'clearHistory'
  | 'removeHistoryAt'
  | 'pause'
  | 'toggle'
  | 'setPlaying'
  | 'setDurationSeconds'
>;

export type PlayerMainContextValue = PlayerMainContextValueBase & {
  /**
   * Resolved library metadata for the current `track` (when it corresponds to a `content-collections` music item).
   * `null` for unknown tracks (e.g. mixes or any track not in `allMusic`).
   */
  music: Music | null;
};
