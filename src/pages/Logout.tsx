// src/pages/Logout.tsx — MB-BLUE-94.13.9 — 2026-03-20 (-0600)
/**
 * MercyBlade Blue — Logout (NUCLEAR)
 * Path: src/pages/Logout.tsx
 * Version: MB-BLUE-94.13.9 — 2026-03-20 (-0600)
 *
 * GOAL (LOCKED INTENT):
 * - Stop auth auto-refresh (best-effort)
 * - Sign out (best-effort, global)
 * - Delete Supabase auth token from localStorage (sb-*-auth-token)
 * - Clear MercyBlade local flags
 * - Hard redirect to /auth?logged_out=1
 *
 * NOTES:
 * - Some Supabase auth state can exist in cookies depending on configuration.
 *   We attempt a best-effort cookie cleanup (non-fatal).
 * - This component must NEVER rely on React state.
 *
 * PATCH (2026-03-20):
 * - Remove legacy email-cache cleanup key: mercyblade_email
 * - Keep auth/session cleanup focused on real session and app flags
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function bestEffortClearSupabaseAuthCookies() {
  try {
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (const c of cookies) {
      const [rawName] = c.split("=");
      const name = (rawName || "").trim();
      if (!name) continue;

      if (
        name.startsWith("sb-") ||
        name.includes("supabase") ||
        name.includes("auth-token")
      ) {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
      }
    }
  } catch {
    // ignore
  }
}

const Logout = () => {
  useEffect(() => {
    const doLogout = async () => {
      try {
        // exists in supabase-js v2 (optional)
        // @ts-ignore
        supabase.auth.stopAutoRefresh?.();
      } catch {
        // ignore
      }

      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[logout] signOut failed (fail-open)", err);
        }
      }

      try {
        localStorage.removeItem("mb_has_seen_onboarding");
        localStorage.removeItem("mb_redirect_after_onboarding");

        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k) continue;
          if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
            keysToDelete.push(k);
          }
        }

        keysToDelete.forEach((k) => localStorage.removeItem(k));

        sessionStorage.clear();
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[logout] storage cleanup failed (fail-open)", err);
        }
      }

      bestEffortClearSupabaseAuthCookies();

      window.location.replace("/auth?logged_out=1");
    };

    void doLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Logging out…
    </div>
  );
};

export default Logout;