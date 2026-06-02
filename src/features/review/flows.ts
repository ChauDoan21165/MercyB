// src/features/review/flows.ts — canonical registry of the 7 review flows.
//
// Vietnamese-first: every label reads from the Vietnamese learner's point of
// view ("Việt → Anh"). This is the single source of truth for flow identity;
// the UI iterates REVIEW_FLOWS, never hard-codes a flow list.

import type { ReviewFlow, ReviewFlowId } from "./types";

export const REVIEW_FLOWS: readonly ReviewFlow[] = [
  { id: "vi-en", prompt: "vi", answer: "en", label: "Việt → Anh" },
  { id: "vi-de", prompt: "vi", answer: "de", label: "Việt → Đức" },
  { id: "vi-ja", prompt: "vi", answer: "ja", label: "Việt → Nhật" },
  { id: "vi-ko", prompt: "vi", answer: "ko", label: "Việt → Hàn" },
  { id: "vi-zh", prompt: "vi", answer: "zh", label: "Việt → Trung" },
  { id: "en-vi", prompt: "en", answer: "vi", label: "Anh → Việt" },
  { id: "en-es", prompt: "en", answer: "es", label: "Anh → Tây Ban Nha" },
] as const;

const BY_ID: ReadonlyMap<ReviewFlowId, ReviewFlow> = new Map(
  REVIEW_FLOWS.map((f) => [f.id, f]),
);

export function getFlow(id: ReviewFlowId): ReviewFlow | undefined {
  return BY_ID.get(id);
}

export function isReviewFlowId(value: string): value is ReviewFlowId {
  return BY_ID.has(value as ReviewFlowId);
}

export const REVIEW_FLOW_IDS: readonly ReviewFlowId[] = REVIEW_FLOWS.map(
  (f) => f.id,
);
