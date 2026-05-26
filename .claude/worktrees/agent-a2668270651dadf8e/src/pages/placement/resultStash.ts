// src/pages/placement/resultStash.ts
//
// Tiny sessionStorage helper for handing off the placement result from
// /placement/test → /placement/results. Survives a page refresh, clears
// when the tab closes, and never persists across sessions.

import type { EngineSnapshot } from '@/lib/placement/engine';

const KEY = 'mb.placement.result.v1';

export type StashedResult = {
  snapshot: EngineSnapshot;
  roomId: string;
  elapsedMs: number;
};

export function stashResult(payload: StashedResult): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* ignore — Results will redirect back to /placement */
  }
}

export function readStashedResult(): StashedResult | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StashedResult;
  } catch {
    return null;
  }
}

export function clearStashedResult(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
