'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo } from 'react';
import { ROUTES } from '@/lib/routes';
import { usePlayer } from '../context/usePlayer';

// ----------------------------------------------------------------------

function slugFromTrackSrc(src: string, kind: string): string | null {
  // Supports both relative and absolute URLs.
  const pathname = (() => {
    try {
      return new URL(src, 'http://example.local').pathname;
    } catch {
      return src;
    }
  })();

  const m = pathname.match(new RegExp(`^/api/stream/${kind}/([^/]+)/?$`));
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

export type TrackArtProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string;
  type?: string;
};

export function TrackArt(props: TrackArtProps) {
  const { track } = usePlayer();

  const trackSrc = track?.src;
  const trackKind = track?.kind;
  const trackCover = track?.cover;
  const { type: artType = 'cover', alt, ...imageProps } = props;

  const artSrc = useMemo(() => {
    // Prefer explicit metadata over deriving URLs from the stream src.
    if (artType === 'cover' && trackCover) return trackCover;

    if (!trackSrc || !trackKind) return null;
    const slug = slugFromTrackSrc(trackSrc, trackKind);
    if (!slug) return null;
    const routeFactory = ROUTES[trackKind as keyof typeof ROUTES];
    if (!routeFactory) return null;
    return routeFactory(encodeURIComponent(slug)).art(artType);
  }, [artType, trackCover, trackKind, trackSrc]);

  if (!artSrc) return null;

  const resolvedAlt = alt ?? `${artType} art${track?.title ? ` for ${track.title}` : ''}`;

  return <Image src={artSrc} alt={resolvedAlt} {...imageProps} />;
}
