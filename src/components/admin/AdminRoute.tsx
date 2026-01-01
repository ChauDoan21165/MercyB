// src/components/admin/AdminRoute.tsx
// MB-BLUE-101.7 — 2026-01-01 (+0700)
/**
 * ADMIN GUARD (LOCKED)
 * - Authority comes ONLY from DB truth:
 *   get_admin_level(auth.uid()) >= 9
 * - If RPC fails => deny (fail-safe)
 * - No env allowlists, no duplicated rules.
 *
 * FIX (101.7):
 * - Prefer canonical no-arg RPC: get_admin_level()
 * - If needed, fall back ONLY to the real policy-bound signature:
 *   get_admin_level(_user_id uuid)
 * - Treat non-numeric/NaN results as deny (fail-safe).
 */

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  children: React.ReactNode;
};

type GuardState =
  | { status: "checking" }
  | { status: "allowed" }
  | { status: "denied" };

export default function AdminRoute({ children }: Props) {
  const location = useLocation();
  const [state, setState] = useState<GuardState>({ status: "checking" });

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const { data: authRes, error: authErr } = await supabase.auth.getUser();
        const userId = authRes?.user?.id;

        if (authErr || !userId) {
          if (!alive) return;
          setState({ status: "denied" });
          return;
        }

        let levelData: unknown = null;

        // ✅ Attempt A: canonical no-arg call (uses auth.uid() in SQL)
        {
          const { data, error } = await supabase.rpc("get_admin_level");
          if (!error) levelData = data;
        }

        // ✅ Attempt B: fall back to policy-bound signature: (_user_id uuid)
        if (levelData === null || levelData === undefined) {
          const { data, error } = await supabase.rpc("get_admin_level", {
            _user_id: userId,
          });

          if (error) {
            if (!alive) return;
            setState({ status: "denied" });
            return;
          }

          levelData = data;
        }

        const level =
          typeof levelData === "number" ? levelData : Number(levelData);

        if (!alive) return;

        if (!Number.isFinite(level)) {
          setState({ status: "denied" });
          return;
        }

        setState(level >= 9 ? { status: "allowed" } : { status: "denied" });
      } catch {
        if (!alive) return;
        setState({ status: "denied" });
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "checking") {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ opacity: 0.75, fontSize: 14 }}>
          Checking admin access…
        </div>
      </div>
    );
  }

  if (state.status !== "allowed") {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname, reason: "admin_denied" }}
      />
    );
  }

  return <>{children}</>;
}
