// src/features/review/content/sources/seedSource.ts
//
// A ReviewSource backed by a committed, gate-certified seed JSON (seeds/out/).
// This is how a reviewed flow goes live: defaultSources registers a seedSource
// per approved flow. The seed's cards are ReviewCandidates (with cefr/provenance
// for reviewers); we project them onto the public ReviewItem at load via
// toReviewItem. READ-ONLY, pure, sync — exactly what the adapter expects.

import type { ReviewFlowId, ReviewItem } from "@/features/review/types";
import { toReviewItem } from "../ingestion/candidate";
import type { ReviewCandidate } from "../validate";
import type { ReviewSource } from "./source";

/** Minimal shape of a seed JSON (see seeds/buildSeed.ts `Seed`). */
export interface SeedLike {
  flow: string;
  cards: ReviewCandidate[];
}

/**
 * Build a ReviewSource from a certified seed. Only cards whose `flow` matches
 * are emitted (defensive against a mis-passed seed). Mapping happens once.
 */
export function createSeedSource(
  name: string,
  flow: ReviewFlowId,
  seed: SeedLike,
): ReviewSource {
  const items: ReviewItem[] = (seed.cards ?? [])
    .filter((c) => c.flow === flow)
    .map((c) => toReviewItem(c));
  return {
    name,
    flows: () => [flow],
    items: (f) => (f === flow ? items : []),
  };
}
