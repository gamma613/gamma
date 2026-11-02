'use client';

import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

// ----------------------------------------------------------------------

export type BackButtonProps = {
  className?: string;
  fallbackHref?: string;
  label?: string;
};

export function BackButton({
  className,
  fallbackHref = ROUTES.music().root,
  label = 'Back to Music',
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('mb-4 -ml-2 text-muted-foreground hover:text-foreground gap-1.5', className)}
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="size-3.5" />
      <span>{label}</span>
    </Button>
  );
}
