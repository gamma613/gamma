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
  /** Navigation-only undo stack (most-recent-first). */
  backStack: PlayerTrackId[];
  /** Navigation-only redo stack (most-recent-first). */
  forwardStack: PlayerTrackId[];
  queue: PlayerTrackId[];
  onDeck: PlayerTrackId[];
  history: PlayerHistoryEntry[];
};

export type PlayerHistoryEntry = {
  trackId: PlayerTrackId;
  positionSeconds: number;
  durationSeconds: number;
};

export type PlayerActions = {
  play: (
    track: PlayerTrack,
    opts?: {
      seekSeconds?: number;
      suppressHistory?: boolean;
      /**
       * Controls whether a playback change should push onto the navigation stacks.
       * - `push` (default): push previous track to `backStack` and clear `forwardStack`
       * - `none`: do not mutate navigation stacks (used for undo/redo navigation)
       */
      navigation?: 'push' | 'none';
    }
  ) => void;
  playId: (
    track: PlayerTrackId,
    opts?: { seekSeconds?: number; suppressHistory?: boolean; navigation?: 'push' | 'none' }
  ) => void;
  playFromHistory: (trackId: PlayerTrackId) => void;
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
  | 'backStack'
  | 'forwardStack'
  | 'queue'
  | 'onDeck'
  | 'history'
  | 'play'
  | 'playId'
  | 'playFromHistory'
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
