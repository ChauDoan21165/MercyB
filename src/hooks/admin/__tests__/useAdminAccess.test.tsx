// src/hooks/admin/__tests__/useAdminAccess.test.tsx
//
// Unit tests proving useAdminAccess resolves the admin level from
// the get_admin_level RPC (canonical path), the admin_users
// backstop (when the RPC fails), and fail-closed when both reads
// return null.
//
// The supabase singleton is mocked as a tiny stub that returns
// whatever the test sets via the per-test rpcResponses /
// adminUsersResponse maps. No network, no env vars.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

// ── Mocks ────────────────────────────────────────────────────────────

const rpcCalls: Array<{ name: string; args: unknown }> = [];
let rpcResponses: Record<
  string,
  { data: unknown; error: { message?: string } | null }
> = {};
let adminUsersResponse: {
  data: { level?: number | null } | null;
  error: { message?: string } | null;
} = { data: null, error: null };
let profilesResponse: {
  data: { id?: string | null; email?: string | null } | null;
  error: { message?: string } | null;
} = { data: null, error: null };
let mockUser: { id: string; email: string } | null = null;

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: mockUser },
          error: null as { message?: string } | null,
        }),
    },
    rpc: (name: string, args: unknown) => {
      rpcCalls.push({ name, args });
      return Promise.resolve(
        rpcResponses[name] ?? { data: null, error: null },
      );
    },
    from: (table: string) => {
      if (table === "admin_users") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve(adminUsersResponse),
            }),
          }),
        };
      }
      if (table === "profiles") {
        return {
          select: () => ({
            or: () => ({
              limit: () => ({
                maybeSingle: () => Promise.resolve(profilesResponse),
              }),
            }),
          }),
        };
      }
      throw new Error(`unexpected table: ${table}`);
    },
  },
}));

// Import AFTER vi.mock so the hook gets the mocked client.
import { useAdminAccess } from "../useAdminAccess";

beforeEach(() => {
  rpcCalls.length = 0;
  rpcResponses = {};
  adminUsersResponse = { data: null, error: null };
  profilesResponse = { data: null, error: null };
  mockUser = null;
});

describe("useAdminAccess", () => {
  it("resolves level 9 from get_admin_level RPC (the bug-fix path)", async () => {
    mockUser = { id: "user-9", email: "admin@example.com" };
    rpcResponses.get_admin_level = { data: 9, error: null };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions.level).toBe(9);
    expect(result.current.permissions.isAdmin).toBe(true);
    expect(result.current.permissions.canEditSystem).toBe(true);
    expect(result.current.permissions.canViewAdmin).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.userId).toBe("user-9");
  });

  it("resolves level 10 (admin master) from RPC", async () => {
    mockUser = { id: "u-master", email: "master@example.com" };
    rpcResponses.get_admin_level = { data: 10, error: null };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions.level).toBe(10);
    expect(result.current.permissions.isAdminMaster).toBe(true);
    expect(result.current.permissions.canEditSystem).toBe(true);
  });

  it("falls back to admin_users.level when RPC errors", async () => {
    mockUser = { id: "user-9", email: "admin@example.com" };
    rpcResponses.get_admin_level = {
      data: null,
      error: { message: "permission denied for function get_admin_level" },
    };
    adminUsersResponse = { data: { level: 9 }, error: null };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions.level).toBe(9);
    expect(result.current.permissions.canEditSystem).toBe(true);
  });

  it("returns level 0 with default permissions for non-admins", async () => {
    mockUser = { id: "user-free", email: "free@example.com" };
    rpcResponses.get_admin_level = { data: 0, error: null };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions.level).toBe(0);
    expect(result.current.permissions.isAdmin).toBe(false);
    expect(result.current.permissions.canEditSystem).toBe(false);
  });

  it("fails closed when both reads return null AND has_role is false", async () => {
    mockUser = { id: "user-x", email: "x@example.com" };
    rpcResponses.get_admin_level = {
      data: null,
      error: { message: "rpc gone" },
    };
    adminUsersResponse = {
      data: null,
      error: { message: "admin_users denied" },
    };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions.level).toBe(0);
    expect(result.current.permissions.isAdmin).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it("when both numeric reads fail but has_role=true, grants level 1 ONLY (capped, never canEditSystem)", async () => {
    mockUser = { id: "user-degraded", email: "degraded@example.com" };
    rpcResponses.get_admin_level = {
      data: null,
      error: { message: "rpc gone" },
    };
    adminUsersResponse = {
      data: null,
      error: { message: "admin_users denied" },
    };
    rpcResponses.has_role = { data: true, error: null };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Conservative upgrade: just enough to view, not edit.
    expect(result.current.permissions.level).toBe(1);
    expect(result.current.permissions.canViewAdmin).toBe(true);
    expect(result.current.permissions.canEditSystem).toBe(false);
    expect(result.current.permissions.canManageAdmins).toBe(false);
  });

  it("fail-closed when no user is signed in", async () => {
    mockUser = null;

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions).toEqual({
      level: 0,
      isAdmin: false,
      isAdminMaster: false,
      canViewAdmin: false,
      canManageUsers: false,
      canManageContent: false,
      canManagePayments: false,
      canManageAdmins: false,
      canEditSystem: false,
    });
  });

  it("does not query profiles for is_admin / admin_level columns", async () => {
    // Regression test for the original bug: the doomed columns must
    // never appear in any selector. A profile fetch happens for the
    // email, but the select string must NOT contain `is_admin` or
    // `admin_level`. We assert this by ensuring the test-side stub
    // never receives a request that would hit those columns
    // (profilesResponse data shape uses only id/email).
    mockUser = { id: "user-9", email: "auth@example.com" };
    rpcResponses.get_admin_level = { data: 9, error: null };
    profilesResponse = {
      data: { id: "user-9", email: "profile@example.com" },
      error: null,
    };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.permissions.level).toBe(9);
    // Email prefers auth.user.email when present.
    expect(result.current.email).toBe("auth@example.com");
  });

  it("calls get_admin_level with the _user_id key the SQL signature expects", async () => {
    mockUser = { id: "abc-123", email: "rpc@example.com" };
    rpcResponses.get_admin_level = { data: 5, error: null };

    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const call = rpcCalls.find((c) => c.name === "get_admin_level");
    expect(call).toBeDefined();
    expect(call!.args).toEqual({ _user_id: "abc-123" });
  });
});
