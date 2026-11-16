'use client';

import { MusicTypeLabel, type MixType } from './MusicTypeLabel';

export function MusicMetadata({
  year,
  type,
  mixType,
  bpm,
  expandedType,
}: {
  year?: number | string | null;
  type?: string | null;
  mixType?: MixType | null;
  bpm?: number | null;
  expandedType?: boolean;
}) {
  const items = [
    year != null ? String(year) : null,
    type ? (
      expandedType ? (
        `${type}${type === 'mix' && mixType ? ` (${mixType})` : ''}`
      ) : (
        <MusicTypeLabel type={type} mixType={mixType} />
      )
    ) : null,
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
