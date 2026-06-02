// src/features/gamification/store/InMemoryGamificationStore.ts
//
// Process-lifetime store. Used as the test double and as the SSR / no-IndexedDB
// fallback so the module never crashes where IndexedDB is unavailable. Holds a
// deep-cloned copy on each save so callers can't mutate persisted state by
// reference.

import { createDefaultState } from "../defaults";
import type { GamificationState, GamificationStore } from "../types";

function clone(state: GamificationState): GamificationState {
  return JSON.parse(JSON.stringify(state)) as GamificationState;
}

export class InMemoryGamificationStore implements GamificationStore {
  private state: GamificationState | null = null;

  constructor(seed?: GamificationState) {
    this.state = seed ? clone(seed) : null;
  }

  async load(): Promise<GamificationState> {
    return this.state ? clone(this.state) : createDefaultState();
  }

  async save(state: GamificationState): Promise<void> {
    this.state = clone(state);
  }

  async clear(): Promise<void> {
    this.state = null;
  }

  isAvailable(): boolean {
    return true;
  }
}
