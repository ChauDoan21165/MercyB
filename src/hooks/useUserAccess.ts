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
   * Raw public-facing entitlement tier.
   * Keep billing plan identity here for UI, snapshots, and tests.
   */
  tier: TierId;

  /**
   * Effective room-access tier for renderers / gating.
   * Premium subscribers and high admins should behave like full access.
   */
  userTier: TierId;

  /**
   * Raw billing / entitlement tier from authService.
   * Kept so premium plan info is not lost even when room gating is elevated.
   */
  entitlementTier: TierId;

  hasPremium: boolean;
  hasPremiumMonthly: boolean;
  hasPremiumYearly: boolean;

  features: FeatureAccess;

  loading: boolean;
  isLoading: boolean;

  canAccessPremium: () => boolean;

  email?: string;
  userId?: string;
  user?: {
    id?: string;
    email?: string;
  };
}

const FORCE_UNLOCK_MERCY_FEATURES = true;

function isPremiumTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

/**
 * Paid premium users should not be locked from rooms.
 * Map premium billing plans to full room-access tier.
 */
function toEffectiveAccessTier(tier: TierId): TierId {
  if (tier === "premium_month" || tier === "premium_year") {
    return "vip9";
  }
  return tier;
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

export const guestAccess = (): UserAccess => {
  const unlockMercyFeatures = FORCE_UNLOCK_MERCY_FEATURES;
  const entitlementTier: TierId = "free";
  const userTier = toEffectiveAccessTier(entitlementTier);

  return {
    isAdmin: false,
    isHighAdmin: false,
    adminLevel: 0,

    isAuthenticated: false,
    isDemoMode: true,

    tier: entitlementTier,
    userTier,
    entitlementTier,

    hasPremium: false,
    hasPremiumMonthly: false,
    hasPremiumYearly: false,

    features: buildFeatureAccess(entitlementTier, { unlockMercyFeatures }),

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
  const unlockMercyFeatures = FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin;
  const entitlementTier: TierId = "free";
  const userTier: TierId = isHighAdmin
    ? "vip9"
    : toEffectiveAccessTier(entitlementTier);

  return {
    ...guestAccess(),
    isAdmin,
    isHighAdmin,
    adminLevel,

    isAuthenticated: true,
    isDemoMode: false,

    tier: entitlementTier,
    userTier,
    entitlementTier,

    hasPremium: false,
    hasPremiumMonthly: false,
    hasPremiumYearly: false,

    features: buildFeatureAccess(entitlementTier, { unlockMercyFeatures }),

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

      try {
        const baseQuery = supabase
          .from("profiles")
          .select("id, email, is_admin, admin_level");

        const profileResult = userId
          ? await baseQuery.eq("id", userId).maybeSingle()
          : await baseQuery.maybeSingle();

        const { data: profile } = profileResult;

        if (profile) {
          adminLevel = safeNumber(profile.admin_level, 0);
          isHighAdmin = adminLevel >= 9;
          isAdmin = Boolean(profile.is_admin) || adminLevel > 0 || isHighAdmin;
          resolvedEmail =
            (profile.email || userEmail || "").trim() || undefined;
        }
      } catch {
        // keep free/admin defaults
      }

      let entitlementTier: TierId = "free";

      try {
        const entitlement = await fetchCurrentEntitlement(supabase);
        entitlementTier = resolveEntitlementTier(entitlement);
      } catch {
        entitlementTier = "free";
      }

      /**
       * Business rule:
       * - active premium_month / premium_year users should not be locked from rooms
       * - high admins should also have full room access
       * - but .tier must remain the raw entitlement tier for UI/tests
       */
      const userTier: TierId = isHighAdmin
        ? "vip9"
        : toEffectiveAccessTier(entitlementTier);

      const unlockMercyFeatures = FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin;
      const features = buildFeatureAccess(entitlementTier, { unlockMercyFeatures });

      const next: UserAccess = {
        isAdmin,
        isHighAdmin,
        adminLevel,

        isAuthenticated: true,
        isDemoMode: false,

        tier: entitlementTier,
        userTier,
        entitlementTier,

        hasPremium: isPremiumTier(entitlementTier),
        hasPremiumMonthly: entitlementTier === "premium_month",
        hasPremiumYearly: entitlementTier === "premium_year",

        features,

        loading: false,
        isLoading: false,

        canAccessPremium: () =>
          isPremiumTier(entitlementTier) || isHighAdmin,

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

export default useUserAccess;