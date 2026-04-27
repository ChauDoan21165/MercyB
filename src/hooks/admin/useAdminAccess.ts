// Path: src/hooks/admin/useAdminAccess.ts
// File: useAdminAccess.ts
//
// Single source of truth for admin access in the frontend.
//
// Authoritative read order (matches the SQL truth):
//   1) RPC public.get_admin_level(_user_id uuid)
//        - SECURITY DEFINER, reads admin_users.level under
//          the function's own privileges; bypasses admin_users RLS.
//        - Defined in migrations 20251209061329 +
//          20260427010000 (EXECUTE granted to authenticated).
//   2) Direct SELECT from public.admin_users
//        - RLS allows the row owner to read their own row when
//          get_admin_level(auth.uid()) > 0; this still works because
//          get_admin_level itself bypasses RLS.
//        - Used only if the RPC is missing or returns null.
//   3) RPC public.has_role(_user_id, _role)
//        - Optional supporting check; treated as a boolean hint, not
//          as a level.
//
// Profile rows are read separately purely for the user's email — the
// `profiles` table has no `is_admin` or `admin_level` columns in this
// codebase, so reading them was the source of the prior false-zero
// bug (DB level 9 displayed as 0). Querying non-existent columns in
// PostgREST returns 42703, which we used to swallow into a default-0
// permission set.
//
// Security posture (unchanged):
//   - Permissions are derived from a server-issued integer level via
//     permissionsFromLevel(); no client-side flag is ever trusted as
//     "isAdmin = true".
//   - All thresholds (canEditSystem >= 9 etc.) match the SQL gates.
//   - On any error or anonymous session we fail closed to
//     defaultPermissions.

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

type ProfileEmailRow = {
  id?: string | null;
  user_id?: string | null;
  email?: string | null;
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
  if (value === null || value === undefined) return 0;
  const level = Number(value);
  return Number.isFinite(level) ? Math.max(0, level) : 0;
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function escapePostgrestValue(value: string): string {
  return value.replace(/,/g, "\\,");
}

function describeError(err: unknown): string {
  if (!err) return "";
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return String(err);
}

/**
 * Resolve the admin level from the authoritative source.
 *
 * Priority:
 *   1) RPC public.get_admin_level(_user_id) — SECURITY DEFINER, the
 *      canonical reader of admin_users.level.
 *   2) Direct SELECT level FROM admin_users WHERE user_id = … —
 *      backstop in case the RPC EXECUTE grant has drifted in some
 *      environment (the SECURITY DEFINER read still works for the
 *      row owner because admin_users RLS allows self-select once
 *      get_admin_level returns > 0; either way, RLS denies cross-
 *      user reads).
 *
 * Returns null when no signal is available — the caller falls back
 * to defaultPermissions (level 0).
 */
async function fetchAdminLevel(
  userId: string,
): Promise<{ level: number | null; sourceError: string | null }> {
  // Cast: get_admin_level is not in generated types yet (function
  // pre-dates the last types dump in some environments).
  const sb = supabase as unknown as {
    rpc: (
      name: string,
      args?: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message?: string } | null }>;
    from: (table: string) => {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{
            data: { level?: number | null } | null;
            error: { message?: string } | null;
          }>;
        };
      };
    };
  };

  // 1) RPC — primary, SECURITY DEFINER, bypasses admin_users RLS.
  try {
    const { data, error } = await sb.rpc("get_admin_level", {
      _user_id: userId,
    });
    if (!error && data !== null && typeof data !== "undefined") {
      return { level: normalizeLevel(data), sourceError: null };
    }
    if (error) {
      console.warn(
        "[useAdminAccess] get_admin_level RPC error (falling back):",
        error.message,
      );
    }
  } catch (err) {
    console.warn(
      "[useAdminAccess] get_admin_level RPC threw (falling back):",
      describeError(err),
    );
  }

  // 2) Direct admin_users read — backstop. The row owner can SELECT
  //    their own row; cross-user reads are still RLS-blocked.
  try {
    const { data, error } = await sb
      .from("admin_users")
      .select("level")
      .eq("user_id", escapePostgrestValue(userId))
      .maybeSingle();
    if (error) {
      // 42501 = permission denied; 42P01 = relation does not exist.
      // Both are "no signal" not "level 0" — return null so the
      // caller doesn't pretend the user is non-admin when we simply
      // couldn't read.
      return { level: null, sourceError: error.message ?? "admin_users read failed" };
    }
    if (data && typeof data.level === "number") {
      return { level: normalizeLevel(data.level), sourceError: null };
    }
    // No row at all → user is genuinely not in admin_users → level 0.
    return { level: 0, sourceError: null };
  } catch (err) {
    return { level: null, sourceError: describeError(err) };
  }
}

/**
 * Optional supporting check. Returns true only on an explicit
 * server-confirmed match. Failures are treated as "unknown" (false)
 * — never as a positive signal.
 */
async function fetchHasAdminRole(userId: string): Promise<boolean> {
  const sb = supabase as unknown as {
    rpc: (
      name: string,
      args?: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message?: string } | null }>;
  };

  try {
    const { data, error } = await sb.rpc("has_role", {
      _user_id: userId,
      _role: "admin" as AdminRole,
    });
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}

async function fetchProfileEmail(
  userId: string,
): Promise<ProfileEmailRow | null> {
  const sb = supabase as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        or: (clause: string) => {
          limit: (n: number) => {
            maybeSingle: () => Promise<{
              data: ProfileEmailRow | null;
              error: { message?: string } | null;
            }>;
          };
        };
      };
    };
  };

  // The `profiles` table only has the email/identity columns we need.
  // Match on either `id` or `user_id` since some profile rows index
  // on the auth.uid() while others index on a separate primary key.
  const safeUserId = escapePostgrestValue(userId);
  try {
    const { data, error } = await sb
      .from("profiles")
      .select("id, user_id, email")
      .or(`user_id.eq.${safeUserId},id.eq.${safeUserId}`)
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn(
        "[useAdminAccess] profile email lookup failed:",
        error.message,
      );
      return null;
    }
    return data ?? null;
  } catch (err) {
    console.warn(
      "[useAdminAccess] profile email lookup threw:",
      describeError(err),
    );
    return null;
  }
}

/**
 * Single Source of Truth for admin access in the frontend.
 *
 * Returned state never claims "isAdmin: true" without a server-issued
 * level >= 1. On any error the hook fails closed to level 0 with the
 * server-side error message exposed via state.error so the
 * /admin/* "Admin only" screen can show why instead of a silent zero.
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

      const [{ level, sourceError }, hasRole, profile] = await Promise.all([
        fetchAdminLevel(user.id),
        fetchHasAdminRole(user.id),
        fetchProfileEmail(user.id),
      ]);

      const resolvedEmail =
        normalizeText(user.email) ?? normalizeText(profile?.email);

      // Decide the effective level:
      //   - If RPC/admin_users gave us a number, trust it.
      //   - If both reads failed (level === null), the has_role hint
      //     is the only positive signal we have; treat as level 1
      //     (canViewAdmin) so the user isn't silently locked out
      //     when their level is genuinely >= 1 but reads timed out.
      //     This is a CONSERVATIVE upgrade — capped at 1 — and only
      //     fires when has_role explicitly returned true.
      let effectiveLevel = 0;
      if (typeof level === "number") {
        effectiveLevel = level;
      } else if (hasRole) {
        effectiveLevel = 1;
      }

      setState({
        loading: false,
        permissions: permissionsFromLevel(effectiveLevel),
        userId: user.id,
        email: resolvedEmail,
        error: level === null ? sourceError : null,
      });
    } catch (e) {
      console.error("[useAdminAccess] error:", e);
      setState({
        loading: false,
        permissions: defaultPermissions,
        userId: null,
        email: null,
        error: describeError(e) || "Admin check failed",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
