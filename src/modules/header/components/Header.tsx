import { SeekBar } from '@/modules/player';
import Image from 'next/image';
import Link from 'next/link';
//
import { MenuButton } from './MenuButton';
import { NowPlaying } from './NowPlaying';

// ----------------------------------------------------------------------

export function Header() {
  return (
    <header
      className="fixed inset-x-0 bottom-0 z-30 bg-background/30 supports-backdrop-filter:backdrop-blur-md"
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
              <NowPlaying />
            </div>

            <MenuButton />
          </div>
        </div>
      </div>
    </header>
  );
}
