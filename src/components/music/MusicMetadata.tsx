'use client';

import { MusicTypeLabel, type MixType } from './MusicTypeLabel';

export function MusicMetadata({
  year,
  type,
  mixType,
  bpm,
}: {
  year?: number | string | null;
  type?: string | null;
  mixType?: MixType | null;
  bpm?: number | null;
}) {
  const items = [
    year != null ? String(year) : null,
    type ? <MusicTypeLabel type={type} mixType={mixType} /> : null,
    bpm ? `${bpm} BPM` : null,
  ].filter(Boolean);

  return (
    <>
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 ? ' · ' : null}
          {item}
        </span>
      ))}
    </>
  );
}
