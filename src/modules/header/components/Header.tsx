'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Player } from '@/modules/player';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto max-w-md sm:max-w-3xl">
        <div className="min-h-[50px] md:min-h-[80px] transition-[min-height] duration-300 ease-out flex items-center px-3 bg-[var(--background)]">
          <Link href="/" className="inline-block">
            <Image src="/logo-transparent.png" alt="gamma logo" height="44" width="44" priority />
          </Link>

          <div className="flex flex-1 px-3 justify-center">
            <Player />
          </div>

          <div className="flex justify-end">
            <Image src="/logo-transparent.png" alt="gamma logo" height="44" width="44" priority />
          </div>
        </div>
      </div>
    </header>
  );
}

