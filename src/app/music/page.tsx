import { PageWrapper } from '@/components';
import { MusicTile } from '@/components/music';
import { ROUTES } from '@/lib/routes';
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
      <div className="grid gap-3.5 xs:gap-4 sm:gap-5 lg:gap-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => {
          const href = ROUTES.music(item.slug).root;
          const coverSrc = ROUTES.music(item.slug).art('cover');

          return (
            <MusicTile
              key={item.slug}
              slug={item.slug}
              title={item.title}
              artist={item.artist}
              href={href}
              coverSrc={coverSrc}
              bpm={item.bpm}
              type={item.type}
              year={item.date ? item.date.getFullYear() : null}
              genres={item.genres}
              tags={item.tags}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
}
