// PATH: src/lib/useEntitlements.ts
// File: useEntitlements.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FAIL_CLOSED_ENTITLEMENT,
  fetchCurrentEntitlement,
  resolveEntitlementTier,
  type BackendEntitlement,
} from "@/lib/authService";
import {
  fetchActiveGiftSubscription,
  type ActiveGiftSubscription,
} from "@/lib/gift/fetchActiveGiftSubscription";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

type Ent = BackendEntitlement & {
  billing_tier: string;
  vip_tier: string;
  vip_rank: number;
  features: Record<string, unknown>;
  updated_at: string;
};

function normalizeTier(tier: string | null | undefined): string {
  return String(tier || "level0").toLowerCase().trim();
}

function isPremiumStatus(status: string | null | undefined): boolean {
  const s = String(status || "").toLowerCase().trim();
  return s === "active" || s === "trialing";
}

function isPaidBillingTier(tier: string): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function isLegacyVipTier(tier: string): boolean {
  return /^vip(\d+)$/.test(tier);
}

function tierToRank(tier: string, entitlement?: BackendEntitlement): number {
  const s = normalizeTier(tier);

  if (s === "level0") return 0;

  if (isPaidBillingTier(s)) {
    const premiumActive =
      entitlement?.is_premium === true && isPremiumStatus(entitlement?.status);
    return premiumActive ? 9 : 0;
  }

  const m = s.match(/^vip(\d+)$/);
  if (!m) return 0;

  const n = Number(m[1]);
  return Number.isFinite(n) ? n : 0;
}

function hasPaidRepoAccess(ent: BackendEntitlement, resolvedTier: string): boolean {
  const tier = normalizeTier(resolvedTier);
  const premiumActive = ent.is_premium === true && isPremiumStatus(ent.status);
  if (isPaidBillingTier(tier)) return premiumActive;
  return false;
}

function buildFeatures(
  entitlement: BackendEntitlement,
  resolvedTier: string,
  vipRank: number,
) {
  const normalizedTier = normalizeTier(resolvedTier);
  const premiumActive =
    entitlement.is_premium === true && isPremiumStatus(entitlement.status);
  const paidRepoAccess = hasPaidRepoAccess(entitlement, normalizedTier);

  return {
    premium: premiumActive,
    is_premium: premiumActive,
    paid_repo_access: paidRepoAccess,
    premium_monthly: paidRepoAccess && normalizedTier === "premium_month",
    premium_yearly: paidRepoAccess && normalizedTier === "premium_year",
    has_legacy_vip_label: isLegacyVipTier(normalizedTier),
    vip_tier: normalizedTier,
    vip_rank: vipRank,
    level1: paidRepoAccess || vipRank >= 1,
    level2: paidRepoAccess || vipRank >= 2,
    level3: paidRepoAccess || vipRank >= 3,
    level4: paidRepoAccess || vipRank >= 4,
    level5: paidRepoAccess || vipRank >= 5,
    level6: paidRepoAccess || vipRank >= 6,
    level7: paidRepoAccess || vipRank >= 7,
    level8: paidRepoAccess || vipRank >= 8,
    level9: paidRepoAccess || vipRank >= 9,
  } as Record<string, unknown>;
}

/**
 * Overlay an active gift-code subscription onto a non-premium
 * entitlement. The redeem-access-code RPC writes to
 * `user_subscriptions` only; the me-entitlement Edge Function reads
 * from the unified `subscriptions` table only. Until those are
 * bridged server-side, gift redeemers would otherwise show as Free.
 *
 * The synthesized entitlement deliberately puts the legacy VIP key
 * (e.g. "vip9") into `tier_id`. `resolveEntitlementTier` and
 * `tierToRank` both expect that field to carry one of `premium_year`,
 * `premium_month`, or `vipN` — matching the contract those resolvers
 * already understand. If `vip_key` is missing we leave `tier_id`
 * untouched so the resolver falls back to text-based inference.
 */
function applyGiftSubscriptionOverlay(
  base: BackendEntitlement,
  giftSub: ActiveGiftSubscription,
): BackendEntitlement {
  return {
    ...base,
    is_premium: true,
    status: "active",
    source: "gift_code",
    expires_at: giftSub.current_period_end,
    current_period_end: giftSub.current_period_end,
    plan_name: giftSub.plan_name ?? base.plan_name ?? null,
    tier_id: giftSub.vip_key ?? base.tier_id ?? null,
  };
}

function buildEntitlement(entitlement: BackendEntitlement): Ent {
  const resolvedTier = normalizeTier(resolveEntitlementTier(entitlement));
  const vipRank = tierToRank(resolvedTier, entitlement);

  return {
    ...entitlement,
    billing_tier: resolvedTier,
    vip_tier: resolvedTier,
    vip_rank: vipRank,
    features: buildFeatures(entitlement, resolvedTier, vipRank),
    updated_at: new Date().toISOString(),
  };
}

export function useEntitlements() {
  const { user, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<Ent | null>(null);
  const [loading, setLoading] = useState(true);

  const requestIdRef = useRef(0);

  // Stable refs for user and authLoading so refreshEntitlements
  // does not get recreated on every auth state change
  const userRef = useRef(user);
  const authLoadingRef = useRef(authLoading);
  userRef.current = user;
  authLoadingRef.current = authLoading;

  const refreshEntitlements = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (authLoadingRef.current) {
      setLoading(true);
      return;
    }

    if (!userRef.current) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Pass supabase explicitly — consistent with authService contract.
      // Fetch the legacy entitlement (Stripe path) and the gift-code
      // subscription state in parallel so the page never pays for two
      // sequential round trips. If me-entitlement reports non-premium
      // but the user has an active gift redemption in user_subscriptions,
      // we overlay the gift-side state onto the entitlement.
      const [backendEntRaw, giftSub] = await Promise.all([
        fetchCurrentEntitlement(supabase),
        fetchActiveGiftSubscription(supabase, userRef.current?.id ?? ""),
      ]);

      if (requestIdRef.current !== requestId) return;

      const backendEnt = backendEntRaw ?? FAIL_CLOSED_ENTITLEMENT;
      // Use !backendEnt.is_premium (truthy check) instead of strict
      // === false — me-entitlement can return is_premium as undefined
      // or null on partial responses (FAIL_CLOSED_ENTITLEMENT paths,
      // shape drift). Strict equality would skip the overlay for those
      // cases even though the user clearly isn't premium.
      const finalEnt =
        !backendEnt.is_premium && giftSub
          ? applyGiftSubscriptionOverlay(backendEnt, giftSub)
          : backendEnt;

      setData(buildEntitlement(finalEnt));
    } catch {
      if (requestIdRef.current !== requestId) return;

      setData(buildEntitlement(FAIL_CLOSED_ENTITLEMENT));
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []); // stable — reads user/authLoading via refs

  // Re-fetch when user identity or auth loading state changes.
  // Key on user?.id (primitive) — using `user` re-fires on every Supabase
  // auth event (TOKEN_REFRESHED, USER_UPDATED) because the session/user
  // reference changes even when the logical identity is unchanged,
  // causing pending me-entitlement calls to stack up across consumers.
  useEffect(() => {
    void refreshEntitlements();
  }, [user?.id, authLoading, refreshEntitlements]);

  const features = useMemo(
    () => (data?.features ?? {}) as Record<string, unknown>,
    [data],
  );

  function hasFlag(key: string, fallback = false) {
    const normalized = String(key || "").trim().toLowerCase();
    const value = features[normalized];

    if (typeof value === "boolean") return value;

    if (normalized === "premium" || normalized === "is_premium") {
      return data?.is_premium === true && isPremiumStatus(data?.status);
    }

    if (
      normalized === "paid_repo_access" ||
      normalized === "premium_monthly" ||
      normalized === "premium_yearly"
    ) {
      const billingTier = normalizeTier(data?.billing_tier);
      const premiumActive =
        data?.is_premium === true && isPremiumStatus(data?.status);

      if (normalized === "paid_repo_access") {
        return premiumActive && isPaidBillingTier(billingTier);
      }
      if (normalized === "premium_monthly") {
        return premiumActive && billingTier === "premium_month";
      }
      if (normalized === "premium_yearly") {
        return premiumActive && billingTier === "premium_year";
      }
    }

    const m = normalized.match(/^vip(\d+)$/);
    if (m) return (data?.vip_rank ?? 0) >= Number(m[1]);

    return fallback;
  }

  function getLimit(key: string, fallback: number) {
    const normalized = String(key || "").trim().toLowerCase();
    const value = features[normalized];

    if (typeof value === "number" && Number.isFinite(value)) return value;

    if (
      typeof value === "string" &&
      value.trim() &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }

    return fallback;
  }

  return {
    ent: data,
    features,
    loading,
    hasFlag,
    getLimit,
    refreshEntitlements,
  };
}