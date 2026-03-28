'use client';

import { Button, RemoveButton } from '@/components';
import { allMusic } from 'content-collections';
import { useMemo } from 'react';
import { EnqueueButton } from '../../../components/EnqueueButton';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import { PlayNextButton } from '../../../components/PlayNextButton';
import { usePlayer } from '../../../context/usePlayer';
import { MusicRow } from './MusicRow';
import { PaginationControls, usePagination } from './Pagination';

// ----------------------------------------------------------------------

export function History({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { ready } = usePlayer();
  if (!ready) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">History</h2>
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </section>
    );
  }

  return <HistoryPaged itemsPerPage={itemsPerPage} />;
}

function HistoryPaged({ itemsPerPage }: { itemsPerPage: number }) {
  const { track, history, clearHistory, removeHistoryAt } = usePlayer();

  const entries = useMemo(() => {
    const currentSlug = track?.slug ?? null;
    return history.map((id, index) => ({ id, index })).filter((x) => x.id !== currentSlug);
  }, [history, track?.slug]);

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const { page, pageCount, setPage, startIndex, endIndexExclusive } = usePagination({
    itemCount: entries.length,
    itemsPerPage,
    itemKey: 'history',
  });

  const pageItems = entries.slice(startIndex, endIndexExclusive);

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">History</h2>
        <div className="flex items-center gap-2">
          <PaginationControls page={page} pageCount={pageCount} onPageChange={onPageChange} />
          {history.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={clearHistory}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing played yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {pageItems.map(({ id, index }) => {
              const item = bySlug.get(id) ?? null;
              return (
                <li key={`${id}-${index}`}>
                  <MusicRow
                    trackId={id}
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
                    left={<PlayInPlayerButton slug={id} className="size-9 shrink-0" />}
                    actions={
                      <div className="flex items-center gap-1">
                        <PlayNextButton trackId={id} />
                        <EnqueueButton trackId={id} />
                        <RemoveButton onClick={() => removeHistoryAt(index)} />
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
