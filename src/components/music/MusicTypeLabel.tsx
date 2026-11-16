'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/Tooltip';

export type MixType = 'studio' | 'live';

export function MusicTypeLabel({
  type,
  mixType,
}: {
  type?: string | null;
  mixType?: MixType | null;
}) {
  if (!type) return null;
  if (type !== 'mix' || !mixType) return type;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`mix, ${mixType}`}
          className="underline decoration-dotted underline-offset-2 rounded-xs"
        >
          {type}
        </button>
      </TooltipTrigger>
      <TooltipContent>{mixType}</TooltipContent>
    </Tooltip>
  );
}
