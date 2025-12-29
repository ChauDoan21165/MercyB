// src/components/ThemeToggle.tsx
// MB-BLUE-97.8 — 2025-12-29 (+0700)
//
// RULE:
// - NO next-themes
// - Uses Mercy Blade data-mb-mode
// - Persists to localStorage
// - Works in Vite / SPA / static deploy

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type MBMode = "rainbow" | "bw";

const STORAGE_KEY = "mb-mode";

function getInitialMode(): MBMode {
  if (typeof window === "undefined") return "rainbow";
  return (localStorage.getItem(STORAGE_KEY) as MBMode) || "rainbow";
}

function applyMode(mode: MBMode) {
  document.documentElement.setAttribute("data-mb-mode", mode);
  localStorage.setItem(STORAGE_KEY, mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<MBMode>(getInitialMode);

  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  const toggle = () => {
    setMode((m) => (m === "rainbow" ? "bw" : "rainbow"));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="h-9 w-9 relative"
      aria-label="Toggle theme"
    >
      <Sun
        className={`h-4 w-4 transition-all ${
          mode === "rainbow"
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all ${
          mode === "bw"
            ? "rotate-0 scale-100"
            : "rotate-90 scale-0"
        }`}
      />
    </Button>
  );
}
