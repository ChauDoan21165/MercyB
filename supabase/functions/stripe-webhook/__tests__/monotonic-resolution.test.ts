// monotonic-resolution.test.ts
//
// Born-tested guard for the graceful terminal resolution that replaces the
// `Failed to apply monotonic Stripe subscription update after concurrent
// modifications` throw in upsertSharedSubscriptionMonotonic (billing.ts). The
// throw was the intermittent HTTP 500 on invoice.paid / customer.subscription
// .updated when Stripe fired both near-simultaneously for one subscription.
//
// billing.ts transitively imports Deno-only code and cannot load under vitest,
// so the decision core lives in the Deno-free monotonic-resolution.ts and is
// tested here. We model two concurrent events racing the same subscription and
// assert: both resolve WITHOUT a 500, the final row is the NEWER one, an older
// event never regresses it, and we only throw on the true impossibility.

import { describe, expect, it } from "vitest";

import {
  type MonotonicExhaustionAction,
  resolveMonotonicExhaustion,
} from "../monotonic-resolution";

type Row = { current_period_end_ms: number | null };

/**
 * Stand-in for `compareStripeFreshness(incoming, persisted)`: the exhausted
 * event vs. whatever won the race. The real comparator is richer
 * (object_time_ms → event_created → priority), but only its SIGN drives the
 * terminal decision, and current_period_end moves monotonically with it here.
 */
function freshnessSign(incomingMs: number, persistedMs: number): number {
  if (incomingMs === persistedMs) return 0;
  return incomingMs > persistedMs ? 1 : -1;
}

/** Model the row after the terminal decision is carried out. */
function applyDecision(
  persisted: Row,
  incomingPeriodEndMs: number,
  action: MonotonicExhaustionAction,
): Row {
  // "apply" advances to the incoming (newer) period; "noop" keeps the winner's
  // already-persisted (equal-or-newer) period. "throw" never reaches here in the
  // two-events scenarios (the row is always readable).
  return action === "apply"
    ? { current_period_end_ms: incomingPeriodEndMs }
    : persisted;
}

describe("resolveMonotonicExhaustion — two concurrent events on one subscription", () => {
  it("older loser resolves without a 500 (noop) and does NOT regress the newer row", () => {
    // The newer event B (period_end 200) won the CAS and is persisted; the older
    // event A (100) exhausted its retries.
    const persisted: Row = { current_period_end_ms: 200 };
    const incomingA = 100;

    const action = resolveMonotonicExhaustion({
      hasLatest: true,
      freshnessComparison: freshnessSign(incomingA, 200), // -1
    });

    expect(action).toBe("noop");
    expect(action).not.toBe("throw"); // resolves -> no 500
    expect(applyDecision(persisted, incomingA, action).current_period_end_ms).toBe(
      200,
    ); // newer preserved; older never regresses it
  });

  it("newer loser resolves (apply) and the final row is the newer one", () => {
    // The older event A (100) won the CAS and is persisted; the newer event B
    // (200) exhausted its retries but must still land.
    const persisted: Row = { current_period_end_ms: 100 };
    const incomingB = 200;

    const action = resolveMonotonicExhaustion({
      hasLatest: true,
      freshnessComparison: freshnessSign(incomingB, 100), // +1
    });

    expect(action).toBe("apply");
    expect(applyDecision(persisted, incomingB, action).current_period_end_ms).toBe(
      200,
    ); // final row is the newer one
  });

  it("equal-freshness duplicate resolves as noop (no 500, no redundant overwrite)", () => {
    expect(
      resolveMonotonicExhaustion({ hasLatest: true, freshnessComparison: 0 }),
    ).toBe("noop");
  });

  it("BOTH racing events resolve without a 500, whichever won", () => {
    const pairs: ReadonlyArray<readonly [number, number]> = [
      [100, 200], // older loser
      [200, 100], // newer loser
      [150, 150], // dead heat
    ];
    for (const [incoming, persisted] of pairs) {
      const action = resolveMonotonicExhaustion({
        hasLatest: true,
        freshnessComparison: freshnessSign(incoming, persisted),
      });
      expect(action).not.toBe("throw"); // readable row -> never a 500
    }
  });

  it("the final row is always the monotonic max — an older event can never regress it", () => {
    const pairs: ReadonlyArray<readonly [number, number]> = [
      [100, 200],
      [200, 100],
      [150, 150],
    ];
    for (const [incoming, persisted] of pairs) {
      const row: Row = { current_period_end_ms: persisted };
      const action = resolveMonotonicExhaustion({
        hasLatest: true,
        freshnessComparison: freshnessSign(incoming, persisted),
      });
      expect(applyDecision(row, incoming, action).current_period_end_ms).toBe(
        Math.max(incoming, persisted),
      );
    }
  });

  it("only throws on the true impossibility: the row vanished (no latest)", () => {
    expect(
      resolveMonotonicExhaustion({ hasLatest: false, freshnessComparison: null }),
    ).toBe("throw");
    // A stale non-null comparison must not override an absent row.
    expect(
      resolveMonotonicExhaustion({ hasLatest: false, freshnessComparison: 1 }),
    ).toBe("throw");
  });

  it("defensive: hasLatest true but null comparison is treated as throw", () => {
    expect(
      resolveMonotonicExhaustion({ hasLatest: true, freshnessComparison: null }),
    ).toBe("throw");
  });
});
