// src/lib/placement/usePlacementFlag.ts
//
// Placement-test feature-flag resolver.
//
// The shared `useFeatureFlag` hook (owned by CC1) only inspects the
// `is_enabled` boolean. That's correct for flags that are flipped on
// globally, but the placement-test rollout uses a per-user opt-in
// column (`enabled_user_ids`) so we can enable the beta for specific
// accounts before the wide launch.
//
// Resolution order (any positive match → enabled):
//   1. row not found / error          → disabled (fail-closed)
//   2. is_enabled === true            → enabled globally
//   3. enabled_user_ids contains uid  → enabled for this user
//   4. otherwise                      → disabled
//
// We intentionally do NOT modify `useFeatureFlag` itself — that's a
// shared utility and this branch should not reshape it. If/when CC1
// extends it to support per-user opt-in natively, this helper can be
// removed and callers swapped back.

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const FLAG_KEY = 'placement_test_enabled';

export type PlacementFlagState = {
  enabled: boolean;
  loading: boolean;
};

export function usePlacementFlag(userId: string | null | undefined): PlacementFlagState {
  const [state, setState] = useState<PlacementFlagState>({
    enabled: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Select both columns defensively. If `enabled_user_ids` is not
        // yet in the schema (e.g., a fresh clone), Supabase returns an
        // error — we fall back to the global-only path below.
        const { data, error } = await supabase
          .from('feature_flags')
          .select('is_enabled, enabled_user_ids')
          .eq('flag_key', FLAG_KEY)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          // Retry without the extended column so we at least honour the
          // global toggle when the per-user column doesn't exist in this
          // environment.
          const fallback = await supabase
            .from('feature_flags')
            .select('is_enabled')
            .eq('flag_key', FLAG_KEY)
            .maybeSingle();
          if (cancelled) return;
          if (fallback.error) {
            console.warn('[usePlacementFlag] flag fetch error:', fallback.error.message);
            setState({ enabled: false, loading: false });
            return;
          }
          const isEnabled = Boolean(
            (fallback.data as { is_enabled?: boolean | null } | null)?.is_enabled,
          );
          setState({ enabled: isEnabled, loading: false });
          return;
        }

        if (!data) {
          setState({ enabled: false, loading: false });
          return;
        }

        const row = data as {
          is_enabled?: boolean | null;
          enabled_user_ids?: string[] | null;
        };
        const globalOn = Boolean(row.is_enabled);
        const perUserOn =
          !!userId &&
          Array.isArray(row.enabled_user_ids) &&
          row.enabled_user_ids.includes(userId);

        setState({ enabled: globalOn || perUserOn, loading: false });
      } catch (err) {
        if (cancelled) return;
        console.warn(
          '[usePlacementFlag] threw:',
          (err as Error)?.message ?? String(err),
        );
        setState({ enabled: false, loading: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return state;
}
