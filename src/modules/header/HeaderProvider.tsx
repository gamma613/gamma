"use client";

import { createContext, useMemo, useState } from "react";

import type { HeaderContextValue } from "./context/types";

export const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  const value = useMemo<HeaderContextValue>(() => {
    return {
      navOpen,
      setNavOpen,
    };
  }, [navOpen]);

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}
