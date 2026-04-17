/**
 * Path: src/hooks/useUserAccess.ts
 * File: useUserAccess.ts
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

  /**
   * Trial state.
   * No extra UI is required here; consumers can show a simple existing message.
   */
  isTrialExpired: boolean;
  accessAnnouncement?: string;

  email?: string;
  userId?: string;
  user?: {
    id?: string;
    email?: string;
  };
}

const FORCE_UNLOCK_MERCY_FEATURES = true;
const TRIAL_ENDED_MESSAGE =
  "Your free trial has ended. Please upgrade to continue.";

function isPremiumTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

/**
 * Paid premium users should not be locked from rooms.
 * Map premium billing plans to full room-access tier.
 */
function toEffectiveAccessTier(tier: TierId): TierId {
  if (tier === "premium_month" || tier === "premium_year") {
    return "level9";
  }
  return tier;
}

function safeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readStringField(record: unknown, key: string): string | undefined {
  if (!record || typeof record !== "object") return undefined;
  const value = (record as Record<string, unknown>)[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function readBooleanField(record: unknown, key: string): boolean | undefined {
  if (!record || typeof record !== "object") return undefined;
  const value = (record as Record<string, unknown>)[key];
  if (typeof value === "boolean") return value;
  return undefined;
}

function parseDateMs(value: unknown): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferTrialExpired(entitlement: unknown, entitlementTier: TierId): boolean {
  if (isPremiumTier(entitlementTier)) return false;

  const explicitExpired =
    readBooleanField(entitlement, "is_trial_expired") ??
    readBooleanField(entitlement, "trial_expired");

  if (typeof explicitExpired === "boolean") {
    return explicitExpired;
  }

  const planType =
    readStringField(entitlement, "plan_type") ??
    readStringField(entitlement, "planType") ??
    readStringField(entitlement, "access_type") ??
    readStringField(entitlement, "accessType");

  const accessExpiresAt =
    readStringField(entitlement, "access_expires_at") ??
    readStringField(entitlement, "accessExpiresAt") ??
    readStringField(entitlement, "trial_expires_at") ??
    readStringField(entitlement, "trialExpiresAt");

  const expiresAtMs = parseDateMs(accessExpiresAt);
  if (expiresAtMs !== null) {
    return Date.now() > expiresAtMs;
  }

  if (!planType) {
    return false;
  }

  const normalizedPlanType = planType.toLowerCase();

  if (
    normalizedPlanType === "free_trial" ||
    normalizedPlanType === "trial" ||
    normalizedPlanType === "free"
  ) {
    return false;
  }

  return false;
}

function buildFeatureAccess(
  entitlementTier: TierId,
  options?: {
    unlockMercyFeatures?: boolean;
    trialExpired?: boolean;
  },
): FeatureAccess {
  const isPremium = isPremiumTier(entitlementTier);
  const trialExpired = Boolean(options?.trialExpired);
  const unlockMercyFeatures =
    !trialExpired &&
    (FORCE_UNLOCK_MERCY_FEATURES || Boolean(options?.unlockMercyFeatures));

  if (trialExpired) {
    return {
      hasMercyGuide: false,
      hasMercyJourney: false,
      hasMercyGrammar: false,
      hasMercySpeak: false,
      hasMercyLogic: false,
      hasPremiumRooms: false,
    };
  }

  return {
    hasMercyGuide: true,
    hasMercyJourney: isPremium || unlockMercyFeatures,
    hasMercyGrammar: isPremium || unlockMercyFeatures,
    hasMercySpeak: isPremium || unlockMercyFeatures,
    hasMercyLogic: isPremium || unlockMercyFeatures,
    hasPremiumRooms: isPremium,
  };
}

export const guestAccess = (): UserAccess => {
  const unlockMercyFeatures = FORCE_UNLOCK_MERCY_FEATURES;
  const entitlementTier: TierId = "level0";
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

    isTrialExpired: false,
    accessAnnouncement: undefined,

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
  isTrialExpired?: boolean;
}): UserAccess {
  const userId = params.userId?.trim() || undefined;
  const email = params.email?.trim() || undefined;
  const adminLevel = safeNumber(params.adminLevel, 0);
  const isHighAdmin = Boolean(params.isHighAdmin) || adminLevel >= 9;
  const isAdmin = Boolean(params.isAdmin) || adminLevel > 0 || isHighAdmin;
  const loading = Boolean(params.loading);
  const isTrialExpired = Boolean(params.isTrialExpired) && !isHighAdmin;
  const unlockMercyFeatures = !isTrialExpired && (FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin);
  const entitlementTier: TierId = "level0";
  const userTier: TierId = isHighAdmin
    ? "level9"
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

    features: buildFeatureAccess(entitlementTier, {
      unlockMercyFeatures,
      trialExpired: isTrialExpired,
    }),

    loading,
    isLoading: loading,

    canAccessPremium: () => isHighAdmin,

    isTrialExpired,
    accessAnnouncement: isTrialExpired ? TRIAL_ENDED_MESSAGE : undefined,

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
        // keep level0/admin defaults
      }

      let entitlementTier: TierId = "level0";
      let isTrialExpired = false;

      try {
        const entitlement = await fetchCurrentEntitlement(supabase);
        entitlementTier = resolveEntitlementTier(entitlement);
        isTrialExpired = inferTrialExpired(entitlement, entitlementTier);
      } catch {
        entitlementTier = "level0";
        isTrialExpired = false;
      }

      /**
       * Business rule:
       * - active premium_month / premium_year users should not be locked from rooms
       * - high admins should also have full room access
       * - but .tier must remain the raw entitlement tier for UI/tests
       * - when free trial has ended, stop Library + Teacher Mercy access without adding extra UI
       */
      const userTier: TierId = isHighAdmin
        ? "level9"
        : toEffectiveAccessTier(entitlementTier);

      const unlockMercyFeatures =
        !isTrialExpired && (FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin);

      const features = buildFeatureAccess(entitlementTier, {
        unlockMercyFeatures,
        trialExpired: isTrialExpired && !isHighAdmin && !isPremiumTier(entitlementTier),
      });

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

        isTrialExpired: isTrialExpired && !isHighAdmin && !isPremiumTier(entitlementTier),
        accessAnnouncement:
          isTrialExpired && !isHighAdmin && !isPremiumTier(entitlementTier)
            ? TRIAL_ENDED_MESSAGE
            : undefined,

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