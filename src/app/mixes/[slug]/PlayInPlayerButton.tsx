'use client';

import { usePlayer } from '@/modules/player';

export function PlayInPlayerButton({
  slug,
  title,
  artist,
  cover,
}: {
  slug: string;
  title: string;
  artist?: string;
  cover?: string;
}) {
  const { play } = usePlayer();

  return (
    <button
      type="button"
      className="shrink-0 rounded border px-3 py-1 text-sm hover:bg-black/5"
      onClick={() =>
        play({
          kind: 'mixes',
          src: `/api/stream/mixes/${slug}`,
          title,
          artist,
          cover,
        })
      }
    >
      Play
    </button>
  );
}
