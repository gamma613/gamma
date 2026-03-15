import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import slugify from 'slugify';
import { MIX_ART_EXTS, MIX_AUDIO_EXTS } from "./src/lib/mixes/supported";

// ----------------------------------------------------------------------

// Mixes

/** Shape of a mix item data source */
const mixSchema = z.object({
  artist: z.string().min(1).optional().nullable(),
  artExt: z.object({
    cover: z.enum(MIX_ART_EXTS as unknown as [string, ...string[]]).nullable().optional(),
  }).optional(),
  audioExt: z.enum(MIX_AUDIO_EXTS as unknown as [string, ...string[]]).nullable().optional(),
  bpm: z.number().positive().nullable().optional(),
  bpm2: z.number().positive().nullable().optional(),
  content: z.string().optional().nullable(),
  date: z.coerce.date().nullable().optional(),
  description: z.string().optional(),
  genres: z.array(z.string()),
  length: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  title: z.string().min(1),
  slug: z.string().optional().nullable(),
});

/** Export the inferred type for use in UI components */
export type Mix = z.infer<typeof mixSchema>;

/** parse */
const mixes = defineCollection({
  name: "mixes",
  directory: "/protected-assets/mixes",
  include: "**/*.md",
  schema: mixSchema,
  transform: (document) => {
    const { audioExt, slug, title } = document;

    // overload substitutions in the return
    return {
      ...document,
      audioExt: audioExt ?? 'mp3',
      slug: slug ?? slugify(title),
    }
  },
});

/** Define the collections to be created and exported */
export default defineConfig({
  content: [mixes],
});
