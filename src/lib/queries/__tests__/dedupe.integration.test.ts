// src/lib/queries/__tests__/dedupe.integration.test.ts
//
// REGRESSION GUARD for the React Query migration shipped in PRs #393-#402.
//
// These tests assert the central invariant of that work: when N components
// on a page each call the same query hook, the underlying network read
// happens EXACTLY ONCE — not N times. The unit tests for each hook
// (client.test.ts, useEntitlementQuery.test.ts, useProfileQuery.test.ts,
// hooks/__tests__/useFeatureFlag.test.ts) cover behavior in isolation.
// This file covers the failure mode the migration was built to prevent:
// integration-level duplicate fetches.
//
// **If you find yourself loosening these tests, you are very likely
// undoing PRs #393-#402.** The right next move in that case is to ask
// in #eng before changing the assertions.
//
// What can break dedupe — these are the regression patterns to watch for:
//   1. A new hook bypasses qk.* and assembles its own query key inline.
//   2. A caller switches from useEntitlements()/useProfileQuery()/etc.
//      back to a direct supabase.* call inside a component.
//   3. queryClient defaults change (refetchOnMount: false → true,
//      staleTime: 30_000 → 0, etc.) — those are guarded by client.test.ts
//      but a regression there will also surface here.
//   4. A wrapper hook recreates the QueryClient per render (an instance
//      created inside a component body resets the cache on every mount).

import React from "react";
import { renderHook, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Supabase mock ───────────────────────────────────────────────────────────
//
// One mock module replaces the singleton client for every hook in the file.
// Per-table `maybeSingle` counters let us assert which table was hit how
// many times in the cross-cutting smoke test.
const mockGetUser = vi.fn();
const mockFeatureFlagsMaybeSingle = vi.fn();
const mockProfilesMaybeSingle = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { getUser: () => mockGetUser() },
    from: (table: string) => {
      const maybeSingle =
        table === "feature_flags"
          ? mockFeatureFlagsMaybeSingle
          : mockProfilesMaybeSingle;
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: () => maybeSingle(),
          }),
        }),
      };
    },
  },
}));

// fetchCurrentEntitlement (the underlying me-entitlement RPC) is wrapped
// by useEntitlementQuery; mock it so we can count edge-function invocations
// without leaving the unit-test process.
vi.mock("@/lib/authService", async () => {
  const actual = await vi.importActual<typeof import("@/lib/authService")>(
    "@/lib/authService",
  );
  return {
    ...actual,
    fetchCurrentEntitlement: vi.fn(),
  };
});

// Hook + fetcher imports must come AFTER the vi.mock calls above so the
// hooks resolve to the mocked supabase / authService modules.
import { useAuthUserQuery } from "@/lib/queries/useAuthUserQuery";
import { useFeatureFlagQuery } from "@/lib/queries/useFeatureFlagQuery";
import { useEntitlementQuery } from "@/lib/queries/useEntitlementQuery";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import { qk } from "@/lib/queries/keys";
import * as authService from "@/lib/authService";

const fetchCurrentEntitlement =
  authService.fetchCurrentEntitlement as unknown as ReturnType<typeof vi.fn>;

// ── Test infra ──────────────────────────────────────────────────────────────

const SAMPLE_USER = {
  id: "user-1",
  email: "alice@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00Z",
};

const SAMPLE_ENTITLEMENT = {
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

const SAMPLE_PROFILE = { id: "user-1", email: "alice@example.com" };
const SAMPLE_FLAG_ROW = { is_enabled: true, enabled_user_ids: [] };

/**
 * Build a QueryClient mirroring the production defaults at
 * src/lib/queries/client.ts. retry:false avoids slow paths under test.
 */
function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });
}

function wrapperFor(client: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetUser.mockResolvedValue({ data: { user: SAMPLE_USER }, error: null });
  mockFeatureFlagsMaybeSingle.mockResolvedValue({
    data: SAMPLE_FLAG_ROW,
    error: null,
  });
  mockProfilesMaybeSingle.mockResolvedValue({
    data: SAMPLE_PROFILE,
    error: null,
  });
  fetchCurrentEntitlement.mockResolvedValue(SAMPLE_ENTITLEMENT);
});

// ── Per-hook dedupe tests ───────────────────────────────────────────────────

describe("query-hook dedupe (10 simultaneous mounts → 1 fetch)", () => {
  it("dedupes useAuthUserQuery across 10 simultaneous mounts", async () => {
    const wrapper = wrapperFor(makeClient());

    const hooks = Array.from({ length: 10 }, () =>
      renderHook(() => useAuthUserQuery(), { wrapper }),
    );

    await waitFor(() => {
      for (const h of hooks) {
        expect(h.result.current.isSuccess).toBe(true);
      }
    });

    // The whole point of the migration: 10 components, 1 network call.
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    // All 10 components received the same data reference.
    for (const h of hooks) {
      expect(h.result.current.data?.id).toBe(SAMPLE_USER.id);
    }
  });

  it("dedupes useFeatureFlagQuery across 10 simultaneous mounts", async () => {
    const client = makeClient();

    // Pre-seed the auth-user cache so userId is stable from the first
    // render of every consumer. This mirrors production: AuthProvider
    // resolves the user once at boot, then downstream components mount
    // and see the resolved value synchronously. Without seeding, the
    // hook re-keys from `qk.featureFlag(key, null)` to
    // `qk.featureFlag(key, "user-1")` mid-flight and we'd see TWO
    // feature_flags reads (one per cache key) — that's not a regression,
    // it's the cache-key-includes-userId design. We test the
    // post-auth-resolution dedupe here; the auth dedupe itself is
    // covered by the useAuthUserQuery test above.
    client.setQueryData(qk.authUser(), SAMPLE_USER);

    const wrapper = wrapperFor(client);
    const hooks = Array.from({ length: 10 }, () =>
      renderHook(() => useFeatureFlagQuery("ai_disclosure_v2"), { wrapper }),
    );

    await waitFor(() => {
      for (const h of hooks) {
        expect(h.result.current.loading).toBe(false);
      }
    });

    // 10 components, 1 underlying flag row read.
    expect(mockFeatureFlagsMaybeSingle).toHaveBeenCalledTimes(1);
    // Auth was pre-cached, so getUser was never invoked.
    expect(mockGetUser).not.toHaveBeenCalled();
    for (const h of hooks) {
      expect(h.result.current.enabled).toBe(true);
    }
  });

  it("dedupes useEntitlementQuery across 10 simultaneous mounts", async () => {
    const wrapper = wrapperFor(makeClient());

    const hooks = Array.from({ length: 10 }, () =>
      renderHook(() => useEntitlementQuery("user-1"), { wrapper }),
    );

    await waitFor(() => {
      for (const h of hooks) {
        expect(h.result.current.isSuccess).toBe(true);
      }
    });

    // 10 components calling useEntitlements() in production produced 14
    // me-entitlement requests pre-migration. After PR #401 the answer is 1.
    expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1);
    for (const h of hooks) {
      expect(h.result.current.data).toEqual(SAMPLE_ENTITLEMENT);
    }
  });

  it("dedupes useProfileQuery across 10 simultaneous mounts", async () => {
    const wrapper = wrapperFor(makeClient());

    const hooks = Array.from({ length: 10 }, () =>
      renderHook(() => useProfileQuery("user-1"), { wrapper }),
    );

    await waitFor(() => {
      for (const h of hooks) {
        expect(h.result.current.isSuccess).toBe(true);
      }
    });

    // Pre-migration baseline was ~33 profiles reads per page. Post-#402: 1.
    expect(mockProfilesMaybeSingle).toHaveBeenCalledTimes(1);
    for (const h of hooks) {
      expect(h.result.current.data).toEqual(SAMPLE_PROFILE);
    }
  });
});

// ── Cross-cutting page-level smoke ──────────────────────────────────────────

describe("page-level smoke", () => {
  /**
   * One component that exercises every migrated hook. Rendered 10× into
   * a single QueryClientProvider, the assertion is that the four
   * underlying network reads happen ONCE EACH — total 4 calls, not 40.
   * That's the user-visible promise of the whole #393–#402 chain.
   */
  function PageConsumer({ userId }: { userId: string }) {
    useAuthUserQuery();
    useFeatureFlagQuery("ai_disclosure_v2");
    useEntitlementQuery(userId);
    useProfileQuery(userId);
    return null;
  }

  it("mounting 10 components calling all 4 hooks results in 4 supabase calls total (not 40)", async () => {
    const client = makeClient();

    // Step 1 — prime the auth cache the way <AuthProvider> does at app
    // boot. One getUser call happens here; subsequent component mounts
    // read it from cache without re-fetching, and downstream queries
    // that key on userId (useFeatureFlagQuery) see a stable userId
    // from their first render.
    const primer = renderHook(() => useAuthUserQuery(), {
      wrapper: wrapperFor(client),
    });
    await waitFor(() => expect(primer.result.current.isSuccess).toBe(true));
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    primer.unmount();

    // Step 2 — mount 10 PageConsumers in a single render call. Each one
    // calls all four migrated hooks. With dedupe working, the combined
    // network footprint is exactly: 1 auth read (from step 1, no
    // additional fetches), 1 flag row read, 1 me-entitlement RPC,
    // 1 profile row read.
    render(
      React.createElement(
        QueryClientProvider,
        { client },
        Array.from({ length: 10 }, (_, i) =>
          React.createElement(PageConsumer, { key: i, userId: "user-1" }),
        ),
      ),
    );

    await waitFor(() => {
      expect(mockFeatureFlagsMaybeSingle).toHaveBeenCalled();
      expect(fetchCurrentEntitlement).toHaveBeenCalled();
      expect(mockProfilesMaybeSingle).toHaveBeenCalled();
    });

    // Hard assertions: exactly one underlying read per data source.
    // 1 + 1 + 1 + 1 = 4 calls total for 10 consumers × 4 hooks (not 40).
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFeatureFlagsMaybeSingle).toHaveBeenCalledTimes(1);
    expect(fetchCurrentEntitlement).toHaveBeenCalledTimes(1);
    expect(mockProfilesMaybeSingle).toHaveBeenCalledTimes(1);
  });
});
