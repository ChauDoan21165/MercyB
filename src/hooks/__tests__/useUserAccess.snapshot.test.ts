// src/hooks/__tests__/useUserAccess.snapshot.test.ts
//
// MB-BLUE alignment (AUTH-DRIVEN, ENTITLEMENT-DRIVEN)

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUserAccess } from "../useUserAccess";
import { normalizeTier } from "@/lib/constants/tiers";
import { qk } from "@/lib/queries/keys";
import type { UserAccess } from "../useUserAccess";

// Shared mock shapes. Profile rows and entitlement payloads are
// intentionally loose here — several tests feed deliberately corrupted
// data to exercise the hook's defensive parsing.
type MockUser = { id?: string; email?: string } | null;
type MockProfileResult = {
  data: Record<string, unknown> | null;
  error: { message: string } | null;
};
type MockEntitlement = Record<string, unknown> | null;

// ---- AuthProvider mock ----
vi.mock("@/providers/AuthProvider", () => {
  let state: { user: MockUser; isLoading: boolean } = {
    user: null,
    isLoading: false,
  };

  const __setAuth = (next: Partial<typeof state>) => {
    state = { ...state, ...next };
    if (state.user) {
      state = {
        ...state,
        user: { id: state.user.id ?? "user-1", ...state.user },
      };
    }
  };

  return {
    useAuth: () => {
      return {
        user: state.user,
        isLoading: state.isLoading,
        signOut: vi.fn(),
        signInWithOAuth: vi.fn(),
        signInWithPassword: vi.fn(),
        signUpWithPassword: vi.fn(),
        resetPassword: vi.fn(),
      };
    },
    __mock: { __setAuth },
  };
});

// ---- Supabase mock (profiles-only) ----
vi.mock("@/lib/supabaseClient", () => {
  let nextProfileResult: MockProfileResult = { data: null, error: null };

  const __setProfilesResult = (r: MockProfileResult) => {
    nextProfileResult = r;
  };

  const mockFrom = vi.fn((table: string) => {
    if (table !== "profiles") {
      throw new Error(`Unexpected table in useUserAccess test: ${table}`);
    }

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockImplementation(async () => nextProfileResult),
    };

    return chain;
  });

  return {
    supabase: {
      from: mockFrom,
    },
    __mock: {
      mockFrom,
      __setProfilesResult,
    },
  };
});

// ---- authService mock: REAL resolveEntitlementTier / entitlementIsPremium ----
// Un-mocked via importOriginal so entitlement STATUS flows through the real
// premium gate. The previous status-blind mock (tier-string → levelN, ignoring
// is_premium / status) is exactly what hid the hasPremium false-green: it could
// never have caught an expired-premium leak. Only fetchCurrentEntitlement is
// mocked (it does a network/Supabase call); __setEntitlement still accepts the
// lightweight test shape and translates it into a real BackendEntitlement so the
// real resolver runs against realistic input. is_premium derives from the named
// premium tiers unless set explicitly, so an expired/canceled case is just
// {tier:"premium_month", is_premium:false, status:"canceled"}.
vi.mock("@/lib/authService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/authService")>();

  let entitlement: MockEntitlement = null;

  const __setEntitlement = (next: MockEntitlement) => {
    entitlement = next;
  };

  const toBackendEntitlement = (input: MockEntitlement) => {
    if (!input || typeof input !== "object") return null;
    const i = input as Record<string, unknown>;
    const tier = typeof i.tier === "string" ? i.tier : undefined;
    const isPremium =
      typeof i.is_premium === "boolean"
        ? i.is_premium
        : tier === "premium_month" || tier === "premium_year";
    const status =
      typeof i.status === "string" ? i.status : isPremium ? "active" : "canceled";
    const tierId =
      typeof i.tier_id === "string"
        ? i.tier_id
        : tier && tier !== "level0"
          ? tier
          : null;
    return {
      is_premium: isPremium,
      status,
      source: typeof i.source === "string" ? i.source : "stripe",
      expires_at: null,
      plan_name: typeof i.plan_name === "string" ? i.plan_name : null,
      tier_id: tierId,
    };
  };

  return {
    ...actual,
    fetchCurrentEntitlement: vi.fn(async () => toBackendEntitlement(entitlement)),
    __mock: { __setEntitlement },
  };
});

// Pull the mock helpers back out AFTER mocks are registered.
import * as AuthMod from "@/providers/AuthProvider";
const { __setAuth } = ((
  AuthMod as unknown as {
    __mock?: { __setAuth: (next: { user?: MockUser; isLoading?: boolean }) => void };
  }
).__mock ?? {}) as {
  __setAuth: (next: { user?: MockUser; isLoading?: boolean }) => void;
};

import * as SupaMod from "@/lib/supabaseClient";
const { mockFrom, __setProfilesResult } = ((
  SupaMod as unknown as {
    __mock?: {
      mockFrom: ReturnType<typeof vi.fn>;
      __setProfilesResult: (r: MockProfileResult) => void;
    };
  }
).__mock ?? {}) as {
  mockFrom: ReturnType<typeof vi.fn>;
  __setProfilesResult: (r: MockProfileResult) => void;
};

import * as AuthServiceMod from "@/lib/authService";
const { __setEntitlement } = ((
  AuthServiceMod as unknown as {
    __mock?: { __setEntitlement: (next: MockEntitlement) => void };
  }
).__mock ?? {}) as {
  __setEntitlement: (next: MockEntitlement) => void;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function renderUseUserAccess(client = makeQueryClient()) {
  return renderHook(() => useUserAccess(), {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client }, children),
  });
}

// Snapshot only stable, serializable fields.
function stableSnapshot(a: UserAccess) {
  return {
    isAdmin: a.isAdmin,
    isHighAdmin: a.isHighAdmin,
    adminLevel: a.adminLevel,

    isAuthenticated: a.isAuthenticated,
    isDemoMode: a.isDemoMode,

    tier: a.tier,

    loading: a.loading,
    isLoading: a.isLoading,
  };
}

describe("useUserAccess snapshots - baseline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
    __setEntitlement(null);
  });

  it("level0 tier user access snapshot", async () => {
    __setAuth({ user: { email: "level0@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "level0@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.tier).toBe("level0");
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "level0",
      }
    `);
  });

  it("monthly premium user access snapshot", async () => {
    __setAuth({ user: { email: "month@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "month@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "premium_month" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.tier).toBe("level1");
      expect(result.current.isLoading).toBe(false);
    });

    // Revenue-critical guard: a real Premium subscriber must read hasPremium
    // true so ParentView (L6) does NOT show the paywall. stableSnapshot omits
    // hasPremium, so assert it explicitly — this is the check the old test
    // lacked.
    expect(result.current.hasPremium).toBe(true);
    expect(result.current.canAccessPremium()).toBe(true);

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "level1",
      }
    `);
  });

  it("yearly premium user access snapshot", async () => {
    __setAuth({ user: { email: "year@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "year@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "premium_year" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.tier).toBe("level9");
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasPremium).toBe(true);
    expect(result.current.canAccessPremium()).toBe(true);

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "level9",
      }
    `);
  });

  it("admin user access snapshot", async () => {
    __setAuth({ user: { email: "admin@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "admin@example.com", is_admin: true, admin_level: 9 },
      error: null,
    });

    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isHighAdmin).toBe(true);
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 9,
        "isAdmin": true,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": true,
        "isLoading": false,
        "loading": false,
        "tier": "level0",
      }
    `);
  });

  it("unauthenticated user access snapshot (demo mode)", async () => {
    __setAuth({ user: null, isLoading: false });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isDemoMode).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFrom).not.toHaveBeenCalled();

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "isAdmin": false,
        "isAuthenticated": false,
        "isDemoMode": true,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "level0",
      }
    `);
  });

  it("auth loading stays loading until auth resolves", async () => {
    __setAuth({ user: null, isLoading: true });

    const { result, rerender } = renderUseUserAccess();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);

    __setAuth({ user: null, isLoading: false });
    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isDemoMode).toBe(true);
    });
  });
});

describe("useUserAccess admin vs non-admin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
    __setEntitlement(null);
  });

  it("admin gets admin override even when entitlement is level0", async () => {
    __setAuth({ user: { email: "admin-level0@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "admin-level0@example.com", is_admin: true, admin_level: 9 },
      error: null,
    });

    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isHighAdmin).toBe(true);
    expect(result.current.adminLevel).toBe(9);
    expect(result.current.tier).toBe("level0");
    expect(result.current.canAccessPremium()).toBe(true);
  });

  it("non-admin on level0 entitlement does not get premium access", async () => {
    __setAuth({ user: { email: "level0-user@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "level0-user@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isHighAdmin).toBe(false);
    expect(result.current.adminLevel).toBe(0);
    expect(result.current.tier).toBe("level0");
    // Inverse fail-open guard: a free user must read hasPremium === false.
    // This is the exact field ParentView (L6) gates on; the old test never
    // asserted the negative, which let the always-false bug hide.
    expect(result.current.hasPremium).toBe(false);
    expect(result.current.canAccessPremium()).toBe(false);
  });

  it("expired premium (is_premium:false / canceled) reads hasPremium false — inverse fail-open guard", async () => {
    __setAuth({
      user: { email: "expired-premium@example.com" },
      isLoading: false,
    });

    __setProfilesResult({
      data: {
        email: "expired-premium@example.com",
        is_admin: false,
        admin_level: 0,
      },
      error: null,
    });

    // A lapsed subscriber: the provider tier still says premium_month, but the
    // entitlement is no longer premium (is_premium false / status canceled).
    // With the resolver UN-MOCKED, this flows through the REAL gate
    // (entitlementIsPremium: is_premium + active/trialing) and MUST resolve to
    // level0 → hasPremium false. A status-blind mock could never catch this.
    __setEntitlement({
      tier: "premium_month",
      is_premium: false,
      status: "canceled",
    });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tier).toBe("level0");
    expect(result.current.hasPremium).toBe(false);
    expect(result.current.canAccessPremium()).toBe(false);
  });

  it("admin with broken entitlement still gets admin override", async () => {
    __setAuth({ user: { email: "admin-broken@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "admin-broken@example.com", is_admin: true, admin_level: 9 },
      error: null,
    });

    __setEntitlement(null);

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isHighAdmin).toBe(true);
    expect(result.current.tier).toBe("level0");
    expect(result.current.canAccessPremium()).toBe(true);
  });

  it("non-admin with premium_month entitlement gets premium access only from tier, not admin role", async () => {
    __setAuth({ user: { email: "member-month@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "member-month@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "premium_month" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isHighAdmin).toBe(false);
    expect(result.current.adminLevel).toBe(0);
    expect(result.current.tier).toBe("level1");
    expect(result.current.canAccessPremium()).toBe(true);
  });

  it("non-admin with premium_year entitlement gets premium access only from tier, not admin role", async () => {
    __setAuth({ user: { email: "member-year@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "member-year@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "premium_year" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isHighAdmin).toBe(false);
    expect(result.current.adminLevel).toBe(0);
    expect(result.current.tier).toBe("level9");
    expect(result.current.canAccessPremium()).toBe(true);
  });
});

describe("useUserAccess profile query cache sharing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
    __setEntitlement(null);
  });

  it("reuses cached profile data instead of issuing a separate profiles read", async () => {
    const client = makeQueryClient();
    const userId = "cached-user-1";

    __setAuth({
      user: { id: userId, email: "cached-admin@example.com" },
      isLoading: false,
    });
    __setEntitlement({ tier: "level0" });

    client.setQueryData(qk.profile(userId), {
      id: userId,
      email: "cached-admin@example.com",
      is_admin: true,
      admin_level: 9,
    });

    const { result } = renderUseUserAccess(client);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.adminLevel).toBe(9);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});

describe("useUserAccess corrupted profile rows and malformed entitlement payloads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
    __setEntitlement(null);
  });

  it("profiles row has invalid admin level → falls back safely", async () => {
    __setAuth({ user: { email: "weird-admin@example.com" }, isLoading: false });

    __setProfilesResult({
      data: {
        email: "weird-admin@example.com",
        is_admin: false,
        admin_level: "not-a-number",
      },
      error: null,
    });

    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toEqual({
      isAdmin: false,
      isHighAdmin: false,
      adminLevel: 0,
      isAuthenticated: true,
      isDemoMode: false,
      tier: "level0",
      loading: false,
      isLoading: false,
    });
  });

  it("profiles row with string numeric admin level still grants admin safely", async () => {
    __setAuth({ user: { email: "string-admin@example.com" }, isLoading: false });

    __setProfilesResult({
      data: {
        email: "string-admin@example.com",
        is_admin: false,
        admin_level: "9",
      },
      error: null,
    });

    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isHighAdmin).toBe(true);
    expect(result.current.adminLevel).toBe(9);
    expect(result.current.canAccessPremium()).toBe(true);
  });

  it("malformed entitlement payload with wrong types resolves to level0 safely", async () => {
    __setAuth({ user: { email: "bad-entitlement@example.com" }, isLoading: false });

    __setProfilesResult({
      data: {
        email: "bad-entitlement@example.com",
        is_admin: false,
        admin_level: 0,
      },
      error: null,
    });

    __setEntitlement({
      tier: 999,
      status: { active: true },
      source: ["stripe"],
    });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.tier).toBe("level0");
    expect(result.current.canAccessPremium()).toBe(false);
  });

  it("malformed entitlement payload missing tier resolves to level0 safely", async () => {
    __setAuth({ user: { email: "missing-tier@example.com" }, isLoading: false });

    __setProfilesResult({
      data: {
        email: "missing-tier@example.com",
        is_admin: false,
        admin_level: 0,
      },
      error: null,
    });

    __setEntitlement({
      status: "active",
      weird: true,
    });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tier).toBe("level0");
    expect(result.current.canAccessPremium()).toBe(false);
  });

  it("corrupted profiles row shape still keeps authenticated user stable", async () => {
    __setAuth({ user: { email: "broken-profile@example.com" }, isLoading: false });

    __setProfilesResult({
      data: {
        strange_field: true,
        admin_level: null,
        is_admin: null,
      },
      error: null,
    });

    __setEntitlement({ tier: "premium_month" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toEqual({
      isAdmin: false,
      isHighAdmin: false,
      adminLevel: 0,
      isAuthenticated: true,
      isDemoMode: false,
      tier: "level1",
      loading: false,
      isLoading: false,
    });

    expect(result.current.canAccessPremium()).toBe(true);
  });
});

describe("useUserAccess auth-loaded but partially broken downstream data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
    __setEntitlement(null);
  });

  it("profiles lookup error still resolves entitlement tier safely", async () => {
    __setAuth({ user: { email: "profiles-error@example.com" }, isLoading: false });

    __setProfilesResult({
      data: null,
      error: { message: "bad row shape" },
    });

    __setEntitlement({ tier: "premium_year" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.adminLevel).toBe(0);
    expect(result.current.tier).toBe("level9");
    expect(result.current.canAccessPremium()).toBe(true);
  });

  it("missing profile row still resolves entitlement tier", async () => {
    __setAuth({ user: { email: "missing@example.com" }, isLoading: false });

    __setProfilesResult({ data: null, error: null });
    __setEntitlement({ tier: "level0" });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tier).toBe("level0");
    expect(result.current.isAdmin).toBe(false);
  });

  it("unauthenticated user avoids profiles query even if prior mock state is corrupted", async () => {
    __setProfilesResult({
      data: {
        email: "should-not-be-used@example.com",
        is_admin: true,
        admin_level: 999,
      },
      error: null,
    });

    __setEntitlement({ tier: "premium_year" });
    __setAuth({ user: null, isLoading: false });

    const { result } = renderUseUserAccess();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFrom).not.toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isDemoMode).toBe(true);
    expect(result.current.tier).toBe("level0");
  });

  it("auth loading suppresses downstream work until auth resolves", async () => {
    __setAuth({ user: { email: "loading@example.com" }, isLoading: true });

    const { result, rerender } = renderUseUserAccess();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.loading).toBe(true);

    expect(mockFrom).not.toHaveBeenCalled();

    __setProfilesResult({
      data: {
        email: "loading@example.com",
        is_admin: false,
        admin_level: 0,
      },
      error: null,
    });
    __setEntitlement({ tier: "premium_month" });
    __setAuth({ user: { email: "loading@example.com" }, isLoading: false });

    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tier).toBe("level1");
    expect(result.current.canAccessPremium()).toBe(true);
  });
});

describe("normalizeTier canon tests", () => {
  it("normalizes current tier variants correctly", () => {
    expect(normalizeTier("level0")).toBe("level0");
    expect(normalizeTier("premium_month")).toBe("premium_month");
    expect(normalizeTier("premium_year")).toBe("premium_year");
  });

  it("handles null/undefined as level0 tier", () => {
    expect(normalizeTier(null)).toBe("level0");
    expect(normalizeTier(undefined)).toBe("level0");
    expect(normalizeTier("")).toBe("level0");
  });
});
