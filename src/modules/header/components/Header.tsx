import { VIEWPORT_PADDING_CN } from '@/components';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderPlayer } from './HeaderPlayer';
import { MenuPopover } from './MenuPopover';

// ----------------------------------------------------------------------

export function Header() {
  return (
    <header className="fixed inset-x-0 bottom-0 z-30 bg-background/75 supports-backdrop-filter:backdrop-blur-md h-(--header-height)">
      {/* Limits the content width */}
      <div className={cn('mx-auto max-w-3xl h-full flex items-center', VIEWPORT_PADDING_CN)}>
        <MenuPopover />
        {/* Stretches the full width, keeping remaining items pinned right */}
        <div className="flex-1 min-w-0">
          <HeaderPlayer />
        </div>
        <Link href="/" className="inline-block">
          <Image src="/logo-transparent.png" alt="gamma logo" height="44" width="44" priority />
        </Link>
      </div>
    </header>
  );
}
