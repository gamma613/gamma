import fsp from 'fs/promises';
import path from 'path';
import { getMusicItem } from './getMusicItem';
import {
  MUSIC_ART_EXTS,
  MUSIC_AUDIO_EXTS,
  type MusicArtExt,
  type MusicArtType,
  type MusicAudioExt,
} from './supported';

type ResolveOptions = {
  dir: string;
  suffix: string;
  preferredBases: readonly string[];
  preferredExts: readonly string[];
};

async function resolveBySuffix({
  dir,
  suffix,
  preferredBases,
  preferredExts,
}: ResolveOptions): Promise<string | null> {
  let entries: string[];
  try {
    entries = await fsp.readdir(dir);
  } catch {
    return null;
  }

  const set = new Set(entries);

  for (const ext of preferredExts) {
    for (const base of preferredBases) {
      const exact = `${base}.${ext}`;
      if (set.has(exact)) return path.join(dir, exact);
    }
  }

  const sorted = [...set].sort();
  for (const ext of preferredExts) {
    const needle = `-${suffix}.${ext}`;
    const match = sorted.find((name) => name.endsWith(needle));
    if (match) return path.join(dir, match);
  }

  return null;
}

function musicDirForSlug(slug: string): string | null {
  const item = getMusicItem(slug);
  if (!item) return null;
  return path.join(process.cwd(), 'protected-assets/music', slug);
}

export async function resolveMusicArtFile(
  slug: string,
  type: MusicArtType
): Promise<string | null> {
  const dir = musicDirForSlug(slug);
  if (!dir) return null;
  return resolveBySuffix({
    dir,
    suffix: type,
    preferredBases: [type, `${slug}-${type}`],
    preferredExts: MUSIC_ART_EXTS,
  });
}

export async function resolveMusicAudioFile(slug: string): Promise<string | null> {
  const dir = musicDirForSlug(slug);
  if (!dir) return null;

  let entries: string[];
  try {
    entries = await fsp.readdir(dir);
  } catch {
    return null;
  }

  const set = new Set(entries);
  for (const ext of MUSIC_AUDIO_EXTS) {
    const exact = `${slug}.${ext}`;
    if (set.has(exact)) return path.join(dir, exact);
  }

  return null;
}

export type { MusicAudioExt, MusicArtExt };
