// PATH: src/lib/useEntitlements.ts
// File: useEntitlements.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FAIL_CLOSED_ENTITLEMENT,
  fetchCurrentEntitlement,
  resolveEntitlementTier,
  type BackendEntitlement,
} from "@/lib/authService";
import { useAuth } from "@/providers/AuthProvider";

type Ent = BackendEntitlement & {
  billing_tier: string;
  vip_tier: string;
  vip_rank: number;
  features: Record<string, unknown>;
  updated_at: string;
};

function normalizeTier(tier: string | null | undefined): string {
  return String(tier || "free").toLowerCase().trim();
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

/**
 * Compatibility rank only:
 * - free => 0
 * - premium_month / premium_year => 9 ONLY when premium is active/trialing
 * - vip1..vip9 => numeric compatibility only
 * - unknown => 0
 */
function tierToRank(tier: string, entitlement?: BackendEntitlement): number {
  const s = normalizeTier(tier);

  if (s === "free") return 0;

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

  // New policy:
  // - only active/trialing premium billing tiers unlock the whole paid repo
  // - legacy VIP labels remain compatibility labels, not paid truth
  if (isPaidBillingTier(tier)) {
    return premiumActive;
  }

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

    // Explicit modern paid flags.
    paid_repo_access: paidRepoAccess,
    premium_monthly: paidRepoAccess && normalizedTier === "premium_month",
    premium_yearly: paidRepoAccess && normalizedTier === "premium_year",

    // Compatibility metadata flags.
    has_legacy_vip_label: isLegacyVipTier(normalizedTier),
    vip_tier: normalizedTier,
    vip_rank: vipRank,

    // Backward-compatible feature flags:
    // any active paid billing tier unlocks the full paid repo.
    vip1: paidRepoAccess || vipRank >= 1,
    vip2: paidRepoAccess || vipRank >= 2,
    vip3: paidRepoAccess || vipRank >= 3,
    vip4: paidRepoAccess || vipRank >= 4,
    vip5: paidRepoAccess || vipRank >= 5,
    vip6: paidRepoAccess || vipRank >= 6,
    vip7: paidRepoAccess || vipRank >= 7,
    vip8: paidRepoAccess || vipRank >= 8,
    vip9: paidRepoAccess || vipRank >= 9,
  } as Record<string, unknown>;
}

function buildEntitlement(entitlement: BackendEntitlement): Ent {
  const resolvedTier = normalizeTier(resolveEntitlementTier(entitlement));
  const vipRank = tierToRank(resolvedTier, entitlement);

  return {
    ...entitlement,
    // Canonical raw paid-vs-legacy entitlement result.
    billing_tier: resolvedTier,
    // Keep a compatibility field name for older callers.
    vip_tier: resolvedTier,
    // Effective access rank used by older VIP-based checks.
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

  const refreshEntitlements = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const backendEnt =
        (await fetchCurrentEntitlement()) ?? FAIL_CLOSED_ENTITLEMENT;

      if (requestIdRef.current !== requestId) return;

      setData(buildEntitlement(backendEnt));
    } catch {
      if (requestIdRef.current !== requestId) return;

      setData(buildEntitlement(FAIL_CLOSED_ENTITLEMENT));
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [authLoading, user]);

  useEffect(() => {
    void refreshEntitlements();
  }, [refreshEntitlements]);

  const features = useMemo(
    () => (data?.features ?? {}) as Record<string, unknown>,
    [data],
  );

  function hasFlag(key: string, fallback = false) {
    const normalized = String(key || "").trim().toLowerCase();
    const value = features[normalized];

    if (typeof value === "boolean") return value;

    if (
      normalized === "premium" ||
      normalized === "is_premium"
    ) {
      return data?.is_premium === true && isPremiumStatus(data?.status);
    }

    if (
      normalized === "paid_repo_access" ||
      normalized === "premium_monthly" ||
      normalized === "premium_yearly"
    ) {
      const billingTier = normalizeTier(data?.billing_tier);
      const premiumActive = data?.is_premium === true && isPremiumStatus(data?.status);

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
    if (m) {
      return (data?.vip_rank ?? 0) >= Number(m[1]);
    }

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