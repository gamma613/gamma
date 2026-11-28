import { PageWrapper } from '@/components';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { MusicIndex } from '@/sections/music/MusicIndex';
import { allMusic } from 'content-collections';
import type { Metadata } from 'next';

// ----------------------------------------------------------------------

const DESCRIPTION = 'Explore mixes, tracks, and musical offerings.';
const TITLE = 'Music Library';

export const metadata: Metadata = {
  alternates: { canonical: ROUTES.music().root },
  description: DESCRIPTION,
  openGraph: {
    description: DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE],
    title: TITLE,
    type: 'website',
    url: ROUTES.music().root,
  },
  title: TITLE,
  twitter: {
    card: 'summary',
    description: DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE.url],
    title: TITLE,
  },
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
