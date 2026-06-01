// src/features/review/runtime.ts — the composition root for the review module.
//
// This is the ONE place that instantiates the real engine implementations
// (D1 scheduler / D2 IndexedDB store / D3 content adapter) and bundles them
// into the `SessionDeps` the UI containers consume. Everything else takes deps
// by injection, so tests stay implementation-free and a future Supabase-backed
// store swaps in here alone.
//
// Lazily constructed + cached as a process singleton: one IndexedDB connection
// and one content adapter for the whole app session.

import { createScheduler } from "./scheduler";
import { createReviewStore } from "./store";
import { createContentAdapter } from "./content";
import type { SessionDeps } from "./session";

let cached: SessionDeps | null = null;

/** The app-wide review dependency bundle (scheduler + store + content). */
export function getReviewDeps(): SessionDeps {
  if (!cached) {
    cached = {
      scheduler: createScheduler(),
      store: createReviewStore(),
      content: createContentAdapter(),
    };
  }
  return cached;
}

/** Test/reset hook — drops the cached deps so the next call rebuilds them. */
export function __resetReviewDeps(): void {
  cached = null;
}
