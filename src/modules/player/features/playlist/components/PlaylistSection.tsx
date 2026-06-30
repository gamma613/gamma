'use client';

import { H2 } from '@/components';
import { getMusicBySlug } from '@/lib/music/allMusicIndex';
import type { PlayerTrackId } from '../../../context/types';
import { usePlayerMain } from '../../../context/usePlayerMain';
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
  actionsInPopover,
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
  /** When true, actions render inside an ellipsis popover. */
  actionsInPopover?: boolean;
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
  const { ready } = usePlayerMain();
  if (!ready) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <H2 disableGutter>{title}</H2>
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
      actionsInPopover={actionsInPopover}
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
  actionsInPopover,
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
  actionsInPopover?: boolean;
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
  const { track } = usePlayerMain();
  const currentSlug = track?.slug ?? null;

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
        <H2 disableGutter>{title}</H2>
        <div className="flex items-center gap-2">
          {headerRight}
          {pagination}
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

              const item = getMusicBySlug(trackId);
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
                    left={renderLeft?.(trackId, ctx)}
                    actions={renderActions?.(trackId, ctx)}
                    actionsPopover={
                      actionsInPopover && renderActions ? renderActions(trackId, ctx) : undefined
                    }
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
