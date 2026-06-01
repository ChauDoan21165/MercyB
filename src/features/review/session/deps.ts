// src/features/review/session/deps.ts — Lane D / D4
//
// The dependency bundle every session function takes as its first argument.
// Bundles the three contract INTERFACES — never their concrete D1/D2/D3
// implementations — so session logic stays pure and testable with in-memory
// fakes.

import type {
  Scheduler,
  ReviewStore,
  ContentAdapter,
} from "@/features/review/types";

export interface SessionDeps {
  scheduler: Scheduler;
  store: ReviewStore;
  content: ContentAdapter;
}
