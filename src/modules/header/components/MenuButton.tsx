'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
//
import { useHeader } from '../context/useHeader';

// ----------------------------------------------------------------------

export function MenuButton() {
  const { setNavOpen } = useHeader();

  return (
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
  );
}
