'use client';

import { useHydrated } from '@/lib/useHydrated';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// ----------------------------------------------------------------------

type PageCollapseContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
};

const STORAGE_KEY = 'gamma.page.collapsed.v1';

const PageCollapseContext = createContext<PageCollapseContextValue | null>(null);

export function PageCollapseProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const [collapsed, setCollapsedState] = useState(false);

  // Load persisted state after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === 'true') setCollapsedState(true);
    } catch {
      // ignore
    }
  }, [hydrated]);

  // Apply to DOM + persist.
  useEffect(() => {
    if (!hydrated) return;

    const el = document.documentElement;
    if (collapsed) el.dataset.pageCollapsed = 'true';
    else delete el.dataset.pageCollapsed;

    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? 'true' : 'false');
    } catch {
      // ignore
    }

    return () => {
      delete el.dataset.pageCollapsed;
    };
  }, [collapsed, hydrated]);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(Boolean(next));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((v) => !v);
  }, []);

  const value = useMemo<PageCollapseContextValue>(
    () => ({ collapsed, setCollapsed, toggleCollapsed }),
    [collapsed, setCollapsed, toggleCollapsed]
  );

  return <PageCollapseContext.Provider value={value}>{children}</PageCollapseContext.Provider>;
}

export function usePageCollapse(): PageCollapseContextValue {
  const ctx = useContext(PageCollapseContext);
  if (!ctx) throw new Error('usePageCollapse must be used within <PageCollapseProvider>');
  return ctx;
}
