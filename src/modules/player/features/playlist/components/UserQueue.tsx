'use client';

import { Button, RemoveButton } from '@/components';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { PlayNextButton } from '../../../components/PlayNextButton';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function UserQueue({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { queue, clearQueue, removeFromQueue } = usePlayerMain();

  return (
    <PlaylistSection
      title="Your queue"
      itemKey="user-queue"
      itemsPerPage={itemsPerPage}
      items={queue.map((trackId) => ({ trackId }))}
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
      renderLeft={(trackId) => <PlayInPlayerButton slug={trackId} className="size-9 shrink-0" />}
      renderActions={(trackId, { absoluteIndex }) => (
        <div className="flex items-center gap-1">
          {absoluteIndex !== 0 && <PlayNextButton trackId={trackId} />}
          <RemoveButton onClick={() => removeFromQueue(trackId)} />
        </div>
      )}
    />
  );
}
