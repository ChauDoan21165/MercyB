// Hardening unit tests for src/billing/subscriptionRepository.ts
//
// Covers the pure entitlement-derivation logic plus all four
// Supabase-backed repository functions via the injected `client?`
// test seam (the default path goes through a runtime-constructed
// dynamic import that vi.mock cannot intercept — injecting a fake
// SupabaseLike is the documented way to unit-test the read/write
// paths; see the JSDoc on getSubscriptionsByUserId).

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  deriveEntitlementFromSubscriptions,
  getSubscriptionsByUserId,
  hasProcessedEvent,
  insertEntitlementEvent,
  upsertSubscription,
  type EntitlementSnapshot,
  type EntitlementEventInput,
  type UpsertSubscriptionInput,
  type SupabaseLike,
} from "../subscriptionRepository";
import type { SubscriptionRow } from "../types";

const FUTURE = "2099-01-01T00:00:00.000Z";
const FAR_FUTURE = "2100-06-15T12:00:00.000Z";
const PAST = "2000-01-01T00:00:00.000Z";

// ---------------------------------------------------------------------------
// Fake Supabase client builders
// ---------------------------------------------------------------------------

type QueryResult = { data?: unknown; error?: { message: string } | null };

/**
 * Builds a SupabaseLike whose `.select(...).eq(...)` chain resolves to the
 * given result (used by getSubscriptionsByUserId — terminal `.eq`).
 * The returned object records the calls for assertions.
 */
function makeSelectEqClient(result: QueryResult) {
  const calls = {
    from: [] as string[],
    select: [] as string[],
    eq: [] as Array<[string, unknown]>,
  };

  const builder = {
    select(columns: string) {
      calls.select.push(columns);
      return {
        eq: (column: string, value: unknown) => {
          calls.eq.push([column, value]);
          // getSubscriptionsByUserId awaits the result of .eq directly.
          return Promise.resolve(result);
        },
      };
    },
  };

  const client: SupabaseLike = {
    from(table: string) {
      calls.from.push(table);
      return builder as unknown as ReturnType<SupabaseLike["from"]>;
    },
  };

  return { client, calls };
}

/**
 * Builds a SupabaseLike whose `.select().eq().eq().maybeSingle()` chain
 * resolves to the given result (used by hasProcessedEvent).
 */
function makeMaybeSingleClient(result: QueryResult) {
  const calls = {
    from: [] as string[],
    eq: [] as Array<[string, unknown]>,
    maybeSingleCount: 0,
  };

  const eqable: unknown = {
    eq(column: string, value: unknown) {
      calls.eq.push([column, value]);
      return eqable;
    },
    maybeSingle() {
      calls.maybeSingleCount += 1;
      return Promise.resolve(result);
    },
  };

  const client: SupabaseLike = {
    from(table: string) {
      calls.from.push(table);
      return {
        select: (_columns: string) => eqable,
      } as unknown as ReturnType<SupabaseLike["from"]>;
    },
  };

  return { client, calls };
}

/**
 * Builds a SupabaseLike that records insert/upsert calls and resolves them
 * to the given result.
 */
function makeWriteClient(result: QueryResult) {
  const calls = {
    from: [] as string[],
    insert: [] as unknown[],
    upsert: [] as Array<{ values: unknown; options?: { onConflict?: string } }>,
  };

  const client: SupabaseLike = {
    from(table: string) {
      calls.from.push(table);
      return {
        insert(values: unknown) {
          calls.insert.push(values);
          return Promise.resolve(result);
        },
        upsert(values: unknown, options?: { onConflict?: string }) {
          calls.upsert.push({ values, options });
          return Promise.resolve(result);
        },
      } as unknown as ReturnType<SupabaseLike["from"]>;
    },
  };

  return { client, calls };
}

// ===========================================================================
// deriveEntitlementFromSubscriptions
// ===========================================================================

describe("deriveEntitlementFromSubscriptions", () => {
  it("returns inactive for an empty list", () => {
    const snapshot = deriveEntitlementFromSubscriptions([]);
    expect(snapshot).toEqual<EntitlementSnapshot>({
      status: "inactive",
      expires_at: null,
      source: null,
    });
  });

  it.each(["active", "trialing", "grace_period", "past_due"] as const)(
    "treats status %s as entitling",
    (status) => {
      const snapshot = deriveEntitlementFromSubscriptions([
        { status, current_period_end: FUTURE, provider: "stripe" },
      ]);
      expect(snapshot.status).toBe("active");
      expect(snapshot.expires_at).toBe(FUTURE);
      expect(snapshot.source).toBe("stripe");
    },
  );

  it.each(["paused", "expired", "revoked"] as const)(
    "treats status %s as non-entitling",
    (status) => {
      const snapshot = deriveEntitlementFromSubscriptions([
        { status, current_period_end: FUTURE, provider: "stripe" },
      ]);
      expect(snapshot).toEqual<EntitlementSnapshot>({
        status: "inactive",
        expires_at: null,
        source: null,
      });
    },
  );

  it("ignores non-entitling rows even when they have a later period end", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "expired", current_period_end: FAR_FUTURE, provider: "apple" },
      { status: "active", current_period_end: FUTURE, provider: "stripe" },
    ]);
    expect(snapshot.status).toBe("active");
    expect(snapshot.expires_at).toBe(FUTURE);
    expect(snapshot.source).toBe("stripe");
  });

  it("picks the entitling subscription with the latest current_period_end", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: FUTURE, provider: "stripe" },
      { status: "trialing", current_period_end: FAR_FUTURE, provider: "google" },
      { status: "past_due", current_period_end: PAST, provider: "apple" },
    ]);
    expect(snapshot.status).toBe("active");
    expect(snapshot.expires_at).toBe(FAR_FUTURE);
    expect(snapshot.source).toBe("google");
  });

  it("keeps the first winner when a later candidate has an equal period end (strict >)", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: FUTURE, provider: "stripe" },
      { status: "active", current_period_end: FUTURE, provider: "apple" },
    ]);
    // Strictly-greater comparison means the first encountered wins on a tie.
    expect(snapshot.source).toBe("stripe");
    expect(snapshot.expires_at).toBe(FUTURE);
  });

  it("treats a null current_period_end as negative-infinity (loses to any dated row)", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: null, provider: "stripe" },
      { status: "active", current_period_end: PAST, provider: "apple" },
    ]);
    expect(snapshot.source).toBe("apple");
    expect(snapshot.expires_at).toBe(PAST);
  });

  it("returns active with null expires_at when the only entitling row has a null period end", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: null, provider: "stripe" },
    ]);
    expect(snapshot.status).toBe("active");
    expect(snapshot.expires_at).toBeNull();
    expect(snapshot.source).toBe("stripe");
  });

  it("treats an undefined current_period_end like null", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      // current_period_end intentionally omitted
      { status: "active", provider: "stripe" } as Pick<
        SubscriptionRow,
        "status" | "current_period_end" | "provider"
      >,
    ]);
    expect(snapshot.status).toBe("active");
    expect(snapshot.expires_at).toBeNull();
    expect(snapshot.source).toBe("stripe");
  });

  it("treats an unparseable date string as negative-infinity", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "active", current_period_end: "not-a-date", provider: "stripe" },
      { status: "active", current_period_end: PAST, provider: "apple" },
    ]);
    expect(snapshot.source).toBe("apple");
    expect(snapshot.expires_at).toBe(PAST);
  });

  it("returns inactive when every subscription is non-entitling", () => {
    const snapshot = deriveEntitlementFromSubscriptions([
      { status: "expired", current_period_end: FUTURE, provider: "stripe" },
      { status: "revoked", current_period_end: FAR_FUTURE, provider: "apple" },
      { status: "paused", current_period_end: FUTURE, provider: "google" },
    ]);
    expect(snapshot.status).toBe("inactive");
    expect(snapshot.expires_at).toBeNull();
    expect(snapshot.source).toBeNull();
  });
});

// ===========================================================================
// getSubscriptionsByUserId
// ===========================================================================

describe("getSubscriptionsByUserId", () => {
  it("queries the subscriptions table filtered by user_id and returns rows", async () => {
    const rows: SubscriptionRow[] = [
      { user_id: "u-1", provider: "stripe", status: "active", current_period_end: FUTURE },
    ];
    const { client, calls } = makeSelectEqClient({ data: rows, error: null });

    const result = await getSubscriptionsByUserId("u-1", client);

    expect(result).toEqual(rows);
    expect(calls.from).toEqual(["subscriptions"]);
    expect(calls.eq).toEqual([["user_id", "u-1"]]);
    expect(calls.select[0]).toContain("user_id");
    expect(calls.select[0]).toContain("current_period_end");
  });

  it("returns an empty array when data is null", async () => {
    const { client } = makeSelectEqClient({ data: null, error: null });
    const result = await getSubscriptionsByUserId("u-1", client);
    expect(result).toEqual([]);
  });

  it("returns an empty array when data is undefined", async () => {
    const { client } = makeSelectEqClient({ error: null });
    const result = await getSubscriptionsByUserId("u-1", client);
    expect(result).toEqual([]);
  });

  it("throws a wrapped error when the query fails", async () => {
    const { client } = makeSelectEqClient({ error: { message: "boom" } });
    await expect(getSubscriptionsByUserId("u-1", client)).rejects.toThrow(
      "Failed to load subscriptions: boom",
    );
  });
});

// ===========================================================================
// hasProcessedEvent
// ===========================================================================

describe("hasProcessedEvent", () => {
  it("returns true when a matching row exists", async () => {
    const { client, calls } = makeMaybeSingleClient({
      data: { id: "evt-row-1" },
      error: null,
    });

    const result = await hasProcessedEvent("stripe", "evt-123", client);

    expect(result).toBe(true);
    expect(calls.from).toEqual(["entitlement_events"]);
    expect(calls.eq).toEqual([
      ["provider", "stripe"],
      ["event_id", "evt-123"],
    ]);
    expect(calls.maybeSingleCount).toBe(1);
  });

  it("returns false when no row exists (null data)", async () => {
    const { client } = makeMaybeSingleClient({ data: null, error: null });
    const result = await hasProcessedEvent("apple", "evt-x", client);
    expect(result).toBe(false);
  });

  it("returns false when data is undefined", async () => {
    const { client } = makeMaybeSingleClient({ error: null });
    const result = await hasProcessedEvent("google", "evt-y", client);
    expect(result).toBe(false);
  });

  it("throws a wrapped error when the idempotency check fails", async () => {
    const { client } = makeMaybeSingleClient({ error: { message: "db down" } });
    await expect(hasProcessedEvent("stripe", "evt-1", client)).rejects.toThrow(
      "Failed checking event idempotency: db down",
    );
  });
});

// ===========================================================================
// insertEntitlementEvent
// ===========================================================================

describe("insertEntitlementEvent", () => {
  const baseInput: EntitlementEventInput = {
    provider: "stripe",
    event_type: "invoice.paid",
    event_id: "evt-1",
    user_id: "u-1",
    payload: { foo: "bar" },
  };

  it("inserts the event into entitlement_events with all fields", async () => {
    const { client, calls } = makeWriteClient({ error: null });

    await expect(
      insertEntitlementEvent(baseInput, client),
    ).resolves.toBeUndefined();

    expect(calls.from).toEqual(["entitlement_events"]);
    expect(calls.insert).toEqual([
      {
        provider: "stripe",
        event_type: "invoice.paid",
        event_id: "evt-1",
        user_id: "u-1",
        payload: { foo: "bar" },
      },
    ]);
  });

  it("defaults a missing user_id to null", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    const { user_id: _omit, ...withoutUser } = baseInput;

    await insertEntitlementEvent(withoutUser, client);

    expect((calls.insert[0] as { user_id: unknown }).user_id).toBeNull();
  });

  it("coerces an explicit null user_id to null", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    await insertEntitlementEvent({ ...baseInput, user_id: null }, client);
    expect((calls.insert[0] as { user_id: unknown }).user_id).toBeNull();
  });

  it("throws a wrapped error when the insert fails", async () => {
    const { client } = makeWriteClient({ error: { message: "conflict" } });
    await expect(insertEntitlementEvent(baseInput, client)).rejects.toThrow(
      "Failed to insert entitlement event: conflict",
    );
  });
});

// ===========================================================================
// upsertSubscription
// ===========================================================================

describe("upsertSubscription", () => {
  const fullInput: UpsertSubscriptionInput = {
    user_id: "u-1",
    provider: "stripe",
    provider_customer_id: "cus_1",
    provider_subscription_id: "sub_1",
    provider_transaction_id: "in_1",
    provider_original_transaction_id: "sub_root_1",
    product_id: "prod_1",
    environment: "production",
    status: "active",
    current_period_start: PAST,
    current_period_end: FUTURE,
    cancel_at_period_end: true,
    canceled_at: null,
    ended_at: null,
    raw_payload: { hello: "world" },
  };

  it("upserts the subscriptions table with a fully-populated row", async () => {
    const { client, calls } = makeWriteClient({ error: null });

    await expect(
      upsertSubscription(fullInput, client),
    ).resolves.toBeUndefined();

    expect(calls.from).toEqual(["subscriptions"]);
    expect(calls.upsert).toHaveLength(1);
    expect(calls.upsert[0].values).toEqual({
      user_id: "u-1",
      provider: "stripe",
      provider_customer_id: "cus_1",
      provider_subscription_id: "sub_1",
      provider_transaction_id: "in_1",
      provider_original_transaction_id: "sub_root_1",
      product_id: "prod_1",
      environment: "production",
      status: "active",
      current_period_start: PAST,
      current_period_end: FUTURE,
      cancel_at_period_end: true,
      canceled_at: null,
      ended_at: null,
      raw_payload: { hello: "world" },
    });
  });

  it("uses provider,provider_subscription_id as the conflict target when subscription id is present", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    await upsertSubscription(fullInput, client);
    expect(calls.upsert[0].options).toEqual({
      onConflict: "provider,provider_subscription_id",
    });
  });

  it("falls back to provider,provider_transaction_id when subscription id is null", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    await upsertSubscription(
      { ...fullInput, provider_subscription_id: null },
      client,
    );
    expect(calls.upsert[0].options).toEqual({
      onConflict: "provider,provider_transaction_id",
    });
  });

  it("falls back to provider,provider_transaction_id when subscription id is omitted", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    const { provider_subscription_id: _omit, ...withoutSubId } = fullInput;
    await upsertSubscription(withoutSubId, client);
    expect(calls.upsert[0].options).toEqual({
      onConflict: "provider,provider_transaction_id",
    });
  });

  it("treats an empty-string subscription id as present (!= null) for conflict target", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    await upsertSubscription(
      { ...fullInput, provider_subscription_id: "" },
      client,
    );
    // The guard is `!= null`, so an empty string still selects the
    // subscription-id conflict target.
    expect(calls.upsert[0].options).toEqual({
      onConflict: "provider,provider_subscription_id",
    });
  });

  it("applies defaults for all optional fields on a minimal input", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    const minimal: UpsertSubscriptionInput = {
      user_id: "u-2",
      provider: "apple",
      status: "trialing",
      current_period_end: null,
    };

    await upsertSubscription(minimal, client);

    expect(calls.upsert[0].values).toEqual({
      user_id: "u-2",
      provider: "apple",
      provider_customer_id: null,
      provider_subscription_id: null,
      provider_transaction_id: null,
      provider_original_transaction_id: null,
      product_id: null,
      environment: null,
      status: "trialing",
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      canceled_at: null,
      ended_at: null,
      raw_payload: null,
    });
    // No subscription id and no transaction id → falls back to the
    // transaction-id conflict target.
    expect(calls.upsert[0].options).toEqual({
      onConflict: "provider,provider_transaction_id",
    });
  });

  it("preserves an explicit false cancel_at_period_end (does not flip to default)", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    await upsertSubscription(
      { ...fullInput, cancel_at_period_end: false },
      client,
    );
    expect(
      (calls.upsert[0].values as { cancel_at_period_end: unknown })
        .cancel_at_period_end,
    ).toBe(false);
  });

  it("defaults a null cancel_at_period_end to false", async () => {
    const { client, calls } = makeWriteClient({ error: null });
    await upsertSubscription(
      { ...fullInput, cancel_at_period_end: null },
      client,
    );
    expect(
      (calls.upsert[0].values as { cancel_at_period_end: unknown })
        .cancel_at_period_end,
    ).toBe(false);
  });

  it("throws a wrapped error when the upsert fails", async () => {
    const { client } = makeWriteClient({ error: { message: "rls denied" } });
    await expect(upsertSubscription(fullInput, client)).rejects.toThrow(
      "Failed to upsert subscription: rls denied",
    );
  });
});

// ===========================================================================
// Default-client path (no injected client) — exercises getSupabase()
// ===========================================================================

describe("default client resolution (getSupabase)", () => {
  // The default path constructs a dynamic import at runtime via
  // Function("path","return import(path)"). vi.mock cannot intercept it,
  // so the import of "@/integrations/supabase/client" rejects in the test
  // environment. We assert the functions surface that rejection rather than
  // silently swallowing it — proving the default branch is reachable.
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getSubscriptionsByUserId attempts the dynamic import when no client is injected", async () => {
    await expect(getSubscriptionsByUserId("u-1")).rejects.toBeDefined();
  });

  it("hasProcessedEvent attempts the dynamic import when no client is injected", async () => {
    await expect(hasProcessedEvent("stripe", "evt-1")).rejects.toBeDefined();
  });
});
