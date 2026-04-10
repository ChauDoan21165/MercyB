// PATH: src/hooks/useUserAccess.ts

/**
 * File: useUserAccess.ts
 * Path: src/hooks/useUserAccess.ts
 */

import { useEffect, useMemo, useState } from "react";
import type { TierId } from "@/lib/constants/tiers";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchCurrentEntitlement,
  resolveEntitlementTier,
} from "@/lib/authService";

export interface FeatureAccess {
  hasMercyGuide: boolean;
  hasMercyJourney: boolean;
  hasMercyGrammar: boolean;
  hasMercySpeak: boolean;
  hasMercyLogic: boolean;
  hasPremiumRooms: boolean;
}

export interface UserAccess {
  isAdmin: boolean;
  isHighAdmin: boolean;
  adminLevel: number;

  isAuthenticated: boolean;
  isDemoMode: boolean;

  /**
   * Public-facing billing/app tier.
   * Keep this as the raw resolved entitlement tier so tests/UI snapshots remain stable.
   */
  tier: TierId;

  /**
   * Effective room-access tier for legacy room gating helpers.
   * Paid billing plans map to vip9 here so premium users can access all VIP rooms.
   */
  userTier: TierId;

  /**
   * Raw billing / entitlement tier from authService / profile hints.
   */
  entitlementTier: TierId;

  hasPremium: boolean;
  hasPremiumMonthly: boolean;
  hasPremiumYearly: boolean;

  features: FeatureAccess;

  loading: boolean;
  isLoading: boolean;

  /**
   * True when the user has paid access (or high-admin override).
   */
  canAccessPremium: () => boolean;

  email?: string;
  userId?: string;
  user?: {
    id?: string;
    email?: string;
  };
}

const FORCE_UNLOCK_MERCY_FEATURES = true;
const PREMIUM_CACHE_KEY = "mb.cachedEntitlementTier";

function isPremiumTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function normalizeTierLoose(value: unknown): TierId {
  const raw = String(value ?? "").trim().toLowerCase();

  switch (raw) {
    case "premium":
    case "premium_month":
    case "monthly":
    case "month":
    case "pro_month":
    case "paid_month":
      return "premium_month";

    case "premium_year":
    case "yearly":
    case "annual":
    case "year":
    case "pro_year":
    case "paid_year":
      return "premium_year";

    case "vip1":
    case "vip2":
    case "vip3":
    case "vip4":
    case "vip5":
    case "vip6":
    case "vip7":
    case "vip8":
    case "vip9":
    case "kids_1":
    case "kids_2":
    case "kids_3":
    case "free":
      return raw as TierId;

    default:
      return "free";
  }
}

function truthyFlag(value: unknown): boolean {
  if (value === true) return true;
  const s = String(value ?? "").trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "paid" || s === "active";
}

/**
 * Effective room tier only.
 * Raw .tier should remain the billing tier for UI/tests.
 */
function toEffectiveRoomTier(entitlementTier: TierId, isHighAdmin = false): TierId {
  if (isHighAdmin) return "vip9";
  if (entitlementTier === "premium_month" || entitlementTier === "premium_year") {
    return "vip9";
  }
  return entitlementTier;
}

function buildFeatureAccess(
  entitlementTier: TierId,
  options?: {
    unlockMercyFeatures?: boolean;
  },
): FeatureAccess {
  const isPremium = isPremiumTier(entitlementTier);
  const unlockMercyFeatures =
    FORCE_UNLOCK_MERCY_FEATURES || Boolean(options?.unlockMercyFeatures);

  return {
    hasMercyGuide: true,
    hasMercyJourney: isPremium || unlockMercyFeatures,
    hasMercyGrammar: isPremium || unlockMercyFeatures,
    hasMercySpeak: isPremium || unlockMercyFeatures,
    hasMercyLogic: isPremium || unlockMercyFeatures,
    hasPremiumRooms: isPremium,
  };
}

function safeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readCachedEntitlementTier(): TierId {
  try {
    if (typeof window === "undefined") return "free";
    return normalizeTierLoose(window.localStorage.getItem(PREMIUM_CACHE_KEY));
  } catch {
    return "free";
  }
}

function writeCachedEntitlementTier(tier: TierId) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PREMIUM_CACHE_KEY, tier);
  } catch {
    // ignore
  }
}

function clearCachedEntitlementTier() {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PREMIUM_CACHE_KEY);
  } catch {
    // ignore
  }
}

function resolveProfileTier(profile: any): TierId {
  const directTierCandidates = [
    profile?.tier,
    profile?.plan,
    profile?.plan_tier,
    profile?.subscription_tier,
    profile?.billing_tier,
    profile?.access_tier,
    profile?.membership_tier,
    profile?.premium_tier,
    profile?.role_tier,
    profile?.entitlement_tier,
    profile?.product_tier,
    profile?.current_tier,
  ];

  for (const candidate of directTierCandidates) {
    const normalized = normalizeTierLoose(candidate);
    if (normalized !== "free") return normalized;
  }

  const looksPaid =
    truthyFlag(profile?.is_premium) ||
    truthyFlag(profile?.premium) ||
    truthyFlag(profile?.paid) ||
    truthyFlag(profile?.has_premium) ||
    truthyFlag(profile?.premium_active) ||
    truthyFlag(profile?.subscription_active) ||
    truthyFlag(profile?.is_paid) ||
    ["active", "trialing", "trial", "paid"].includes(
      String(profile?.subscription_status ?? profile?.status ?? "").trim().toLowerCase(),
    );

  if (looksPaid) {
    const cycle = String(
      profile?.billing_cycle ??
        profile?.plan_cycle ??
        profile?.interval ??
        profile?.subscription_interval ??
        "",
    )
      .trim()
      .toLowerCase();

    if (cycle.includes("year") || cycle.includes("annual")) return "premium_year";
    return "premium_month";
  }

  return "free";
}

export const guestAccess = (): UserAccess => {
  const entitlementTier: TierId = "free";

  return {
    isAdmin: false,
    isHighAdmin: false,
    adminLevel: 0,

    isAuthenticated: false,
    isDemoMode: true,

    tier: entitlementTier,
    userTier: toEffectiveRoomTier(entitlementTier),
    entitlementTier,

    hasPremium: false,
    hasPremiumMonthly: false,
    hasPremiumYearly: false,

    features: buildFeatureAccess(entitlementTier, {
      unlockMercyFeatures: FORCE_UNLOCK_MERCY_FEATURES,
    }),

    loading: false,
    isLoading: false,

    canAccessPremium: () => false,

    email: undefined,
    userId: undefined,
    user: undefined,
  };
};

function authenticatedFreeAccess(params: {
  userId?: string | null;
  email?: string | null;
  isAdmin?: boolean;
  isHighAdmin?: boolean;
  adminLevel?: number;
  loading?: boolean;
}): UserAccess {
  const userId = params.userId?.trim() || undefined;
  const email = params.email?.trim() || undefined;
  const adminLevel = safeNumber(params.adminLevel, 0);
  const isHighAdmin = Boolean(params.isHighAdmin) || adminLevel >= 9;
  const isAdmin = Boolean(params.isAdmin) || adminLevel > 0 || isHighAdmin;
  const loading = Boolean(params.loading);

  const entitlementTier: TierId = "free";

  return {
    ...guestAccess(),

    isAdmin,
    isHighAdmin,
    adminLevel,

    isAuthenticated: true,
    isDemoMode: false,

    tier: entitlementTier,
    userTier: toEffectiveRoomTier(entitlementTier, isHighAdmin),
    entitlementTier,

    hasPremium: false,
    hasPremiumMonthly: false,
    hasPremiumYearly: false,

    features: buildFeatureAccess(entitlementTier, {
      unlockMercyFeatures: FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin,
    }),

    loading,
    isLoading: loading,

    canAccessPremium: () => isHighAdmin,

    email,
    userId,
    user: {
      id: userId,
      email,
    },
  };
}

export const useUserAccess = (): UserAccess => {
  const { user, isLoading: authLoading } = useAuth();

  const [access, setAccess] = useState<UserAccess>(() => ({
    ...guestAccess(),
    loading: true,
    isLoading: true,
    isDemoMode: false,
  }));

  const userId = (user?.id || "").trim() || null;
  const userEmail = (user?.email || "").trim() || null;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (authLoading) {
        if (!alive) return;

        setAccess((prev) => ({
          ...prev,
          loading: true,
          isLoading: true,
          isDemoMode: false,
          isAuthenticated: false,
          email: userEmail ?? undefined,
          userId: userId ?? undefined,
          user: {
            id: userId ?? undefined,
            email: userEmail ?? undefined,
          },
        }));
        return;
      }

      if (!user) {
        if (!alive) return;
        setAccess(guestAccess());
        return;
      }

      if (!alive) return;

      setAccess(
        authenticatedFreeAccess({
          userId,
          email: userEmail,
          loading: true,
        }),
      );

      let adminLevel = 0;
      let isHighAdmin = false;
      let isAdmin = false;
      let resolvedEmail = userEmail ?? undefined;
      let profileTier: TierId = "free";

      try {
        const baseQuery = supabase.from("profiles").select("*");

        const profileResult = userId
          ? await baseQuery.eq("id", userId).maybeSingle()
          : await baseQuery.maybeSingle();

        const { data: profile } = profileResult;

        if (profile) {
          adminLevel = safeNumber(profile.admin_level, 0);
          isHighAdmin = adminLevel >= 9;
          isAdmin = Boolean(profile.is_admin) || adminLevel > 0 || isHighAdmin;
          resolvedEmail = (profile.email || userEmail || "").trim() || undefined;
          profileTier = resolveProfileTier(profile);
        }
      } catch {
        // keep defaults
      }

      let entitlementTier: TierId = "free";
      let entitlementFetchSucceeded = false;

      try {
        const entitlement = await fetchCurrentEntitlement(supabase);
        entitlementTier = normalizeTierLoose(resolveEntitlementTier(entitlement));
        entitlementFetchSucceeded = true;
      } catch {
        entitlementTier = "free";
        entitlementFetchSucceeded = false;
      }

      const cachedTier = readCachedEntitlementTier();

      let effectiveEntitlementTier: TierId = entitlementTier;

      if (!isPremiumTier(effectiveEntitlementTier) && isPremiumTier(profileTier)) {
        effectiveEntitlementTier = profileTier;
      }

      /**
       * IMPORTANT:
       * Only trust cached premium state when live entitlement fetch failed.
       * Do NOT let old cached premium override a fresh "free" result.
       */
      if (
        !entitlementFetchSucceeded &&
        !isPremiumTier(effectiveEntitlementTier) &&
        !isPremiumTier(profileTier) &&
        isPremiumTier(cachedTier)
      ) {
        effectiveEntitlementTier = cachedTier;
      }

      if (isPremiumTier(effectiveEntitlementTier)) {
        writeCachedEntitlementTier(effectiveEntitlementTier);
      } else if (entitlementFetchSucceeded || profileTier === "free") {
        clearCachedEntitlementTier();
      }

      const hasPremium = isPremiumTier(effectiveEntitlementTier);

      const next: UserAccess = {
        isAdmin,
        isHighAdmin,
        adminLevel,

        isAuthenticated: true,
        isDemoMode: false,

        tier: effectiveEntitlementTier,
        userTier: toEffectiveRoomTier(effectiveEntitlementTier, isHighAdmin),
        entitlementTier: effectiveEntitlementTier,

        hasPremium,
        hasPremiumMonthly: effectiveEntitlementTier === "premium_month",
        hasPremiumYearly: effectiveEntitlementTier === "premium_year",

        features: buildFeatureAccess(effectiveEntitlementTier, {
          unlockMercyFeatures: FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin,
        }),

        loading: false,
        isLoading: false,

        canAccessPremium: () => hasPremium || isHighAdmin,

        email: resolvedEmail,
        userId: userId ?? undefined,
        user: {
          id: userId ?? undefined,
          email: resolvedEmail,
        },
      };

      if (!alive) return;
      setAccess(next);
    };

    void run();

    return () => {
      alive = false;
    };
  }, [authLoading, user, userId, userEmail]);

  return useMemo(() => access, [access]);
};