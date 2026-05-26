// src/lib/__tests__/useEntitlements.giftRedemption.test.ts
//
// Pins the gift-subscription overlay contract introduced when the
// account page started showing "Free / Inactive" for users with a
// valid gift redemption. me-entitlement reads the unified
// `subscriptions` table; the redeem RPC writes only to legacy
// `user_subscriptions`. Until those are bridged, the hook overlays
// the gift-side state onto the entitlement client-side.
//
// Three scenarios:
//   1. Non-premium entitlement + active gift sub → premium overlay
//      with the gift sub's tier_id (vip_key) and expiry.
//   2. Already-premium entitlement → gift sub fetch is a no-op.
//   3. Non-premium entitlement + no gift sub → stays non-premium.

import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

vi.mock("@/lib/authService", async () => {
  const actual = await vi.importActual<any>("@/lib/authService");
  return {
    ...actual,
    fetchCurrentEntitlement: vi.fn(),
  };
});

vi.mock("@/lib/gift/fetchActiveGiftSubscription", () => ({
  fetchActiveGiftSubscription: vi.fn(),
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

import { useEntitlements } from "@/lib/useEntitlements";
import * as authService from "@/lib/authService";
import * as giftMod from "@/lib/gift/fetchActiveGiftSubscription";
import { useAuth } from "@/providers/AuthProvider";

const fetchCurrentEntitlement = authService.fetchCurrentEntitlement as unknown as ReturnType<
  typeof vi.fn
>;
const fetchActiveGiftSubscription =
  giftMod.fetchActiveGiftSubscription as unknown as ReturnType<typeof vi.fn>;
const useAuthMock = useAuth as unknown as ReturnType<typeof vi.fn>;

function makeWrapper() {
  // Fresh QueryClient per test so cached entitlement results don't
  // bleed between scenarios. Disable retry so failure paths resolve
  // immediately without exponential backoff.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  useAuthMock.mockReturnValue({
    user: { id: "user-1", email: "test@example.com" },
    isLoading: false,
  });
});

describe("useEntitlements — gift redemption overlay", () => {
  it("overlays an active gift subscription onto a non-premium entitlement", async () => {
    fetchCurrentEntitlement.mockResolvedValue({
      is_premium: false,
      source: null,
      status: "inactive",
      expires_at: null,
      current_period_end: null,
      plan_name: null,
      tier_id: null,
      price_id: null,
      cancel_at_period_end: null,
    });
    fetchActiveGiftSubscription.mockResolvedValue({
      tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
      current_period_end: "2027-05-10T15:58:10.285802+00:00",
      vip_key: "vip9",
      plan_name: "Premium Access",
    });

    const { result } = renderHook(() => useEntitlements(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const ent = result.current.ent;
    expect(ent?.is_premium).toBe(true);
    expect(ent?.status).toBe("active");
    expect(ent?.source).toBe("gift_code");
    expect(ent?.plan_name).toBe("Premium Access");
    expect(ent?.expires_at).toBe("2027-05-10T15:58:10.285802+00:00");
    expect(ent?.current_period_end).toBe(
      "2027-05-10T15:58:10.285802+00:00",
    );
    // tier_id carries the legacy VIP key. resolveEntitlementTier maps
    // "Premium Access" plan_name → "level9" via the text-fallback path; the
    // hook stores both the original VIP key on the entitlement and
    // is_premium=true on the features map. (Mapping levelN → vipRank
    // numerically is a separate pre-existing concern in tierToRank
    // and out of scope for this PR.)
    expect(ent?.tier_id).toBe("vip9");
    expect(ent?.features?.is_premium).toBe(true);
  });

  it("does NOT overlay when entitlement is already premium", async () => {
    fetchCurrentEntitlement.mockResolvedValue({
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: "2027-01-01T00:00:00Z",
      current_period_end: "2027-01-01T00:00:00Z",
      plan_name: "Level 1 Monthly",
      tier_id: "premium_month",
      price_id: "price_123",
      cancel_at_period_end: false,
    });
    fetchActiveGiftSubscription.mockResolvedValue({
      tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
      current_period_end: "2099-12-31T00:00:00Z",
      vip_key: "vip9",
      plan_name: "Premium Access",
    });

    const { result } = renderHook(() => useEntitlements(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const ent = result.current.ent;
    expect(ent?.is_premium).toBe(true);
    // Stripe source preserved, NOT replaced with gift_code.
    expect(ent?.source).toBe("stripe");
    expect(ent?.plan_name).toBe("Level 1 Monthly");
    expect(ent?.tier_id).toBe("premium_month");
    expect(ent?.expires_at).toBe("2027-01-01T00:00:00Z");
  });

  // Defensive: me-entitlement may return is_premium as undefined or
  // null on partial / FAIL_CLOSED responses. The overlay condition
  // uses a truthy check (!backendEnt.is_premium) so those shapes
  // still trigger the gift overlay. A strict `=== false` check
  // (the original PR #363 form) would skip the overlay here.
  it("overlays even when is_premium is undefined (non-strict truthy check)", async () => {
    fetchCurrentEntitlement.mockResolvedValue({
      // is_premium intentionally omitted — simulates partial response.
      source: null,
      status: "inactive",
      expires_at: null,
      current_period_end: null,
      plan_name: null,
      tier_id: null,
      price_id: null,
      cancel_at_period_end: null,
    } as never);
    fetchActiveGiftSubscription.mockResolvedValue({
      tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
      current_period_end: "2027-05-10T15:58:10.285802+00:00",
      vip_key: "vip9",
      plan_name: "Premium Access",
    });

    const { result } = renderHook(() => useEntitlements(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.ent?.is_premium).toBe(true);
    expect(result.current.ent?.source).toBe("gift_code");
    expect(result.current.ent?.tier_id).toBe("vip9");
  });

  it("overlays even when is_premium is null (non-strict truthy check)", async () => {
    fetchCurrentEntitlement.mockResolvedValue({
      is_premium: null as unknown as boolean,
      source: null,
      status: "inactive",
      expires_at: null,
      current_period_end: null,
      plan_name: null,
      tier_id: null,
      price_id: null,
      cancel_at_period_end: null,
    });
    fetchActiveGiftSubscription.mockResolvedValue({
      tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
      current_period_end: "2027-05-10T15:58:10.285802+00:00",
      vip_key: "vip9",
      plan_name: "Premium Access",
    });

    const { result } = renderHook(() => useEntitlements(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.ent?.is_premium).toBe(true);
    expect(result.current.ent?.source).toBe("gift_code");
  });

  it("stays non-premium when there is no active gift subscription", async () => {
    fetchCurrentEntitlement.mockResolvedValue({
      is_premium: false,
      source: null,
      status: "inactive",
      expires_at: null,
      current_period_end: null,
      plan_name: null,
      tier_id: null,
      price_id: null,
      cancel_at_period_end: null,
    });
    fetchActiveGiftSubscription.mockResolvedValue(null);

    const { result } = renderHook(() => useEntitlements(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const ent = result.current.ent;
    expect(ent?.is_premium).toBe(false);
    expect(ent?.status).toBe("inactive");
    expect(ent?.source).toBe(null);
    expect(ent?.vip_rank).toBe(0);
  });

  it("calls both entitlement fetches in parallel with the same user id", async () => {
    fetchCurrentEntitlement.mockResolvedValue({
      is_premium: false,
      source: null,
      status: "inactive",
      expires_at: null,
      current_period_end: null,
      plan_name: null,
      tier_id: null,
      price_id: null,
      cancel_at_period_end: null,
    });
    fetchActiveGiftSubscription.mockResolvedValue(null);

    renderHook(() => useEntitlements(), { wrapper: makeWrapper() });

    await waitFor(() =>
      expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1),
    );
    await waitFor(() =>
      expect(fetchActiveGiftSubscription).toHaveBeenCalledTimes(1),
    );
    // Helper receives the live user id, not the auth header.
    const giftCallArgs = fetchActiveGiftSubscription.mock.calls[0];
    expect(giftCallArgs[1]).toBe("user-1");
  });
});
