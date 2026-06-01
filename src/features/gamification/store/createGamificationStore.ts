// src/features/gamification/store/createGamificationStore.ts
//
// Factory that picks the best available GamificationStore for the current
// environment. STEP-0 baseline returns the in-memory store everywhere; F5
// upgrades this to prefer the IndexedDB-backed store when `indexedDB` exists,
// falling back to in-memory in SSR / tests. The seam (this factory + the
// GamificationStore interface) is the ONLY thing the rest of the module sees,
// so a server-backed store can be slotted in later with no other changes.

import { InMemoryGamificationStore } from "./InMemoryGamificationStore";
import { IndexedDbGamificationStore } from "./IndexedDbGamificationStore";
import type { GamificationStore } from "../types";

export function createGamificationStore(): GamificationStore {
  // Prefer IndexedDB when present (browser); fall back to in-memory in
  // SSR / tests where `indexedDB` is undefined.
  if (typeof indexedDB !== "undefined") {
    return new IndexedDbGamificationStore();
  }
  return new InMemoryGamificationStore();
}
