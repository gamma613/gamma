import { defineCollection, defineConfig } from '@content-collections/core';
import slugify from 'slugify';
import { z } from 'zod';

// ----------------------------------------------------------------------

// Music

export const MUSIC_TYPES = ['mix', 'mashup', 'track'] as const;
export type MusicType = (typeof MUSIC_TYPES)[number];
export const MIX_TYPES = ['live', 'studio'] as const;
export type MixType = (typeof MIX_TYPES)[number];

const lowercaseGenreNameSchema = z.string().refine((name) => name === name.toLowerCase(), {
  error: 'Genre names and subgenres must be lowercase',
});
const lowercaseTagSchema = z.string().refine((tag) => tag === tag.toLowerCase(), {
  error: 'Tags must be lowercase',
});

/** A standalone genre or an umbrella genre with its subgenres. */
const genreSchema = z.union([
  lowercaseGenreNameSchema,
  z
    .record(lowercaseGenreNameSchema, z.array(lowercaseGenreNameSchema))
    .refine((genre) => Object.keys(genre).length === 1, {
      error: 'A genre mapping must contain exactly one umbrella genre',
    }),
]);
export type MusicGenre = z.infer<typeof genreSchema>;

/** Fields shared by all music item types. */
const musicFieldsSchema = z.object({
  artist: z.string().min(1).optional().nullable(),
  bpm: z.number().positive().nullable().optional(),
  bpm2: z.number().positive().nullable().optional(),
  content: z.string().optional().nullable(),
  date: z.coerce.date(),
  description: z.string().optional(),
  durationSeconds: z.number().int().positive().optional().nullable(),
  genres: z.array(genreSchema).optional().nullable(),
  tags: z.array(lowercaseTagSchema).optional().nullable(),
  tracklist: z.array(z.string().min(1)).optional().nullable(),
  title: z.string().min(1),
  slug: z.string().optional().nullable(),
});

/** Mixes require a Studio/Live subtype; other media types cannot have one. */
const musicSchema = z.discriminatedUnion('type', [
  musicFieldsSchema.extend({ type: z.literal('mix'), mixType: z.enum(MIX_TYPES) }),
  musicFieldsSchema.extend({
    type: z.literal('mashup'),
    mixType: z.never().optional(),
  }),
  musicFieldsSchema.extend({
    type: z.literal('track'),
    mixType: z.never().optional(),
  }),
]);

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
