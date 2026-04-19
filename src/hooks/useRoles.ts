// PATH: src/hooks/useRoles.ts
// Custom Role Loader — Load user roles from database

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface UserRoles {
  isAdmin: boolean;
  isModerator: boolean;
  isContentEditor: boolean;
  loading: boolean;
}

const DEFAULT_ROLES: UserRoles = {
  isAdmin: false,
  isModerator: false,
  isContentEditor: false,
  loading: false,
};

export function useRoles() {
  const [roles, setRoles] = useState<UserRoles>({
    ...DEFAULT_ROLES,
    loading: true,
  });

  const mountedRef = useRef(false);
  const runIdRef   = useRef(0);

  const loadRoles = useCallback(async () => {
    const runId = ++runIdRef.current;

    try {
      const { data, error: userError } = await supabase.auth.getUser();

      if (!mountedRef.current || runId !== runIdRef.current) return;

      if (userError || !data?.user) {
        setRoles({ ...DEFAULT_ROLES });
        return;
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      if (!mountedRef.current || runId !== runIdRef.current) return;

      if (rolesError) {
        // Log only in dev — never leak DB error details to production console
        if (import.meta.env.DEV) {
          console.warn("[useRoles] Failed to load roles:", rolesError.message);
        }
        setRoles({ ...DEFAULT_ROLES });
        return;
      }

      const rolesList = (userRoles ?? []).map((r) => String(r.role ?? ""));

      setRoles({
        isAdmin: rolesList.includes("admin"),
        isModerator: rolesList.includes("moderator"),
        isContentEditor: rolesList.includes("content_editor"),
        loading: false,
      });
    } catch {
      if (!mountedRef.current || runId !== runIdRef.current) return;
      setRoles({ ...DEFAULT_ROLES });
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    void loadRoles();

    // Re-load roles only on meaningful auth events —
    // SIGNED_IN and SIGNED_OUT, not TOKEN_REFRESHED which fires on every
    // silent refresh and would cause unnecessary DB queries
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          void loadRoles();
        }
      },
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadRoles]);

  return roles;
}