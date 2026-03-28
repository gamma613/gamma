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
        <div className="flex items-center gap-3">
          {/* Play button */}
          {left}

          {/* Artwork */}
          <Link href={href} className="shrink-0">
            <Image
              src={ROUTES.music(slug).art("cover")}
              alt=""
              aria-hidden="true"
              unoptimized
              width={128}
              height={128}
              sizes="40px, (min-width: 768px) 52px, (min-width: 1024px) 64px"
              className="size-10 md:13 lg:size-16 rounded-md object-cover border border-border/50"
            />
          </Link>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link href={href} className="truncate hover:underline">
              <TitleArtist
                title={title}
                artist={artist}
                className="text-xs xs:text-sm sm:text-md md:text-lg"
              />
            </Link>
            <div className="min-w-0 text-muted-foreground truncate text-xs md:text-sm lg:text-md">
              <MetaData item={item} />
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <CardAction className={cn("ml-auto flex items-center gap-1 self-center shrink-0")}>
              {actions}
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
      {item.type ?? "music"}
      {genres.length > 0 && (
        <>
          <span aria-hidden="true"> | </span>
          {genres.join(", ")}
        </>
      )}
    </>
  );
}
