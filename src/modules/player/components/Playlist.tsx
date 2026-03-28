"use client";

import { Button, Card, CardAction, CardContent, RemoveButton, TitleArtist } from "@/components";
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

      {displayHistory.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeTabId === "next" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTabId("next")}
          >
            Up next
          </Button>

          <Button
            type="button"
            variant={activeTabId === "history" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTabId("history")}
          >
            History
          </Button>
        </div>
      )}

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
              <Card>
                <CardContent>
                  <h3>Nothing here yet.</h3>
                  <p>
                    Curate your listening experience using the &quot;Play Next&quot; and
                    &quot;Enqueue&quot; buttons.
                  </p>
                </CardContent>
              </Card>
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

          {upcomingFromDefault.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">On deck</h2>
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
            </section>
          )}
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

function MetaSeparator() {
  return <span aria-hidden="true"> | </span>;
}

function MusicMetaData({ slug }: { slug: string }) {
  const item = allMusic.find((x) => x.slug === slug);
  if (!item) return null;

  return (
    <>
      {item.type}
      {item.genres && (
        <>
          <MetaSeparator />
          {item.genres.join(", ")}
        </>
      )}
    </>
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
      <CardContent className="px-2 xs:px-4">
        <div className="flex items-center gap-2 xs:gap-3">
          {/* Play button */}
          <PlayInPlayerButton slug={slug} className="size-9 shrink-0" />
          {/* Artwork */}
          <Link href={ROUTES.music(slug).root} className="shrink-0">
            <Image
              src={ROUTES.music(slug).art("cover")}
              alt=""
              aria-hidden="true"
              width={128}
              height={128}
              sizes="40px, (min-width: 768px) 52px, (min-width: 1024px) 64px"
              className="size-10 md:13 lg:size-16 rounded-md object-cover border border-border/50"
            />
          </Link>
          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link href={ROUTES.music(slug).root} className="truncate hover:underline block">
              <TitleArtist
                artist={artist}
                title={title}
                className="text-xs xs:text-sm sm:text-md md:text-lg"
              />
            </Link>
            <div className="min-w-0 text-muted-foreground truncate text-xs md:text-sm lg:text-md">
              <MusicMetaData slug={slug} />
            </div>
          </div>
          {/* Actions */}
          {actions && (
            <CardAction className="ml-auto flex items-center self-center gap-1 shrink-0">
              {actions}
            </CardAction>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
