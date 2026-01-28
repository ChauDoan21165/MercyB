// src/components/guide/host/utils.ts
// SAFE STUB — required by MercyAIHost import.
// Minimal exports only. No behavior changes elsewhere.

/**
 * Normalize language input safely.
 */
export function safeLang(v?: string | null): "en" | "vi" {
  const s = String(v || "").trim().toLowerCase();
  if (s === "vi" || s === "en") return s;
  return "en";
}

/**
 * Crash-proof localStorage setter used by MercyAIHost.
 * Returns true if we successfully wrote, else false.
 */
export function safeSetLS(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(String(key), String(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Crash-proof localStorage getter.
 */
export function safeGetLS(key: string): string | null {
  try {
    return window.localStorage.getItem(String(key));
  } catch {
    return null;
  }
}

/**
 * ETLS — tiny, safe localStorage wrapper used by some host builds.
 */
export const safeETLS = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(String(key));
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(String(key), String(value));
    } catch {
      // ignore
    }
  },

  del(key: string): void {
    try {
      window.localStorage.removeItem(String(key));
    } catch {
      // ignore
    }
  },
};
