// src/features/review/index.ts — public surface of the review module.
//
// The shared shell imports ONLY from here (plus the lazy ReviewApp in the
// router). Everything else is internal to the feature.

export { FEATURE_REVIEW } from "./flag";
export { REVIEW_FLOWS, REVIEW_FLOW_IDS, getFlow, isReviewFlowId } from "./flows";
export { default as ReviewNavEntry } from "./ReviewNavEntry";
export type * from "./types";
