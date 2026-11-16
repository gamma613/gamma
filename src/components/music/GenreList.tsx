'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/Tooltip';

export type MusicGenre = string | Record<string, string[]>;

export function GenreList({
  genres,
  className,
  layout = 'inline',
}: {
  genres?: MusicGenre[] | null;
  className?: string;
  layout?: 'inline' | 'expanded' | 'stacked';
}) {
  const visibleGenres = genres?.filter(Boolean) ?? [];

  if (visibleGenres.length === 0) return null;

  return (
    <span className={className}>
      {visibleGenres.map((genre, index) => {
        const mapping = typeof genre === 'string' ? null : Object.entries(genre)[0];
        const name = typeof genre === 'string' ? genre : (mapping?.[0] ?? '');
        const subgenres = mapping?.[1] ?? [];

        return (
          <span key={`${name}-${index}`} className={layout === 'stacked' ? 'block' : undefined}>
            {layout !== 'stacked' && index > 0 ? ', ' : null}
            {layout === 'stacked' || layout === 'expanded' ? (
              <>
                {name}
                {subgenres.length > 0 ? ` (${subgenres.join(', ')})` : null}
              </>
            ) : subgenres.length > 0 ? (
              <GenreTooltip name={name} subgenres={subgenres} />
            ) : (
              name
            )}
          </span>
        );
      })}
    </span>
  );
}

function GenreTooltip({ name, subgenres }: { name: string; subgenres: string[] }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${name}, subgenres: ${subgenres.join(', ')}`}
          className="underline decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
        >
          {name}
        </button>
      </TooltipTrigger>
      <TooltipContent>{subgenres.join(', ')}</TooltipContent>
    </Tooltip>
  );
}
