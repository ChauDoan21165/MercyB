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

  tier: TierId;

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

function buildFeatureAccess(
  tier: TierId,
  options?: {
    unlockMercyFeatures?: boolean;
  },
): FeatureAccess {
  const isPremium = isPremiumTier(tier);
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

  return {
    isAdmin: false,
    isHighAdmin: false,
    adminLevel: 0,

    isAuthenticated: false,
    isDemoMode: true,

    tier: "free",

    hasPremium: false,
    hasPremiumMonthly: false,
    hasPremiumYearly: false,

    features: buildFeatureAccess("free", { unlockMercyFeatures }),

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

  return {
    ...guestAccess(),
    isAdmin,
    isHighAdmin,
    adminLevel,

    isAuthenticated: true,
    isDemoMode: false,

    tier: "free",

    hasPremium: false,
    hasPremiumMonthly: false,
    hasPremiumYearly: false,

    features: buildFeatureAccess("free", { unlockMercyFeatures }),

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
      } catch {}

      let finalTier: TierId = "free";

      try {
        const entitlement = await fetchCurrentEntitlement(supabase);
        finalTier = resolveEntitlementTier(entitlement);
      } catch {
        finalTier = "free";
      }

      const unlockMercyFeatures = FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin;
      const features = buildFeatureAccess(finalTier, { unlockMercyFeatures });

      const next: UserAccess = {
        isAdmin,
        isHighAdmin,
        adminLevel,

        isAuthenticated: true,
        isDemoMode: false,

        tier: finalTier,

        hasPremium: isPremiumTier(finalTier),
        hasPremiumMonthly: finalTier === "premium_month",
        hasPremiumYearly: finalTier === "premium_year",

        features,

        loading: false,
        isLoading: false,

        canAccessPremium: () =>
          isPremiumTier(finalTier) || isHighAdmin,

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