'use client';

import { allMusic } from 'content-collections';
import { useMemo } from 'react';
import { EnqueueButton } from '../../../components/EnqueueButton';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { PlayNextButton } from '../../../components/PlayNextButton';
import { usePlayer } from '../../../context/usePlayer';
import { MusicRow } from './MusicRow';
import { PaginationControls, usePagination } from './Pagination';

// ----------------------------------------------------------------------

export function OnDeck({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { ready } = usePlayer();
  if (!ready) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">On deck</h2>
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </section>
    );
  }

  return <OnDeckPaged itemsPerPage={itemsPerPage} />;
}

function OnDeckPaged({ itemsPerPage }: { itemsPerPage: number }) {
  const { onDeck, track } = usePlayer();
  const currentSlug = track?.slug ?? null;

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const { page, pageCount, setPage, startIndex, endIndexExclusive } = usePagination({
    itemCount: onDeck.length,
    itemsPerPage,
    itemKey: 'on-deck',
  });

  const pageItems = onDeck.slice(startIndex, endIndexExclusive);

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">On deck</h2>
        <PaginationControls page={page} pageCount={pageCount} onPageChange={onPageChange} />
      </div>

      {onDeck.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing on deck.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {pageItems.map((trackId, indexOnPage) => {
              const item = bySlug.get(trackId) ?? null;
              const absoluteIndex = startIndex + indexOnPage;
              const isCurrent = Boolean(currentSlug && trackId === currentSlug);

              return (
                <li key={`${trackId}-${absoluteIndex}`}>
                  <MusicRow
                    trackId={trackId}
                    item={
                      item
                        ? {
                            slug: item.slug,
                            title: item.title,
                            artist: item.artist,
                            type: item.type,
                            genres: item.genres,
                          }
                        : null
                    }
                    left={<PlayInPlayerButton slug={trackId} className="size-9 shrink-0" />}
                    actions={
                      <div className="flex items-center gap-1">
                        <PlayNextButton trackId={trackId} disabled={isCurrent} />
                        <EnqueueButton trackId={trackId} disabled={isCurrent} />
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>

          <div className="flex justify-end">
            <PaginationControls page={page} pageCount={pageCount} onPageChange={onPageChange} />
          </div>
        </>
      )}
    </section>
  );
}
