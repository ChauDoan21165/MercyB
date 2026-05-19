// supabase/functions/placement-session/engine/scoring.ts
//
// Placement Test v2 — response scoring: Response → ScoredItem (Phase 2,
// PR 8).
//
// Implements: sequence-doc PR 8 — "where scoring lives". This is the ONE
// module the irt.ts / thetaEstimator.ts / itemSelector.ts / terminator.ts
// headers all defer to: each of those operates on the minimal `{a,b,u}`
// `ScoredItem` shape and explicitly states that the Response/Item →
// ScoredItem mapping — "what counts as correct; the writing_sample/
// null-correct exclusion of decision #3; any L1-revealed discount (cf.
// PR #656)" — "belongs with server scoring in PR 8, not in the numeric
// estimator" (thetaEstimator.ts:17-26). This file is that mapping, in
// exactly one place (single source of truth — the same DRY discipline as
// priorMeanForSelfRating owning the self-rating→μ₀ map).
//
// SERVER-SIDE (locked Q1): scoring needs the answer key
// (`Item.correctOptionId`) and the IRT params (`discrimination`,
// `difficulty`), neither of which ever reaches the browser. PURE +
// dependency-light: imports are this series' own types + the PR-2 irt.ts
// `ScoredItem` shape + the PR-V2-4 `itemById` index only — no Deno/URL ⇒
// tsconfig.functions.json (gate #6) type-checks it; vitest runs its
// goldens.
//
// SCORING POLICY (the locked decisions this module encodes):
//
//  • Decision #3 — `writing_sample` is post-test / unscored: it NEVER
//    enters θ. `Response.correct` for a writing sample is `null` by the
//    types.ts contract. Both signals (item type AND null-correct) map to
//    "excluded" → `null`, so the estimator/terminator never see it.
//
//  • L1-revealed discount (cf. PR #656, `Response.l1RevealedUsed`): a
//    *correct* answer the learner reached only after pressing the L1
//    crutch is NOT evidence of unaided ability, so it is scored u = 0.
//    An incorrect answer is u = 0 regardless (the crutch did not save
//    it). A correct answer WITHOUT the crutch is u = 1.
//
// RECONSTRUCTION NOTE (flagged in the PR + to Chau, same discipline as
// `itemSelector.randomesqueK` #712 / `terminator` precedence #718): the
// design+sequence docs are ephemeral and unavailable this session. That
// an L1-revealed discount EXISTS is locked by three in-repo breadcrumbs
// (thetaEstimator.ts:21-26 "any L1-revealed discount … belongs with
// server scoring in PR 8"; the `Response.l1RevealedUsed` field in
// types.ts:135 "pressed an L1 crutch (cf. PR #656)"; PR #656). Its
// *binary* form (discount → u = 0, not a fractional weight) is FORCED by
// the kernel contract, not chosen: `ScoredItem.u` is `0 | 1`
// (irt.ts:31) — the 2PL likelihood/score/info functions have no
// fractional-credit path, and inventing a "partial-credit weight"
// constant would be a NEW config knob, which the engine discipline
// forbids ("no new knob; anchor to existing constants/contracts"). So
// the binary discount is the only discipline-compliant encoding; it adds
// zero new constants and is anchored to the existing `0 | 1` `u` type.

import { itemById } from "./itemBank.ts";
import type { ScoredItem } from "./irt.ts";
import type { Item, ItemBank, Response } from "../types.ts";

/**
 * Score ONE administered response against its (server) bank item →
 * `ScoredItem` for θ, or `null` when the response is excluded from θ.
 *
 * Excluded (→ null):
 *  • `item.type === "writing_sample"` — decision #3 (post-test/unscored).
 *  • `resp.correct === null` — the types.ts sentinel for a non-IRT-scored
 *    response (a writing sample, or any response the edge fn could not
 *    dichotomously grade). Belt-and-braces with the type check above so a
 *    null-correct on any type can never poison θ.
 *
 * Scored (→ {a,b,u}), `u` per the L1-revealed discount:
 *  • correct && !l1RevealedUsed         → u = 1
 *  • correct &&  l1RevealedUsed         → u = 0  (crutch-assisted ≠ ability)
 *  • !correct (any l1RevealedUsed)      → u = 0
 *
 * `a` = item discrimination, `b` = item difficulty (the only two IRT
 * fields irt.ts consumes). Authoring `cefr`/`meta` never enter θ.
 */
export function scoreResponse(item: Item, resp: Response): ScoredItem | null {
  // Decision #3: writing samples are never IRT-scored. Either signal
  // (item type or the null-correct sentinel) excludes the response.
  if (item.type === "writing_sample" || resp.correct === null) return null;

  // L1-revealed discount: a crutch-assisted correct is not unaided
  // ability → u = 0. Everything not a clean unaided correct → u = 0.
  const cleanCorrect = resp.correct === true && resp.l1RevealedUsed !== true;
  const u: 0 | 1 = cleanCorrect ? 1 : 0;

  return { a: item.discrimination, b: item.difficulty, u };
}

/**
 * Map an append-only `Response[]` (the session's administered log) to the
 * `ScoredItem[]` the estimator/terminator consume — the canonical bridge
 * between session shape and the numeric kernel.
 *
 * Order-preserving (the estimator is order-independent, but a stable
 * mapping keeps goldens exact). Responses are dropped iff:
 *  • the item id is not in the bank (defensive — an unknown item cannot
 *    be IRT-scored; never crash a live session, CLAUDE.md "core path
 *    survives optional failures"), or
 *  • `scoreResponse` returns null (decision #3 / null-correct).
 *
 * Result: exactly the θ-contributing items, scored once, in one place.
 */
export function toScoredItems(
  bank: ItemBank,
  administered: ReadonlyArray<Response>,
): ScoredItem[] {
  const out: ScoredItem[] = [];
  for (const resp of administered) {
    const item = itemById(bank, resp.itemId);
    if (item === null) continue; // unknown item — cannot score, skip
    const scored = scoreResponse(item, resp);
    if (scored !== null) out.push(scored);
  }
  return out;
}
