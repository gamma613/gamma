'use client';

import { IconButton } from '@/components/buttons/IconButton';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useHeader } from '../context/useHeader';

// ----------------------------------------------------------------------

export function MenuButton() {
  const { setNavOpen } = useHeader();

  return (
    <IconButton
      className="h-11 w-11"
      icon={faBars}
      iconClassName="size-5"
      label="Navigate"
      onClick={() => setNavOpen(true)}
      type="button"
      variant="ghost"
    />
  );
}
