// src/hooks/__tests__/useUserAccess.snapshot.test.ts
//
// MB-BLUE alignment (AUTH-DRIVEN, ENTITLEMENT-DRIVEN)
//
// IMPORTANT:
// - useUserAccess reads auth state from useAuth().
// - It queries profiles only for admin metadata.
// - Tier is resolved from fetchCurrentEntitlement() / resolveEntitlementTier().
// - Current product model:
//   - free
//   - premium_month
//   - premium_year

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUserAccess } from "../useUserAccess";
import { normalizeTier } from "@/lib/constants/tiers";
import type { UserAccess } from "../useUserAccess";

// ---- AuthProvider mock ----
vi.mock("@/providers/AuthProvider", () => {
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
vi.mock("@/lib/supabaseClient", () => {
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

// ---- authService mock (tier comes from entitlement now) ----
vi.mock("@/lib/authService", () => {
  let entitlement: any = null;

  const __setEntitlement = (next: any) => {
    entitlement = next;
  };

  return {
    fetchCurrentEntitlement: vi.fn(async () => entitlement),
    resolveEntitlementTier: vi.fn((ent: any) => {
      const raw = ent?.tier ?? "free";

      if (raw === "premium_month") return "premium_month";
      if (raw === "premium_year") return "premium_year";
      return "free";
    }),
    __mock: { __setEntitlement },
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

import * as AuthServiceMod from "@/lib/authService";
const { __setEntitlement } = ((AuthServiceMod as any).__mock ?? {}) as {
  __setEntitlement: (next: any) => void;
};

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

describe("useUserAccess snapshots - current tier model", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __setAuth({ user: null, isLoading: false });
    __setProfilesResult({ data: null, error: null });
    __setEntitlement(null);
  });

  it("Free tier user access snapshot", async () => {
    __setAuth({ user: { email: "free@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "free@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "free" });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.tier).toBe("free");
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
        "tier": "free",
      }
    `);
  });

  it("Monthly premium user access snapshot", async () => {
    __setAuth({ user: { email: "month@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "month@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "premium_month" });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("premium_month");
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
        "tier": "premium_month",
      }
    `);
  });

  it("Yearly premium user access snapshot", async () => {
    __setAuth({ user: { email: "year@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "year@example.com", is_admin: false, admin_level: 0 },
      error: null,
    });

    __setEntitlement({ tier: "premium_year" });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("premium_year");
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
        "tier": "premium_year",
      }
    `);
  });

  it("Admin user access snapshot", async () => {
    __setAuth({ user: { email: "admin@example.com" }, isLoading: false });

    __setProfilesResult({
      data: { email: "admin@example.com", is_admin: true, admin_level: 9 },
      error: null,
    });

    __setEntitlement({ tier: "free" });

    const { result } = renderHook(() => useUserAccess());

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
        "tier": "free",
      }
    `);
  });

  it("Unauthenticated user access snapshot (demo mode)", async () => {
    __setAuth({ user: null, isLoading: false });

    const { result } = renderHook(() => useUserAccess());

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
        "tier": "free",
      }
    `);
  });

  it("Auth loading: stays loading until auth resolves", async () => {
    __setAuth({ user: null, isLoading: true });

    const { result, rerender } = renderHook(() => useUserAccess());

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

  it("Missing profiles row: still resolves entitlement tier", async () => {
    __setAuth({ user: { email: "missing@example.com" }, isLoading: false });

    __setProfilesResult({ data: null, error: null });
    __setEntitlement({ tier: "free" });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tier).toBe("free");
  });
});

describe("normalizeTier canon tests", () => {
  it("normalizes current tier variants correctly", () => {
    expect(normalizeTier("free")).toBe("free");
    expect(normalizeTier("premium_month")).toBe("premium_month");
    expect(normalizeTier("premium_year")).toBe("premium_year");
  });

  it("handles null/undefined as free tier", () => {
    expect(normalizeTier(null)).toBe("free");
    expect(normalizeTier(undefined)).toBe("free");
    expect(normalizeTier("")).toBe("free");
  });
});