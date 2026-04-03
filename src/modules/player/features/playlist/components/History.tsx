'use client';

import { Button, RemoveButton } from '@/components';
import { useMemo } from 'react';
import { EnqueueButton } from '../../../components/EnqueueButton';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { PlayNextButton } from '../../../components/PlayNextButton';
import { usePlayer } from '../../../context/usePlayer';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function History({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { track, history, clearHistory, removeHistoryAt } = usePlayer();

  const entries = useMemo(() => {
    const currentSlug = track?.slug ?? null;
    return history.map((id, index) => ({ id, index })).filter((x) => x.id !== currentSlug);
  }, [history, track?.slug]);

  return (
    <PlaylistSection
      title="History"
      itemKey="history"
      itemsPerPage={itemsPerPage}
      items={entries.map(({ id, index }) => ({ trackId: id, meta: index }))}
      empty={<p className="rf-sm text-muted-foreground">Nothing played yet.</p>}
      headerRight={
        history.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearHistory}>
            Clear
          </Button>
        ) : null
      }
      renderLeft={(trackId) => <PlayInPlayerButton slug={trackId} className="size-9 shrink-0" />}
      renderActions={(trackId, { meta }) => (
        <div className="flex items-center gap-1">
          <PlayNextButton trackId={trackId} />
          <EnqueueButton trackId={trackId} />
          <RemoveButton onClick={() => removeHistoryAt(meta!)} />
        </div>
      )}
    />
  );
}
