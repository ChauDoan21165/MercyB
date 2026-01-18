// src/hooks/__tests__/useUserAccess.snapshot.test.ts
//
// FIX: Vitest hoists vi.mock() to the top of the file.
// Your `mockGetUser` / `mockFrom` were declared AFTER vi.mock,
// so the factory ran before initialization → TDZ error.
// Solution: declare the spies INSIDE the vi.mock factory, then
// export small helpers to access them in tests.
//
// ALSO FIX (MB-BLUE-102.3a — 2026-01-15):
// - useUserAccess uses useAuth() which normally requires <AuthProvider>.
// - In hook unit tests, we mock useAuth() so tests don't crash with:
//   "useAuth must be used inside <AuthProvider>".

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUserAccess } from "../useUserAccess";
import { normalizeTier } from "@/lib/constants/tiers";

// ---- AuthProvider mock (hook-safe) ----
// useUserAccess calls useAuth(); in tests we don't mount <AuthProvider>,
// so we mock the hook to avoid context errors.
vi.mock("@/providers/AuthProvider", () => {
  return {
    useAuth: () => ({
      user: { id: "test-user" },
      session: { user: { id: "test-user" } },
      loading: false,
      // present in real provider; not used in these snapshots
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUpWithPassword: vi.fn(),
      resetPassword: vi.fn(),
    }),
  };
});

// ---- hoist-safe mocks (defined inside factory) ----
vi.mock("@/lib/supabaseClient", () => {
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();

  return {
    supabase: {
      auth: {
        getUser: mockGetUser,
      },
      from: mockFrom,
    },

    // Test-only accessors (not used by prod code)
    __mock: {
      mockGetUser,
      mockFrom,
    },
  };
});

// Pull the mock fns back out AFTER the mock is registered
// (safe because import is evaluated after vi.mock hoisting).
import { __mock } from "@/lib/supabaseClient";
const { mockGetUser, mockFrom } = __mock as {
  mockGetUser: ReturnType<typeof vi.fn>;
  mockFrom: ReturnType<typeof vi.fn>;
};

describe("useUserAccess snapshots - tier access logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Free tier user access snapshot", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_roles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "Free / Miễn phí" } },
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(result.current).toMatchInlineSnapshot(`
      {
        "canAccessVIP1": false,
        "canAccessVIP2": false,
        "canAccessVIP3": false,
        "canAccessVIP3II": false,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "tier": "free",
      }
    `);
  });

  it("VIP1 tier user access snapshot", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-vip1" } },
      error: null,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_roles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "VIP1 / VIP1" } },
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("vip1");
    });

    expect(result.current).toMatchInlineSnapshot(`
      {
        "canAccessVIP1": true,
        "canAccessVIP2": false,
        "canAccessVIP3": false,
        "canAccessVIP3II": false,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "tier": "vip1",
      }
    `);
  });

  it("VIP3II tier user access snapshot", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-vip3ii" } },
      error: null,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_roles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "VIP3 II / VIP3 II" } },
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("vip3ii");
    });

    expect(result.current).toMatchInlineSnapshot(`
      {
        "canAccessVIP1": true,
        "canAccessVIP2": true,
        "canAccessVIP3": true,
        "canAccessVIP3II": true,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "tier": "vip3ii",
      }
    `);
  });

  it("VIP6 tier user access snapshot", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-vip6" } },
      error: null,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_roles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "VIP6 / VIP6" } },
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.tier).toBe("vip6");
    });

    expect(result.current).toMatchInlineSnapshot(`
      {
        "canAccessVIP1": true,
        "canAccessVIP2": true,
        "canAccessVIP3": true,
        "canAccessVIP3II": true,
        "canAccessVIP4": true,
        "canAccessVIP5": true,
        "canAccessVIP6": true,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": true,
        "isDemoMode": false,
        "tier": "vip6",
      }
    `);
  });

  it("Admin user access snapshot (full VIP9 access)", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "admin-user" } },
      error: null,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_roles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { role: "admin" },
            error: null,
          }),
        };
      }
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "Free / Miễn phí" } },
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    expect(result.current).toMatchInlineSnapshot(`
      {
        "canAccessVIP1": true,
        "canAccessVIP2": true,
        "canAccessVIP3": true,
        "canAccessVIP3II": true,
        "canAccessVIP4": true,
        "canAccessVIP5": true,
        "canAccessVIP6": true,
        "canAccessVIP9": true,
        "isAdmin": true,
        "isAuthenticated": true,
        "isDemoMode": false,
        "tier": "vip9",
      }
    `);
  });

  it("Unauthenticated user access snapshot (demo mode)", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useUserAccess());

    await waitFor(() => {
      expect(result.current.isDemoMode).toBe(true);
    });

    expect(result.current).toMatchInlineSnapshot(`
      {
        "canAccessVIP1": false,
        "canAccessVIP2": false,
        "canAccessVIP3": false,
        "canAccessVIP3II": false,
        "canAccessVIP4": false,
        "canAccessVIP5": false,
        "canAccessVIP6": false,
        "canAccessVIP9": false,
        "isAdmin": false,
        "isAuthenticated": false,
        "isDemoMode": true,
        "tier": "free",
      }
    `);
  });
});

describe("normalizeTier canon tests", () => {
  it("normalizes all tier variants correctly", () => {
    expect(normalizeTier("Free / Miễn phí")).toBe("free");
    expect(normalizeTier("VIP1 / VIP1")).toBe("vip1");
    expect(normalizeTier("VIP2 / VIP2")).toBe("vip2");
    expect(normalizeTier("VIP3 / VIP3")).toBe("vip3");
    expect(normalizeTier("VIP3 II / VIP3 II")).toBe("vip3ii");
    expect(normalizeTier("VIP4 / VIP4")).toBe("vip4");
    expect(normalizeTier("VIP5 / VIP5")).toBe("vip5");
    expect(normalizeTier("VIP6 / VIP6")).toBe("vip6");
    expect(normalizeTier("VIP9 / Cấp VIP9")).toBe("vip9");
    expect(normalizeTier("Kids Level 1 / Trẻ em cấp 1")).toBe("kids_1");
    expect(normalizeTier("Kids Level 2 / Trẻ em cấp 2")).toBe("kids_2");
    expect(normalizeTier("Kids Level 3 / Trẻ em cấp 3")).toBe("kids_3");
  });

  it("handles null/undefined as free tier", () => {
    expect(normalizeTier(null)).toBe("free");
    expect(normalizeTier(undefined)).toBe("free");
    expect(normalizeTier("")).toBe("free");
  });
});
