"use client";

import { allMusic } from "content-collections";
import { useMemo } from "react";
import { usePlayer } from "../../../context/usePlayer";
import { MusicRow } from "./MusicRow";
import { PlayInPlayerButton } from "../../../components/PlayInPlayerButton";

// ----------------------------------------------------------------------

export function NowPlaying() {
  const { track } = usePlayer();

  const bySlug = useMemo(() => new Map(allMusic.map((x) => [x.slug, x])), []);
  const item = track?.slug ? (bySlug.get(track.slug) ?? null) : null;

  if (!track?.slug) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Now playing</h2>
      <MusicRow
        trackId={track.slug}
        item={
          item
            ? {
                slug: item.slug,
                title: item.title,
                artist: item.artist,
                type: item.type,
                genres: item.genres,
              }
            : {
                slug: track.slug,
                title: track.title ?? track.slug,
                artist: track.artist,
              }
        }
        left={<PlayInPlayerButton slug={track.slug} className="size-9 shrink-0" />}
      />
    </div>
  );
}
