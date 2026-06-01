// src/features/review/content/sources/source.ts — internal seam between the
// ContentAdapter and each concrete content source. NOT part of the public
// types.ts contract; it exists so the adapter is composed from independent,
// individually-testable, individually-injectable sources.
//
// A ReviewSource is a pure data transform: given a flow it supports, it returns
// the ReviewItems it can derive from EXISTING content, read-only. It must never
// throw and never perform IO beyond reading already-imported module data.

import type { ReviewFlowId, ReviewItem } from "@/features/review/types";

export interface ReviewSource {
  /** Stable provenance label, e.g. "spanish/lessons". Used for debugging. */
  readonly name: string;
  /** Flows this source can contribute items to. */
  flows(): ReviewFlowId[];
  /**
   * Items this source derives for `flow`. MUST return [] (never throw) when it
   * does not support the flow or has nothing to contribute.
   */
  items(flow: ReviewFlowId): ReviewItem[];
}
