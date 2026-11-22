'use client';

import { formatDateYmd } from '@/lib/formatDate';
import { formatTrackTime } from '@/modules/player';
import { Music } from 'content-collections';
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
  /** Shows the duration of the tack, if available.  */
  durationSeconds?: Music['durationSeconds'];
  /** Mix subtype shown when `type` is `mix`. */
  mixType?: MixType | null;
  /** Music item type, such as `mix`, `mashup`, or `track`. */
  type?: string | null;
};

export function MusicMetadata({
  bpm,
  date,
  dateFormat = 'year',
  durationSeconds,
  expandedType,
  mixType,
  type,
}: MusicMetadataProps) {
  const items = [
    // date
    date != null
      ? dateFormat === 'full'
        ? formatDateYmd(date)
        : String(date.getUTCFullYear())
      : null,
    // type
    type ? (
      expandedType ? (
        `${type}${type === 'mix' && mixType ? ` (${mixType})` : ''}`
      ) : (
        <MusicTypeLabel type={type} mixType={mixType} />
      )
    ) : null,
    // tempo
    bpm ? `${bpm} BPM` : null,
    // duration
    durationSeconds ? formatTrackTime(durationSeconds) : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap">
      {items.map((item, index) => (
        <span key={index} className="whitespace-nowrap">
          {index > 0 && <span aria-hidden="true">{'\u00A0·\u00A0'}</span>}
          {item}
        </span>
      ))}
    </div>
  );
}
