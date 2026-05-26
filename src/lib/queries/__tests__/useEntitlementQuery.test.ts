// src/lib/queries/__tests__/useEntitlementQuery.test.ts
//
// Pins the dedupe contract for useEntitlementQuery:
//   1. Returns the BackendEntitlement when authenticated.
//   2. Disabled (no fetch) when userId is null / empty.
//   3. Two simultaneous mounts with the same userId share ONE
//      fetchCurrentEntitlement call (the whole reason the hook exists).
//   4. A second mount within staleTime serves the cached value.

import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/authService", async () => {
  const actual = await vi.importActual<any>("@/lib/authService");
  return {
    ...actual,
    fetchCurrentEntitlement: vi.fn(),
  };
});

import { useEntitlementQuery } from "@/lib/queries/useEntitlementQuery";
import * as authService from "@/lib/authService";

const fetchCurrentEntitlement =
  authService.fetchCurrentEntitlement as unknown as ReturnType<typeof vi.fn>;

function makeClient() {
  // 30s staleTime mirrors the shared QueryClient defaults from
  // src/lib/queries/client.ts so the cache-hit test reflects production.
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 30_000, gcTime: 5 * 60_000 },
    },
  });
}

function wrapperFor(client: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

const SAMPLE_ENT = {
  is_premium: true,
  source: "stripe",
  status: "active",
  expires_at: "2027-01-01T00:00:00Z",
  current_period_end: "2027-01-01T00:00:00Z",
  plan_name: "Premium Monthly",
  tier_id: "premium_month",
  price_id: "price_123",
  cancel_at_period_end: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useEntitlementQuery", () => {
  it("returns the entitlement when authenticated", async () => {
    fetchCurrentEntitlement.mockResolvedValue(SAMPLE_ENT);

    const { result } = renderHook(() => useEntitlementQuery("user-1"), {
      wrapper: wrapperFor(makeClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(SAMPLE_ENT);
    expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1);
  });

  it("does not fetch when userId is null (anonymous)", async () => {
    fetchCurrentEntitlement.mockResolvedValue(SAMPLE_ENT);

    const { result } = renderHook(() => useEntitlementQuery(null), {
      wrapper: wrapperFor(makeClient()),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
    expect(fetchCurrentEntitlement).not.toHaveBeenCalled();
  });

  it("dedupes concurrent mounts for the same userId into ONE fetch", async () => {
    fetchCurrentEntitlement.mockResolvedValue(SAMPLE_ENT);

    const client = makeClient();
    const wrapper = wrapperFor(client);

    // Two independent components mount simultaneously and both subscribe
    // to the same query key — react-query must collapse them into a
    // single in-flight request.
    const a = renderHook(() => useEntitlementQuery("user-1"), { wrapper });
    const b = renderHook(() => useEntitlementQuery("user-1"), { wrapper });

    await waitFor(() => expect(a.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(b.result.current.isSuccess).toBe(true));

    expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1);
    expect(a.result.current.data).toEqual(SAMPLE_ENT);
    expect(b.result.current.data).toEqual(SAMPLE_ENT);
  });

  it("serves the cached value on a second mount within staleTime", async () => {
    fetchCurrentEntitlement.mockResolvedValue(SAMPLE_ENT);

    const client = makeClient();
    const wrapper = wrapperFor(client);

    const first = renderHook(() => useEntitlementQuery("user-1"), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1);

    // Unmount, then re-mount under the same QueryClient. Within the
    // 30s staleTime window the cached entitlement should be returned
    // without a second network call.
    first.unmount();

    const second = renderHook(() => useEntitlementQuery("user-1"), { wrapper });
    expect(second.result.current.data).toEqual(SAMPLE_ENT);
    expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1);
  });
});
