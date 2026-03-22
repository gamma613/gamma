"use client";

import Link from "next/link";
import { allMusic } from "content-collections";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { usePlayer } from "../context/usePlayer";
import { getRecentTrackIds } from "../library";
import { PlayInPlayerButton } from "./PlayInPlayerButton";

export function UpNext({ className, limit = 10 }: { className?: string; limit?: number }) {
  const { track, queue, playedThisCycle, clearQueue, removeFromQueue } = usePlayer();

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const defaultOrder = useMemo(() => getRecentTrackIds(), []);

  const upcomingFromDefault = useMemo(() => {
    const queued = new Set(queue);
    const played = new Set(playedThisCycle);
    const currentSlug = track?.slug ?? null;

    const startIndex = currentSlug ? defaultOrder.findIndex((x) => x === currentSlug) : -1;
    const out: string[] = [];

    for (let step = 1; step <= defaultOrder.length && out.length < limit; step += 1) {
      const idx = (Math.max(0, startIndex) + step) % defaultOrder.length;
      const candidate = defaultOrder[idx]!;
      if (candidate === currentSlug) continue;
      if (queued.has(candidate)) continue;
      if (played.has(candidate)) continue;
      out.push(candidate);
    }

    return out;
  }, [defaultOrder, limit, playedThisCycle, queue, track?.slug]);

  return (
    <div className={cn("space-y-6", className)}>
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
                <li
                  key={slug}
                  className="flex items-center gap-3 rounded-md border border-border/50 p-2"
                >
                  <PlayInPlayerButton slug={slug} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <Link href={ROUTES.music(slug).root} className="truncate hover:underline block">
                      {item?.title ?? slug}
                    </Link>
                    {item?.type && <div className="text-xs text-muted-foreground">{item.type}</div>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromQueue(slug)}
                  >
                    Remove
                  </Button>
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
                <li
                  key={slug}
                  className="flex items-center gap-3 rounded-md border border-border/50 p-2"
                >
                  <PlayInPlayerButton slug={slug} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <Link href={ROUTES.music(slug).root} className="truncate hover:underline block">
                      {item?.title ?? slug}
                    </Link>
                    {item?.type && <div className="text-xs text-muted-foreground">{item.type}</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
