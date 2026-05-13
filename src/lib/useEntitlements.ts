// PATH: src/lib/useEntitlements.ts
// File: useEntitlements.ts

import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FAIL_CLOSED_ENTITLEMENT,
  resolveEntitlementTier,
  type BackendEntitlement,
} from "@/lib/authService";
import {
  fetchActiveGiftSubscription,
  type ActiveGiftSubscription,
} from "@/lib/gift/fetchActiveGiftSubscription";
import { supabase } from "@/lib/supabaseClient";
import { qk } from "@/lib/queries/keys";
import { useEntitlementQuery } from "@/lib/queries/useEntitlementQuery";
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
  const queryClient = useQueryClient();
  const userId = user?.id ?? null;

  // Both fetches run via react-query so all 28 callers across the page
  // share one me-entitlement and one giftSubscription request. Keys
  // include userId so anonymous users / sign-out flips invalidate the
  // cache automatically.
  const entitlementQuery = useEntitlementQuery(userId);

  const giftQuery = useQuery<ActiveGiftSubscription | null>({
    queryKey: qk.giftSubscription(userId ?? ""),
    enabled: Boolean(userId),
    queryFn: () => fetchActiveGiftSubscription(supabase, userId ?? ""),
  });

  const data = useMemo<Ent | null>(() => {
    if (!userId) return null;
    if (entitlementQuery.isLoading || giftQuery.isLoading) return null;

    const backendEnt = entitlementQuery.data ?? FAIL_CLOSED_ENTITLEMENT;
    const giftSub = giftQuery.data ?? null;

    // Use !backendEnt.is_premium (truthy check) instead of strict
    // === false — me-entitlement can return is_premium as undefined
    // or null on partial responses (FAIL_CLOSED_ENTITLEMENT paths,
    // shape drift). Strict equality would skip the overlay for those
    // cases even though the user clearly isn't premium.
    const finalEnt =
      !backendEnt.is_premium && giftSub
        ? applyGiftSubscriptionOverlay(backendEnt, giftSub)
        : backendEnt;

    return buildEntitlement(finalEnt);
  }, [
    userId,
    entitlementQuery.data,
    entitlementQuery.isLoading,
    giftQuery.data,
    giftQuery.isLoading,
  ]);

  const loading =
    authLoading ||
    (Boolean(userId) && (entitlementQuery.isLoading || giftQuery.isLoading));

  const refreshEntitlements = useCallback(async () => {
    if (!userId) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: qk.entitlement(userId) }),
      queryClient.invalidateQueries({ queryKey: qk.giftSubscription(userId) }),
    ]);
  }, [queryClient, userId]);

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
