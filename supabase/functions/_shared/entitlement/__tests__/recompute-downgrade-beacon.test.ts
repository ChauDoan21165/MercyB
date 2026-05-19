// supabase/functions/_shared/entitlement/__tests__/recompute-downgrade-beacon.test.ts
//
// A18 §7 row 6 — unit suite for the downgrade-beacon helpers.
//
// Covers the five transitions the dispatch enumerates:
//   active   → inactive  ⇒ beacon emitted (the ONLY firing case)
//   inactive → inactive  ⇒ no beacon
//   active   → active    ⇒ no beacon
//   null     → inactive  ⇒ no beacon (no prior row to downgrade from)
//   null     → active    ⇒ no beacon (this is an UP-grade)
//
// Sentry is mocked: `addEdgeBreadcrumb` is spied via `vi.mock` so we
// assert the breadcrumb shape (category, message, level, data) and
// the count (exactly 1 on downgrade, 0 otherwise).
//
// Plus the prior-state loader's contract:
//   - row exists, is_premium=true  ⇒ true
//   - row exists, is_premium=false ⇒ false
//   - no row                       ⇒ null
//   - read error                   ⇒ null (suppress beacon for this call)
//   - thrown exception             ⇒ null (suppress, never re-throw)

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const addEdgeBreadcrumbMock = vi.fn().mockResolvedValue(undefined);
vi.mock("../../sentry.ts", () => ({
  addEdgeBreadcrumb: (...args: unknown[]) => addEdgeBreadcrumbMock(...args),
}));

import {
  emitDowngradeBeaconIfNeeded,
  loadPriorEntitlementIsPremium,
  type SupabaseClientLike,
} from "../downgradeBeacon";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const APP_ID = "mercy_blade";

beforeEach(() => {
  addEdgeBreadcrumbMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ────────────────────────────────────────────────────────────────────
 * Fake supabase client — minimal `.from(t).select().eq().eq().maybeSingle()`
 * ──────────────────────────────────────────────────────────────────── */

type MaybeSingleResult = { data: unknown; error: unknown };

function makeFakeClient(result: MaybeSingleResult | Error): SupabaseClientLike {
  return {
    from(table: string) {
      if (table !== "entitlements") {
        throw new Error(`fakeClient: unexpected table ${table}`);
      }
      // deno-lint-ignore no-explicit-any
      const chain: any = {};
      chain.select = () => chain;
      chain.eq = () => chain;
      chain.maybeSingle = () => {
        if (result instanceof Error) return Promise.reject(result);
        return Promise.resolve(result);
      };
      return chain;
    },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * emitDowngradeBeaconIfNeeded — the five transitions
 * ──────────────────────────────────────────────────────────────────── */

describe("emitDowngradeBeaconIfNeeded — transitions", () => {
  it("active → inactive: emits beacon (the only firing case)", async () => {
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "stripe-webhook",
      prevIsPremium: true,
      nextIsPremium: false,
    });

    expect(addEdgeBreadcrumbMock).toHaveBeenCalledTimes(1);
    expect(addEdgeBreadcrumbMock).toHaveBeenCalledWith({
      category: "billing.downgrade",
      message: `entitlement downgraded: ${USER_ID} (stripe-webhook)`,
      level: "warning",
      data: {
        userId: USER_ID,
        appId: APP_ID,
        reason: "stripe-webhook",
      },
    });
  });

  it("inactive → inactive: no beacon", async () => {
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "backfill",
      prevIsPremium: false,
      nextIsPremium: false,
    });
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("active → active: no beacon (still premium)", async () => {
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "stripe-webhook",
      prevIsPremium: true,
      nextIsPremium: true,
    });
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("null → inactive: no beacon (first write, never premium)", async () => {
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "backfill",
      prevIsPremium: null,
      nextIsPremium: false,
    });
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("null → active: no beacon (upgrade, not downgrade)", async () => {
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "stripe-webhook",
      prevIsPremium: null,
      nextIsPremium: true,
    });
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("inactive → active: no beacon (upgrade path)", async () => {
    // Not in the dispatch's enumerated five, but logically belongs in
    // the matrix as the "explicit upgrade" complement to active→active.
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "stripe-webhook",
      prevIsPremium: false,
      nextIsPremium: true,
    });
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("breadcrumb message includes the reason verbatim (different reasons)", async () => {
    const reasons = [
      "stripe-webhook",
      "revenuecat-webhook",
      "redeem-gift-code",
      "admin-manual-fix",
      "backfill",
    ];
    for (const reason of reasons) {
      addEdgeBreadcrumbMock.mockClear();
      await emitDowngradeBeaconIfNeeded({
        userId: USER_ID,
        appId: APP_ID,
        reason,
        prevIsPremium: true,
        nextIsPremium: false,
      });
      expect(addEdgeBreadcrumbMock).toHaveBeenCalledTimes(1);
      const [breadcrumb] = addEdgeBreadcrumbMock.mock.calls[0];
      expect(breadcrumb.message).toBe(`entitlement downgraded: ${USER_ID} (${reason})`);
      expect(breadcrumb.data.reason).toBe(reason);
    }
  });

  it("breadcrumb data carries appId override correctly", async () => {
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: "custom_app",
      reason: "admin-manual-fix",
      prevIsPremium: true,
      nextIsPremium: false,
    });
    expect(addEdgeBreadcrumbMock.mock.calls[0][0].data.appId).toBe("custom_app");
  });
});

/* ────────────────────────────────────────────────────────────────────
 * loadPriorEntitlementIsPremium — boolean | null contract
 * ──────────────────────────────────────────────────────────────────── */

describe("loadPriorEntitlementIsPremium — boolean | null contract", () => {
  it("row exists with is_premium=true ⇒ returns true", async () => {
    const client = makeFakeClient({
      data: { is_premium: true },
      error: null,
    });
    expect(await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID)).toBe(true);
  });

  it("row exists with is_premium=false ⇒ returns false", async () => {
    const client = makeFakeClient({
      data: { is_premium: false },
      error: null,
    });
    expect(await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID)).toBe(false);
  });

  it("no row (maybeSingle data=null) ⇒ returns null (no prior state)", async () => {
    const client = makeFakeClient({ data: null, error: null });
    expect(await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID)).toBeNull();
  });

  it("read error ⇒ returns null (suppress beacon for this call)", async () => {
    const client = makeFakeClient({
      data: null,
      error: new Error("RLS denied"),
    });
    expect(await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID)).toBeNull();
  });

  it("thrown exception ⇒ returns null, does NOT re-throw", async () => {
    const client = makeFakeClient(new Error("network boom"));
    expect(await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID)).toBeNull();
  });

  it("malformed row (is_premium not a boolean) ⇒ returns false (defensive)", async () => {
    // A row exists but the column came back as a string / undefined /
    // null. Treat as "not premium" rather than throwing or guessing.
    const client = makeFakeClient({
      data: { is_premium: "yes" },
      error: null,
    });
    expect(await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID)).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────
 * Composition — the way PR2 will use the two helpers together
 * ──────────────────────────────────────────────────────────────────── */

describe("composition — prior-state + emit", () => {
  it("end-to-end: row prev=true, post-recompute next=false ⇒ beacon fires", async () => {
    const client = makeFakeClient({ data: { is_premium: true }, error: null });
    const prev = await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID);
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "stripe-webhook",
      prevIsPremium: prev,
      nextIsPremium: false,
    });
    expect(addEdgeBreadcrumbMock).toHaveBeenCalledTimes(1);
  });

  it("end-to-end: no prior row, post-recompute next=false ⇒ no beacon", async () => {
    const client = makeFakeClient({ data: null, error: null });
    const prev = await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID);
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "backfill",
      prevIsPremium: prev,
      nextIsPremium: false,
    });
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("end-to-end: read error suppresses beacon even when next would have downgraded", async () => {
    const client = makeFakeClient({
      data: null,
      error: new Error("read denied"),
    });
    const prev = await loadPriorEntitlementIsPremium(client, USER_ID, APP_ID);
    expect(prev).toBeNull();
    await emitDowngradeBeaconIfNeeded({
      userId: USER_ID,
      appId: APP_ID,
      reason: "stripe-webhook",
      prevIsPremium: prev,
      nextIsPremium: false,
    });
    // Without a confirmed prior=true, we cannot assert this is a true
    // downgrade — suppress rather than emit a false-positive beacon.
    expect(addEdgeBreadcrumbMock).not.toHaveBeenCalled();
  });
});
