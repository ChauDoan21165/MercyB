// src/billing/computeEntitlement.corporate.test.ts
//
// Pins the corporate-seat entitlement projection: lookup contract,
// active vs inactive account, missing-stripe-link short-circuit, and
// the never-throws guarantee. Subscription-based entitlement is
// covered separately by computeEntitlement.test.ts.

import { describe, expect, it, vi } from "vitest";

import {
  getCorporateSeatEntitlement,
  isCorporateSeat,
  type CorporateEntitlementSupabase,
} from "./computeEntitlement";

type MockReturns = {
  seats?: { data: unknown; error: unknown };
  accounts?: { data: unknown; error: unknown };
};

function buildSupabase(returns: MockReturns): CorporateEntitlementSupabase {
  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => {
            if (table === "corporate_seats") {
              return returns.seats ?? { data: null, error: null };
            }
            if (table === "corporate_accounts") {
              return returns.accounts ?? { data: null, error: null };
            }
            return { data: null, error: null };
          }),
        })),
      })),
    })),
  };
}

describe("isCorporateSeat", () => {
  it("returns false on empty user id without hitting the network", async () => {
    const supabase = buildSupabase({});
    expect(await isCorporateSeat("", supabase)).toBe(false);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("returns true when a seat row exists", async () => {
    const supabase = buildSupabase({
      seats: { data: { corporate_account_id: "acc-1" }, error: null },
    });
    expect(await isCorporateSeat("user-1", supabase)).toBe(true);
  });

  it("returns false when no seat row exists", async () => {
    const supabase = buildSupabase({ seats: { data: null, error: null } });
    expect(await isCorporateSeat("user-1", supabase)).toBe(false);
  });

  it("returns false on RLS / network error rather than throwing", async () => {
    const supabase = buildSupabase({
      seats: { data: null, error: { message: "RLS denied" } },
    });
    expect(await isCorporateSeat("user-1", supabase)).toBe(false);
  });
});

describe("getCorporateSeatEntitlement", () => {
  it("returns null when the user has no seat", async () => {
    const supabase = buildSupabase({ seats: { data: null, error: null } });
    expect(await getCorporateSeatEntitlement("user-1", supabase)).toBeNull();
  });

  it("returns active stripe entitlement when account is active + stripe-linked", async () => {
    const supabase = buildSupabase({
      seats: { data: { corporate_account_id: "acc-1" }, error: null },
      accounts: {
        data: {
          id: "acc-1",
          active: true,
          stripe_subscription_id: "sub_123",
        },
        error: null,
      },
    });
    const result = await getCorporateSeatEntitlement("user-1", supabase);
    expect(result).toEqual({
      status: "active",
      source: "stripe",
      expires_at: null,
    });
  });

  it("returns inactive when account exists but is not active", async () => {
    const supabase = buildSupabase({
      seats: { data: { corporate_account_id: "acc-1" }, error: null },
      accounts: {
        data: { id: "acc-1", active: false, stripe_subscription_id: "sub_x" },
        error: null,
      },
    });
    const result = await getCorporateSeatEntitlement("user-1", supabase);
    expect(result).toEqual({
      status: "inactive",
      source: null,
      expires_at: null,
    });
  });

  it("returns inactive when account has no stripe link yet (pre-sales)", async () => {
    const supabase = buildSupabase({
      seats: { data: { corporate_account_id: "acc-1" }, error: null },
      accounts: {
        data: { id: "acc-1", active: true, stripe_subscription_id: null },
        error: null,
      },
    });
    const result = await getCorporateSeatEntitlement("user-1", supabase);
    expect(result?.status).toBe("inactive");
  });

  it("returns null when the seat lookup errors out (degrades to subs path)", async () => {
    const supabase = buildSupabase({
      seats: { data: null, error: { message: "boom" } },
    });
    expect(await getCorporateSeatEntitlement("user-1", supabase)).toBeNull();
  });

  it("returns null when the account lookup errors out", async () => {
    const supabase = buildSupabase({
      seats: { data: { corporate_account_id: "acc-1" }, error: null },
      accounts: { data: null, error: { message: "boom" } },
    });
    expect(await getCorporateSeatEntitlement("user-1", supabase)).toBeNull();
  });
});
