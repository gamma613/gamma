'use client';

import { Button } from '@/components';
import { faCircleXmark, faForwardStep, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistActionItem } from './PlaylistActionItem';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function History({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const {
    track,
    history,
    clearHistory,
    removeHistoryAt,
    playFromHistory,
    queue,
    queueNext,
    enqueue,
  } = usePlayerMain();

  const entries = useMemo(() => {
    const currentSlug = track?.slug ?? null;
    return history
      .map((h, index) => ({ id: h.trackId, index }))
      .filter((x) => x.id !== currentSlug);
  }, [history, track?.slug]);

  return (
    <PlaylistSection
      title="History"
      itemKey="history"
      itemsPerPage={itemsPerPage}
      items={entries.map(({ id, index }) => ({ trackId: id, meta: index }))}
      actionsInPopover
      empty={<p className="rf-sm text-muted-foreground">Nothing played yet.</p>}
      headerRight={
        history.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearHistory}>
            Clear
          </Button>
        ) : null
      }
      renderActions={(trackId, { meta }) => (
        <>
          <PlaylistActionItem
            icon={faPlay}
            label="Play now"
            onClick={() => playFromHistory(trackId)}
          />
          <PlaylistActionItem
            icon={faForwardStep}
            label="Play next"
            onClick={() => queueNext(trackId)}
            disabled={queue[0] === trackId}
          />
          <PlaylistActionItem
            icon={faPlus}
            label="Enqueue"
            onClick={() => enqueue(trackId)}
            disabled={queue.includes(trackId)}
          />
          <PlaylistActionItem
            icon={faCircleXmark}
            label="Remove"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => removeHistoryAt(meta!)}
          />
        </>
      )}
    />
  );
}
