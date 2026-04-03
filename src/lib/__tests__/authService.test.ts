// src/lib/__tests__/authService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------
// Shared Supabase mock (hoist-safe + TS-safe)
// --------------------
vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();

  return {
    supabase,
    __mock: supabase,
  };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

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
        plan_name: "VIP1 Monthly",
        tier_id: "vip1",
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
        plan_name: " VIP3 yearly ",
        tier_id: " vip3 ",
      },
      error: null,
    });

    const result = await fetchCurrentEntitlement();

    expect(result).toEqual({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "VIP3 yearly",
      tier_id: "vip3",
    });
  });

  it("maps premium month-style payloads to vip1", () => {
    const tier = resolveEntitlementTier({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "monthly",
      tier_id: null,
    });

    expect(tier).toBe("vip1");
  });

  it("maps yearly / annual payloads to vip9", () => {
    const tier = resolveEntitlementTier({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "annual plan",
      tier_id: null,
    });

    expect(tier).toBe("vip9");
  });

  it("treats inactive premium-looking payloads as free", () => {
    const ent = {
      is_premium: true,
      source: "stripe",
      status: "past_due",
      expires_at: null,
      plan_name: "VIP3",
      tier_id: "vip3",
    } as const;

    expect(entitlementIsPremium(ent)).toBe(false);
    expect(resolveEntitlementTier(ent)).toBe("free");
    expect(entitlementToVipKey(ent)).toBe("free");
  });

  it("falls back unknown premium payloads to vip1", () => {
    const ent = {
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "mystery premium",
      tier_id: "something-odd",
    } as const;

    expect(resolveEntitlementTier(ent)).toBe("vip1");
    expect(entitlementToVipKey(ent)).toBe("vip1");
  });

  it("maps higher vip tiers to vip3 compatibility key", () => {
    const ent = {
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      plan_name: "VIP6",
      tier_id: "vip6",
    } as const;

    expect(resolveEntitlementTier(ent)).toBe("vip6");
    expect(entitlementToVipKey(ent)).toBe("vip3");
  });
});