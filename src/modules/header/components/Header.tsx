'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Player, SeekBar } from '@/modules/player';
import { useHeader } from '../context/useHeader';

export function Header() {
  const { setNavOpen } = useHeader();

  return (
    <header
      className="fixed inset-x-0 bottom-0 z-30 bg-background/30 supports-[backdrop-filter]:backdrop-blur-md"
      style={{ height: "var(--header-height)" }}
    >
      <SeekBar className="mt-auto" />
      <div className="mx-auto max-w-md sm:max-w-3xl px-3 h-full flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="flex w-full items-center">
            <Link href="/" className="inline-block">
              <Image src="/logo-transparent.png" alt="gamma logo" height="44" width="44" priority />
            </Link>

            <div className="flex flex-1 px-3 justify-center">
              <Player />
            </div>

            <Button
              type="button"
              variant="ghost"
              className="h-11 w-11 p-0 md:h-9 md:w-9"
              aria-label="Navigate"
              title="Navigate"
              onClick={() => setNavOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
