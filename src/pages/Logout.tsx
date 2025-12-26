// src/pages/Logout.tsx — MB-BLUE-94.13.8 — 2025-12-25 (+0700)
/**
 * MercyBlade Blue — Logout (NUCLEAR)
 * Path: src/pages/Logout.tsx
 * Version: MB-BLUE-94.13.8 — 2025-12-25 (+0700)
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
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function bestEffortClearSupabaseAuthCookies() {
  try {
    // Best-effort: clear cookies that look like Supabase auth storage.
    // (Cookie names differ by setup; this is harmless if none exist.)
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (const c of cookies) {
      const [rawName] = c.split("=");
      const name = (rawName || "").trim();
      if (!name) continue;

      // Heuristic: clear likely supabase cookies
      // (Do NOT assume exact cookie names; clear only obvious ones.)
      if (name.startsWith("sb-") || name.includes("supabase") || name.includes("auth-token")) {
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
      // 1) Stop background refresh first (prevents “looping”)
      try {
        // exists in supabase-js v2 (optional)
        // @ts-ignore
        supabase.auth.stopAutoRefresh?.();
      } catch {}

      // 2) Supabase sign out (best-effort)
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        if (import.meta.env.DEV) console.warn("[logout] signOut failed (fail-open)", err);
      }

      // 3) Clear local/session storage (best-effort)
      try {
        // MercyBlade local flags
        localStorage.removeItem("mb_has_seen_onboarding");
        localStorage.removeItem("mb_redirect_after_onboarding");
        localStorage.removeItem("mercyblade_email");

        // ✅ Remove Supabase auth token keys (covers all envs)
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k) continue;
          if (k.startsWith("sb-") && k.endsWith("-auth-token")) keysToDelete.push(k);
        }
        keysToDelete.forEach((k) => localStorage.removeItem(k));

        // Also clear sessionStorage just in case
        sessionStorage.clear();
      } catch (err) {
        if (import.meta.env.DEV) console.warn("[logout] storage cleanup failed (fail-open)", err);
      }

      // 4) Best-effort cookie cleanup
      bestEffortClearSupabaseAuthCookies();

      // 5) Hard redirect clears in-memory session too
      window.location.replace("/auth?logged_out=1");
    };

    doLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Logging out…
    </div>
  );
};

export default Logout;
