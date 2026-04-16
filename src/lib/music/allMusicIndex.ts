import { allMusic, type Music } from 'content-collections';

// ----------------------------------------------------------------------

const allMusicBySlug = new Map(allMusic.map((x) => [x.slug, x] as const));

export function getMusicBySlug(slug: string): Music | null {
  return allMusicBySlug.get(slug) ?? null;
}

export { allMusicBySlug };
export type { Music };
