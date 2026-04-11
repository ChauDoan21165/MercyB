/**
 * Path: src/hooks/admin/useAdminAccess.ts
 * File: useAdminAccess.ts
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const isAdmin = safeLevel > 0;

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

function escapePostgrestValue(value: string): string {
  return value.replace(/,/g, "\\,");
}

async function fetchAdminProfile(userId: string): Promise<ProfileAdminRow | null> {
  const typedSupabase = supabase as any;
  const safeUserId = escapePostgrestValue(userId);

  const { data, error } = await typedSupabase
    .from("profiles")
    .select("id, user_id, email, is_admin, admin_level")
    .or(`user_id.eq.${safeUserId},id.eq.${safeUserId}`)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileAdminRow | null) ?? null;
}

async function fetchAdminRoleByRpc(
  userId: string,
): Promise<{ hasRole: boolean; level: number | null }> {
  const typedSupabase = supabase as any;

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
 */
export function useAdminAccess() {
  const [state, setState] = useState<AdminAccessState>({
    loading: true,
    permissions: defaultPermissions,
    userId: null,
    email: null,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;

      if (!user) {
        setState({
          loading: false,
          permissions: defaultPermissions,
          userId: null,
          email: null,
          error: null,
        });
        return;
      }

      let profile: ProfileAdminRow | null = null;
      let profileError: string | null = null;

      try {
        profile = await fetchAdminProfile(user.id);
      } catch (err: any) {
        console.error("[useAdminAccess] profile lookup error:", err);
        profileError = err?.message || "Unable to read admin profile";
      }

      const resolvedEmail = normalizeText(user.email) ?? normalizeText(profile?.email);

      if (profile && isAdminFromProfile(profile)) {
        const level = normalizeLevel(profile.admin_level);
        const resolvedLevel = level >= 1 ? level : 1;

        setState({
          loading: false,
          permissions: permissionsFromLevel(resolvedLevel),
          userId: user.id,
          email: resolvedEmail,
          error: null,
        });
        return;
      }

      let rpc = { hasRole: false, level: null as number | null };

      try {
        rpc = await fetchAdminRoleByRpc(user.id);
      } catch (err) {
        console.error("[useAdminAccess] rpc fallback error:", err);
      }

      if (rpc.hasRole || (rpc.level ?? 0) >= 1) {
        const resolvedLevel = Math.max(1, normalizeLevel(rpc.level ?? 1));

        setState({
          loading: false,
          permissions: permissionsFromLevel(resolvedLevel),
          userId: user.id,
          email: resolvedEmail,
          error: null,
        });
        return;
      }

      setState({
        loading: false,
        permissions: defaultPermissions,
        userId: user.id,
        email: resolvedEmail,
        error: profileError,
      });
    } catch (e: any) {
      console.error("[useAdminAccess] error:", e);
      setState({
        loading: false,
        permissions: defaultPermissions,
        userId: null,
        email: null,
        error: e?.message || "Admin check failed",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}