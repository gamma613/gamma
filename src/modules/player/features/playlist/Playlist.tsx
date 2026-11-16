'use client';

import { Button } from '@/components';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { History } from './components/History';
import { NowPlaying } from './components/NowPlaying';
import { OnDeck } from './components/OnDeck';
import { UserQueue } from './components/UserQueue';

// ----------------------------------------------------------------------

const sections = [
  { id: 'now-playing', label: 'Now playing' },
  { id: 'queue', label: 'Playing next' },
  { id: 'on-deck', label: 'On deck' },
  { id: 'history', label: 'History' },
] as const;

type PlaylistTabId = (typeof sections)[number]['id'];

export function Playlist({ className }: { className?: string }) {
  const [tabId, setTabId] = useState<PlaylistTabId>('now-playing');

  useEffect(() => {
    const updateActiveSection = () => {
      const atPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atPageEnd) {
        setTabId('history');
        return;
      }

      const activationLine = 150;
      let active: PlaylistTabId = 'now-playing';
      for (const section of sections) {
        const element = document.getElementById(`playlist-${section.id}`);
        if (element && element.getBoundingClientRect().top <= activationLine) active = section.id;
      }
      setTabId(active);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  const scrollToSection = (id: PlaylistTabId) => {
    document
      .getElementById(`playlist-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={cn('space-y-6', className)}>
      <nav
        aria-label="Playlist sections"
        className="sticky top-0 z-20 -mx-2 flex gap-1 overflow-x-auto bg-background/90 px-2 py-2 backdrop-blur sm:-mx-3 sm:px-3"
      >
        {sections.map(({ id, label }) => (
          <Button
            key={id}
            type="button"
            variant={tabId === id ? 'secondary' : 'ghost'}
            size="sm"
            aria-current={tabId === id ? 'location' : undefined}
            onClick={() => scrollToSection(id)}
            className="shrink-0"
          >
            {label}
          </Button>
        ))}
      </nav>

      <div className="space-y-12">
        <div id="playlist-now-playing" className="scroll-mt-20">
          <NowPlaying />
        </div>
        <div id="playlist-queue" className="scroll-mt-20">
          <UserQueue />
        </div>
        <div id="playlist-on-deck" className="scroll-mt-20">
          <OnDeck />
        </div>
        <div id="playlist-history" className="scroll-mt-20">
          <History />
        </div>
      </div>
    </div>
  );
}
