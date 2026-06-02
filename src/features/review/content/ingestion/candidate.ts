// src/features/review/content/ingestion/candidate.ts
//
// Shared helpers for building ReviewCandidates (DC1 ingestion). A candidate is
// the pre-certification shape; once it clears the gate, toReviewItem() projects
// it onto the public ReviewItem contract (dropping the gate-only cefr/provenance
// fields — those live on in the seed JSON for reviewers, not in the runtime item).

import type { ReviewItem } from "@/features/review/types";
import { slugify } from "../slug";
import type { ReviewCandidate } from "../validate";

/** Trim to a non-empty string, or undefined. */
export function clean(s: string | undefined | null): string | undefined {
  if (s == null) return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
}

/** Build the stable namespaced id for a candidate from its front text. */
export function candidateId(
  flow: ReviewCandidate["flow"],
  kind: ReviewCandidate["kind"],
  front: string,
): string {
  return `${flow}:${kind}:${slugify(front)}`;
}

/** Project a certified candidate onto the public ReviewItem shape. */
export function toReviewItem(cand: ReviewCandidate): ReviewItem {
  return {
    id: cand.id,
    flow: cand.flow,
    kind: cand.kind,
    front: cand.front,
    back: cand.back,
    pronunciation: cand.pronunciation,
    example: cand.example,
    noteVi: cand.noteVi,
    source: cand.source,
  };
}
