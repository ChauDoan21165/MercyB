/**
 * Stage 4 (L4) — Diagnostic Intervention Layer types.
 *
 * L4 is the deterministic glue between L3 (descriptive signal) and the
 * Stage 3B suggestion surface: take the device-local L3 signals, consult
 * a hard-coded rule table, emit at most one per-learner intervention.
 *
 * Decisions applied verbatim from
 * `docs/architecture/L4-diagnostic-intervention-layer.md` (§ Decisions
 * recorded, 2026-05-28):
 *
 *   - Q1=A  Rules live in a hard-coded TypeScript table (`rules.ts`).
 *           No Supabase, no JSON file, no admin surface.
 *   - Q5=B  The engine emits a structured `TriggerReason`; the
 *           presentation layer composes the VI/EN user-facing text. We
 *           REUSE Stage 3B's `TriggerReason` / `TargetAction` contract
 *           rather than duplicate it — see the imports below.
 *   - Q6=A  Live L1 signal wins over a stale placement snapshot
 *           (encoded in the rule evaluator's precedence; see
 *           `evaluate.ts`).
 *   - Q7=A  At most ONE L4 suggestion per session, anywhere.
 *   - Q4=A  Dismiss is permanent — L4 honors Stage 3B's deterministic
 *           dismissed-id set (`getDismissedSuggestionIds`) and never
 *           re-surfaces a dismissed id.
 *   - Q9=B  Evaluate on signal-change via a write-side hook, NOT on
 *           read (see `signalHook.ts`).
 *
 * Hard invariants (inherited from L3 / Stage 3B boundaries):
 *   - Pure data shapes. No I/O in this file.
 *   - No Supabase, no network, no `mercy_user_facts`, no placement
 *     writeback. L4 reads device-local signals and writes only its own
 *     local suggestion buffer.
 */

import type {
  TargetAction,
  TriggerReason,
} from "@/lib/stage-3b/suggestionEngine";

// Re-export the Stage 3B contract under L4-flavoured names so L4 call
// sites read naturally while making the "we wire into 3B, we do not
// fork it" intent explicit.
export type { TargetAction, TriggerReason };

/**
 * The raw, time-windowable L1 ring-buffer entry. Mirrors
 * `L1RecentEntry` from the Stage 3A adapter but typed locally so the
 * evaluator stays a pure function over a plain data shape (the
 * aggregator collapses these into per-tag counts and drops the
 * individual timestamps L4's windowing needs).
 */
export interface L1SignalEntry {
  tag: string;
  /** Epoch ms of the firing. */
  ts: number;
}

/**
 * Device-local signal bundle the rule evaluator reads. Deliberately a
 * plain value (not a live reader) so `evaluateStage4` is pure and
 * deterministic: identical signals + gate → identical output.
 */
export interface Stage4Signals {
  /** Raw L1 ring buffer (timestamps preserved for windowing). */
  l1Recent: ReadonlyArray<L1SignalEntry>;
  /** Placement-snapshot weakness tag ids (no severity in the snapshot). */
  placementWeaknesses: ReadonlyArray<string>;
  /** Evaluation clock. Injected so windowing is testable. */
  now: number;
}

/**
 * Gate inputs to the PURE evaluator. Passed in explicitly so the
 * evaluator is unit-testable without localStorage.
 *
 * Note the ≤1-per-session cap (Q7=A) is deliberately NOT here: it needs
 * the candidate suggestion's id to decide (a *different* suggestion may
 * already own the session's single slot), so it is enforced one layer
 * up, at display time, by the store / consumer (`store.ts`,
 * `useStage4Suggestion`). Keeping it out of the evaluator preserves
 * Q9=B's "evaluate on signal-change, not on read" — rule evaluation
 * stays pure and read-free; only a tiny session-marker write happens at
 * display time.
 */
export interface Stage4Gate {
  /** Learner flipped suggestions off globally (Stage 3B disable flag). */
  disabled: boolean;
  /** Deterministic dismissed-id set (Q4=A — honor Stage 3B's set). */
  dismissedIds: ReadonlySet<string>;
}

/**
 * The single output shape L4 produces. Structured-reason first (Q5=B):
 * `triggerReason` + `targetAction` are the Stage 3B contract; the
 * user-facing string is NOT baked in — the presentation layer composes
 * it (see `src/components/stage-4/composeStage4Reason.ts`).
 */
export interface Stage4Suggestion {
  /**
   * Stable, deterministic id. Same evidence → same id so the shared
   * dismissed-id set suppresses re-emission permanently (Q4=A).
   */
  id: string;
  /** Which rule in the table fired. */
  ruleId: string;
  /** Structured trigger evidence (Stage 3B `TriggerReason`). */
  triggerReason: TriggerReason;
  /** What to surface next (Stage 3B `TargetAction`). */
  targetAction: TargetAction;
  /**
   * How long the suggestion stays valid before re-evaluation. Provisional
   * default — owned by L5.
   */
  // L5-PENDING: TTL default (7 days) is provisional pending L5 ratification
  // of "L4 suggestion lifetime / TTL". See STAGE-4-5-decision-queue.md
  // § Research-blocked → "L4 suggestion lifetime / TTL".
  ttlMs: number;
  /** Epoch ms the suggestion was produced (for TTL expiry checks). */
  generatedAt: number;
}
