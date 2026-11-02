'use client';

import { PlayInPlayerButton } from '@/modules/player';
import Image from 'next/image';
import Link from 'next/link';

// ----------------------------------------------------------------------

export type MusicTileProps = {
  artist?: string | null;
  coverSrc: string;
  bpm?: number | null;
  href: string;
  genres?: string[] | null;
  slug: string;
  tags?: string[] | null;
  title: string;
  type?: string | null;
  year?: number | string | null;
};

export function MusicTile({
  artist,
  bpm,
  coverSrc,
  genres,
  href,
  slug,
  tags,
  title,
  type,
  year,
}: MusicTileProps) {
  const hasDistinctArtist = Boolean(artist && artist.toLowerCase() !== 'gamma');
  const meta = [year, type, bpm ? `${bpm} BPM` : null].filter(Boolean);
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
        <Link
          href={href}
          className="block min-w-0 group/title focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
        >
          <h3
            className="font-semibold text-foreground text-xs sm:text-sm leading-snug line-clamp-2 group-hover/title:underline"
            title={title}
          >
            {title}
            {hasDistinctArtist ? ` - ${artist}` : ''}
          </h3>
        </Link>

        {meta.length > 0 && (
          <p
            className="mt-0.5 text-muted-foreground text-[10px] sm:text-xs truncate"
            title={meta.join(' · ')}
          >
            {meta.join(' · ')}
          </p>
        )}

        {visibleGenres.length > 0 && (
          <p
            className="mt-0.5 text-muted-foreground text-[10px] sm:text-xs truncate"
            title={visibleGenres.join(', ')}
          >
            {visibleGenres.join(', ')}
          </p>
        )}

        {visibleTags.length > 0 && (
          <p
            className="mt-0.5 text-muted-foreground/80 text-[10px] sm:text-xs truncate"
            title={visibleTags.join(', ')}
          >
            {visibleTags.join(', ')}
          </p>
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
