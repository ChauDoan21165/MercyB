// src/billing/__tests__/subscriptionRepository.test.ts
//
// A12 ratchet-2b — exercises the 4 DB functions in subscriptionRepository.ts
// via the new `client?: SupabaseLike` test seam introduced by PR
// #918 (refactor/A12-billing-seam). Plus locks the invariants from the
// dispatch brief: price_id non-coupling, single-derivation owner,
// per-provider edge cases.

import { describe, it, expect } from "vitest";
import {
  getSubscriptionsByUserId,
  hasProcessedEvent,
  insertEntitlementEvent,
  upsertSubscription,
  deriveEntitlementFromSubscriptions,
  type SupabaseLike,
} from "../subscriptionRepository";
import { computeEntitlement } from "../computeEntitlement";
import type { SubscriptionRow } from "../types";

// A minimal mock Supabase client that records every call. The
// real client surface is loose-typed (`select` returns `any`), so we
// cast through `unknown as SupabaseLike` whenever we shape it for a
// specific test.
interface MockCall {
  table: string;
  method: "select" | "insert" | "upsert" | "eq" | "maybeSingle";
  args: unknown;
}

function mockSelectableTable(rows: unknown[], error: { message: string } | null = null) {
  return {
    select: (_cols: string) => ({
      eq: (_col: string, _val: string) =>
        Promise.resolve({ data: rows, error }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
  };
}

function mockMaybeSingleTable(row: unknown | null, error: { message: string } | null = null) {
  return {
    select: (_cols: string) => ({
      eq: (_col1: string, _val1: string) => ({
        eq: (_col2: string, _val2: string) => ({
          maybeSingle: () => Promise.resolve({ data: row, error }),
        }),
      }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
  };
}

describe("getSubscriptionsByUserId — via client seam", () => {
  it("returns the data rows on a successful select", async () => {
    const rows: Partial<SubscriptionRow>[] = [
      { user_id: "u1", provider: "stripe", status: "active", current_period_end: "2099-01-01" },
    ];
    const client = {
      from: (_t: string) => mockSelectableTable(rows),
    } as unknown as SupabaseLike;

    const result = await getSubscriptionsByUserId("u1", client);
    expect(result).toEqual(rows);
  });

  it("returns [] when supabase returns null data", async () => {
    const client = {
      from: (_t: string) => mockSelectableTable(null as unknown as unknown[]),
    } as unknown as SupabaseLike;
    const result = await getSubscriptionsByUserId("u1", client);
    expect(result).toEqual([]);
  });

  it("throws with a context-rich message when supabase errors", async () => {
    const client = {
      from: (_t: string) => mockSelectableTable([], { message: "RLS denied" }),
    } as unknown as SupabaseLike;

    await expect(getSubscriptionsByUserId("u1", client)).rejects.toThrow(
      /Failed to load subscriptions: RLS denied/,
    );
  });

  it("queries the subscriptions table specifically", async () => {
    const calls: string[] = [];
    const client = {
      from: (t: string) => {
        calls.push(t);
        return mockSelectableTable([]);
      },
    } as unknown as SupabaseLike;
    await getSubscriptionsByUserId("u1", client);
    expect(calls).toContain("subscriptions");
  });
});

describe("hasProcessedEvent — via client seam", () => {
  it("returns true when the row exists", async () => {
    const client = {
      from: (_t: string) => mockMaybeSingleTable({ id: "evt-row-1" }),
    } as unknown as SupabaseLike;
    expect(await hasProcessedEvent("stripe", "evt_test_001", client)).toBe(true);
  });

  it("returns false when no row exists", async () => {
    const client = {
      from: (_t: string) => mockMaybeSingleTable(null),
    } as unknown as SupabaseLike;
    expect(await hasProcessedEvent("apple", "txid_1", client)).toBe(false);
  });

  it("returns false when data is null + no error (post-PR #774 contract)", async () => {
    const client = {
      from: (_t: string) => mockMaybeSingleTable(null),
    } as unknown as SupabaseLike;
    expect(await hasProcessedEvent("google", "purchase_1", client)).toBe(false);
  });

  it("throws on supabase error (does NOT swallow — caller decides)", async () => {
    const client = {
      from: (_t: string) => mockMaybeSingleTable(null, { message: "schema invalid" }),
    } as unknown as SupabaseLike;
    await expect(hasProcessedEvent("stripe", "evt_x", client)).rejects.toThrow(
      /Failed checking event idempotency: schema invalid/,
    );
  });
});

describe("insertEntitlementEvent — via client seam", () => {
  it("inserts the event with all required fields + null defaults", async () => {
    const calls: { table: string; values: unknown }[] = [];
    const client = {
      from: (table: string) => ({
        select: (_c: string) => ({ eq: () => Promise.resolve({}) }),
        insert: (values: unknown) => {
          calls.push({ table, values });
          return Promise.resolve({ data: null, error: null });
        },
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
    } as unknown as SupabaseLike;

    await insertEntitlementEvent(
      {
        provider: "stripe",
        event_type: "invoice.paid",
        event_id: "evt_1",
        user_id: "u1",
        payload: { foo: "bar" },
      },
      client,
    );

    expect(calls).toHaveLength(1);
    expect(calls[0].table).toBe("entitlement_events");
    expect(calls[0].values).toEqual({
      provider: "stripe",
      event_type: "invoice.paid",
      event_id: "evt_1",
      user_id: "u1",
      payload: { foo: "bar" },
    });
  });

  it("defaults user_id to null when omitted", async () => {
    const calls: { values: unknown }[] = [];
    const client = {
      from: (_t: string) => ({
        select: () => ({ eq: () => Promise.resolve({}) }),
        insert: (values: unknown) => {
          calls.push({ values });
          return Promise.resolve({ data: null, error: null });
        },
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
    } as unknown as SupabaseLike;

    await insertEntitlementEvent(
      {
        provider: "apple",
        event_type: "REFUND",
        event_id: "txid_refund_1",
        payload: { type: "refund" },
      },
      client,
    );

    expect((calls[0].values as { user_id: unknown }).user_id).toBeNull();
  });

  it("throws with context on insert failure (caller can log + retry)", async () => {
    const client = {
      from: (_t: string) => ({
        select: () => ({ eq: () => Promise.resolve({}) }),
        insert: () =>
          Promise.resolve({ data: null, error: { message: "duplicate key" } }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
    } as unknown as SupabaseLike;

    await expect(
      insertEntitlementEvent(
        { provider: "google", event_type: "RTDN", event_id: "p_1", payload: {} },
        client,
      ),
    ).rejects.toThrow(/Failed to insert entitlement event: duplicate key/);
  });
});

describe("upsertSubscription — via client seam (onConflict branching)", () => {
  it("uses 'provider,provider_subscription_id' when sub id is present", async () => {
    const upsertCalls: { table: string; values: unknown; options: unknown }[] = [];
    const client = {
      from: (table: string) => ({
        select: () => ({ eq: () => Promise.resolve({}) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: (values: unknown, options?: { onConflict?: string }) => {
          upsertCalls.push({ table, values, options });
          return Promise.resolve({ data: null, error: null });
        },
      }),
    } as unknown as SupabaseLike;

    await upsertSubscription(
      {
        user_id: "u1",
        provider: "stripe",
        provider_subscription_id: "sub_test",
        status: "active",
        current_period_end: "2099-01-01",
      },
      client,
    );

    expect(upsertCalls[0].table).toBe("subscriptions");
    expect(upsertCalls[0].options).toEqual({ onConflict: "provider,provider_subscription_id" });
  });

  it("falls back to 'provider,provider_transaction_id' when sub id is absent", async () => {
    const upsertCalls: { options: unknown }[] = [];
    const client = {
      from: (_t: string) => ({
        select: () => ({ eq: () => Promise.resolve({}) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: (_v: unknown, options?: { onConflict?: string }) => {
          upsertCalls.push({ options });
          return Promise.resolve({ data: null, error: null });
        },
      }),
    } as unknown as SupabaseLike;

    await upsertSubscription(
      {
        user_id: "u1",
        provider: "apple",
        provider_transaction_id: "txid_apple_1",
        status: "active",
        current_period_end: "2099-01-01",
      },
      client,
    );

    expect(upsertCalls[0].options).toEqual({ onConflict: "provider,provider_transaction_id" });
  });

  it("normalizes all optional fields to null/false on the upserted row", async () => {
    const upsertCalls: { values: unknown }[] = [];
    const client = {
      from: (_t: string) => ({
        select: () => ({ eq: () => Promise.resolve({}) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: (values: unknown) => {
          upsertCalls.push({ values });
          return Promise.resolve({ data: null, error: null });
        },
      }),
    } as unknown as SupabaseLike;

    await upsertSubscription(
      {
        user_id: "u1",
        provider: "google",
        status: "active",
        current_period_end: null,
      },
      client,
    );

    const row = upsertCalls[0].values as Record<string, unknown>;
    expect(row.provider_customer_id).toBeNull();
    expect(row.provider_subscription_id).toBeNull();
    expect(row.provider_transaction_id).toBeNull();
    expect(row.provider_original_transaction_id).toBeNull();
    expect(row.product_id).toBeNull();
    expect(row.environment).toBeNull();
    expect(row.cancel_at_period_end).toBe(false);
    expect(row.canceled_at).toBeNull();
    expect(row.ended_at).toBeNull();
    expect(row.raw_payload).toBeNull();
  });

  it("throws with context on upsert failure", async () => {
    const client = {
      from: (_t: string) => ({
        select: () => ({ eq: () => Promise.resolve({}) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: () =>
          Promise.resolve({ data: null, error: { message: "FK violation" } }),
      }),
    } as unknown as SupabaseLike;

    await expect(
      upsertSubscription(
        {
          user_id: "u1",
          provider: "stripe",
          provider_subscription_id: "sub_x",
          status: "active",
          current_period_end: "2099-01-01",
        },
        client,
      ),
    ).rejects.toThrow(/Failed to upsert subscription: FK violation/);
  });
});

// ─── Invariant tests (from the dispatch brief) ────────────────────────────

describe("INVARIANT: deriveEntitlementFromSubscriptions ignores price_id / product_id", () => {
  // The derivation key is (status, current_period_end, provider). If a
  // future refactor accidentally introduces a price_id branch, this test
  // catches it loudly: two rows that differ ONLY in product_id must
  // produce the same entitlement output.

  it("two rows with identical status+period+provider but different product_id → same result", () => {
    const baseA = {
      status: "active" as const,
      current_period_end: "2099-01-01T00:00:00Z",
      provider: "stripe" as const,
      product_id: "prod_old_sku",
    };
    const baseB = {
      ...baseA,
      product_id: "prod_new_sku",
    };
    expect(deriveEntitlementFromSubscriptions([baseA])).toEqual(
      deriveEntitlementFromSubscriptions([baseB]),
    );
  });

  it("the result has NO product_id / price_id field — only status/expires_at/source", () => {
    const result = deriveEntitlementFromSubscriptions([
      {
        status: "active",
        current_period_end: "2099-01-01T00:00:00Z",
        provider: "stripe",
      },
    ]);
    expect(Object.keys(result).sort()).toEqual(["expires_at", "source", "status"]);
  });
});

describe("INVARIANT: single-derivation owner (B68 — computeEntitlement delegates to deriveEntitlementFromSubscriptions)", () => {
  // The matrix has exactly ONE function that derives entitlement.
  // computeEntitlement is a thin shim. If any future refactor inlines
  // logic into computeEntitlement, the two paths diverge silently.
  // This test asserts byte-equal output for the same input.

  it.each([
    [{ status: "active", current_period_end: "2099-01-01", provider: "stripe" as const }],
    [{ status: "trialing", current_period_end: "2099-01-01", provider: "apple" as const }],
    [{ status: "expired", current_period_end: "2000-01-01", provider: "google" as const }],
  ])("computeEntitlement and deriveEntitlementFromSubscriptions agree on %j", (row) => {
    const subs = [row] as SubscriptionRow[];
    expect(computeEntitlement(subs)).toEqual(deriveEntitlementFromSubscriptions(subs));
  });

  it("agrees on multi-row + tie-break logic", () => {
    const subs: SubscriptionRow[] = [
      { user_id: "u", status: "active", current_period_end: "2050-01-01", provider: "apple" },
      { user_id: "u", status: "active", current_period_end: "2099-01-01", provider: "stripe" },
    ];
    const r1 = computeEntitlement(subs);
    const r2 = deriveEntitlementFromSubscriptions(subs);
    expect(r1).toEqual(r2);
    // The latest period_end wins:
    expect(r1.source).toBe("stripe");
    expect(r1.expires_at).toBe("2099-01-01");
  });
});

describe("INVARIANT: monotonic (same input → same output, idempotent)", () => {
  // The derivation function is pure: calling it twice with the same
  // input must produce structurally-equal output. This locks the
  // "no hidden mutation, no time-dependent branch" property.

  it("two consecutive calls with the same input produce equal results", () => {
    const subs: SubscriptionRow[] = [
      { user_id: "u", status: "active", current_period_end: "2099-01-01", provider: "stripe" },
    ];
    const a = deriveEntitlementFromSubscriptions(subs);
    const b = deriveEntitlementFromSubscriptions(subs);
    expect(a).toEqual(b);
  });

  it("re-ordering the input array does NOT change the result (set semantics)", () => {
    const rowA: Partial<SubscriptionRow> = { status: "active", current_period_end: "2099-01-01", provider: "stripe" };
    const rowB: Partial<SubscriptionRow> = { status: "active", current_period_end: "2050-01-01", provider: "apple" };
    const ab = deriveEntitlementFromSubscriptions([rowA, rowB] as SubscriptionRow[]);
    const ba = deriveEntitlementFromSubscriptions([rowB, rowA] as SubscriptionRow[]);
    expect(ab).toEqual(ba);
  });
});

describe("INVARIANT: per-provider parity", () => {
  // stripe / apple / google must all be treated identically by the
  // derivation. Same status + period → same activation; different
  // providers don't get preferential treatment.

  it.each(["stripe", "apple", "google"] as const)(
    "an active %s subscription with future period → active",
    (provider) => {
      const r = deriveEntitlementFromSubscriptions([
        { status: "active", current_period_end: "2099-01-01", provider },
      ]);
      expect(r).toEqual({ status: "active", expires_at: "2099-01-01", source: provider });
    },
  );

  it.each(["stripe", "apple", "google"] as const)(
    "an expired %s subscription → inactive",
    (provider) => {
      const r = deriveEntitlementFromSubscriptions([
        { status: "expired", current_period_end: "2099-01-01", provider },
      ]);
      expect(r.status).toBe("inactive");
      expect(r.source).toBeNull();
    },
  );
});

describe("deriveEntitlementFromSubscriptions — edge cases", () => {
  it("empty array → inactive", () => {
    const r = deriveEntitlementFromSubscriptions([]);
    expect(r).toEqual({ status: "inactive", expires_at: null, source: null });
  });

  it("only non-entitling statuses (expired/revoked/paused) → inactive", () => {
    const r = deriveEntitlementFromSubscriptions([
      { status: "expired", current_period_end: "2099-01-01", provider: "stripe" },
      { status: "revoked", current_period_end: "2099-01-01", provider: "apple" },
      { status: "paused", current_period_end: "2099-01-01", provider: "google" },
    ]);
    expect(r.status).toBe("inactive");
  });

  it("trialing / grace_period / past_due all count as entitling", () => {
    for (const status of ["trialing", "grace_period", "past_due"] as const) {
      const r = deriveEntitlementFromSubscriptions([
        { status, current_period_end: "2099-01-01", provider: "stripe" },
      ]);
      expect(r.status).toBe("active");
    }
  });

  it("when periods tie, the FIRST entitling row wins (order-stable iteration)", () => {
    // Both rows have the same current_period_end → toMillis equal →
    // the strict `>` comparison fails on the second row → first wins.
    const r = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: "2099-01-01", provider: "apple" },
      { status: "active", current_period_end: "2099-01-01", provider: "stripe" },
    ]);
    expect(r.source).toBe("apple");
  });

  it("a row with null current_period_end loses to a row with a date (toMillis(-Infinity))", () => {
    const r = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: null, provider: "apple" },
      { status: "active", current_period_end: "2099-01-01", provider: "stripe" },
    ]);
    expect(r.source).toBe("stripe");
  });

  it("a row with invalid (unparseable) date loses to a row with a parseable date", () => {
    const r = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: "not-a-date", provider: "apple" },
      { status: "active", current_period_end: "2099-01-01", provider: "stripe" },
    ]);
    expect(r.source).toBe("stripe");
  });

  it("when ALL active rows have null period, the first one still wins (no winner == null skipped)", () => {
    const r = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: null, provider: "apple" },
      { status: "active", current_period_end: null, provider: "stripe" },
    ]);
    // Both equal at -Infinity; first row wins per the strict >.
    expect(r.status).toBe("active");
    expect(r.source).toBe("apple");
    expect(r.expires_at).toBeNull();
  });
});
