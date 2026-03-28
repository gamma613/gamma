"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardAction, CardContent, TitleArtist } from "@/components";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { PlayerTrackId } from "../../../context/types";

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
}: {
  trackId: PlayerTrackId;
  item: PlaylistMusicItem | null;
  left: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const slug = item?.slug ?? trackId;
  const href = ROUTES.music(slug).root;
  const title = item?.title ?? slug;
  const artist = item?.artist ?? undefined;

  return (
    <Card className="py-2 bg-card/80">
      <CardContent className="px-4">
        <div className="flex items-start gap-3">
          {left}

          <Link href={href} className="shrink-0">
            <Image
              width={48}
              height={48}
              src={ROUTES.music(slug).art("cover")}
              alt=""
              aria-hidden="true"
              unoptimized
              className="size-10 rounded-md object-cover border border-border/50"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={href} className="truncate hover:underline block">
              <TitleArtist title={title} artist={artist} />
            </Link>
            <div className="min-w-0">
              <MetaLine item={item} />
            </div>
          </div>

          {actions && (
            <CardAction className={cn("ml-auto flex items-center gap-1 self-start shrink-0")}>
              {actions}
            </CardAction>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetaLine({ item }: { item: PlaylistMusicItem | null }) {
  if (!item) return null;
  const genres = item.genres?.filter(Boolean) ?? [];

  return (
    <div className="text-xs text-muted-foreground truncate">
      {item.type ?? "music"}
      {genres.length > 0 && (
        <>
          <span aria-hidden="true"> | </span>
          {genres.join(", ")}
        </>
      )}
    </div>
  );
}
