// src/hooks/__tests__/useUserAccess.snapshot.test.ts
//
// MB-BLUE alignment (AUTH-DRIVEN, NO DUPLICATE TIMELINES)
//
// IMPORTANT UPDATES vs old tests:
// - useUserAccess NO LONGER calls supabase.auth.getUser() or listens to auth events.
// - It ONLY reads auth state from useAuth() (AuthProvider).
// - It queries ONLY: supabase.from("profiles") by email.
// - Therefore, these tests must mock:
//   1) "@/providers/AuthProvider"  (user + isLoading)
//   2) "@/lib/supabaseClient"      (from("profiles")... chain)
//
// BUILD-SAFE / HOIST-SAFE FIXES:
// 1) Vitest hoists vi.mock() to top-of-file. Any variables referenced inside
//    the mock factory must be declared inside the factory (TDZ-safe).
// 2) useUserAccess depends on useAuth() context. In hook unit tests, mock
//    useAuth() so tests don't crash without <AuthProvider>.
// 3) TypeScript: the real "@/lib/supabaseClient" module does NOT export __mock.
//    So we must NOT `import { __mock } ...` (TS2305). Instead import as namespace
//    and cast to `any` to read the test-only export from the mocked module.
// 4) Snapshots should not include functions (canAccessTier). Snapshot only a
//    stable subset of fields.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUserAccess } from "../useUserAccess";
import { normalizeTier } from "@/lib/constants/tiers";
import type { TierId } from "@/lib/constants/tiers";
import type { UserAccess } from "../useUserAccess";

// ---- AuthProvider mock (hook-safe) ----
//
// We want to vary auth per test, so we expose a test-only setter.
vi.mock("@/providers/AuthProvider", () => {
  // HOIST-SAFE: declare inside factory
  let state: { user: any; isLoading: boolean } = {
    user: null,
    isLoading: false,
  };

  const __setAuth = (next: Partial<typeof state>) => {
    state = { ...state, ...next };
  };

  return {
    useAuth: () => ({
      user: state.user,
      isLoading: state.isLoading,
      // extra fns sometimes exist in real provider, not used here
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUpWithPassword: vi.fn(),
      resetPassword: vi.fn(),
    }),
    __mock: { __setAuth },
  };
});

// ---- Supabase mock (profiles-only) ----
//
// useUserAccess calls:
// supabase.from("profiles").select(...).eq("email", userEmail).maybeSingle()
vi.mock("@/lib/supabaseClient", () => {
  // HOIST-SAFE: declare inside factory
  let nextProfileResult: { data: any; error: any } = { data: null, error: null };

  const __setProfilesResult = (r: { data: any; error: any }) => {
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

// Pull the mock helpers back out AFTER mocks are registered.
import * as AuthMod from "@/providers/AuthProvider";
const { __setAuth } = ((AuthMod as any).__mock ?? {}) as {
  __setAuth: (next: { user?: any; isLoading?: boolean }) => void;
};

import * as SupaMod from "@/lib/supabaseClient";
const { mockFrom, __setProfilesResult } = ((SupaMod as any).__mock ?? {}) as {
  mockFrom: ReturnType<typeof vi.fn>;
  __setProfilesResult: (r: { data: any; error: any }) => void;
};

// Snapshot only stable, serializable fields (no functions).
function stableSnapshot(a: UserAccess) {
  return {
    isAdmin: a.isAdmin,
    isHighAdmin: a.isHighAdmin,
    adminLevel: a.adminLevel,

    isAuthenticated: a.isAuthenticated,
    isDemoMode: a.isDemoMode,

    tier: a.tier,

    canAccessVIP1: a.canAccessVIP1,
    canAccessVIP2: a.canAccessVIP2,
    canAccessVIP3: a.canAccessVIP3,
    canAccessVIP4: a.canAccessVIP4,
    canAccessVIP5: a.canAccessVIP5,
    canAccessVIP6: a.canAccessVIP6,
    canAccessVIP9: a.canAccessVIP9,

    loading: a.loading,
    isLoading: a.isLoading,
  };
}

describe("useUserAccess snapshots - tier access logic (MB-BLUE)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
  });

  it("Free tier user access snapshot", async () => {
    __setAuth({ user: { email: "free@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "free@example.com", tier: "Free / Miễn phí", is_admin: false, admin_level: 0 },
      error: null,
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "canAccessVIP1": false,
        "canAccessVIP2": false,
        "canAccessVIP3": false,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "free",
      }
    `);
  });

  it("VIP1 tier user access snapshot", async () => {
    __setAuth({ user: { email: "vip1@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "vip1@example.com", tier: "VIP1 / VIP1", is_admin: false, admin_level: 0 },
      error: null,
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("vip1");
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "canAccessVIP1": true,
        "canAccessVIP2": false,
        "canAccessVIP3": false,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "vip1",
      }
    `);
  });

  it("VIP3 tier user access snapshot", async () => {
    __setAuth({ user: { email: "vip3@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "vip3@example.com", tier: "VIP3 II / VIP3 II", is_admin: false, admin_level: 0 },
      error: null,
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("vip3");
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "canAccessVIP1": true,
        "canAccessVIP2": true,
        "canAccessVIP3": true,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "vip3",
      }
    `);
  });

  it("VIP6 tier user access snapshot", async () => {
    __setAuth({ user: { email: "vip6@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "vip6@example.com", tier: "VIP6 / VIP6", is_admin: false, admin_level: 0 },
      error: null,
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("vip6");
      expect(result.current.isLoading).toBe(false);
    });

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "canAccessVIP1": true,
        "canAccessVIP2": true,
        "canAccessVIP3": true,
        "canAccessVIP4": true,
        "canAccessVIP5": true,
        "canAccessVIP6": true,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "vip6",
      }
    `);
  });

  it("Admin user access snapshot (high admin => vip9)", async () => {
    __setAuth({ user: { email: "admin@example.com" }, isLoading: false });

    // MB-BLUE: high admin is determined by admin_level >= 9
    __setProfilesResult({
      data: { email: "admin@example.com", tier: "Free / Miễn phí", is_admin: true, admin_level: 9 },
      error: null,
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isHighAdmin).toBe(true);
      expect(result.current.tier).toBe("vip9");
      expect(result.current.isLoading).toBe(false);
    });

    // High admin: all tiers accessible
    expect(result.current.canAccessTier("vip9")).toBe(true);

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 9,
        "canAccessVIP1": true,
        "canAccessVIP2": true,
        "canAccessVIP3": true,
        "canAccessVIP4": true,
        "canAccessVIP5": true,
        "canAccessVIP6": true,
        "canAccessVIP9": true,
        "isAdmin": true,
        "isAuthenticated": true,
        "isDemoMode": false,
        "isHighAdmin": true,
        "isLoading": false,
        "loading": false,
        "tier": "vip9",
      }
    `);
  });

  it("Unauthenticated user access snapshot (demo mode)", async () => {
    __setAuth({ user: null, isLoading: false });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isDemoMode).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
    });

    // In demo mode, the hook should not query profiles.
    expect(mockFrom).not.toHaveBeenCalled();

    expect(stableSnapshot(result.current)).toMatchInlineSnapshot(`
      {
        "adminLevel": 0,
        "canAccessVIP1": false,
        "canAccessVIP2": false,
        "canAccessVIP3": false,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": false,
        "isDemoMode": true,
        "isHighAdmin": false,
        "isLoading": false,
        "loading": false,
        "tier": "free",
      }
    `);
  });

  it("Auth loading: stays loading until auth resolves", async () => {
    __setAuth({ user: null, isLoading: true });

    const { result, rerender } = renderHook(() => useUserAccess());

    // Immediately: loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);

    // Resolve auth to unauthenticated
    __setAuth({ user: null, isLoading: false });
    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isDemoMode).toBe(true);
    });
  });

  it("Missing profiles row: falls back to FREE (no silent grant)", async () => {
    __setAuth({ user: { email: "missing@example.com" }, isLoading: false });

    __setProfilesResult({ data: null, error: null });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tier).toBe("free");
    expect(result.current.canAccessVIP1).toBe(false);
  });
});

describe("normalizeTier canon tests", () => {
  it("normalizes all tier variants correctly", () => {
    expect(normalizeTier("Free / Miễn phí")).toBe("free");
    expect(normalizeTier("VIP1 / VIP1")).toBe("vip1");
    expect(normalizeTier("VIP2 / VIP2")).toBe("vip2");
    expect(normalizeTier("VIP3 / VIP3")).toBe("vip3");
    expect(normalizeTier("VIP3 II / VIP3 II")).toBe("vip3");
    expect(normalizeTier("VIP4 / VIP4")).toBe("vip4");
    expect(normalizeTier("VIP5 / VIP5")).toBe("vip5");
    expect(normalizeTier("VIP6 / VIP6")).toBe("vip6");
    expect(normalizeTier("VIP9 / Cấp VIP9")).toBe("vip9");
    expect(normalizeTier("Kids Level 1 / Trẻ em cấp 1")).toBe("kids_1" as TierId);
    expect(normalizeTier("Kids Level 2 / Trẻ em cấp 2")).toBe("kids_2" as TierId);
    expect(normalizeTier("Kids Level 3 / Trẻ em cấp 3")).toBe("kids_3" as TierId);
  });

  it("handles null/undefined as free tier", () => {
    expect(normalizeTier(null)).toBe("free");
    expect(normalizeTier(undefined)).toBe("free");
    expect(normalizeTier("")).toBe("free");
  });
});