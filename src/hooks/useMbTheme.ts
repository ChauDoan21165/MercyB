import { createContext, useContext, useEffect, useState, ReactNode, createElement } from "react";

export type MbThemeMode = "color" | "bw";

interface MbThemeContextValue {
  mode: MbThemeMode;
  toggle: () => void;
  setMode: (mode: MbThemeMode) => void;
}

const MbThemeContext = createContext<MbThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "mb-theme-mode";

function applyThemeAttribute(mode: MbThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-mb-theme", mode);
}

export function MbThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MbThemeMode>("color");

  // First load: read from localStorage and apply
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as MbThemeMode | null;
      if (stored === "color" || stored === "bw") {
        setModeState(stored);
        applyThemeAttribute(stored);
      } else {
        applyThemeAttribute("color");
      }
    } catch {
      applyThemeAttribute("color");
    }
  }, []);

  const setMode = (next: MbThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
    applyThemeAttribute(next);
  };

  const toggle = () => setMode(prev => (prev === "color" ? "bw" : "color"));

  const value: MbThemeContextValue = { mode, toggle, setMode };

  return createElement(MbThemeContext.Provider, { value }, children);
}

export function useMbTheme(): MbThemeContextValue {
  const ctx = useContext(MbThemeContext);
  if (!ctx) {
    throw new Error("useMbTheme must be used inside <MbThemeProvider>");
  }
  return ctx;
}

// Safe hook for optional usage (doesn't throw if provider missing)
export function useMbThemeSafe(): MbThemeContextValue | null {
  return useContext(MbThemeContext) ?? null;
}
