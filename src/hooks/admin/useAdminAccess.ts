/**
 * Path: src/hooks/admin/useAdminAccess.ts
 * File: useAdminAccess.ts
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { qk } from "@/lib/queries/keys";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";

export type AdminRole = "admin";

export type AdminPermissions = {
  level: number;
  isAdmin: boolean;
  isAdminMaster: boolean;

  canViewAdmin: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canManagePayments: boolean;
  canManageAdmins: boolean;
  canEditSystem: boolean;
};

type AdminAccessState = {
  loading: boolean;
  permissions: AdminPermissions;
  userId: string | null;
  email: string | null;
  error: string | null;
};

type ProfileAdminRow = {
  user_id?: string | null;
  id?: string | null;
  email?: string | null;
  is_admin?: boolean | null;
  admin_level?: number | null;
};

const defaultPermissions: AdminPermissions = {
  level: 0,
  isAdmin: false,
  isAdminMaster: false,

  canViewAdmin: false,
  canManageUsers: false,
  canManageContent: false,
  canManagePayments: false,
  canManageAdmins: false,
  canEditSystem: false,
};

function permissionsFromLevel(level: number): AdminPermissions {
  const safeLevel = Number.isFinite(level) ? Math.max(0, level) : 0;
  // Must match the SQL admin policy in
  // supabase/migrations/20260701000000_subscriptions_rls_select_policies.sql:
  //   USING (public.get_admin_level(auth.uid()) >= 9)
  // If this gate admits a user that the SQL policy rejects, the admin
  // dashboards (AdminSubscriptions, CostMonitoring, AdminDashboard,
  // AdminFeedbackPage) render with broken/empty data instead of
  // refusing access cleanly. See !94 callsite verification for the
  // analysis that motivated this alignment.
  const isAdmin = safeLevel >= 9;

  return {
    level: safeLevel,
    isAdmin,
    isAdminMaster: safeLevel >= 10,

    canViewAdmin: isAdmin,
    canManageUsers: safeLevel >= 3,
    canManageContent: safeLevel >= 5,
    canManagePayments: safeLevel >= 7,
    canManageAdmins: safeLevel >= 8,
    canEditSystem: safeLevel >= 9,
  };
}

function normalizeLevel(value: unknown): number {
  const level = Number(value ?? 0);
  return Number.isFinite(level) ? Math.max(0, level) : 0;
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function isAdminFromProfile(profile: ProfileAdminRow | null): boolean {
  if (!profile) return false;
  const level = normalizeLevel(profile.admin_level);
  return Boolean(profile.is_admin) || level >= 1;
}

async function fetchAdminRoleByRpc(
  userId: string,
): Promise<{ hasRole: boolean; level: number | null }> {
  const typedSupabase = supabase as unknown as {
    rpc: (
      fn: string,
      args: Record<string, unknown>
    ) => Promise<{ data: unknown; error: { message?: string } | null }>;
  };

  let hasRole = false;
  let level: number | null = null;

  try {
    const { data, error } = await typedSupabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin" as AdminRole,
    });

    if (!error) {
      hasRole = Boolean(data);
    }
  } catch {
    // ignore RPC absence/failure
  }

  try {
    const { data, error } = await typedSupabase.rpc("get_admin_level", {
      _user_id: userId,
    });

    if (!error && data !== null && typeof data !== "undefined") {
      level = normalizeLevel(data);
    }
  } catch {
    // ignore RPC absence/failure
  }

  return { hasRole, level };
}

/**
 * Single Source of Truth for admin access in the frontend.
 *
 * New priority:
 * 1) Read admin truth directly from `profiles`
 * 2) Use RPCs only as optional fallback/support
 * 3) Never fail closed just because RPCs are missing
 *
 * Why:
 * - Your real admin data already lives in `profiles.is_admin` + `profiles.admin_level`
 * - RPCs may be missing, stale, or depend on a different role system
 *
 * Profile read goes through useProfileQuery so it shares the cache
 * entry with every other consumer of `qk.profile(userId)`. The earlier
 * `.or(user_id.eq.X, id.eq.X)` defensive lookup is dropped: the rest
 * of the codebase already keys on `profiles.id = auth.users.id`
 * (see src/lib/queries/useProfileQuery.ts), and an out-of-band row
 * keyed only by `user_id` would be invisible to every other reader
 * anyway.
 */
export function useAdminAccess() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery(user?.id ?? null);

  const [rpcState, setRpcState] = useState<{
    loading: boolean;
    hasRole: boolean;
    level: number | null;
    error: string | null;
  }>({ loading: false, hasRole: false, level: null, error: null });

  const profile = (profileQuery.data ?? null) as ProfileAdminRow | null;
  const profileLoading = Boolean(user?.id) && profileQuery.isLoading;
  const profileErrorMessage = profileQuery.error
    ? (profileQuery.error as Error).message
    : null;
  const profileIsAdmin = isAdminFromProfile(profile);

  // Only consult the admin RPCs when the profile lookup itself didn't
  // surface admin status. Mirrors the original priority: profile first,
  // RPCs as fallback.
  useEffect(() => {
    if (!user) {
      setRpcState({ loading: false, hasRole: false, level: null, error: null });
      return;
    }
    if (profileLoading) return;
    if (profileIsAdmin) {
      setRpcState({ loading: false, hasRole: false, level: null, error: null });
      return;
    }

    let cancelled = false;
    setRpcState((s) => ({ ...s, loading: true, error: null }));
    void (async () => {
      try {
        const rpc = await fetchAdminRoleByRpc(user.id);
        if (cancelled) return;
        setRpcState({
          loading: false,
          hasRole: rpc.hasRole,
          level: rpc.level,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        console.error("[useAdminAccess] rpc fallback error:", err);
        setRpcState({
          loading: false,
          hasRole: false,
          level: null,
          error: (err instanceof Error ? err.message : null) || "Admin RPC failed",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, profileLoading, profileIsAdmin]);

  const state = useMemo<AdminAccessState>(() => {
    if (!user) {
      return {
        loading: false,
        permissions: defaultPermissions,
        userId: null,
        email: null,
        error: null,
      };
    }

    if (profileLoading || rpcState.loading) {
      return {
        loading: true,
        permissions: defaultPermissions,
        userId: user.id,
        email: normalizeText(user.email) ?? normalizeText(profile?.email),
        error: null,
      };
    }

    const resolvedEmail =
      normalizeText(user.email) ?? normalizeText(profile?.email);

    if (profileIsAdmin) {
      const level = normalizeLevel(profile?.admin_level);
      const resolvedLevel = level >= 1 ? level : 1;
      return {
        loading: false,
        permissions: permissionsFromLevel(resolvedLevel),
        userId: user.id,
        email: resolvedEmail,
        error: null,
      };
    }

    if (rpcState.hasRole || (rpcState.level ?? 0) >= 1) {
      const resolvedLevel = Math.max(1, normalizeLevel(rpcState.level ?? 1));
      return {
        loading: false,
        permissions: permissionsFromLevel(resolvedLevel),
        userId: user.id,
        email: resolvedEmail,
        error: null,
      };
    }

    return {
      loading: false,
      permissions: defaultPermissions,
      userId: user.id,
      email: resolvedEmail,
      error: profileErrorMessage,
    };
  }, [
    user,
    profile,
    profileLoading,
    profileIsAdmin,
    profileErrorMessage,
    rpcState,
  ]);

  const refresh = useCallback(async () => {
    if (!user) return;
    await queryClient.invalidateQueries({ queryKey: qk.profile(user.id) });
    setRpcState({ loading: false, hasRole: false, level: null, error: null });
  }, [queryClient, user]);

  return { ...state, refresh };
}
