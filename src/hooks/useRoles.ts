// PATH: src/hooks/useRoles.ts
// Custom Role Loader — Load user roles from database

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

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
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [roles, setRoles] = useState<UserRoles>({
    ...DEFAULT_ROLES,
    loading: true,
  });

  const mountedRef = useRef(false);
  const runIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    const runId = ++runIdRef.current;

    if (!userId) {
      setRoles({ ...DEFAULT_ROLES });
      return () => {
        mountedRef.current = false;
      };
    }

    setRoles((prev) => ({ ...prev, loading: true }));

    (async () => {
      try {
        const { data: userRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        if (!mountedRef.current || runId !== runIdRef.current) return;

        if (rolesError) {
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
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [userId]);

  return roles;
}