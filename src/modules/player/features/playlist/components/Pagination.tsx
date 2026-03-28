"use client";

import { useState } from "react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// ----------------------------------------------------------------------

export function usePagination({
  itemCount,
  itemsPerPage,
  itemKey,
}: {
  itemCount: number;
  itemsPerPage: number;
  itemKey: string;
}) {
  const pageCount = Math.max(1, Math.ceil(itemCount / itemsPerPage));
  const storageKey = `gamma.playlist.pagination.${itemKey}.v1`;
  const [pageRaw, setPageRaw] = useState(() => {
    if (typeof window === "undefined") return 1;
    try {
      const raw = window.localStorage.getItem(storageKey);
      const n = raw ? Number(raw) : NaN;
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    } catch {
      return 1;
    }
  });
  const clampPage = (p: number) => Math.max(1, Math.min(pageCount, p));
  const page = clampPage(pageRaw);
  const setPage = (next: number) => {
    const p = clampPage(next);
    setPageRaw(p);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, String(p));
    } catch {
      // ignore
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndexExclusive = startIndex + itemsPerPage;

  return { page, setPage, pageCount, startIndex, endIndexExclusive };
}

export function PaginationControls({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      aria-label="Pagination"
      role="navigation"
    >
      <div className="text-xs text-muted-foreground tabular-nums">
        Page {page} of {pageCount}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        aria-disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onPageChange(page - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={page >= pageCount}
        aria-disabled={page >= pageCount}
        aria-label="Next page"
        onClick={() => onPageChange(page + 1)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </div>
  );
}
