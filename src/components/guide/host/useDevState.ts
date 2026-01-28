// src/components/guide/host/useDevState.ts
// SAFE STUB — used by MercyAIHost import.
// Minimal dev-state wrapper; no side effects.

export type DevHostState = {
  enabled: boolean;
};

export function useDevHostState(): DevHostState {
  // Keep OFF by default in production/dev until you wire real dev tools.
  return { enabled: false };
}