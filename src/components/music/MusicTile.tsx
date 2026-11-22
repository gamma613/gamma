'use client';

import type { Music } from '@/lib/music/allMusicIndex';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { PlayInPlayerButton } from '@/modules/player';
import Image from 'next/image';
import Link from 'next/link';
import { GenreList } from './GenreList';
import { MusicMetadata } from './MusicMetadata';

// ----------------------------------------------------------------------

export type MusicTileProps = {
  className?: string;
  expandedGenres?: boolean;
  expandedType?: boolean;
  item: Music;
};

export function MusicTile({
  className,
  expandedGenres = false,
  expandedType = false,
  item,
}: MusicTileProps) {
  const { artist, bpm, date, durationSeconds, genres, slug, tags, title, type } = item;
  const href = ROUTES.music(slug).root;
  const coverSrc = ROUTES.music(slug).art('cover');
  const mixType = type === 'mix' ? item.mixType : null;
  const hasDistinctArtist = Boolean(artist && artist.toLowerCase() !== 'gamma');
  const visibleGenres = (genres ?? []).filter(Boolean);
  const visibleTags = (tags ?? []).filter(Boolean);

  return (
    <article
      id={`music-tile-${slug}`}
      data-slug={slug}
      className={cn(
        'group/tile flex h-full flex-col rounded-xl bg-card/60 hover:bg-card/90 border border-border/40 hover:border-border/80 transition-all duration-200 p-2.5 sm:p-3 shadow-xs hover:shadow-md',
        className
      )}
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
      <div className="mt-2.5 sm:mt-3 min-w-0 flex-1 text-xs sm:text-sm md:text-md text-muted-foreground">
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

        {/* General metadata */}
        <div className="mt-1">
          <MusicMetadata
            bpm={bpm}
            date={date}
            dateFormat="full"
            durationSeconds={durationSeconds}
            expandedType={expandedType}
            mixType={mixType}
            type={type}
          />
        </div>

        {/* Genres */}
        {visibleGenres.length > 0 && (
          <div className="mt-1 whitespace-normal break-words">
            <GenreList genres={visibleGenres} layout={expandedGenres ? 'expanded' : 'inline'} />
          </div>
        )}

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="mt-1 whitespace-normal break-words">{visibleTags.join(', ')}</div>
        )}
      </div>

      {/* Play button */}
      <PlayInPlayerButton
        slug={slug}
        progressShape="none"
        className="mt-2.5 sm:mt-3 w-full rounded-lg shadow-xs hover:brightness-110 transition"
      />
    </article>
  );
}
