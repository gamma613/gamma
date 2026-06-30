'use client';

import { faForwardStep, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistActionItem } from './PlaylistActionItem';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function OnDeck({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { onDeck, playId, queue, queueNext, enqueue } = usePlayerMain();

  return (
    <PlaylistSection
      title="On deck"
      itemKey="on-deck"
      itemsPerPage={itemsPerPage}
      items={onDeck.map((trackId) => ({ trackId }))}
      hideWhenEmpty
      actionsInPopover
      listClassName="space-y-2 sm:space-y-3 lg:space-y-4"
      renderActions={(trackId, { isCurrent }) => (
        <>
          {!isCurrent && (
            <PlaylistActionItem
              icon={faPlay}
              label="Play now"
              onClick={() => playId(trackId)}
              disabled={isCurrent}
            />
          )}

          {!isCurrent && (
            <PlaylistActionItem
              icon={faForwardStep}
              label="Play next"
              onClick={() => queueNext(trackId)}
              disabled={queue[0] === trackId}
            />
          )}

          {!isCurrent && (
            <PlaylistActionItem
              icon={faPlus}
              label="Enqueue"
              onClick={() => enqueue(trackId)}
              disabled={queue.includes(trackId)}
            />
          )}
        </>
      )}
    />
  );
}
