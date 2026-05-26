// supabase/functions/revenuecat-webhook/__tests__/projection.test.ts
//
// Locks the RevenueCat → DB projection: the code that turns an Apple/RC
// webhook event into a `subscriptions` upsert + a `profiles.tier` /
// premium_* mutation. #560 hardened the auth GATE but left the
// projection itself untested (RECON-money-path-test-coverage.md §2a/§3/
// §4 P2) — a forged-auth rejection was covered, a valid event mutating
// the WRONG tier was not. If this regresses a paying user is granted
// the wrong tier, a refund fails to revoke, or a billing-retry grace
// period silently downgrades a customer.
//
// `handleEvent` already takes the admin client as a parameter, so it is
// tested with the recording fake-client pattern from
// stripe-webhook/__tests__/idempotencyClaim.test.ts (no production
// change beyond the verbatim extraction into ../projection.ts). Every
// asserted value is documented in index.ts's header / projection.ts's
// inline comments — no guessed behavior is codified.

import { describe, expect, it, vi } from "vitest";
import {
  handleEvent,
  IAP_PRODUCT_MONTHLY,
  IAP_PRODUCT_YEARLY,
  PREMIUM_PROFILE_TIER,
  productIdToTier,
} from "../projection";
import type { RcEvent } from "../types";

type DbError = { message: string } | null;
type RecordedCall = {
  table: string;
  op: "upsert" | "update" | "select";
  row?: Record<string, unknown>;
  options?: unknown;
  values?: Record<string, unknown>;
  column?: string;
  value?: unknown;
};

/**
 * Recording fake of the supabase-js builder for the three chains the
 * projection uses:
 *   .from(t).upsert(row, opts)                          -> { error }
 *   .from(t).update(values).eq(col, val)                -> { error }
 *   .from(t).select(c).eq().eq().limit(n)               -> { data, error }
 * Every terminal call is appended to `calls` so we can assert the exact
 * money-path side-effects (tier, status, source, onConflict, ordering).
 */
function makeAdmin(
  opts: {
    upsertError?: DbError;
    updateError?: DbError;
    selectError?: DbError;
    otherActive?: unknown[];
  } = {},
) {
  const calls: RecordedCall[] = [];

  const client = {
    from(table: string) {
      return {
        upsert(row: Record<string, unknown>, options: unknown) {
          calls.push({ table, op: "upsert", row, options });
          return Promise.resolve({ error: opts.upsertError ?? null });
        },
        update(values: Record<string, unknown>) {
          return {
            eq(column: string, value: unknown) {
              calls.push({ table, op: "update", values, column, value });
              return Promise.resolve({ error: opts.updateError ?? null });
            },
          };
        },
        select(_columns: string) {
          const chain = {
            eq(_c: string, _v: unknown) {
              return chain;
            },
            limit(_n: number) {
              calls.push({ table, op: "select" });
              if (opts.selectError) {
                return Promise.resolve({ data: null, error: opts.selectError });
              }
              return Promise.resolve({
                data: opts.otherActive ?? [],
                error: null,
              });
            },
          };
          return chain;
        },
      };
    },
  } as unknown as Parameters<typeof handleEvent>[0];

  return { client, calls };
}

const USER = "11111111-2222-3333-4444-555555555555";
const EXPIRES_MS = Date.UTC(2026, 7, 1); // 2026-08-01T00:00:00.000Z
const EXPIRES_ISO = new Date(EXPIRES_MS).toISOString();

function purchaseEvent(type: string, over: Partial<RcEvent> = {}): RcEvent {
  return {
    type,
    product_id: IAP_PRODUCT_MONTHLY,
    transaction_id: "txn_1",
    original_transaction_id: "orig_1",
    expiration_at_ms: EXPIRES_MS,
    environment: "PRODUCTION",
    ...over,
  };
}

describe("productIdToTier", () => {
  it("maps the monthly product id", () => {
    expect(productIdToTier(IAP_PRODUCT_MONTHLY)).toBe("premium_monthly");
  });
  it("maps the yearly product id", () => {
    expect(productIdToTier(IAP_PRODUCT_YEARLY)).toBe("premium_yearly");
  });
  it("returns null for an unrecognised product id", () => {
    expect(productIdToTier("some.other.product")).toBeNull();
    expect(productIdToTier("")).toBeNull();
  });
});

describe("handleEvent — grant paths", () => {
  const grantTypes = [
    "INITIAL_PURCHASE",
    "RENEWAL",
    "PRODUCT_CHANGE",
    "NON_RENEWING_PURCHASE",
  ];

  it.each(grantTypes)(
    "%s upserts an active subscription and elevates the profile to the premium tier",
    async (type) => {
      const { client, calls } = makeAdmin();

      const result = await handleEvent(client, USER, purchaseEvent(type));

      expect(result).toEqual({
        action: "granted",
        type,
        product_tier: "premium_monthly",
      });

      const upsert = calls.find((c) => c.op === "upsert");
      expect(upsert?.table).toBe("subscriptions");
      expect(upsert?.options).toEqual({ onConflict: "subscription_id" });
      expect(upsert?.row).toMatchObject({
        user_id: USER,
        subscription_id: "orig_1",
        provider: "apple",
        tier: "premium_monthly",
        status: "active",
        environment: "production",
        current_period_end: EXPIRES_ISO,
        cancel_at_period_end: false,
      });

      const profUpdate = calls.find(
        (c) => c.op === "update" && c.table === "profiles",
      );
      expect(profUpdate?.column).toBe("id");
      expect(profUpdate?.value).toBe(USER);
      expect(profUpdate?.values).toEqual({
        tier: PREMIUM_PROFILE_TIER,
        premium_status: "active",
        premium_source: "apple",
        premium_expires_at: EXPIRES_ISO,
      });
    },
  );

  it("skips a purchase event with no subscription id and writes nothing", async () => {
    const { client, calls } = makeAdmin();
    const result = await handleEvent(
      client,
      USER,
      purchaseEvent("INITIAL_PURCHASE", {
        transaction_id: undefined,
        original_transaction_id: undefined,
      }),
    );
    expect(result).toEqual({ skipped: "no_subscription_id", type: "INITIAL_PURCHASE" });
    expect(calls).toHaveLength(0);
  });
});

describe("handleEvent — cancellation", () => {
  it("marks cancel_at_period_end and leaves the profile untouched", async () => {
    const { client, calls } = makeAdmin();
    const result = await handleEvent(
      client,
      USER,
      { type: "CANCELLATION", original_transaction_id: "orig_1" },
    );
    expect(result).toEqual({ action: "cancel_at_period_end", type: "CANCELLATION" });
    const upd = calls.find((c) => c.op === "update");
    expect(upd?.table).toBe("subscriptions");
    expect(upd?.column).toBe("subscription_id");
    expect(upd?.value).toBe("orig_1");
    expect(upd?.values).toMatchObject({ cancel_at_period_end: true });
    expect(typeof upd?.values?.canceled_at).toBe("string");
    expect(calls.some((c) => c.table === "profiles")).toBe(false);
  });

  it("skips cancellation with no subscription id", async () => {
    const { client, calls } = makeAdmin();
    const result = await handleEvent(client, USER, { type: "CANCELLATION" });
    expect(result).toEqual({ skipped: "no_subscription_id", type: "CANCELLATION" });
    expect(calls).toHaveLength(0);
  });
});

describe("handleEvent — expiration / refund", () => {
  it.each(["EXPIRATION", "REFUND"])(
    "%s with no other active sub ends the sub and downgrades the profile to level0",
    async (type) => {
      const { client, calls } = makeAdmin({ otherActive: [] });
      const result = await handleEvent(
        client,
        USER,
        { type, original_transaction_id: "orig_1" },
      );
      expect(result).toEqual({ action: "revoked", type });

      const subUpd = calls.find(
        (c) => c.op === "update" && c.table === "subscriptions",
      );
      expect(subUpd?.values).toMatchObject({ status: "canceled" });
      expect(typeof subUpd?.values?.ended_at).toBe("string");

      const profUpd = calls.find(
        (c) => c.op === "update" && c.table === "profiles",
      );
      expect(profUpd?.values).toEqual({
        tier: "level0",
        premium_status: "inactive",
        premium_expires_at: null,
      });
    },
  );

  it("keeps the profile when another active subscription still exists", async () => {
    const { client, calls } = makeAdmin({ otherActive: [{ id: "other" }] });
    const result = await handleEvent(
      client,
      USER,
      { type: "REFUND", original_transaction_id: "orig_1" },
    );
    expect(result).toEqual({ action: "sub_ended_profile_kept", type: "REFUND" });
    expect(calls.some((c) => c.op === "update" && c.table === "profiles")).toBe(
      false,
    );
  });

  it("still downgrades when the event carries no subscription id (no sub update issued)", async () => {
    const { client, calls } = makeAdmin({ otherActive: [] });
    const result = await handleEvent(client, USER, { type: "EXPIRATION" });
    expect(result).toEqual({ action: "revoked", type: "EXPIRATION" });
    // The `if (subscriptionId)` guard means no subscriptions.update fires.
    expect(calls.some((c) => c.op === "update" && c.table === "subscriptions"))
      .toBe(false);
    expect(calls.some((c) => c.op === "update" && c.table === "profiles")).toBe(
      true,
    );
  });
});

describe("handleEvent — billing issue & unknown", () => {
  it("marks past_due only and never touches profiles (grace period)", async () => {
    const { client, calls } = makeAdmin();
    const result = await handleEvent(
      client,
      USER,
      { type: "BILLING_ISSUE", original_transaction_id: "orig_1" },
    );
    expect(result).toEqual({ action: "past_due", type: "BILLING_ISSUE" });
    const upd = calls.find((c) => c.op === "update");
    expect(upd?.table).toBe("subscriptions");
    expect(upd?.values).toEqual({ status: "past_due" });
    expect(calls.some((c) => c.table === "profiles")).toBe(false);
  });

  it("skips a billing issue with no subscription id", async () => {
    const { client, calls } = makeAdmin();
    const result = await handleEvent(client, USER, { type: "BILLING_ISSUE" });
    expect(result).toEqual({ skipped: "no_subscription_id", type: "BILLING_ISSUE" });
    expect(calls).toHaveLength(0);
  });

  it("acknowledges an unrecognised event type without any write", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { client, calls } = makeAdmin();
    const result = await handleEvent(
      client,
      USER,
      { type: "TRANSFER", original_transaction_id: "orig_1" },
    );
    expect(result).toEqual({ action: "ignored", type: "TRANSFER" });
    expect(calls).toHaveLength(0);
    infoSpy.mockRestore();
  });
});

describe("handleEvent — DB error propagation", () => {
  it("throws a prefixed error when the subscriptions upsert fails", async () => {
    const { client } = makeAdmin({ upsertError: { message: "boom" } });
    await expect(
      handleEvent(client, USER, purchaseEvent("INITIAL_PURCHASE")),
    ).rejects.toThrow("subscriptions upsert: boom");
  });

  it("throws a prefixed error when the profile elevation fails", async () => {
    const { client } = makeAdmin({ updateError: { message: "no perms" } });
    await expect(
      handleEvent(client, USER, purchaseEvent("RENEWAL")),
    ).rejects.toThrow("profiles update: no perms");
  });

  it("throws a prefixed error when the other-active-sub check fails", async () => {
    const { client } = makeAdmin({ selectError: { message: "pg down" } });
    await expect(
      handleEvent(client, USER, {
        type: "EXPIRATION",
        original_transaction_id: "orig_1",
      }),
    ).rejects.toThrow("active sub check: pg down");
  });
});
