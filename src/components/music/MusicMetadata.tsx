'use client';

import { formatDateYmd } from '@/lib/formatDate';
import { MusicTypeLabel, type MixType } from './MusicTypeLabel';

/** Controls whether metadata shows only the release year or the full date. */
export type MusicMetadataDateFormat = 'full' | 'year';

type MusicMetadataProps = {
  /** Primary tempo in beats per minute. */
  bpm?: number | null;
  /** Release date used to display either a year or a full date. */
  date?: Date | null;
  /** Date display mode; defaults to the year only. */
  dateFormat?: MusicMetadataDateFormat;
  /** Shows the mix subtype inline instead of in a tooltip. */
  expandedType?: boolean;
  /** Mix subtype shown when `type` is `mix`. */
  mixType?: MixType | null;
  /** Music item type, such as `mix`, `mashup`, or `track`. */
  type?: string | null;
};

export function MusicMetadata({
  bpm,
  date,
  dateFormat = 'year',
  expandedType,
  mixType,
  type,
}: MusicMetadataProps) {
  const items = [
    date != null
      ? dateFormat === 'full'
        ? formatDateYmd(date)
        : String(date.getUTCFullYear())
      : null,
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
