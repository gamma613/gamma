# Playlist / Infinite Player Workflow

This directory contains the playlist UI (`Playlist.tsx`, `components/*`). The playlist behavior
(queue/history/on-deck logic, transport semantics) lives in `src/modules/player/context/PlayerProvider.tsx`.

The core model is a moving playback bead:

1. **History** is behind the bead.
2. **Now Playing** is the bead.
3. **User Queue** is the intentional future path.
4. **On Deck** is the complete, loopable library fallback.

## Current data model

State comes from `usePlayerMain()`:

- **Now Playing**: `state.track` (single current track)
- **User Queue**: `state.queue` (array; index `0` is the next track)
- **History**: `state.history` (array of `{ trackId, positionSeconds, durationSeconds }`, most-recent-first)
- **On Deck**: `state.onDeck` (derived list of every library trackId)
- **Legacy Navigation Stacks**: `state.backStack` / `state.forwardStack` remain on the context for compatibility, but playlist transport no longer uses undo/redo semantics.

## Invariants

- The queue should not contain duplicates.
- On Deck contains every available library item.
- On Deck orders ordinary items by least-recently-played first.
- On Deck sinks the current track and queued tracks to the bottom, with the current track before the queued tracks.
- Transport is bead-first:
  - **Previous** moves back through History and pushes the displaced future into the front of User Queue.
  - **Next** consumes User Queue first, then falls back to On Deck.

## Behavior of key actions

### Play now (`playId` / `play`)

When you start playing a track normally:

- the previous track is prepended into History if it is different
- the chosen track is removed from User Queue if present
- On Deck is recomputed

### Next (`playNext`)

When you hit Next:

1. if User Queue has items, shift `queue[0]` and play it
2. otherwise play the first On Deck item that is not already current
3. otherwise recompute On Deck and try again
4. otherwise loop from the most recent History item when available

### Previous (`playPrevious`)

When you hit Previous:

1. choose the most recent History item that is not the current track
2. remove that item, plus any more-recent skipped History items, from History
3. prepend the forward path to User Queue
4. play the chosen History item

Example:

- Start: `H=[A, B, C]`, `NP=D`, `Q=[E, F, G]`
- Previous: `H=[A, B]`, `NP=C`, `Q=[D, E, F, G]`
- Previous again: `H=[A]`, `NP=B`, `Q=[C, D, E, F, G]`

Note: state History is stored most-recent-first, so the example above is written in display order for readability.

### Play from history (`playFromHistory`)

Choosing Play now on an item from History selects only that item:

- the chosen item is removed from History
- the chosen item becomes Now Playing
- the previous Now Playing item is pushed to the front of User Queue
- other History items stay in History

Example:

- Start: `H=[A, B, C]`, `NP=D`, `Q=[E, F, G]`
- Play `A`: `H=[B, C]`, `NP=A`, `Q=[D, E, F, G]`

### Queue from history

Choosing Play next or Enqueue on an item from History moves only that item:

- the chosen item is removed from History
- Play next moves it to the front of User Queue
- Enqueue moves it to the end of User Queue
- Now Playing and other History items are unchanged

## On Deck ordering

On Deck always contains the whole library. Its order is dynamic:

- unqueued, non-current tracks come first, least-recently-played first
- the current track sinks near the bottom
- User Queue tracks sink below the current track in queue order

Example:

- `NP=C`
- `Q=[D, E, F]`
- On Deck tail: `[..., C, D, E, F]`
