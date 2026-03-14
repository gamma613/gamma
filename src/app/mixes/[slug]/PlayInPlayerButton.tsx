'use client';

import { usePlayer } from '@/modules/player';

export function PlayInPlayerButton({ src, title }: { src: string; title: string }) {
  const { play } = usePlayer();

  return (
    <button
      type="button"
      className="shrink-0 rounded border px-3 py-1 text-sm hover:bg-black/5"
      onClick={() => play({ src, title })}
    >
      Play
    </button>
  );
}
