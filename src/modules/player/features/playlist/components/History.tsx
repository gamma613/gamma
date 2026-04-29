'use client';

import { Button, RemoveButton } from '@/components';
import { IconButton } from '@/components/buttons/IconButton';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { EnqueueButton } from '../../../components/EnqueueButton';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { PlayNextButton } from '../../../components/PlayNextButton';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function History({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { track, history, clearHistory, removeHistoryAt, playFromHistory } = usePlayerMain();

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
      renderLeft={(trackId) => (
        <PlayInPlayerButton
          slug={trackId}
          resumeFromHistory
          className="hidden xs:inline-flex size-9 shrink-0"
        />
      )}
      renderActions={(trackId, { meta }) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={faPlay}
            label="Play again"
            className="xs:hidden"
            onClick={() => playFromHistory(trackId)}
            type="button"
            variant="ghost"
          />
          <PlayNextButton trackId={trackId} />
          <EnqueueButton trackId={trackId} />
          <RemoveButton onClick={() => removeHistoryAt(meta!)} />
        </div>
      )}
    />
  );
}
