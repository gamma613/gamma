"use client";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { useHydrated } from "@/lib/useHydrated";
import { cn } from "@/lib/utils";
import { faArrowLeft, faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export type BackLink = {
  path: string;
  title?: string;
};

export function PageControls({ backLink }: { backLink?: BackLink }) {
  const [collapsed, setCollapsed] = useState(false);
  const hydrated = useHydrated();

  useEffect(() => {
    const el = document.documentElement;
    if (collapsed) el.dataset.pageCollapsed = "true";
    else delete el.dataset.pageCollapsed;
    return () => {
      delete el.dataset.pageCollapsed;
    };
  }, [collapsed]);

  const backLabel = useMemo(() => {
    if (!backLink) return null;
    return backLink.title ? `Go back to ${backLink.title}` : "Go back";
  }, [backLink]);

  const collapseLabel = collapsed ? "Expand page" : "Collapse page";

  if (!hydrated) return null;

  return createPortal(
    <>
      {backLink && (
        <div
          className={cn(
            "fixed left-3 top-3 z-40 transition-[top,opacity] duration-300",
            collapsed && "top-[calc(100dvh-var(--header-height)-3rem)] opacity-90",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label={backLabel ?? "Go back"}
                className="active:translate-y-0"
              >
                <Link href={backLink.path}>
                  <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{backLabel}</TooltipContent>
          </Tooltip>
        </div>
      )}

      <div
        className={cn(
          "fixed right-3 top-3 z-40 transition-[top,opacity] duration-300",
          collapsed && "top-[calc(100dvh-var(--header-height)-3rem)] opacity-90",
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
              onClick={() => setCollapsed((v) => !v)}
            >
              <FontAwesomeIcon icon={collapsed ? faExpand : faCompress} className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{collapseLabel}</TooltipContent>
        </Tooltip>
      </div>
    </>,
    document.body,
  );
}
