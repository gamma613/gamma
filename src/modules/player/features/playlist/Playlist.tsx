'use client';

import { Button } from '@/components';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { History } from './components/History';
import { NowPlaying } from './components/NowPlaying';
import { OnDeck } from './components/OnDeck';
import { UserQueue } from './components/UserQueue';

// ----------------------------------------------------------------------

type PlaylistTabId = 'next' | 'history';

export function Playlist({ className }: { className?: string }) {
  const [tabId, setTabId] = useState<PlaylistTabId>('next');

  return (
    <div className={cn('space-y-6', className)}>
      <NowPlaying />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={tabId === 'next' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTabId('next')}
        >
          Playing next
        </Button>
        <Button
          type="button"
          variant={tabId === 'history' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTabId('history')}
        >
          History
        </Button>
      </div>

      {tabId === 'next' ? (
        <div className="space-y-6">
          <UserQueue />
          <OnDeck />
        </div>
      ) : (
        <History />
      )}
    </div>
  );
}
