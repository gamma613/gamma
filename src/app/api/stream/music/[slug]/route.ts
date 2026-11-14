import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { getMusicItem } from '@/lib/music/getMusicItem';
import { fetchR2Audio, r2AudioContentType } from '@/lib/music/r2Audio';
import { resolveMusicAudioFile } from '@/lib/music/resolveAsset';
import { audioContentTypeFromExt } from '@/lib/music/supported';
import { NextResponse } from 'next/server';

// ----------------------------------------------------------------------

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const item = getMusicItem(slug);
    if (!item) throw new Error(`Music item not found: ${slug}`);

    if (process.env.MEDIA_STORAGE === 'r2') {
      const upstream = await fetchR2Audio(slug, req.headers.get('range'));
      if (upstream.status === 404) return new NextResponse('Not found', { status: 404 });

      const headers = new Headers({
        'Content-Type': upstream.headers.get('content-type') || r2AudioContentType(),
        'Accept-Ranges': upstream.headers.get('accept-ranges') || 'bytes',
        'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=604800',
      });
      for (const name of ['content-length', 'content-range']) {
        const value = upstream.headers.get(name);
        if (value) headers.set(name, value);
      }

      return new NextResponse(upstream.body, { status: upstream.status, headers });
    }

    const audioFile = await resolveMusicAudioFile(slug);
    if (!audioFile) throw new Error(`Audio not found: ${slug}`);

    const ext = path.extname(audioFile).replace('.', '').toLowerCase();
    const contentType = audioContentTypeFromExt(ext);

    const stat = await fsp.stat(audioFile);
    const fileSize = stat.size;

    const range = req.headers.get('range');

    if (!range) {
      const stream = fs.createReadStream(audioFile);

      return new NextResponse(stream as unknown as BodyInit, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileSize.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=604800',
        },
      });
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(audioFile, { start, end });

    return new NextResponse(stream as unknown as BodyInit, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
