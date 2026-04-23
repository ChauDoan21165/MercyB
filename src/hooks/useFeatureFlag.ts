import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * React hook — resolves a feature flag for the current signed-in user.
 *
 * Resolution order (kept in sync with the migration at
 * supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and the server-side helper in src/lib/featureFlags.ts):
 *   1. If enabled_user_ids contains the current user       → ON
 *   2. Else if is_enabled = true                           → ON (global)
 *   3. Else (or on error, or no session, or row missing)   → OFF
 *
 * Signature preserved from the pre-cohort version, so existing callers do
 * not need updating. `defaultValue` is returned while the query is in
 * flight (optimistic-off by default).
 */
export const useFeatureFlag = (key: string, defaultValue = false) => {
  const [enabled, setEnabled] = useState<boolean>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFlag = async () => {
      try {
        const [userRes, flagRes] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("feature_flags")
            .select("is_enabled, enabled_user_ids")
            .eq("flag_key", key)
            .maybeSingle(),
        ]);

        if (flagRes.error) {
          console.warn("Feature flag error:", flagRes.error.message);
          return;
        }
        if (!isMounted || !flagRes.data) return;

        const userId = userRes.data.user?.id ?? null;
        const cohort = Array.isArray(flagRes.data.enabled_user_ids)
          ? flagRes.data.enabled_user_ids
          : [];

        // 1. Per-user cohort — ON overrides global OFF for this user.
        if (userId && cohort.includes(userId)) {
          setEnabled(true);
          return;
        }
        // 2. Global toggle.
        setEnabled(!!flagRes.data.is_enabled);
      } catch (err) {
        console.error("Error fetching feature flag:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFlag();

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { enabled, loading };
};
