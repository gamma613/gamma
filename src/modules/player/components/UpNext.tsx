"use client";

import Image from "next/image";
import Link from "next/link";
import { allMusic } from "content-collections";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { formatDateYmd } from "@/lib/formatDate";
import { TitleArtist } from "@/components/music";
import { usePlayer } from "../context/usePlayer";
import { getRecentTrackIds } from "../library";
import { PlayInPlayerButton } from "./PlayInPlayerButton";
import { EnqueueButton } from "./EnqueueButton";
import { PlayNextButton } from "./PlayNextButton";

// ----------------------------------------------------------------------

export function UpNext({ className, limit }: { className?: string; limit?: number }) {
  const { track, queue, playedThisCycle, clearQueue, removeFromQueue } = usePlayer();

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const defaultOrder = useMemo(() => getRecentTrackIds(), []);
  const effectiveLimit = limit ?? defaultOrder.length;

  const upcomingFromDefault = useMemo(() => {
    const queued = new Set(queue);
    const played = new Set(playedThisCycle);
    const currentSlug = track?.slug ?? null;

    const startIndex = currentSlug ? defaultOrder.findIndex((x) => x === currentSlug) : -1;
    const out: string[] = [];

    for (let step = 1; step <= defaultOrder.length && out.length < effectiveLimit; step += 1) {
      const idx = (Math.max(0, startIndex) + step) % defaultOrder.length;
      const candidate = defaultOrder[idx]!;
      if (candidate === currentSlug) continue;
      if (queued.has(candidate)) continue;
      if (played.has(candidate)) continue;
      out.push(candidate);
    }

    return out;
  }, [defaultOrder, effectiveLimit, playedThisCycle, queue, track?.slug]);

  return (
    <div className={cn("space-y-6", className)}>
      {track?.slug && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Now playing</h2>
          <MusicRow
            slug={track.slug}
            title={track.title ?? track.slug}
            artist={track.artist}
            status="Now"
          />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Up next</h2>
          {queue.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={clearQueue}>
              Clear
            </Button>
          )}
        </div>

        {queue.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing queued.</p>
        ) : (
          <ul className="space-y-2">
            {queue.map((slug) => {
              const item = bySlug.get(slug);
              return (
                <li key={slug}>
                  <MusicRow
                    slug={slug}
                    title={item?.title ?? slug}
                    artist={item?.artist ?? undefined}
                    status="Queued"
                    rightAction={
                      <div className="flex items-center gap-1">
                        <PlayNextButton trackId={slug} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromQueue(slug)}
                        >
                          Remove
                        </Button>
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">From the library</h2>
        {upcomingFromDefault.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming items (cycle may be complete).
          </p>
        ) : (
          <ul className="space-y-2">
            {upcomingFromDefault.map((slug) => {
              const item = bySlug.get(slug);
              return (
                <li key={slug}>
                  <MusicRow
                    slug={slug}
                    title={item?.title ?? slug}
                    artist={item?.artist ?? undefined}
                    rightAction={
                      <div className="flex items-center gap-1">
                        <PlayNextButton trackId={slug} />
                        <EnqueueButton trackId={slug} />
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All music</h2>
        <ul className="space-y-2">
          {defaultOrder.map((slug) => {
            const item = bySlug.get(slug);
            const status = slug === track?.slug ? "Now" : queue.includes(slug) ? "Queued" : null;
            const isCurrent = slug === track?.slug;
            return (
              <li key={slug}>
                <div className={cn(slug === track?.slug && "rounded-md ring-1 ring-primary/30")}>
                  <MusicRow
                    slug={slug}
                    title={item?.title ?? slug}
                    artist={item?.artist ?? undefined}
                    status={status}
                    rightAction={
                      isCurrent ? undefined : (
                        <div className="flex items-center gap-1">
                          <PlayNextButton trackId={slug} />
                          <EnqueueButton trackId={slug} />
                        </div>
                      )
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------

// Helpers

function MusicMetaLine({ slug }: { slug: string }) {
  const item = allMusic.find((x) => x.slug === slug);
  if (!item) return null;
  return (
    <div className="text-xs text-muted-foreground">
      {formatDateYmd(item.date)} <span aria-hidden="true">|</span> {item.type}
    </div>
  );
}

function MusicArtwork({ slug }: { slug: string }) {
  const href = ROUTES.music(slug).root;
  return (
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
  );
}

function MusicRow({
  slug,
  title,
  artist,
  status,
  rightAction,
}: {
  slug: string;
  title: string;
  artist?: string;
  status?: string | null;
  rightAction?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-background/75 rounded-md border border-border/50 p-2">
      <PlayInPlayerButton slug={slug} className="size-9" />
      <MusicArtwork slug={slug} />
      <div className="min-w-0 flex-1">
        <Link href={ROUTES.music(slug).root} className="truncate hover:underline block">
          <TitleArtist title={title} artist={artist} />
        </Link>
        <div className="flex items-center gap-2">
          <MusicMetaLine slug={slug} />
          {status && (
            <span className="text-xs text-muted-foreground">
              <span aria-hidden="true">•</span> {status}
            </span>
          )}
        </div>
      </div>
      {rightAction}
    </div>
  );
}
