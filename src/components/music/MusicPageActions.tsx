'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { PlayInPlayerButton } from '@/modules/player';
import { faDownload, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover } from 'radix-ui';
import { useState } from 'react';

// ----------------------------------------------------------------------

/** Download feature gate */
const ALLOW_DOWNLOAD = false;

export function MusicPageActions({
  className,
  artist,
  slug,
  title,
}: {
  artist: string;
  className?: string;
  slug: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const filename = `${safeFilename(`${artist} - ${title}`)}.mp3`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}`);
      setCopied(true);
      trackEvent('music_share', { item_id: slug, method: 'copy_link' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn('mt-6 flex flex-wrap items-center gap-3', className)}>
      <PlayInPlayerButton slug={slug} />
      {ALLOW_DOWNLOAD && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-full px-4"
              aria-label="Download"
              asChild
            >
              <a
                href={`/api/stream/music/${encodeURIComponent(slug)}`}
                download={filename}
                onClick={() => trackEvent('music_download', { item_id: slug, file_name: filename })}
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Download</TooltipContent>
        </Tooltip>
      )}
      <Popover.Root>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover.Trigger asChild>
              <Button
                type="button"
                variant="outline"
                aria-label="Share"
                className="h-10 gap-2 rounded-full px-4"
              >
                <FontAwesomeIcon icon={faShareNodes} />
              </Button>
            </Popover.Trigger>
          </TooltipTrigger>
          <TooltipContent side="top">Share</TooltipContent>
        </Tooltip>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            aria-label="Share this item"
            className="z-50 rounded-lg border bg-background/90 p-1 text-popover-foreground shadow-md supports-[backdrop-filter]:backdrop-blur-md"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start px-3"
              onClick={copyLink}
            >
              {copied ? 'Link Copied' : 'Copy link'}
            </Button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

// ----------------------------------------------------------------------

function safeFilename(value: string) {
  return (
    value
      .normalize('NFKC')
      .replace(/[^\p{L}\p{N} ._-]/gu, '')
      .replace(/\s+/g, ' ')
      .replace(/[. ]+$/g, '')
      .trim() || 'audio'
  );
}
