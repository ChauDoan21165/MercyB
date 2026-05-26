import { useState, useEffect } from 'react';

/**
 * CANONICAL Mercy Blade Theme Hook
 * 
 * Single source of truth for visual mode (color vs black & white)
 * across the entire application.
 * 
 * Persistence: localStorage key "mb_visual_mode"
 * Default: "color"
 */

export type VisualMode = "color" | "bw";

export interface UseMercyBladeThemeOptions {
  /**
   * Default mode when no stored preference exists
   * @default "color"
   */
  defaultMode?: VisualMode;
}

export interface UseMercyBladeThemeResult {
  /**
   * Current visual mode
   */
  mode: VisualMode;
  
  /**
   * Set visual mode (persists to localStorage)
   */
  setMode: (mode: VisualMode) => void;
  
  /**
   * Toggle between color and bw
   */
  toggleMode: () => void;
  
  /**
   * Convenience booleans
   */
  isColor: boolean;
  isBW: boolean;
}

const STORAGE_KEY = 'mb_visual_mode';

/**
 * Load mode from localStorage with fallback
 */
function loadMode(defaultMode: VisualMode = "color"): VisualMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "color" || stored === "bw") {
      return stored;
    }
  } catch (error) {
    console.warn('[useMercyBladeTheme] Failed to read from localStorage:', error);
  }
  return defaultMode;
}

/**
 * Save mode to localStorage
 */
function saveMode(mode: VisualMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch (error) {
    console.warn('[useMercyBladeTheme] Failed to write to localStorage:', error);
  }
}

/**
 * Unified Mercy Blade theme hook
 * 
 * @example
 * const { mode, setMode, toggleMode, isColor, isBW } = useMercyBladeTheme();
 * 
 * // Use mode to conditionally render
 * {mode === "color" ? <ColorfulComponent /> : <BWComponent />}
 * 
 * // Or use convenience booleans
 * {isColor && <RainbowGradient />}
 */
export function useMercyBladeTheme(
  options?: UseMercyBladeThemeOptions
): UseMercyBladeThemeResult {
  const defaultMode = options?.defaultMode || "color";
  
  const [mode, setModeState] = useState<VisualMode>(() => loadMode(defaultMode));

  // Persist mode changes to localStorage AND set data attribute on html element
  useEffect(() => {
    saveMode(mode);
    // Set data attribute for CSS theming
    document.documentElement.dataset.mbTheme = mode;
  }, [mode]);

  const setMode = (newMode: VisualMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState(prev => prev === "color" ? "bw" : "color");
  };

  return {
    mode,
    setMode,
    toggleMode,
    isColor: mode === "color",
    isBW: mode === "bw",
  };
}
