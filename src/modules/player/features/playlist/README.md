# Playlist / Infinite Player Workflow

This directory contains the playlist UI (`Playlist.tsx`, `components/*`). The _behavior_ of the playlist
(queue/history/on-deck logic) lives in `src/modules/player/context/PlayerProvider.tsx`.

The core idea is an infinite player that can always produce a “next track” by:

1. consuming the **User Queue** first
2. otherwise choosing from **On Deck** (library items not currently queued, biased toward least-recently-played)
3. otherwise looping from **History**

## Current data model (as implemented)

State comes from `usePlayerMain()`:

- **Now Playing**: `state.track` (single current track)
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
- “Next” is deterministic: it consumes queue first, then On Deck.

## Behavior of key actions (today)

### Play now (`playId` / `play`)

When you start playing a track:

- the previous track (if any and different) is prepended into `history` _(unless `suppressHistory` is true)_
- the chosen track is removed from the queue (if present)
- On Deck is recomputed

Implication: clicking “Play now” on an item that was queued removes it from the queue.

### Next (`playNext`)

When you hit “Next”:

1. if `queue` has items: shift `queue[0]` and play it
2. else if `onDeck` has items: play `onDeck[0]`
3. else: recompute on-deck; if still empty, loop by playing `history[0]` (most recent)

### Previous (`playPrevious`)

When you hit “Previous”:

1. find the first history entry with `trackId !== currentSlug` (most-recent-first)
2. remove that entry from history
3. prepend the current track to the front of the user queue
4. play the history track with `{ suppressHistory: true }`

This “bump current into queue” rule is an intentional simplification: it creates a clean, predictable
forward path after going backwards.

### Play from history (`playFromHistory`)

When you explicitly choose a track from History in the UI:

- it plays the chosen track (optionally seeking to its saved position)
- it does **not** do the “bump current into queue” behavior (that is only for `playPrevious`)

So manual “play from history” behaves like a normal “Play now” in terms of history updates.

## Reasoning about the tricky cases

### “When I go back to history, where does the currently playing song go?”

Current rule (implemented): it goes to the **front of the user queue**, becoming what plays next.

Why this is nice:

- “Next” after going back is always well-defined (it consumes the queue).
- It avoids relying on on-deck ordering rules to infer what “forward” means.

### “What happens when you click back multiple times?”

Each “Previous”:

- moves you to an older history entry
- pushes the track you backed out of onto the front of the queue

Net effect: you build a “forward stack” in the queue, so pressing “Next” undoes your back-stepping.

### “Back once, then manually pick an older history item, then Prev: what should happen?”

There are two coherent mental models:

1. **Navigation model (browser-like)**: Prev/Next walk the exact navigation steps you took.
2. **Play-log model**: Prev means “go to the most recently played other track”.

Today is closer to (2). If you want (1), you usually need an explicit back-stack + forward-stack
separate from play history.

### “Should history record repeats like A, B, C, C, D…?”

Today: yes, repeats can exist.

Trade-offs:

- **Exact play log** (allows repeats): most faithful, but makes Prev semantics subjective.
- **Unique history** (no repeats; move-to-front): simpler Prev semantics, but loses fidelity.

On Deck already behaves like “unique history” for ranking purposes (it only cares about the most recent
occurrence), so switching history to a move-to-front model is feasible if we decide that’s the UX we want.

## Suggested simplification (if we want to reduce complexity)

If the goal is: “each library item lives in exactly one place at a time”, we can treat each track as
being in exactly one of these states:

- `nowPlaying`
- `queued` (user queue)
- `onDeck`
- `history`

Then:

- “Play now” moves the track to `nowPlaying` and moves the prior `nowPlaying` to `history` (or to `queued`
  if we want browser-like forward behavior).
- “Previous” becomes: swap `nowPlaying` with the head of `history`, and push the swapped-out track into
  the head of `queued` (current behavior).
- “Next” becomes: pop from `queued` else take head from `onDeck` else loop.

This keeps the UI concepts aligned with a single underlying state machine.
