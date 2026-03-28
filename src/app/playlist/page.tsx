import { PageWrapper } from '@/components';
import { Playlist } from '@/modules/player';

// ----------------------------------------------------------------------

export default function PlaylistPage() {
  return (
    <PageWrapper title="Playlist">
      <Playlist />
    </PageWrapper>
  );
}
