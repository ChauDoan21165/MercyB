// src/components/guide/host/buildActions.ts
// SAFE STUB — required by MercyAIHost import.
// Provides a minimal actions API with no side effects.

export type HostActions = {
  clear: () => void;
  seed: (msg?: string) => void;
  setLang: (lang: "en" | "vi") => void;
};

export function useHostActions(_opts?: any): HostActions {
  // MercyAIHost can wire these later; for now they must exist.
  return {
    clear: () => {},
    seed: () => {},
    setLang: () => {},
  };
}
