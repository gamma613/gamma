import fsp from 'fs/promises';
import path from 'path';

import type { MixArtType, MixAudioExt, MixArtExt } from './supported';
import { MIX_ART_EXTS, MIX_AUDIO_EXTS } from './supported';

type ResolveOptions = {
  dir: string;
  // e.g. 'cover' or 'audio'
  suffix: string;
  // base names to try first, without extension, in preferred order
  preferredBases: readonly string[];
  // allowed extensions in preferred order
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

  // 1) Exact preferred base names first (e.g. cover.jpg, audio.mp3)
  for (const ext of preferredExts) {
    for (const base of preferredBases) {
      const exact = `${base}.${ext}`;
      if (set.has(exact)) return path.join(dir, exact);
    }
  }

  // 2) Any file ending in "-<suffix>.<ext>" (preferred ext order)
  const sorted = [...set].sort();
  for (const ext of preferredExts) {
    const needle = `-${suffix}.${ext}`;
    const match = sorted.find((name) => name.endsWith(needle));
    if (match) return path.join(dir, match);
  }

  return null;
}

export async function resolveMixArtFile(slug: string, type: MixArtType): Promise<string | null> {
  const dir = path.join(process.cwd(), 'protected-assets/mixes', slug);
  return resolveBySuffix({
    dir,
    suffix: type,
    preferredBases: [type, `${slug}-${type}`],
    preferredExts: MIX_ART_EXTS,
  });
}

export async function resolveMixAudioFile(slug: string): Promise<string | null> {
  const dir = path.join(process.cwd(), 'protected-assets/mixes', slug);
  return resolveBySuffix({
    dir,
    suffix: 'audio',
    preferredBases: ['audio', `${slug}-audio`],
    preferredExts: MIX_AUDIO_EXTS,
  });
}

export type { MixAudioExt, MixArtExt };

