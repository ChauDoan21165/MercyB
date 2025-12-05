import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ColorMode = "color" | "bw";

type ColorModeContextValue = {
  mode: ColorMode;
  toggle: () => void;
  setMode: (mode: ColorMode) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "mb-color-mode";

function applyHtmlClass(mode: ColorMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "bw") {
    root.classList.add("bw-mode");
  } else {
    root.classList.remove("bw-mode");
  }
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>("color");

  // First load: read from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ColorMode | null;
      if (stored === "color" || stored === "bw") {
        setModeState(stored);
        applyHtmlClass(stored);
      } else {
        applyHtmlClass("color");
      }
    } catch {
      applyHtmlClass("color");
    }
  }, []);

  const setMode = (next: ColorMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
    applyHtmlClass(next);
  };

  const toggle = () => setMode(mode === "color" ? "bw" : "color");

  const value: ColorModeContextValue = { mode, toggle, setMode };

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used inside <ColorModeProvider>");
  }
  return ctx;
}
