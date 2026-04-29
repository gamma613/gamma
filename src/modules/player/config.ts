/**
 * `localStorage` key for the persisted player state (track, queue/history,
 * volume, seek position, etc.). Bump the suffix (e.g. `.v2`) to invalidate old
 * persisted formats if/when we do a breaking change.
 */
export const STORAGE_KEY = 'gamma.player.v1';
/**
 * `BroadcastChannel` name used to coordinate playback between tabs.
 * When one tab starts playing, other tabs should pause.
 */
export const CHANNEL_NAME = 'gamma-player';
/**
 * `localStorage` coordination key used as a fallback for browsers/environments
 * where `BroadcastChannel` is unavailable or unreliable. Tabs write a small
 * "claim" payload here to signal "I'm playing".
 */
export const CLAIM_KEY = 'gamma.player.claim.v1';

/**
 * When resuming a track from history, ignore positions too close to either
 * end.
 */
export const HISTORY_RESUME_THRESHOLD_SECONDS = 60;
