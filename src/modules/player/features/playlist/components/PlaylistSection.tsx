'use client';

import { H2 } from '@/components';
import { allMusic } from 'content-collections';
import { useMemo } from 'react';
import { PlayInPlayerButton } from '../../../components/PlayInPlayerButton';
import type { PlayerTrackId } from '../../../context/types';
import { usePlayer } from '../../../context/usePlayer';
import { MusicRow } from './MusicRow';
import { PaginationControls, usePagination } from './Pagination';

// ----------------------------------------------------------------------

export type PlaylistSectionItem<TMeta = undefined> = {
  meta?: TMeta;
  trackId: PlayerTrackId;
};

export type PlaylistSectionRenderContext<TMeta = undefined> = {
  absoluteIndex: number;
  isCurrent: boolean;
  meta: TMeta | undefined;
};

export function PlaylistSection<TMeta = undefined>({
  empty,
  headerRight,
  hideWhenEmpty,
  itemKey,
  items,
  itemsPerPage = 10,
  listClassName = 'space-y-2',
  renderActions,
  renderLeft,
  title,
}: {
  empty?: React.ReactNode;
  headerRight?: React.ReactNode;
  hideWhenEmpty?: boolean;
  itemKey: string;
  items: PlaylistSectionItem<TMeta>[];
  itemsPerPage?: number;
  listClassName?: string;
  renderActions?: (
    trackId: PlayerTrackId,
    ctx: PlaylistSectionRenderContext<TMeta>
  ) => React.ReactNode;
  renderLeft?: (
    trackId: PlayerTrackId,
    ctx: PlaylistSectionRenderContext<TMeta>
  ) => React.ReactNode;
  title: string;
}) {
  const { ready } = usePlayer();
  if (!ready) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </section>
    );
  }

  return (
    <PlaylistSectionReady
      empty={empty}
      headerRight={headerRight}
      hideWhenEmpty={hideWhenEmpty}
      itemKey={itemKey}
      items={items}
      itemsPerPage={itemsPerPage}
      listClassName={listClassName}
      renderActions={renderActions}
      renderLeft={renderLeft}
      title={title}
    />
  );
}

function PlaylistSectionReady<TMeta = undefined>({
  empty,
  headerRight,
  hideWhenEmpty,
  itemKey,
  items,
  itemsPerPage,
  listClassName,
  renderActions,
  renderLeft,
  title,
}: {
  empty?: React.ReactNode;
  headerRight?: React.ReactNode;
  hideWhenEmpty?: boolean;
  itemKey: string;
  items: PlaylistSectionItem<TMeta>[];
  itemsPerPage: number;
  listClassName: string;
  renderActions?: (
    trackId: PlayerTrackId,
    ctx: PlaylistSectionRenderContext<TMeta>
  ) => React.ReactNode;
  renderLeft?: (
    trackId: PlayerTrackId,
    ctx: PlaylistSectionRenderContext<TMeta>
  ) => React.ReactNode;
  title: string;
}) {
  const { track } = usePlayer();
  const currentSlug = track?.slug ?? null;

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const { page, pageCount, setPage, startIndex, endIndexExclusive } = usePagination({
    itemCount: items.length,
    itemsPerPage,
    itemKey,
  });

  if (hideWhenEmpty && items.length === 0) return null;

  const pageItems = items.slice(startIndex, endIndexExclusive);

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const pagination = (
    <PaginationControls page={page} pageCount={pageCount} onPageChange={onPageChange} />
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <H2>{title}</H2>
        <div className="flex items-center gap-2">
          {pagination}
          {headerRight}
        </div>
      </div>

      {items.length === 0 ? (
        (empty ?? <p className="text-sm text-muted-foreground">Nothing here yet.</p>)
      ) : (
        <>
          <ul className={listClassName}>
            {pageItems.map(({ trackId, meta }, indexOnPage) => {
              const absoluteIndex = startIndex + indexOnPage;
              const isCurrent = Boolean(currentSlug && trackId === currentSlug);

              const item = bySlug.get(trackId) ?? null;
              const playlistItem = item
                ? {
                    slug: item.slug,
                    title: item.title,
                    artist: item.artist,
                    type: item.type,
                    genres: item.genres,
                  }
                : null;

              const ctx: PlaylistSectionRenderContext<TMeta> = {
                absoluteIndex,
                isCurrent,
                meta,
              };

              return (
                <li key={`${trackId}-${absoluteIndex}`}>
                  <MusicRow
                    trackId={trackId}
                    item={playlistItem}
                    left={
                      renderLeft?.(trackId, ctx) ?? (
                        <PlayInPlayerButton slug={trackId} className="size-9 shrink-0" />
                      )
                    }
                    actions={renderActions?.(trackId, ctx)}
                  />
                </li>
              );
            })}
          </ul>

          <div className="flex justify-end">{pagination}</div>
        </>
      )}
    </section>
  );
}
