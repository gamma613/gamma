'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo } from 'react';
import { ROUTES } from '@/lib/routes';
//
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

function streamInfoFromTrackSrc(src: string): { kind: string; slug: string } | null {
  // Supports both relative and absolute URLs.
  const pathname = (() => {
    try {
      return new URL(src, 'http://example.local').pathname;
    } catch {
      return src;
    }
  })();

  const m = pathname.match(/^\/api\/stream\/([^/]+)\/([^/]+)\/?$/);
  if (!m?.[1] || !m?.[2]) return null;
  return { kind: decodeURIComponent(m[1]), slug: decodeURIComponent(m[2]) };
}

export type TrackArtProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string;
  type?: string;
};

export function TrackArt(props: TrackArtProps) {
  const { track } = usePlayer();

  const trackSrc = track?.src;
  const { type: artType = 'cover', alt, ...imageProps } = props;

  const artSrc = useMemo(() => {
    if (!trackSrc) return null;

    const info = streamInfoFromTrackSrc(trackSrc);
    if (!info) return null;

    const routeFactory = ROUTES[info.kind as keyof typeof ROUTES];
    if (!routeFactory) return null;
    return routeFactory(encodeURIComponent(info.slug)).art(artType);
  }, [artType, trackSrc]);

  if (!artSrc) return null;

  const resolvedAlt =
    alt ?? `${artType} art${track?.title ? ` for ${track.title}` : ''}`;

  return <Image src={artSrc} alt={resolvedAlt} {...imageProps} />;
}
