// src/billing/__tests__/computeEntitlement-catchpaths.test.ts
//
// A12 ratchet-2b — exercise the `try { ... } catch { return ... }`
// safety blocks in isCorporateSeat and getCorporateSeatEntitlement that
// the existing computeEntitlement.corporate.test.ts misses.
//
// The existing tests simulate "supabase responded with an error" by
// returning `{ data: null, error: { message } }` from the mock chain —
// which exercises the `if (error)` branch but NOT the `catch` block.
// To reach the catch block, the chain must THROW (reject the promise).
// This file's mock does exactly that.
//
// Why this matters: a real Supabase client can reject if the runtime
// can't reach the network, if a stale fetch handle dies, or if
// jsdom/node rejects the underlying fetch. The catch block is the
// fail-closed safety net — if it ever leaks an exception, the calling
// page crashes instead of falling back to subscription entitlement.

import { describe, it, expect, vi } from "vitest";
import {
  isCorporateSeat,
  getCorporateSeatEntitlement,
  type CorporateEntitlementSupabase,
} from "../computeEntitlement";

function throwingSupabase(
  whichThrows: "seats" | "accounts" | "both",
  errorMessage = "fetch failed (jsdom)",
): CorporateEntitlementSupabase {
  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => {
            if (
              (whichThrows === "seats" && table === "corporate_seats") ||
              (whichThrows === "accounts" && table === "corporate_accounts") ||
              whichThrows === "both"
            ) {
              throw new Error(errorMessage);
            }
            // Healthy path: return shaped data so the OTHER table proceeds.
            if (table === "corporate_seats") {
              return { data: { corporate_account_id: "acc-1" }, error: null };
            }
            if (table === "corporate_accounts") {
              return {
                data: { id: "acc-1", active: true, stripe_subscription_id: "sub_1" },
                error: null,
              };
            }
            return { data: null, error: null };
          }),
        })),
      })),
    })),
  };
}

describe("isCorporateSeat — catch block (promise rejection)", () => {
  it("returns false when the supabase chain THROWS (network drop)", async () => {
    const sup = throwingSupabase("seats");
    expect(await isCorporateSeat("user-1", sup)).toBe(false);
  });

  it("does NOT propagate the underlying error to callers (fail-closed)", async () => {
    const sup = throwingSupabase("seats", "ERR_TIMEOUT");
    // No `expect(...).rejects` — the function must NOT throw.
    await expect(isCorporateSeat("user-1", sup)).resolves.toBe(false);
  });
});

describe("getCorporateSeatEntitlement — catch blocks (promise rejection)", () => {
  it("returns null when the seat lookup THROWS", async () => {
    const sup = throwingSupabase("seats");
    expect(await getCorporateSeatEntitlement("user-1", sup)).toBeNull();
  });

  it("returns null when the account lookup THROWS (seat lookup OK)", async () => {
    const sup = throwingSupabase("accounts");
    expect(await getCorporateSeatEntitlement("user-1", sup)).toBeNull();
  });

  it("fail-closed on either lookup throwing", async () => {
    const sup = throwingSupabase("both");
    await expect(getCorporateSeatEntitlement("user-1", sup)).resolves.toBeNull();
  });
});
