'use client';

import { EnqueueButton } from '../../../components/EnqueueButton';
import { PlayNextButton } from '../../../components/PlayNextButton';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistSection } from './PlaylistSection';

// ----------------------------------------------------------------------

export function OnDeck({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { onDeck } = usePlayerMain();

  return (
    <PlaylistSection
      title="On deck"
      itemKey="on-deck"
      itemsPerPage={itemsPerPage}
      items={onDeck.map((trackId) => ({ trackId }))}
      hideWhenEmpty
      listClassName="space-y-2 sm:space-y-3 lg:space-y-4"
      renderActions={(trackId, { isCurrent }) => (
        <div className="flex items-center gap-1">
          <PlayNextButton trackId={trackId} disabled={isCurrent} />
          <EnqueueButton trackId={trackId} disabled={isCurrent} />
        </div>
      )}
    />
  );
}
