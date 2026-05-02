'use client';

import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { usePlayerMain } from '../../../context/usePlayerMain';
import { PlaylistSection, type PlaylistSectionItem } from './PlaylistSection';

// ----------------------------------------------------------------------

export function NowPlaying() {
  const { track } = usePlayerMain();
  const items: PlaylistSectionItem[] = track?.slug ? [{ trackId: track.slug }] : [];

  return (
    <PlaylistSection
      title="Now playing"
      itemKey="now-playing"
      items={items}
      itemsPerPage={1}
      hideWhenEmpty
      renderActions={(trackId) => <PlayInPlayerButton slug={trackId} className="size-11" />}
    />
  );
}
