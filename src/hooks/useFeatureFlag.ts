import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserHashBucket } from "@/lib/featureFlags";

/**
 * React hook — resolves a feature flag for the current signed-in user.
 *
 * Resolution order (kept in sync with the migrations at
 * supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and 20260426010000_feature_flags_rollout_percentage.sql, plus the
 * server-side helper in src/lib/featureFlags.ts):
 *   1. enabled_user_ids contains the current user                              → ON
 *   2. rollout_percentage IS NOT NULL AND bucket(userId) < percentage          → ON  (new)
 *   3. is_enabled = true                                                       → ON (global)
 *   4. else (no session, row missing, or error)                                → OFF
 *
 * Signature preserved from the pre-percentage version, so existing
 * callers do not need updating. `defaultValue` is returned while the
 * query is in flight (optimistic-off by default).
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
            .select("is_enabled, enabled_user_ids, rollout_percentage")
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

        // 2. Percentage rollout — only when both a percentage is
        //    configured AND we have a stable user id to bucket on.
        const percentage =
          typeof flagRes.data.rollout_percentage === "number"
            ? flagRes.data.rollout_percentage
            : null;
        if (percentage !== null && userId) {
          const bucket = getUserHashBucket(userId);
          if (bucket < percentage) {
            setEnabled(true);
            return;
          }
        }

        // 3. Global toggle.
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
