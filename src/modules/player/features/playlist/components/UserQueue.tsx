'use client';

import { Button } from '@/components';
import { faCircleXmark, faForwardStep, faPlay } from '@fortawesome/free-solid-svg-icons';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistActionItem } from './PlaylistActionItem';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function UserQueue({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { queue, clearQueue, removeFromQueue, playId, queueNext } = usePlayerMain();

  return (
    <PlaylistSection
      title="Manually added"
      itemKey="user-queue"
      itemsPerPage={itemsPerPage}
      items={queue.map((trackId) => ({ trackId }))}
      actionsInPopover
      empty={
        <p className="rf-sm text-muted-foreground">
          {`Curate your listening experience using the "Play Next" and "Enqueue" buttons.`}
        </p>
      }
      headerRight={
        queue.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearQueue}>
            Clear
          </Button>
        ) : null
      }
      renderActions={(trackId, { absoluteIndex, isCurrent }) => (
        <>
          {!isCurrent && (
            <PlaylistActionItem icon={faPlay} label="Play now" onClick={() => playId(trackId)} />
          )}

          {absoluteIndex !== 0 && !isCurrent && (
            <PlaylistActionItem
              icon={faForwardStep}
              label="Play next"
              onClick={() => queueNext(trackId)}
            />
          )}

          <PlaylistActionItem
            icon={faCircleXmark}
            label="Remove"
            onClick={() => removeFromQueue(trackId)}
          />
        </>
      )}
    />
  );
}
