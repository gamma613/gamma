import { NextResponse } from "next/server"
import fsp from "fs/promises"
import fs from "fs"

import path from "path"
import { getMix } from "@/lib/mixes/getMix"
import { Mix } from "content-collections"

// ----------------------------------------------------------------------


/** Supported art types */
type ArtTypes = keyof NonNullable<Mix["artExt"]>;

/** Configuration */
const CONFIG = {
  art: {
    cover: {
      fallback: "public/mixes/default-cover.jpg",
    }
  } satisfies Record<ArtTypes, {
    fallback: string;
  }>,
  debug: false,
}

// ----------------------------------------------------------------------

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string, type: ArtTypes }> }
) {
  const { slug, type } = await params

  // Validate art type
  const artConfig = CONFIG.art[type];
  if (!artConfig) {
    return new NextResponse("Invalid art type", { status: 400 });
  }

  // Try to get art
  try {
    // Get the mix
    const mix = getMix(slug);
    if (!mix) {
      throw new Error(`Mix not found: ${slug}`);
    }

    // See if there is a type
    const ext = mix.artExt?.[type];
    if (!ext) {
      throw new Error(`No ${type} defined for ${slug}`);
    }

    const imageFile = path.join(
      process.cwd(),
      "protected-assets/mixes",
      slug,
      `${type}.${ext}`,
    );

    return await renderImage(imageFile);
  } catch(err) {
    CONFIG.debug && console.log(err);
    // Try fallback cover
    try {
      const fallbackImageFile = path.join(
        process.cwd(),
        artConfig.fallback,
      );
      return await renderImage(fallbackImageFile);
    } catch(err2) {
      CONFIG.debug && console.log(err2);
      // Final fallback - 404
      return new NextResponse("Not found", { status: 404 })
    }
  }
}

async function renderImage(filePath: string) {
  // Check file exists
  await fsp.access(filePath)

  const ext = filePath.split('.').pop()!;
  const stream = fs.createReadStream(filePath);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": `image/${ext === "jpg" ? "jpeg" : ext}`,
      /**
       * browser caches for 5 minutes
       * CDN caches for 30 minutes
       * CDN may serve stale for 24h while refreshing in background
       */
      "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=604800"
    }
  })
}