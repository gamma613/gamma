"use client";

import { allMusic } from "content-collections";
import { useMemo, useRef } from "react";
import { Button, RemoveButton } from "@/components";
import { usePlayer } from "../../../context/usePlayer";
import { MusicRow } from "./MusicRow";
import { PlayInPlayerButton } from "../../../components/PlayInPlayerButton";
import { PlayNextButton } from "../../../components/PlayNextButton";
import { PaginationControls, usePagination } from "./Pagination";

// ----------------------------------------------------------------------

export function UserQueue({ itemsPerPage = 10 }: { itemsPerPage?: number }) {
  const { ready } = usePlayer();
  if (!ready) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Your queue</h2>
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </section>
    );
  }

  return <UserQueuePaged itemsPerPage={itemsPerPage} />;
}

function UserQueuePaged({ itemsPerPage }: { itemsPerPage: number }) {
  const { queue, clearQueue, removeFromQueue } = usePlayer();
  const topRef = useRef<HTMLDivElement | null>(null);

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const { page, pageCount, setPage, startIndex, endIndexExclusive } = usePagination({
    itemCount: queue.length,
    itemsPerPage,
    itemKey: "user-queue",
  });

  const pageItems = queue.slice(startIndex, endIndexExclusive);

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="space-y-3">
      <div ref={topRef} className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Your queue</h2>
        <div className="flex items-center gap-2">
          <PaginationControls page={page} pageCount={pageCount} onPageChange={onPageChange} />
          {queue.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={clearQueue}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {queue.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing queued.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {pageItems.map((trackId, indexOnPage) => {
              const item = bySlug.get(trackId) ?? null;
              const absoluteIndex = startIndex + indexOnPage;
              const isFirstInQueue = absoluteIndex === 0;

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
                        {!isFirstInQueue && <PlayNextButton trackId={trackId} />}
                        <RemoveButton onClick={() => removeFromQueue(trackId)} />
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
