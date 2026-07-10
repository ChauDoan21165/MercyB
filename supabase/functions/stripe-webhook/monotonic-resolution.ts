// monotonic-resolution.ts — graceful terminal resolution for the optimistic
// compare-and-set retry loop in `upsertSharedSubscriptionMonotonic` (billing.ts).
//
// THE BUG THIS FIXES
// ------------------
// When all MAX_MONOTONIC_RETRIES CAS attempts lost the race (a sibling Stripe
// event for the SAME subscription — e.g. `invoice.paid` + `customer.subscription
// .updated`, which Stripe fires near-simultaneously — kept committing between
// our read and write), the loop THREW:
//   "Failed to apply monotonic Stripe subscription update after concurrent
//    modifications"
// -> HTTP 500 -> Stripe retries -> the retry usually lands 200. That intermittent
// 500 was live on "Mercy Blade live webhook 2" across Jul 7–8.
//
// At exhaustion the row is almost always ALREADY in a correct monotonic state —
// the winning event committed. So we reconcile from the freshness relation
// between the incoming event and the persisted row instead of throwing:
//   - "noop"  : incoming is older-or-EQUAL than persisted -> the winner already
//               carries an equal-or-newer state; the monotonic invariant holds.
//               Return success (200); NEVER overwrite the newer row.
//   - "apply" : incoming is strictly NEWER than persisted -> land it with one
//               final monotonic-guarded update (advance-only; the DB guard makes
//               a regression impossible even here).
//   - "throw" : the row could not be re-read at all (it vanished) -> a genuine
//               anomaly, surfaced rather than silently succeeded.
//
// MONOTONIC INVARIANT (preserved by construction): an older/equal incoming event
// can only ever produce "noop", so it can never overwrite a newer
// current_period_end. Only a strictly-newer event produces "apply".
//
// Deliberately ZERO imports (no Deno globals, no esm.sh) so it is vitest-testable
// in isolation — the same "pure logic, DI" pattern as monotonic-backoff.ts and
// subscription-insert.ts (billing.ts transitively imports Deno-only code and
// cannot be loaded under vitest).

export type MonotonicExhaustionAction = "noop" | "apply" | "throw";

export interface MonotonicExhaustionInput {
  /** Was the subscription row re-readable after the retry loop exhausted? */
  hasLatest: boolean;
  /**
   * `compareStripeFreshness(incoming, persisted)`:
   *   > 0  incoming is strictly newer than the persisted row,
   *   = 0  equal freshness,
   *   < 0  incoming is older.
   * Null iff `hasLatest` is false (nothing to compare against).
   */
  freshnessComparison: number | null;
}

/**
 * Decide how the exhausted CAS loop should terminate. Pure; the caller performs
 * the I/O the action implies.
 */
export function resolveMonotonicExhaustion(
  input: MonotonicExhaustionInput,
): MonotonicExhaustionAction {
  // No row after all retries -> we were racing writes on a row that is now
  // unreadable. That should not happen; surface it rather than guess.
  if (!input.hasLatest || input.freshnessComparison == null) {
    return "throw";
  }
  // Incoming older-or-equal -> the winner already satisfies the invariant.
  if (input.freshnessComparison <= 0) {
    return "noop";
  }
  // Incoming strictly newer -> land it (monotonic-guarded apply).
  return "apply";
}
