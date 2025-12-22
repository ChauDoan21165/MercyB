import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "admin";

export type AdminPermissions = {
  level: number;
  isAdmin: boolean;
  isAdminMaster: boolean;

  // “Capabilities” (you can tune these thresholds later)
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
  const isAdmin = level > 0;
  return {
    level,
    isAdmin,
    isAdminMaster: level === 10,

    canViewAdmin: isAdmin,
    canManageUsers: level >= 3,
    canManageContent: level >= 5,
    canManagePayments: level >= 7,
    canManageAdmins: level >= 8,
    canEditSystem: level >= 9,
  };
}

/**
 * Single Source of Truth for admin access in the frontend.
 * - Uses RPC has_role + get_admin_level (if available)
 * - Falls back safely when functions are missing
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
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
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

      // 1) has_role: base gate
      const { data: hasRole, error: roleErr } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin" as AdminRole,
      });

      if (roleErr) {
        // If your DB doesn’t have has_role, fail closed (no admin)
        console.error("[useAdminAccess] has_role error:", roleErr);
        setState({
          loading: false,
          permissions: defaultPermissions,
          userId: user.id,
          email: user.email ?? null,
          error: "Unable to verify admin role",
        });
        return;
      }

      if (!hasRole) {
        setState({
          loading: false,
          permissions: defaultPermissions,
          userId: user.id,
          email: user.email ?? null,
          error: null,
        });
        return;
      }

      // 2) admin level (optional but recommended)
      let level = 1;
      try {
        const { data: lvl, error: lvlErr } = await supabase.rpc("get_admin_level", {
          _user_id: user.id,
        });
        if (!lvlErr && typeof lvl === "number") level = lvl;
      } catch {
        // If RPC missing, default level=1
      }

      const perms = permissionsFromLevel(level);

      setState({
        loading: false,
        permissions: perms,
        userId: user.id,
        email: user.email ?? null,
        error: null,
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
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
