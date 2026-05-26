// src/contexts/MbColorModeContext.tsx
// MB-BLUE-96.3 — 2025-12-28 (+0700)

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ColorMode = "rainbow" | "bw";

const Ctx = createContext<{
  mode: ColorMode;
  setMode: (m: ColorMode) => void;
  toggle: () => void;
} | null>(null);

const STORAGE_KEY = "mb_color_mode";

export function MbColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>("rainbow");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) || "") as ColorMode;
    if (saved === "rainbow" || saved === "bw") setModeState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mbMode = mode; // <html data-mb-mode="...">
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const api = useMemo(
    () => ({
      mode,
      setMode: (m: ColorMode) => setModeState(m),
      toggle: () => setModeState((m) => (m === "rainbow" ? "bw" : "rainbow")),
    }),
    [mode]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useMbColorMode() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMbColorMode must be used inside MbColorModeProvider");
  return v;
}
