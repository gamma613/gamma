import { NextResponse } from "next/server";
import fsp from "fs/promises";
import fs from "fs";
import path from "path";

import { getMusicItem } from "@/lib/music/getMusicItem";
import { resolveMusicAudioFile } from "@/lib/music/resolveAsset";
import { audioContentTypeFromExt } from "@/lib/music/supported";

// ----------------------------------------------------------------------

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const item = getMusicItem(slug);
    if (!item) throw new Error(`Music item not found: ${slug}`);

    const audioFile = await resolveMusicAudioFile(slug);
    if (!audioFile) {
      throw new Error(`Audio not found: ${slug}`);
    }

    const ext = path.extname(audioFile).replace(".", "").toLowerCase();
    const contentType = audioContentTypeFromExt(ext);

    const stat = await fsp.stat(audioFile);
    const fileSize = stat.size;

    const range = req.headers.get("range");

    if (!range) {
      const stream = fs.createReadStream(audioFile);

      return new NextResponse(stream as unknown as BodyInit, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileSize.toString(),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=604800",
        },
      });
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(audioFile, { start, end });

    return new NextResponse(stream as unknown as BodyInit, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
