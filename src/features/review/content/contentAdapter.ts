// src/features/review/content/contentAdapter.ts — D3 slice.
//
// The ContentAdapter (see types.ts) pulls reviewable vocab/sentences from
// EXISTING MercyBlade content, READ-ONLY, and maps them to ReviewItem[].
//
// Two composition modes:
//   - LAZY (default): per-flow dynamic import() loaders (sources/lazyLoaders).
//     A flow's content is code-split into its own chunk and fetched only when
//     getItems(flow) is first called — so the ReviewApp bundle stays small.
//   - SYNC (injected): pass `sources` (ReviewSource[]) to compose from eager,
//     already-built sources. Used by tests (fakes) and any caller that already
//     holds the data.
//
// Fail soft (README): an unsupported or empty flow yields [], never throws.

import type {
  ContentAdapter,
  ReviewFlowId,
  ReviewItem,
} from "@/features/review/types";
import { isReviewFlowId } from "@/features/review/flows";

import type { ReviewSource } from "./sources/source";
import { DEFAULT_FLOW_LOADERS, type ItemsLoader } from "./sources/lazyLoaders";

export interface CreateContentAdapterOptions {
  /**
   * Eager, pre-built sources to compose from. When provided, the adapter runs
   * in SYNC mode and ignores `loaders`. Tests inject fakes here so they never
   * pull real content.
   */
  sources?: ReviewSource[];
  /**
   * Per-flow lazy loaders. Defaults to DEFAULT_FLOW_LOADERS (the real wired
   * content, code-split). Only consulted when `sources` is not provided.
   */
  loaders?: Partial<Record<ReviewFlowId, ItemsLoader>>;
}

/** Dedup a flow's items by stable id, preserving order. */
function dedup(flow: ReviewFlowId, items: readonly ReviewItem[]): ReviewItem[] {
  const out: ReviewItem[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item || item.flow !== flow) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

/** SYNC mode — compose from eager ReviewSources (test/injection path). */
function fromSources(sources: ReviewSource[]): ContentAdapter {
  const supported = new Set<ReviewFlowId>();
  for (const src of sources) {
    let flows: ReviewFlowId[] = [];
    try {
      flows = src.flows();
    } catch {
      flows = [];
    }
    for (const f of flows) if (isReviewFlowId(f)) supported.add(f);
  }

  return {
    supportedFlows: () => [...supported],
    async getItems(flow: ReviewFlowId): Promise<ReviewItem[]> {
      if (!isReviewFlowId(flow) || !supported.has(flow)) return [];
      const collected: ReviewItem[] = [];
      for (const src of sources) {
        try {
          if (!src.flows().includes(flow)) continue;
          collected.push(...(src.items(flow) ?? []));
        } catch {
          // A misbehaving source must not break the deck — fail soft.
        }
      }
      return dedup(flow, collected);
    },
  };
}

/** LAZY mode — per-flow dynamic-import loaders (default path). */
function fromLoaders(
  loaders: Partial<Record<ReviewFlowId, ItemsLoader>>,
): ContentAdapter {
  const supported = (Object.keys(loaders) as ReviewFlowId[]).filter(isReviewFlowId);
  const supportedSet = new Set(supported);
  const cache = new Map<ReviewFlowId, ReviewItem[]>();

  return {
    supportedFlows: () => [...supported],
    async getItems(flow: ReviewFlowId): Promise<ReviewItem[]> {
      if (!isReviewFlowId(flow) || !supportedSet.has(flow)) return [];
      const cached = cache.get(flow);
      if (cached) return cached;
      const loader = loaders[flow];
      if (!loader) return [];
      let items: ReviewItem[] = [];
      try {
        items = dedup(flow, (await loader()) ?? []);
      } catch {
        // A failed import / source must not break the deck — fail soft.
        items = [];
      }
      cache.set(flow, items);
      return items;
    },
  };
}

export function createContentAdapter(
  options: CreateContentAdapterOptions = {},
): ContentAdapter {
  if (options.sources) return fromSources(options.sources);
  return fromLoaders(options.loaders ?? DEFAULT_FLOW_LOADERS);
}
