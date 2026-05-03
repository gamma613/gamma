# Playlist / Infinite Player Workflow

This directory contains the playlist UI (`Playlist.tsx`, `components/*`). The _behavior_ of the playlist
(queue/history/on-deck logic, transport semantics) lives in `src/modules/player/context/PlayerProvider.tsx`.

The core idea is an infinite player that can always produce a “next track” by:

1. consuming the **User Queue** first
2. otherwise choosing from **On Deck** (library items not currently queued, biased toward least-recently-played)
3. otherwise looping from **History**

## Current data model (as implemented)

State comes from `usePlayerMain()`:

- **Now Playing**: `state.track` (single current track)
- **Undo / Redo navigation**
  - `state.backStack` (undo stack; most-recent-first)
  - `state.forwardStack` (redo stack; most-recent-first)
- **User Queue**: `state.queue` (array; index `0` is the _next_ track)
- **History**: `state.history` (array of `{ trackId, positionSeconds, durationSeconds }`, most-recent-first)
- **On Deck**: `state.onDeck` (derived list of library trackIds, excluding current + anything in the queue)

Notes:

- History is most-recent-first.
- History can contain duplicates (ex: you can play the same track again later).
- On Deck is derived using “least recently played” ordering based on the _most recent_ occurrence in history.

## Invariants (intended)

- The queue should not contain duplicates (queue operations filter them out).
- On Deck excludes:
  - the current track
  - anything currently in the queue
- Transport buttons are navigation-first:
  - **Previous** is Undo (go back to what was just playing).
  - **Next** is Redo when available; otherwise it skips forward (queue → on-deck → loop).

## Behavior of key actions (today)

### Play now (`playId` / `play`)

When you start playing a track:

- the previous track (if any and different) is prepended into `history` _(unless `suppressHistory` is true)_
- the previous track is pushed onto `backStack` and `forwardStack` is cleared _(unless `navigation: 'none'`)_
- the chosen track is removed from the queue (if present)
- On Deck is recomputed

Implication: clicking “Play now” on an item that was queued removes it from the queue.

### Next (`playNext`)

When you hit “Next”:

1. if `forwardStack` has items: **Redo** by playing `forwardStack[0]` (does not rewrite play-log history or queue)
2. else if `queue` has items: shift `queue[0]` and play it
3. else if `onDeck` has items: play `onDeck[0]`
4. else: recompute on-deck; if still empty, loop by playing `history[0]` (most recent)

### Previous (`playPrevious`)

When you hit “Previous”:

1. if `backStack` has items: **Undo** by playing `backStack[0]`
2. push the current track onto `forwardStack`
3. do not mutate the queue and do not rewrite play-log history (`suppressHistory: true`, `navigation: 'none'`)

### Play from history (`playFromHistory`)

When you explicitly choose a track from History in the UI, it behaves like a normal “Play now”:

- it plays the chosen track (optionally seeking to the saved position)
- it participates in Undo/Redo (pushes onto `backStack`, clears `forwardStack`)

## Visual model (using animals)

Notation:

- `NP` = now playing
- `B` = back/undo stack (leftmost is the next undo)
- `F` = forward/redo stack (leftmost is the next redo)
- `Q` = user queue (leftmost is next)

### Example 1: Skip → Undo → Redo

Start:

- `NP=Otter`
- `B=[]`
- `F=[]`
- `Q=[Panda, Fox]`

Press Next (skip): plays `Panda`

- `NP=Panda`
- `B=[Otter]`
- `F=[]`
- `Q=[Fox]`

Press Previous (undo): plays `Otter`

- `NP=Otter`
- `B=[]`
- `F=[Panda]`
- `Q=[Fox]` (unchanged)

Press Next (redo): plays `Panda`

- `NP=Panda`
- `B=[Otter]`
- `F=[]`
- `Q=[Fox]` (unchanged)

### Example 2: “Play now” clears redo

Start:

- `NP=Koala`
- `B=[Lynx]`
- `F=[Capybara]`

Click “Play now” on `Hedgehog`:

- `NP=Hedgehog`
- `B=[Koala, Lynx]` (push previous NP)
- `F=[]` (redo cleared on new action)
