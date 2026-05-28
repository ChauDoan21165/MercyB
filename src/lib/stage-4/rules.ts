/**
 * Stage 4 (L4) — hard-coded rule table.
 *
 * Q1=A: rules live HERE, in type-safe TypeScript. No Supabase table, no
 * `public/data/` JSON file, no admin surface. Rule edits ship through
 * the same review path as the engine that drives them. Moving to a
 * loader later (Q1 options B/C) is a refactor that extracts this shape;
 * the rule DATA is identical regardless of source.
 *
 * Q8=A: the first — and currently only — rule is Vietnamese-L1
 * past-tense-marker omission (e.g. "yesterday I go" / "hôm qua tôi đi"
 * → expected "yesterday I went"). It is the highest-confidence detector
 * with the largest evidence base in the L1-detector tests, and it runs
 * on a text-only signal, so it is the cheapest path to a real L4
 * surface. Scope is ONE rule; the second rule (and any rule-arbitration
 * machinery beyond the single-pick cap) is explicitly out of scope for
 * this build.
 *
 * Rule shape contract:
 *   - Each rule is pure: `evaluate(signals) → Stage4RuleMatch | null`.
 *     Identical signals → identical match. No I/O, no clock except the
 *     injected `signals.now`.
 *   - A rule emits the Stage 3B structured contract (`TriggerReason` +
 *     `TargetAction`) — NOT a user-facing string (Q5=B). The
 *     presentation layer composes copy from the structured reason.
 *   - `priority` orders rules when several match; the evaluator's
 *     single-pick cap (Q7=A) then surfaces only the top one.
 */

import type {
  Stage4Signals,
  TargetAction,
  TriggerReason,
} from "./types";

/** Tag the L1 detector emits for "missing past -ed when a past-time
 *  marker is present" — rule 2 in `l1-error-detector.ts`. This is the
 *  live signal the past-tense rule keys off. */
export const PAST_TENSE_L1_TAG = "vi_l1_past_ed";

/** Placement-snapshot weakness id for unmarked past tense — keyed in
 *  `PLACEMENT_DESCRIPTIONS` (`stage-3a/taxonomy.ts`). This is the stale
 *  corroborating signal the past-tense rule pairs with the live L1
 *  evidence. */
export const PAST_TENSE_PLACEMENT_TAG = "past_tense_unmarked";

// L5-PENDING: intervention threshold (≥3 L1 hits in the window) is a
// provisional default pending L5 ratification of "L4 intervention
// threshold defaults". See STAGE-4-5-decision-queue.md § Research-blocked.
// Per X3, L4 intervenes on WEAKER evidence than L6 reports on — two
// thresholds, not one; only the shape is settled, the value is provisional.
export const PAST_TENSE_INTERVENTION_MIN_COUNT = 3;

// L5-PENDING: signal window (7 days) is a provisional default pending
// L5 ratification. Pairs with the intervention threshold above.
export const PAST_TENSE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// L5-PENDING: suggestion TTL (7 days) is a provisional default pending
// L5 ratification of "L4 suggestion lifetime / TTL".
export const PAST_TENSE_SUGGESTION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface Stage4RuleMatch {
  triggerReason: TriggerReason;
  targetAction: TargetAction;
}

export interface Stage4Rule {
  /** Stable rule identifier. */
  id: string;
  /** Lower = higher priority when multiple rules match (Q7=A picks one). */
  priority: number;
  /**
   * Deterministic id for the suggestion this rule emits. Lives in the
   * shared dismissed-id namespace (Q4=A) so a dismissal is permanent
   * across re-evaluations.
   */
  suggestionId: string;
  /** TTL stamped on the emitted suggestion. */
  ttlMs: number;
  /** Pure condition + structured-output builder. `null` = no fire. */
  evaluate: (signals: Stage4Signals) => Stage4RuleMatch | null;
}

/**
 * Count how many times `tag` fired within `windowMs` before `now`.
 * Pure helper over the raw ring buffer — the aggregator's per-tag
 * count collapses the timestamps L4's windowing needs, so L4 windows
 * the raw entries itself.
 */
export function countInWindow(
  entries: Stage4Signals["l1Recent"],
  tag: string,
  now: number,
  windowMs: number,
): number {
  const floor = now - windowMs;
  let count = 0;
  for (const entry of entries) {
    if (entry.tag !== tag) continue;
    // Inclusive lower bound; tolerate clock skew on future-dated entries
    // by counting anything at-or-before `now`.
    if (entry.ts >= floor && entry.ts <= now) count += 1;
  }
  return count;
}

/**
 * Rule 1 — Vietnamese-L1 past-tense-marker omission (Q8=A).
 *
 * Fires only when BOTH:
 *   (a) placement flagged `past_tense_unmarked` (the pattern was
 *       unfamiliar at placement time — the stale corroborating signal),
 *       AND
 *   (b) the live L1 stream shows `vi_l1_past_ed` ≥ the intervention
 *       threshold within the window (the pattern is CURRENTLY failing).
 *
 * Q6=A precedence (live wins over stale) is encoded by the AND: a stale
 * placement flag alone never fires; if the live window shows the learner
 * is now producing past tense reliably (count below threshold), the
 * intervention is suppressed even though placement still lists the
 * weakness. The structured `triggerReason` carries the LIVE evidence
 * (the L1 count), not the placement flag, so the reason a learner is
 * shown reflects current state.
 */
const pastTenseMarkerRule: Stage4Rule = {
  id: "vn-past-tense-marker",
  priority: 0,
  suggestionId: `stage4:${PAST_TENSE_L1_TAG}`,
  ttlMs: PAST_TENSE_SUGGESTION_TTL_MS,
  evaluate(signals) {
    const placementFlagged = signals.placementWeaknesses.includes(
      PAST_TENSE_PLACEMENT_TAG,
    );
    if (!placementFlagged) return null;

    const liveCount = countInWindow(
      signals.l1Recent,
      PAST_TENSE_L1_TAG,
      signals.now,
      PAST_TENSE_WINDOW_MS,
    );
    if (liveCount < PAST_TENSE_INTERVENTION_MIN_COUNT) return null;

    return {
      triggerReason: {
        kind: "repeated_l1_pattern",
        tag: PAST_TENSE_L1_TAG,
        count: liveCount,
      },
      targetAction: { kind: "review_l1_pattern", tag: PAST_TENSE_L1_TAG },
    };
  },
};

/**
 * The rule table. Ordered by priority ascending so the evaluator can
 * pick the top match without re-sorting. ONE rule today (Q8=A); adding
 * a second rule is appending here — no other engine change.
 */
export const STAGE_4_RULES: ReadonlyArray<Stage4Rule> = [
  pastTenseMarkerRule,
];
