// supabase/functions/placement-session/engine/itemSelector.ts
//
// Placement Test v2 — adaptive item selector (Phase 2, PR 5 / PR-V2-5).
//
// Implements: sequence-doc PR 5 "item selector"; design §2.6 (maximum
// Fisher-information selection + content balancing + randomesque exposure
// control + the Vietnamese-L1 nudge). itemBank.ts's closing comment names
// this module explicitly: "the selector, PR-V2-5, layers exposure/quota/
// MFI on top of this [filterItems]".
//
// SERVER-SIDE, like all engine/* code (locked Q1): item params + the
// answer key never reach the browser. This module returns the FULL `Item`
// (not `PublicItem`) — the edge function strips to `PublicItem` before
// it leaves the server, and PR 8 scoring needs the answer key. Same
// server-Item scope as irt.ts/thetaEstimator.ts ("mapping the bank/
// session shapes is the estimator's/selector's job").
//
// PURE + DI: the only stochastic input is an injected `rng: () => number`
// (Kingsbury & Zara randomesque draw). With a scripted rng the whole
// selector is deterministic and golden-testable (mirrors the estimator's
// hand-derived goldens). Imports are this series' own config + the PR-2
// irt.ts kernel + types only — no Deno/URL, so tsconfig.functions.json
// (gate #6) type-checks it and vitest runs its tests.
//
// SCOPE: this is "what to ask NEXT". The STOP rule (MIN/MAX_ITEMS,
// SE_STOP, quota-must-be-met-before-terminate) is the terminator's job
// (a later PR) — config.ts groups those constants under §2.6 too, but
// selection and termination are separate concerns. `selectNextItem`
// returning `null` (eligible pool empty) is the ONE termination signal
// the selector owns: the terminator maps it to `bank_exhausted`.
//
// RECONSTRUCTION NOTE (flagged in the PR + to Chau): the design doc
// (`/private/tmp/placement-test-v2-architecture.md`) is ephemeral and was
// not available this session. §2.6 is fully pinned by the in-repo
// annotations in config.ts/types.ts/itemBank.ts EXCEPT the early→late
// randomesque-K switch point, for which no named config constant exists.
// It is anchored here to `MIN_ITEMS` — the constant config.ts documents
// as the "anti lucky-streak floor": before the floor, exposure security
// dominates (wider K); past it, measurement precision dominates (narrow
// K). This is the single inferred knob; everything else is config-driven.

import {
  L1_NUDGE_WEIGHT,
  MIN_ITEMS,
  RANDOMESQUE_K,
  RANDOMESQUE_K_LATE,
  SOFT_TARGET_MIX,
  TYPE_QUOTAS,
} from "../config.ts";
import { itemInformation } from "./irt.ts";
import type { Item, ItemBank, ItemType, L1TransferTag } from "../types.ts";

/** Scored item types, in the deterministic tie-break order used by every
 *  "pick a type" decision below. `writing_sample` is intentionally absent:
 *  it is post-test/unscored (decision #3, SOFT_TARGET_MIX = 0) and is
 *  NEVER adaptively selected. */
export const SCORED_TYPES: ReadonlyArray<Exclude<ItemType, "writing_sample">> = [
  "reading",
  "listening",
  "grammar",
  "vocabulary",
];

/**
 * Minimal structural input the selector needs from the live session —
 * NOT the full `SessionState` (same scope-boundary discipline as irt.ts
 * taking `{a,b}` and thetaEstimator taking `ScoredItem[]`). Hand-written,
 * not derived: keeps the selector's contract explicit and stable.
 */
export interface SelectionState {
  /** Current working θ̂ (the EAP estimate — locked decision #2: EAP is
   *  what drives selection). */
  theta: number;
  /** Every item id already served this session (exposure within session
   *  — these are excluded from the eligible pool). */
  servedItemIds: ReadonlyArray<string>;
  /** Count of scored items administered per type so far. Missing keys
   *  read as 0. `writing_sample` (if present) is ignored. */
  typeCounts: Partial<Record<ItemType, number>>;
  /** Uncovered priority Vietnamese-L1 transfer tags. A top-K item whose
   *  `l1Tags` intersects this set gets the `L1_NUDGE_WEIGHT` multiplier
   *  in the randomesque draw (design §2.6 "L1 nudge"). Empty/undefined ⇒
   *  plain uniform randomesque. */
  priorityL1Tags?: ReadonlyArray<L1TransferTag>;
}

/** Total scored items administered so far (drives quota math + the
 *  early→late randomesque-K switch). `writing_sample` excluded. */
export function administeredCount(
  typeCounts: Partial<Record<ItemType, number>>,
): number {
  let n = 0;
  for (const t of SCORED_TYPES) n += typeCounts[t] ?? 0;
  return n;
}

/** Eligible pool: bank items that are scored (not `writing_sample`) and
 *  not already served this session. Pure; preserves bank order (the
 *  information sort is stable on top of it). */
export function eligibleItems(
  bank: ItemBank,
  servedItemIds: ReadonlyArray<string>,
): Item[] {
  const served = new Set(servedItemIds);
  return bank.items.filter(
    (it) => it.type !== "writing_sample" && !served.has(it.id),
  );
}

/**
 * Content balancing (design §2.6). Decide which ItemType the NEXT item
 * should come from, considering only types that still have an eligible
 * item:
 *
 *  1. HARD-QUOTA phase — if any type's `TYPE_QUOTAS` minimum is unmet
 *     AND that type still has eligible items, pick the one with the
 *     largest remaining deficit (`quota − count`). This guarantees the
 *     §2.6 "must be met before terminate" minimums get filled while items
 *     remain. Ties → SCORED_TYPES order (deterministic).
 *
 *  2. SOFT-MIX phase — all reachable hard quotas satisfied: pick the type
 *     whose current proportion (`count / max(administered,1)`) is
 *     furthest BELOW its `SOFT_TARGET_MIX` target. Drives the test toward
 *     the ~30/30/20/15 design mix. Ties → SCORED_TYPES order.
 *
 * Returns null only when NO scored type has an eligible item (caller
 * then has an empty pool ⇒ termination).
 */
export function chooseTargetType(
  bank: ItemBank,
  state: SelectionState,
): Exclude<ItemType, "writing_sample"> | null {
  const served = new Set(state.servedItemIds);
  const hasEligible = (t: ItemType): boolean =>
    (bank.byType[t] ?? []).some((it) => !served.has(it.id));

  const reachable = SCORED_TYPES.filter(hasEligible);
  if (reachable.length === 0) return null;

  // Phase 1: unmet hard quotas (only for reachable types).
  let best: Exclude<ItemType, "writing_sample"> | null = null;
  let bestDeficit = 0;
  for (const t of reachable) {
    const quota = TYPE_QUOTAS[t] ?? 0;
    const deficit = quota - (state.typeCounts[t] ?? 0);
    if (deficit > bestDeficit) {
      bestDeficit = deficit;
      best = t;
    }
  }
  if (best) return best; // SCORED_TYPES iteration order ⇒ stable ties

  // Phase 2: soft mix — largest (target − currentProportion) gap.
  const total = administeredCount(state.typeCounts);
  const denom = total > 0 ? total : 1;
  let pick: Exclude<ItemType, "writing_sample"> = reachable[0];
  let bestGap = Number.NEGATIVE_INFINITY;
  for (const t of reachable) {
    const target = SOFT_TARGET_MIX[t] ?? 0;
    const current = (state.typeCounts[t] ?? 0) / denom;
    const gap = target - current;
    if (gap > bestGap) {
      bestGap = gap;
      pick = t;
    }
  }
  return pick;
}

/** An item paired with its Fisher information at the current θ̂. */
export interface RankedItem {
  item: Item;
  information: number;
}

/**
 * Maximum-Fisher-information ranking (design §2.6 / §2.4 `itemInformation`).
 * Descending by information; ties broken by item id (lexicographic) so
 * the ordering — and therefore the top-K and the test — is fully
 * deterministic for a given θ̂.
 */
export function rankByInformation(
  items: ReadonlyArray<Item>,
  theta: number,
): RankedItem[] {
  return items
    .map((item) => ({
      item,
      information: itemInformation(theta, item.discrimination, item.difficulty),
    }))
    .sort((x, y) =>
      y.information !== x.information
        ? y.information - x.information
        : x.item.id < y.item.id
          ? -1
          : x.item.id > y.item.id
            ? 1
            : 0,
    );
}

/**
 * Randomesque exposure-control window size (Kingsbury & Zara, design
 * §2.6). Wide (`RANDOMESQUE_K`) before the anti lucky-streak floor — the
 * early items are the most over-exposable, so trade a little precision
 * for exposure security; narrow (`RANDOMESQUE_K_LATE`) once past
 * `MIN_ITEMS`, where measurement precision matters more than security.
 *
 * RECONSTRUCTION (see header): `MIN_ITEMS` as the switch point is the one
 * §2.6 knob not pinned by a dedicated config constant.
 */
export function randomesqueK(administered: number): number {
  return administered < MIN_ITEMS ? RANDOMESQUE_K : RANDOMESQUE_K_LATE;
}

/**
 * Weighted single draw over the top-K most-informative items (design
 * §2.6). Base weight 1; an item whose `l1Tags` intersects the supplied
 * uncovered priority set is multiplied by `L1_NUDGE_WEIGHT` (the "L1
 * nudge" — gently steers the adaptive engine toward diagnosing the
 * learner's untested Vietnamese-transfer weaknesses without abandoning
 * maximum-information selection). `rng()` must yield [0, 1).
 *
 * Determinism: a scripted `rng` makes this exact. With an empty top-K
 * (only when the pool is empty) → null.
 */
export function randomesqueDraw(
  ranked: ReadonlyArray<RankedItem>,
  administered: number,
  rng: () => number,
  priorityL1Tags?: ReadonlyArray<L1TransferTag>,
): Item | null {
  const k = randomesqueK(administered);
  const topK = ranked.slice(0, k);
  if (topK.length === 0) return null;
  if (topK.length === 1) return topK[0].item;

  const priority = new Set(priorityL1Tags ?? []);
  const weights = topK.map(({ item }) =>
    priority.size > 0 && (item.l1Tags ?? []).some((tag) => priority.has(tag))
      ? L1_NUDGE_WEIGHT
      : 1,
  );
  const totalW = weights.reduce((s, w) => s + w, 0);

  // rng() ∈ [0,1) → a point in [0,totalW); first cumulative bucket it
  // falls under wins. Clamp guards a pathological rng() === 1.
  let r = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON) * totalW;
  for (let i = 0; i < topK.length; i++) {
    r -= weights[i];
    if (r < 0) return topK[i].item;
  }
  return topK[topK.length - 1].item; // float-rounding safety net
}

/**
 * Select the next item to administer (design §2.6, the whole pipeline):
 *
 *   eligible pool  →  content-balanced target type  →  rank that type by
 *   Fisher information at θ̂  →  randomesque top-K  →  L1-nudged draw.
 *
 * Returns the FULL server `Item` (caller strips to `PublicItem`). Returns
 * `null` iff no eligible item remains (the selector's only termination
 * signal — the terminator maps it to `bank_exhausted`).
 */
export function selectNextItem(
  bank: ItemBank,
  state: SelectionState,
  rng: () => number,
): Item | null {
  const pool = eligibleItems(bank, state.servedItemIds);
  if (pool.length === 0) return null;

  const targetType = chooseTargetType(bank, state);
  // targetType is null only if no scored type is reachable — but the pool
  // is non-empty, so at least one scored type IS reachable. The `?? pool`
  // is a defensive belt: never crash a live session on an unexpected
  // shape ("core path survives optional failures").
  const candidates = targetType
    ? pool.filter((it) => it.type === targetType)
    : pool;
  const ranked = rankByInformation(
    candidates.length > 0 ? candidates : pool,
    state.theta,
  );

  return randomesqueDraw(
    ranked,
    administeredCount(state.typeCounts),
    rng,
    state.priorityL1Tags,
  );
}
