import { defineCollection, defineConfig } from '@content-collections/core';
import slugify from 'slugify';
import { z } from 'zod';

// ----------------------------------------------------------------------

// Music

export const MUSIC_TYPES = ['mix', 'mashup', 'track'] as const;
export type MusicType = (typeof MUSIC_TYPES)[number];

/** Shape of a music item data source */
const musicSchema = z.object({
  type: z.enum(MUSIC_TYPES),
  artist: z.string().min(1).optional().nullable(),
  bpm: z.number().positive().nullable().optional(),
  bpm2: z.number().positive().nullable().optional(),
  content: z.string().optional().nullable(),
  date: z.coerce.date(),
  description: z.string().optional(),
  genres: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  title: z.string().min(1),
  slug: z.string().optional().nullable(),
});

const music = defineCollection({
  name: 'music',
  directory: '/protected-assets/music',
  include: '**/*.md',
  schema: musicSchema,
  transform: (document) => {
    const { artist, slug, title, type } = document;

    return {
      ...document,
      type,
      artist: artist ?? 'gamma',
      slug: slug ?? slugify(title),
    };
  },
});

/** Define the collections to be created and exported */
export default defineConfig({
  content: [music],
});
