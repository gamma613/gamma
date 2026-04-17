'use client';

import { Button } from '@/components';
import { IconButton } from '@/components/buttons/IconButton';
import { usePageCollapse } from '@/components/layout';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ----------------------------------------------------------------------

export function MenuPopover({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const router = useRouter();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const [panelRect, setPanelRect] = useState<DOMRect | null>(null);
  const { collapsed, toggleCollapsed } = usePageCollapse();

  const popoverStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!triggerRect) return undefined;

    const gap = 8;
    const width = panelRect?.width ?? 0;

    const unclampedLeft = triggerRect.left;
    const left =
      width > 0
        ? Math.max(8, Math.min(window.innerWidth - width - 8, unclampedLeft))
        : Math.max(8, unclampedLeft);

    const top = triggerRect.top - gap; // translateY with CSS
    return { left, top, position: 'fixed' };
  }, [panelRect?.width, triggerRect]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const triggerEl = triggerRef.current;
    const panelEl = panelRef.current;
    if (!triggerEl || !panelEl) return;

    const measure = () => {
      setTriggerRect(triggerEl.getBoundingClientRect());
      setPanelRect(panelEl.getBoundingClientRect());
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open]);

  const collapseLabel = collapsed ? 'Expand page' : 'Collapse page';

  return (
    <div className={cn('relative', className)}>
      <div ref={triggerRef} className="inline-flex">
        <IconButton
          className="h-11 w-11"
          icon={faBars}
          iconClassName="size-5"
          label="Navigate"
          type="button"
          variant="ghost"
          aria-controls={contentId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        />
      </div>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id={contentId}
            ref={panelRef}
            style={popoverStyle}
            className={cn(
              'z-50 -translate-y-full',
              'inline-flex flex-col',
              'max-w-[320px] w-max',
              'rounded-lg border bg-background/80 p-1 text-popover-foreground shadow-md supports-[backdrop-filter]:backdrop-blur-md'
            )}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start px-3"
              onClick={() => {
                router.push(ROUTES.music().root);
                setOpen(false);
              }}
            >
              Music
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start px-3"
              onClick={() => {
                router.push('/playlist');
                setOpen(false);
              }}
            >
              Playlist
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start px-3"
              onClick={() => {
                toggleCollapsed();
                setOpen(false);
              }}
            >
              {collapseLabel}
            </Button>
          </div>,
          document.body
        )}
    </div>
  );
}
