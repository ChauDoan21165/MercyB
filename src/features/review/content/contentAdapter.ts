// src/features/review/content/contentAdapter.ts — D3 slice.
//
// The ContentAdapter (see types.ts) pulls reviewable vocab/sentences from
// EXISTING MercyBlade content, READ-ONLY, and maps them to ReviewItem[]. It is
// composed of independent ReviewSource modules (one per content corpus). The
// adapter just fans a flow out to every source that supports it, concatenates,
// and dedups by stable namespaced id.
//
// Fail soft (README): an unsupported or empty flow yields [], never throws.

import type {
  ContentAdapter,
  ReviewFlowId,
  ReviewItem,
} from "@/features/review/types";
import { isReviewFlowId } from "@/features/review/flows";

import type { ReviewSource } from "./sources/source";
import { createDefaultSources } from "./sources/defaultSources";

export interface CreateContentAdapterOptions {
  /**
   * Sources to compose. Defaults to the real wired content sources
   * (Spanish lessons + bilingual sentences). Tests inject fakes here so they
   * never depend on real content files.
   */
  sources?: ReviewSource[];
}

export function createContentAdapter(
  options: CreateContentAdapterOptions = {},
): ContentAdapter {
  // Lazily resolve the real sources only when none are injected — so a test
  // that passes fakes never pulls the real-content import graph.
  const sources: ReviewSource[] = options.sources ?? createDefaultSources();

  // Precompute the supported-flow set from the sources, intersected with the
  // canonical flow registry (a source can never invent a non-flow).
  const supported = new Set<ReviewFlowId>();
  for (const src of sources) {
    let flows: ReviewFlowId[] = [];
    try {
      flows = src.flows();
    } catch {
      flows = [];
    }
    for (const f of flows) {
      if (isReviewFlowId(f)) supported.add(f);
    }
  }

  return {
    supportedFlows(): ReviewFlowId[] {
      return [...supported];
    },

    async getItems(flow: ReviewFlowId): Promise<ReviewItem[]> {
      if (!isReviewFlowId(flow) || !supported.has(flow)) return [];

      const out: ReviewItem[] = [];
      const seen = new Set<string>();

      for (const src of sources) {
        let items: ReviewItem[] = [];
        try {
          // Only ask a source for a flow it claims to support.
          if (!src.flows().includes(flow)) continue;
          items = src.items(flow) ?? [];
        } catch {
          // A misbehaving source must not break the deck — fail soft.
          items = [];
        }
        for (const item of items) {
          if (!item || item.flow !== flow) continue;
          if (seen.has(item.id)) continue;
          seen.add(item.id);
          out.push(item);
        }
      }

      return out;
    },
  };
}
