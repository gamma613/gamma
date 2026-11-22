'use client';

import type { Music } from '@/lib/music/allMusicIndex';
import { ROUTES } from '@/lib/routes';
import { PlayInPlayerButton } from '@/modules/player';
import Image from 'next/image';
import Link from 'next/link';
import { GenreList } from './GenreList';
import { MusicMetadata } from './MusicMetadata';

// ----------------------------------------------------------------------

export type MusicTileProps = {
  item: Music;
  expandedGenres?: boolean;
  expandedType?: boolean;
};

export function MusicTile({ item, expandedGenres = false, expandedType = false }: MusicTileProps) {
  const { artist, bpm, date, genres, slug, tags, title, type } = item;
  const href = ROUTES.music(slug).root;
  const coverSrc = ROUTES.music(slug).art('cover');
  const mixType = type === 'mix' ? item.mixType : null;
  const year = date.getFullYear();
  const hasDistinctArtist = Boolean(artist && artist.toLowerCase() !== 'gamma');
  const visibleGenres = (genres ?? []).filter(Boolean);
  const visibleTags = (tags ?? []).filter(Boolean);

  return (
    <article
      id={`music-tile-${slug}`}
      data-slug={slug}
      className="group/tile flex h-full flex-col rounded-xl bg-card/60 hover:bg-card/90 border border-border/40 hover:border-border/80 transition-all duration-200 p-2.5 sm:p-3 shadow-xs hover:shadow-md"
    >
      {/* Cover artwork */}
      <Link
        href={href}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/30 block focus-visible:outline-2 focus-visible:outline-primary border border-border/30"
        aria-label={`View ${title}`}
      >
        <Image
          src={coverSrc}
          alt={`Artwork for ${title}`}
          unoptimized
          width={400}
          height={400}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 240px"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover/tile:scale-105"
        />
      </Link>

      {/* Metadata below cover */}
      <div className="mt-2.5 sm:mt-3 min-w-0 flex-1">
        {/* Title and artist */}
        <Link
          href={href}
          className="block min-w-0 group/title focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
        >
          <h3 className="font-semibold text-foreground text-xs sm:text-sm leading-snug line-clamp-2 group-hover/title:underline">
            {title}
            {hasDistinctArtist ? ` - ${artist}` : ''}
          </h3>
        </Link>

        {/* Explain */}
        {(year != null || type || bpm) && (
          <div
            className={`mt-0.5 text-muted-foreground text-[10px] sm:text-xs ${expandedType ? 'whitespace-normal break-words' : 'truncate'}`}
          >
            <MusicMetadata
              year={year}
              type={type}
              mixType={mixType}
              bpm={bpm}
              expandedType={expandedType}
            />
          </div>
        )}

        {visibleGenres.length > 0 && (
          <div className="mt-0.5 whitespace-normal break-words text-muted-foreground text-[10px] sm:text-xs">
            <GenreList genres={visibleGenres} layout={expandedGenres ? 'expanded' : 'inline'} />
          </div>
        )}

        {visibleTags.length > 0 && (
          <div className="mt-0.5 whitespace-normal break-words text-muted-foreground text-[10px] sm:text-xs">
            {visibleTags.join(', ')}
          </div>
        )}
      </div>

      <PlayInPlayerButton
        slug={slug}
        progressShape="none"
        className="mt-2.5 sm:mt-3 w-full rounded-lg shadow-xs hover:brightness-110 transition"
      />
    </article>
  );
}
