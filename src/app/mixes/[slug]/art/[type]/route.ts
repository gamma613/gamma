import { NextResponse } from "next/server";
import fsp from "fs/promises";
import fs from "fs";

import path from "path";
import { MIX_ART_TYPES, type MixArtType, imageContentTypeFromExt } from "@/lib/mixes/supported";
import { resolveMixArtFile } from "@/lib/mixes/resolveAsset";

// ----------------------------------------------------------------------

/** Configuration */
const CONFIG = {
  art: {
    cover: {
      fallback: "public/mixes/default-cover.jpg",
    },
  } satisfies Record<
    MixArtType,
    {
      fallback: string;
    }
  >,
  debug: false,
};

// ----------------------------------------------------------------------

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string; type: string }> },
) {
  const { slug, type } = await params;

  // Validate art type
  if (!MIX_ART_TYPES.includes(type as MixArtType)) {
    return new NextResponse("Invalid art type", { status: 400 });
  }

  const artConfig = CONFIG.art[type as MixArtType];
  if (!artConfig) {
    return new NextResponse("Invalid art type", { status: 400 });
  }

  // Try to get art
  try {
    const imageFile = await resolveMixArtFile(slug, type as MixArtType);
    if (!imageFile) throw new Error(`No ${type} art found for ${slug}`);

    return await renderImage(imageFile);
  } catch (err) {
    CONFIG.debug && console.log(err);
    // Try fallback cover
    try {
      const fallbackImageFile = path.join(process.cwd(), artConfig.fallback);
      return await renderImage(fallbackImageFile);
    } catch (err2) {
      CONFIG.debug && console.log(err2);
      // Final fallback - 404
      return new NextResponse("Not found", { status: 404 });
    }
  }
}

async function renderImage(filePath: string) {
  // Check file exists
  await fsp.access(filePath);

  const ext = filePath.split(".").pop()!;
  const stream = fs.createReadStream(filePath);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": imageContentTypeFromExt(ext),
      /**
       * browser caches for 5 minutes
       * CDN caches for 30 minutes
       * CDN may serve stale for 24h while refreshing in background
       */
      "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=604800",
    },
  });
}
