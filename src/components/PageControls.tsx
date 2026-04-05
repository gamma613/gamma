'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { usePageCollapse } from '@/components/layout';
import { useHydrated } from '@/lib/useHydrated';
import { cn } from '@/lib/utils';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPortal } from 'react-dom';

// ----------------------------------------------------------------------

export function PageControls() {
  const hydrated = useHydrated();
  const { collapsed, toggleCollapsed } = usePageCollapse();

  const collapseLabel = collapsed ? 'Expand page' : 'Collapse page';

  if (!hydrated) return null;

  return createPortal(
    <div
      className={cn(
        'fixed right-3 top-3 z-40 transition-[top,opacity] duration-300',
        collapsed && 'top-[calc(100dvh-var(--header-height)-3rem)] opacity-90'
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={collapseLabel}
            className="active:translate-y-0"
            onClick={toggleCollapsed}
          >
            <FontAwesomeIcon icon={collapsed ? faExpand : faCompress} className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{collapseLabel}</TooltipContent>
      </Tooltip>
    </div>,
    document.body
  );
}
