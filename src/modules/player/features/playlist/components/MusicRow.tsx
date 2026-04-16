'use client';

import { Card, CardAction, CardContent, TitleArtist } from '@/components';
import { IconButton } from '@/components/buttons/IconButton';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import { Popover } from 'radix-ui';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { PlayerTrackId } from '../../../context/types';

// ----------------------------------------------------------------------

export type PlaylistMusicItem = {
  slug: string;
  title: string;
  artist?: string | null;
  type?: string;
  genres?: string[] | null;
};

export function MusicRow({
  trackId,
  item,
  left,
  actions,
  actionsPopover,
}: {
  trackId: PlayerTrackId;
  item: PlaylistMusicItem | null;
  left: React.ReactNode;
  actions?: React.ReactNode;
  actionsPopover?: React.ReactNode;
}) {
  const slug = item?.slug ?? trackId;
  const href = ROUTES.music(slug).root;
  const title = item?.title ?? slug;
  const artist = item?.artist ?? undefined;

  const [actionsOpen, setActionsOpen] = useState(false);
  const hasPopoverActions = Boolean(actionsPopover);

  const popoverContent = useMemo(() => actionsPopover ?? actions, [actionsPopover, actions]);

  return (
    <Card className="bg-card/80">
      <CardContent>
        <div className="flex items-center gap-3">
          {/* Play button */}
          {left}

          {/* Artwork */}
          <Link href={href} className="shrink-0">
            <Image
              src={ROUTES.music(slug).art('cover')}
              alt=""
              aria-hidden="true"
              unoptimized
              width={104}
              height={104}
              sizes="40px, (min-width: 768px) 52px"
              className="size-10 md:size-13 rounded-md object-cover border border-border/50"
            />
          </Link>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link href={href} className="inline-flex max-w-full min-w-0 hover:underline">
              <TitleArtist
                title={title}
                artist={artist}
                className="truncate text-sm md:text-base"
              />
            </Link>
            <div className="min-w-0 text-muted-foreground truncate text-xs md:text-sm">
              <MetaData item={item} />
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <CardAction className={cn('ml-auto flex items-center gap-1 self-center shrink-0')}>
              {hasPopoverActions ? (
                <>
                  <div className="hidden xs:flex items-center gap-1">{actions}</div>

                  <div className="xs:hidden">
                    <Popover.Root open={actionsOpen} onOpenChange={setActionsOpen}>
                      <Popover.Trigger asChild>
                        <IconButton
                          icon={faEllipsisVertical}
                          label="Actions"
                          type="button"
                          variant="ghost"
                          aria-haspopup="menu"
                        />
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          side="top"
                          align="end"
                          sideOffset={8}
                          aria-label="Actions"
                          className={cn(
                            'z-50 rounded-lg border bg-background/80 p-2 text-popover-foreground shadow-md',
                            'supports-[backdrop-filter]:backdrop-blur-md'
                          )}
                          onClickCapture={(e) => {
                            const target = e.target as HTMLElement | null;
                            if (!target) return;
                            if (!target.closest('button,a,[role=menuitem]')) return;
                            // Defer closing so the action's click handler can run before unmount.
                            window.setTimeout(() => setActionsOpen(false), 0);
                          }}
                        >
                          <div className="flex items-center gap-1">{popoverContent}</div>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  </div>
                </>
              ) : (
                actions
              )}
            </CardAction>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetaData({ item }: { item: PlaylistMusicItem | null }) {
  if (!item) return null;
  const genres = item.genres?.filter(Boolean) ?? [];

  return (
    <>
      {item.type ?? 'music'}
      {genres.length > 0 && (
        <>
          <span aria-hidden="true"> | </span>
          {genres.join(', ')}
        </>
      )}
    </>
  );
}
