import { PageWrapper } from '@/components';
import { MusicIndex } from '@/sections/music/MusicIndex';
import { allMusic } from 'content-collections';
import type { Metadata } from 'next';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  description: 'Explore mixes, tracks, and musical offerings.',
  title: 'Music Library',
};

export default function MusicIndexPage() {
  const items = [...allMusic].sort((a, b) => {
    const at = a.date.getTime();
    const bt = b.date.getTime();
    return bt - at || a.title.localeCompare(b.title);
  });

  return (
    <PageWrapper title="Music Library" className="max-w-7xl">
      <MusicIndex items={items} />
    </PageWrapper>
  );
}
