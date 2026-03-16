import { SeekBar } from '@/modules/player';
import Image from 'next/image';
import Link from 'next/link';
//
import { MenuButton } from './MenuButton';
import { NowPlaying } from './NowPlaying';

// ----------------------------------------------------------------------

export function Header() {
  return (
    <header className="fixed inset-x-0 bottom-0 z-30 bg-background/30 supports-backdrop-filter:backdrop-blur-md h-(--header-height)">
      {/* Limits the content width */}
      <div className="mx-auto max-w-md sm:max-w-3xl h-full flex items-center">
        <MenuButton />
        {/* Stretches the full width, keeping remaining items pinned right */}
        <div className="flex-1 flex-col items-start">
          <NowPlaying />
        </div>
        <Link href="/" className="inline-block">
          <Image src="/logo-transparent.png" alt="gamma logo" height="44" width="44" priority />
        </Link>
      </div>
    </header>
  );
}
