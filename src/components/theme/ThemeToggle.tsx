// src/components/theme/ThemeToggle.tsx
// MB-BLUE-96.3 — 2025-12-28 (+0700)

import React from "react";
import { useMbColorMode } from "@/contexts/MbColorModeContext";

export function ThemeToggle() {
  const { mode, toggle } = useMbColorMode();

  return (
    <button
      onClick={toggle}
      className="rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-accent transition"
      aria-label="Toggle color mode"
      title="Toggle Rainbow / Black & White"
    >
      {mode === "rainbow" ? "🌈 Rainbow ON" : "⬛ Black/White"}
    </button>
  );
}
