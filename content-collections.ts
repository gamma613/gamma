import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import slugify from "slugify";

// ----------------------------------------------------------------------

// Mixes

/** Shape of a mix item data source */
const mixSchema = z.object({
  artist: z.string().min(1).optional().nullable(),
  bpm: z.number().positive().nullable().optional(),
  bpm2: z.number().positive().nullable().optional(),
  content: z.string().optional().nullable(),
  date: z.coerce.date().nullable().optional(),
  description: z.string().optional(),
  genres: z.array(z.string()).optional().nullable(),
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
    const { artist, slug, title } = document;

    // overload substitutions in the return
    return {
      ...document,
      artist: artist ?? "gamma",
      slug: slug ?? slugify(title),
    };
  },
});

/** Define the collections to be created and exported */
export default defineConfig({
  content: [mixes],
});
