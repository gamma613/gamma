"use client";

import { ButtonProps } from "@/components";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePlayerControlsReady } from "../context/usePlayerControlsReady";
import { VolumeButton } from "./VolumeButton";
import { VolumeSlider } from "./VolumeSlider";

// ----------------------------------------------------------------------

export type VolumePopoverAnchor = "top" | "bottom";
type Props = React.PropsWithChildren & {
  anchor?: VolumePopoverAnchor;
  buttonProps?: Omit<ButtonProps, "onClick">;
  className?: string;
};

export function VolumePopover({ anchor = "bottom", buttonProps, className }: Props) {
  const { isReady } = usePlayerControlsReady();
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const popoverStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!triggerRect) return undefined;

    const width = 56; // ~ w-14
    const gap = 8; // matches Tooltip sideOffset-ish and previous mt/mb-2

    const left = Math.max(
      8,
      Math.min(window.innerWidth - width - 8, triggerRect.left + triggerRect.width / 2 - width / 2),
    );

    const top = anchor === "top" ? triggerRect.bottom + gap : triggerRect.top - gap; // we'll translateY with CSS for bottom anchor

    return { left, top, width, position: "fixed" };
  }, [anchor, triggerRect]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Close on outside click/tap, without blocking the underlying interaction.
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;

    const measure = () => {
      setTriggerRect(el.getBoundingClientRect());
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      <div ref={triggerRef} className="inline-flex">
        <VolumeButton
          active={open}
          aria-controls={contentId}
          aria-expanded={open}
          disabled={!isReady || buttonProps?.disabled}
          onClick={() => {
            if (!isReady) return;
            setOpen((v) => !v);
          }}
          {...buttonProps}
        />
      </div>

      {isReady &&
        open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              id={contentId}
              style={popoverStyle}
              ref={panelRef}
              className={cn(
                "z-50",
                "rounded-lg border bg-background/80 py-4 text-popover-foreground shadow-md supports-[backdrop-filter]:backdrop-blur-md",
                anchor === "top" ? "" : "-translate-y-full",
              )}
            >
              <VolumeSlider
                orientation="vertical"
                className="h-[100px]"
                sliderProps={{
                  trackClassName: "data-horizontal:h-4 data-vertical:w-4",
                }}
              />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
