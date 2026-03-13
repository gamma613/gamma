import { NextResponse } from "next/server"
import fsp from "fs/promises"
import fs from "fs"
import path from "path"

import { getMix } from "@/lib/mixes/getMix"

// ----------------------------------------------------------------------

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const mix = getMix(slug)
    if (!mix) {
      throw new Error(`Mix not found: ${slug}`)
    }

    const ext = mix.audioExt

    const audioFile = path.join(
      process.cwd(),
      "protected-assets/mixes",
      slug,
      `audio.${ext}`,
    )

    const stat = await fsp.stat(audioFile)
    const fileSize = stat.size

    const range = req.headers.get("range")

    if (!range) {
      const stream = fs.createReadStream(audioFile)

      return new NextResponse(stream as unknown as BodyInit, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": fileSize.toString(),
          "Accept-Ranges": "bytes",
          "Cache-Control":
            "public, max-age=300, s-maxage=1800, stale-while-revalidate=604800",
        },
      })
    }

    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

    const chunkSize = end - start + 1

    const stream = fs.createReadStream(audioFile, { start, end })

    return new NextResponse(stream as unknown as BodyInit, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "audio/mpeg",
        "Cache-Control":
          "public, max-age=300, s-maxage=1800, stale-while-revalidate=604800",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}