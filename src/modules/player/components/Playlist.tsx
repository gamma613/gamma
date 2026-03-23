"use client";

import { Button, Card, CardAction, CardContent, RemoveButton, TitleArtist } from "@/components";
import { formatDateYmd } from "@/lib/formatDate";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { allMusic } from "content-collections";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { getRecentTrackIds } from "../library";
import { EnqueueButton } from "./EnqueueButton";
import { PlayInPlayerButton } from "./PlayInPlayerButton";
import { PlayNextButton } from "./PlayNextButton";

// ----------------------------------------------------------------------

type PlaylistTabId = "next" | "history";

export function Playlist({ className, limit }: { className?: string; limit?: number }) {
  const {
    track,
    queue,
    playedThisCycle,
    history,
    clearQueue,
    clearHistory,
    removeFromHistory,
    removeFromQueue,
  } = usePlayer();
  const [tabId, setTabId] = useState<PlaylistTabId>("next");
  const displayHistory = useMemo(
    () => history.filter((x) => x !== (track?.slug ?? null)),
    [history, track?.slug],
  );
  const activeTabId: PlaylistTabId =
    tabId === "history" && displayHistory.length === 0 ? "next" : tabId;

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const defaultOrder = useMemo(() => getRecentTrackIds(), []);
  const effectiveLimit = limit ?? defaultOrder.length;

  const upcomingFromDefault = useMemo(() => {
    const queued = new Set(queue);
    const played = new Set(playedThisCycle);
    const currentSlug = track?.slug ?? null;
    return defaultOrder
      .filter((candidate) => {
        if (candidate === currentSlug) return false;
        if (queued.has(candidate)) return false;
        if (played.has(candidate)) return false;
        return true;
      })
      .slice(0, effectiveLimit);
  }, [defaultOrder, effectiveLimit, playedThisCycle, queue, track?.slug]);

  const historyItems = useMemo(() => {
    return displayHistory.slice(0, effectiveLimit);
  }, [displayHistory, effectiveLimit]);

  return (
    <div className={cn("space-y-6", className)}>
      {track?.slug && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Now playing</h2>
          <MusicRow slug={track.slug} title={track.title ?? track.slug} artist={track.artist} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={activeTabId === "next" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTabId("next")}
        >
          Playing next
        </Button>
        {displayHistory.length > 0 && (
          <Button
            type="button"
            variant={activeTabId === "history" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTabId("history")}
          >
            History
          </Button>
        )}
      </div>

      {activeTabId === "next" ? (
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Your queue</h2>
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
                {queue.map((slug, index) => {
                  const item = bySlug.get(slug);
                  const isFirstInQueue = index === 0;
                  return (
                    <li key={slug}>
                      <MusicRow
                        slug={slug}
                        title={item?.title ?? slug}
                        artist={item?.artist ?? undefined}
                        actions={
                          <div className="flex items-center gap-1">
                            {!isFirstInQueue && <PlayNextButton trackId={slug} />}
                            <RemoveButton onClick={() => removeFromQueue(slug)} />
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
            <h2 className="text-lg font-semibold">Followed by</h2>
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
                        actions={
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
        </div>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">History</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                clearHistory();
                setTabId("next");
              }}
            >
              Clear
            </Button>
          </div>

          {historyItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing played yet.</p>
          ) : (
            <ul className="space-y-2">
              {historyItems.map((slug) => {
                const item = bySlug.get(slug);
                return (
                  <li key={slug}>
                    <div
                      className={cn(slug === track?.slug && "rounded-md ring-1 ring-primary/30")}
                    >
                      <MusicRow
                        slug={slug}
                        title={item?.title ?? slug}
                        artist={item?.artist ?? undefined}
                        actions={
                          <div className="flex items-center gap-1">
                            <PlayNextButton trackId={slug} />
                            <EnqueueButton trackId={slug} />
                            <RemoveButton onClick={() => removeFromHistory(slug)} />
                          </div>
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
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
  actions,
}: {
  slug: string;
  title: string;
  artist?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="py-2 bg-card/80">
      <CardContent className="px-4">
        {/* <div className="flex items-center gap-3 bg-background/75 rounded-md border border-border/50 p-2"> */}
        <div className="flex items-center gap-3">
          <PlayInPlayerButton slug={slug} className="size-9" />
          <MusicArtwork slug={slug} />
          <div className="min-w-0 flex-1">
            <Link href={ROUTES.music(slug).root} className="truncate hover:underline block">
              <TitleArtist title={title} artist={artist} />
            </Link>
            <div className="flex items-center gap-2">
              <MusicMetaLine slug={slug} />
            </div>
          </div>
          <CardAction>{actions}</CardAction>
        </div>
      </CardContent>
    </Card>
  );
}
