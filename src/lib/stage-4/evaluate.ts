/**
 * Stage 4 (L4) — pure rule evaluator.
 *
 * `evaluateStage4(signals, gate)` is the deterministic heart of L4:
 * identical inputs → identical output, byte-for-byte. No I/O, no
 * localStorage, no clock (the clock arrives as `signals.now`). The
 * localStorage-backed wrappers live in `store.ts` / `signalHook.ts`.
 *
 * Decision wiring:
 *   - Q7=A  Single-pick: returns AT MOST one `Stage4Suggestion`. Rules
 *           are consulted in priority order and the first match wins.
 *           The ≤1-per-session cap that picks between *different*
 *           suggestions across a session is enforced one layer up (at
 *           display time, in `store.ts` / `useStage4Suggestion`) because
 *           it needs the candidate id; this evaluator only guarantees
 *           one suggestion per call.
 *   - Q4=A  A suggestion whose id is in `gate.dismissedIds` is skipped —
 *           dismiss is permanent. The set is Stage 3B's deterministic
 *           dismissed-id set (honored, not duplicated).
 *   - Q6=A  Precedence (live L1 wins over stale placement) lives inside
 *           each rule's `evaluate`; the evaluator just orders + caps.
 */

import { STAGE_4_RULES } from "./rules";
import type { Stage4Gate, Stage4Signals, Stage4Suggestion } from "./types";

/**
 * Evaluate the L4 rule table against the current signals + gate.
 *
 * Returns the single highest-priority, non-dismissed suggestion, or
 * `null` when nothing fires / the gate suppresses everything.
 */
export function evaluateStage4(
  signals: Stage4Signals,
  gate: Stage4Gate,
): Stage4Suggestion | null {
  // Global learner opt-out short-circuits before any rule runs.
  if (gate.disabled) return null;

  // Defensive copy + stable sort by priority asc. The table is already
  // ordered, but sorting here means a future contributor appending an
  // out-of-order rule still gets correct precedence.
  const ordered = [...STAGE_4_RULES].sort((a, b) => a.priority - b.priority);

  for (const rule of ordered) {
    // Dismiss is permanent (Q4=A): never re-emit a dismissed id, even
    // if the underlying evidence still fires.
    if (gate.dismissedIds.has(rule.suggestionId)) continue;

    const match = rule.evaluate(signals);
    if (!match) continue;

    return {
      id: rule.suggestionId,
      ruleId: rule.id,
      triggerReason: match.triggerReason,
      targetAction: match.targetAction,
      ttlMs: rule.ttlMs,
      generatedAt: signals.now,
    };
  }

  return null;
}
