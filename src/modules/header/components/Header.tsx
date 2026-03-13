'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HeaderPlayer } from '@/modules/player';
import { useHeader } from '../context/useHeader';

export function Header() {
  const { setNavOpen } = useHeader();

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto max-w-md sm:max-w-3xl">
        <div className="min-h-[50px] md:min-h-[80px] transition-[min-height] duration-300 ease-out flex items-center px-3 bg-[var(--background)]">
          <Link href="/" className="inline-block">
            <Image src="/logo-transparent.png" alt="gamma logo" height="44" width="44" priority />
          </Link>

          <div className="flex flex-1 px-3 justify-center">
            <HeaderPlayer />
          </div>

          <div className="flex justify-end">
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
