"use client";

import { useContext } from "react";

import { HeaderContext } from "../HeaderProvider";

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within a HeaderProvider");
  return ctx;
}
