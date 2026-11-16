'use client';

import { MusicTile } from '@/components/music';
import type { Music } from '@/lib/music/allMusicIndex';
import { ROUTES } from '@/lib/routes';
import { MusicFilters, useMusicFilters } from './filters';
import { MusicResultsCount } from './MusicResultsCount';

export function MusicIndex({ items }: { items: Music[] }) {
  const filters = useMusicFilters(items);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <MusicFilters {...filters} />
        <MusicResultsCount
          filteredCount={filters.filteredItems.length}
          totalCount={items.length}
          isFiltered={filters.isFiltered}
          onClear={filters.clearFilters}
        />
      </div>

      <div className="grid gap-3.5 xs:gap-4 sm:gap-5 lg:gap-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filters.filteredItems.map((item) => (
          <MusicTile
            key={item.slug}
            slug={item.slug}
            title={item.title}
            artist={item.artist}
            href={ROUTES.music(item.slug).root}
            coverSrc={ROUTES.music(item.slug).art('cover')}
            bpm={item.bpm}
            type={item.type}
            mixType={item.type === 'mix' ? item.mixType : null}
            year={item.date.getFullYear()}
            genres={item.genres}
            tags={item.tags}
          />
        ))}
      </div>

      <MusicResultsCount
        filteredCount={filters.filteredItems.length}
        totalCount={items.length}
        isFiltered={filters.isFiltered}
        onClear={filters.clearFilters}
        className="mt-6"
      />
    </>
  );
}
