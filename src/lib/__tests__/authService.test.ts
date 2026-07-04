// src/lib/__tests__/authService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { createSupabaseMock } from "@/test/mocks/supabaseMock";

type SupabaseMock = ReturnType<typeof createSupabaseMock>;

// --------------------
// Shared Supabase mock (hoist-safe + TS-safe)
// --------------------
vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();

  return {
    supabase,
    __mock: supabase,
  };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as typeof SupaMod & { __mock: SupabaseMock }).__mock;

import {
  FAIL_CLOSED_ENTITLEMENT,
  entitlementIsPremium,
  entitlementToVipKey,
  fetchCurrentEntitlement,
  resolveEntitlementTier,
} from "../authService";

describe("authService realistic Supabase scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    supabaseMock.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: "fake-token",
          user: { id: "user-123", email: "test@example.com" },
        },
      },
      error: null,
    });

    supabaseMock.functions.invoke.mockResolvedValue({
      data: {
        is_premium: true,
        source: "stripe",
        status: "active",
        expires_at: null,
        plan_name: "Level 1 Monthly",
        tier_id: "level1",
      },
      error: null,
    });
  });

  it("returns null for expired / missing session", async () => {
    supabaseMock.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const result = await fetchCurrentEntitlement();

    expect(result).toBeNull();
    expect(supabaseMock.functions.invoke).not.toHaveBeenCalled();
  });

  it("fails closed when getSession returns an error", async () => {
    supabaseMock.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "JWT expired" },
    });

    const result = await fetchCurrentEntitlement();

    expect(result).toEqual(FAIL_CLOSED_ENTITLEMENT);
    expect(supabaseMock.functions.invoke).not.toHaveBeenCalled();
  });

  it("fails closed when entitlement function returns an error", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: null,
      error: { message: "Edge Function unavailable" },
    });

    const result = await fetchCurrentEntitlement();

    expect(result).toEqual(FAIL_CLOSED_ENTITLEMENT);
  });

  it("fails closed when entitlement function throws", async () => {
    supabaseMock.functions.invoke.mockRejectedValueOnce(
      new Error("network timeout"),
    );

    const result = await fetchCurrentEntitlement();

    expect(result).toEqual(FAIL_CLOSED_ENTITLEMENT);
  });

  it("normalizes malformed entitlement payload safely", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: {
        is_premium: true,
        source: " stripe ",
        status: " ACTIVE ",
        expires_at: "",
        plan_name: " Level 3 yearly ",
        tier_id: " level3 ",
      },
      error: null,
    });

    const result = await fetchCurrentEntitlement();

    expect(result).toEqual({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "Level 3 yearly",
      tier_id: "level3",
    });
  });

  it("maps premium month-style payloads to level1", () => {
    const tier = resolveEntitlementTier({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "monthly",
      tier_id: null,
    });

    expect(tier).toBe("level1");
  });

  it("maps yearly / annual payloads to level9", () => {
    const tier = resolveEntitlementTier({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "annual plan",
      tier_id: null,
    });

    expect(tier).toBe("level9");
  });

  it("treats inactive premium-looking payloads as level0", () => {
    const ent = {
      is_premium: true,
      source: "stripe",
      status: "past_due",
      expires_at: null,
      plan_name: "Level 3",
      tier_id: "level3",
    } as const;

    expect(entitlementIsPremium(ent)).toBe(false);
    expect(resolveEntitlementTier(ent)).toBe("level0");
    expect(entitlementToVipKey(ent)).toBe("level0");
  });

  it("falls back unknown premium payloads to level1", () => {
    const ent = {
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "mystery premium",
      tier_id: "something-odd",
    } as const;

    expect(resolveEntitlementTier(ent)).toBe("level1");
    expect(entitlementToVipKey(ent)).toBe("level1");
  });

  it("maps higher vip tiers to level3 compatibility key", () => {
    const ent = {
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "Level 6",
      tier_id: "level6",
    } as const;

    expect(resolveEntitlementTier(ent)).toBe("level6");
    expect(entitlementToVipKey(ent)).toBe("level3");
  });

  it("resolves null / undefined / non-premium entitlements to level0 (inverse fail-open guard)", () => {
    // The sharp edge for the `tier !== "level0"` premium check: a non-premium
    // input must resolve to the literal "level0", never undefined/null.
    expect(entitlementIsPremium(null)).toBe(false);
    expect(entitlementIsPremium(undefined)).toBe(false);
    expect(resolveEntitlementTier(null)).toBe("level0");
    expect(resolveEntitlementTier(undefined)).toBe("level0");

    // Free / non-premium (is_premium false) — even with an active status.
    const free = {
      is_premium: false,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "free",
      tier_id: "level0",
    } as const;
    expect(entitlementIsPremium(free)).toBe(false);
    expect(resolveEntitlementTier(free)).toBe("level0");

    // Expired/canceled premium — is_premium still true but status inactive.
    const canceled = {
      is_premium: true,
      source: "stripe",
      status: "canceled",
      expires_at: null,
      plan_name: "Level 3",
      tier_id: "level3",
    } as const;
    expect(entitlementIsPremium(canceled)).toBe(false);
    expect(resolveEntitlementTier(canceled)).toBe("level0");
  });
});
