// src/lib/useEntitlements.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FAIL_CLOSED_ENTITLEMENT,
  fetchCurrentEntitlement,
  resolveEntitlementTier,
  type BackendEntitlement,
} from "@/lib/authService";
import { useAuth } from "@/providers/AuthProvider";

type Ent = BackendEntitlement & {
  vip_tier: string;
  vip_rank: number;
  features: Record<string, unknown>;
  updated_at: string;
};

function tierToRank(tier: string): number {
  const s = String(tier || "free").toLowerCase();

  if (s === "free") return 0;

  const m = s.match(/^vip(\d+)$/);
  if (!m) return 0;

  const n = Number(m[1]);
  return Number.isFinite(n) ? n : 0;
}

function isPremiumStatus(status: string | null | undefined): boolean {
  const s = String(status || "").toLowerCase();
  return s === "active" || s === "trialing";
}

function buildFeatures(ent: BackendEntitlement, vipRank: number) {
  const isPremium = ent.is_premium === true && isPremiumStatus(ent.status);

  return {
    premium: isPremium,
    is_premium: isPremium,
    vip1: vipRank >= 1,
    vip2: vipRank >= 2,
    vip3: vipRank >= 3,
    vip4: vipRank >= 4,
    vip5: vipRank >= 5,
    vip6: vipRank >= 6,
    vip9: vipRank >= 9,
  } as Record<string, unknown>;
}

function buildEntitlement(entitlement: BackendEntitlement): Ent {
  const vipTier = resolveEntitlementTier(entitlement);
  const vipRank = tierToRank(vipTier);

  return {
    ...entitlement,
    vip_tier: vipTier,
    vip_rank: vipRank,
    features: buildFeatures(entitlement, vipRank),
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
  }, [authLoading, user?.id]);

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

    if (normalized === "premium" || normalized === "is_premium") {
      return data?.is_premium === true && isPremiumStatus(data?.status);
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