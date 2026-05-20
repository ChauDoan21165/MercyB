// supabase/functions/stripe-webhook/__tests__/finalizeSubscriptionProcessing.test.ts
//
// A18 PR2 smoke + failure-propagation tests for the rewired
// `finalizeSubscriptionProcessing`. Locks two contracts:
//
//   1. SMOKE — when `shouldRecomputeBeforeFinalMark = true`, the
//      function calls `recomputeEntitlement` exactly once, passing
//      the supabase client, the userId, and `{reason: "stripe-webhook"}`.
//      This is the load-bearing invariant of the rewire: the Sentry
//      `tags.reason` filter on the dashboard relies on stripe webhook
//      writes carrying the literal `"stripe-webhook"` string.
//
//   2. FAILURE PROPAGATION — when `recomputeEntitlement` rejects, the
//      outer `finalizeSubscriptionProcessing` call rejects with the
//      SAME error. There is NO try/catch and NO console.warn swallow
//      (A18 §7 forbids the swallow class; pre-PR2 there WAS a swallow
//      at the old `billing.ts:646-651`, deleted here). This test
//      proves the swallow is gone — if a future change re-introduces
//      a catch, this test fails.
//
//   3. SKIP — when `shouldRecomputeBeforeFinalMark = false`, the
//      function MUST NOT call `recomputeEntitlement` (the caller
//      explicitly opted out). The post-recompute path
//      (`markEntitlementEventProcessed`) still runs.
//
// The test does NOT re-cover `recomputeEntitlement`'s own behavior
// (idempotency, monotonic guard, gift inconsistency, downgrade
// beacon) — those are locked by the 26-case suite in
// `_shared/entitlement/__tests__/recompute.test.ts` shipped by #864.
// Duplicating that here would be the dead-test-wiring trap.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const recomputeEntitlementMock = vi.fn();

vi.mock("../../_shared/entitlement/recompute.ts", () => ({
  recomputeEntitlement: (...args: unknown[]) => recomputeEntitlementMock(...args),
}));

import { finalizeSubscriptionProcessing } from "../billing";

const USER_ID = "00000000-0000-4000-8000-000000000001";

type FakeSupabase = {
  from: (table: string) => {
    insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
};

interface RecordedInserts {
  entitlementEvents: Array<Record<string, unknown>>;
}

function makeFakeSupabase(
  insertResult: { error: unknown } = { error: null },
): { supabase: FakeSupabase; calls: RecordedInserts } {
  const calls: RecordedInserts = { entitlementEvents: [] };
  const supabase: FakeSupabase = {
    from(table: string) {
      return {
        insert(row: Record<string, unknown>) {
          if (table === "entitlement_events") {
            calls.entitlementEvents.push(row);
          }
          return Promise.resolve(insertResult);
        },
      };
    },
  };
  return { supabase, calls };
}

function makeStripeEvent() {
  return {
    id: "evt_test_1",
    type: "customer.subscription.updated",
    livemode: false,
  } as unknown as Parameters<typeof finalizeSubscriptionProcessing>[0]["event"];
}

beforeEach(() => {
  recomputeEntitlementMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("finalizeSubscriptionProcessing — A18 PR2 wiring", () => {
  it("SMOKE: calls recomputeEntitlement with the supabase client, userId, and reason='stripe-webhook'", async () => {
    recomputeEntitlementMock.mockResolvedValue({
      user_id: USER_ID,
      app_id: "mercy_blade",
      status: "active",
      source: "stripe",
      expires_at: null,
      is_premium: true,
      computed_at: "2026-05-20T00:00:00.000Z",
      updated_at: "2026-05-20T00:00:00.000Z",
    });

    const { supabase, calls } = makeFakeSupabase();
    const result = await finalizeSubscriptionProcessing({
      // deno-lint-ignore no-explicit-any
      supabase: supabase as any,
      userId: USER_ID,
      event: makeStripeEvent(),
      shouldRecomputeBeforeFinalMark: true,
    });

    // Exactly one recompute call.
    expect(recomputeEntitlementMock).toHaveBeenCalledTimes(1);
    const [passedSupabase, passedUserId, passedOpts] = recomputeEntitlementMock.mock.calls[0];

    // Same supabase client object (NOT a wrapper / re-bind).
    expect(passedSupabase).toBe(supabase);
    expect(passedUserId).toBe(USER_ID);
    // The literal reason string is load-bearing for the Sentry tag.
    expect(passedOpts).toEqual({ reason: "stripe-webhook" });

    // Post-recompute path ran: one entitlement_events insert.
    expect(calls.entitlementEvents).toHaveLength(1);
    expect(calls.entitlementEvents[0].user_id).toBe(USER_ID);
    expect(calls.entitlementEvents[0].event_id).toBe("evt_test_1");

    // Function returns true on a fresh (non-duplicate) insert.
    expect(result).toBe(true);
  });

  it("SKIP: shouldRecomputeBeforeFinalMark=false ⇒ recompute NOT called, mark still runs", async () => {
    const { supabase, calls } = makeFakeSupabase();
    const result = await finalizeSubscriptionProcessing({
      // deno-lint-ignore no-explicit-any
      supabase: supabase as any,
      userId: USER_ID,
      event: makeStripeEvent(),
      shouldRecomputeBeforeFinalMark: false,
    });

    expect(recomputeEntitlementMock).not.toHaveBeenCalled();
    // markEntitlementEventProcessed still runs.
    expect(calls.entitlementEvents).toHaveLength(1);
    expect(result).toBe(true);
  });

  it("FAILURE PROPAGATION: recompute throw propagates verbatim — NO try/catch swallow", async () => {
    const recomputeErr = new Error("stripe-webhook: RPC upsert failed");
    recomputeEntitlementMock.mockRejectedValue(recomputeErr);

    const { supabase, calls } = makeFakeSupabase();

    // The same error object the mock threw must surface at the call
    // site. Pre-PR2 the old code path swallowed this and returned
    // mark's result; that swallow is gone.
    await expect(
      finalizeSubscriptionProcessing({
        // deno-lint-ignore no-explicit-any
        supabase: supabase as any,
        userId: USER_ID,
        event: makeStripeEvent(),
        shouldRecomputeBeforeFinalMark: true,
      }),
    ).rejects.toBe(recomputeErr);

    // The post-recompute mark MUST NOT have run — the throw aborted
    // the function before reaching markEntitlementEventProcessed.
    // (Pre-PR2 the swallow meant mark DID run after a failed
    // recompute — leaving the entitlement_events row recorded even
    // though the actual entitlement write failed.)
    expect(calls.entitlementEvents).toHaveLength(0);
  });

  it("FAILURE PROPAGATION: non-Error rejection is preserved (no normalization)", async () => {
    // Defensive: recomputeEntitlement promises to throw, but its
    // captured supabase / RPC errors may be plain objects, not Error
    // instances. The propagation MUST NOT wrap or rewrite them.
    recomputeEntitlementMock.mockRejectedValue({ code: "PGRST301", message: "denied" });

    const { supabase } = makeFakeSupabase();
    await expect(
      finalizeSubscriptionProcessing({
        // deno-lint-ignore no-explicit-any
        supabase: supabase as any,
        userId: USER_ID,
        event: makeStripeEvent(),
        shouldRecomputeBeforeFinalMark: true,
      }),
    ).rejects.toEqual({ code: "PGRST301", message: "denied" });
  });

  it("returns false when entitlement_events insert reports a duplicate (idempotent webhook replay)", async () => {
    recomputeEntitlementMock.mockResolvedValue({});
    // 23505 = unique_violation. The existing helper
    // `isDuplicateEventInsertError` recognizes it.
    const duplicateError = { code: "23505", message: "duplicate key" };
    const { supabase } = makeFakeSupabase({ error: duplicateError });

    const result = await finalizeSubscriptionProcessing({
      // deno-lint-ignore no-explicit-any
      supabase: supabase as any,
      userId: USER_ID,
      event: makeStripeEvent(),
      shouldRecomputeBeforeFinalMark: true,
    });

    // Recompute still ran (the row IS up-to-date; the duplicate is
    // only on the audit table).
    expect(recomputeEntitlementMock).toHaveBeenCalledTimes(1);
    // mark returns false on duplicate → caller knows replay was a no-op.
    expect(result).toBe(false);
  });
});
