/**
 * Path: src/hooks/useUserAccess.ts
 * File: useUserAccess.ts
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { TierId } from "@/lib/constants/tiers";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchCurrentEntitlement,
  resolveEntitlementTier,
} from "@/lib/authService";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";

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
  // `tier` here is the RESOLVED entitlement tier from resolveEntitlementTier
  // (authService.ts), which maps premium_month → level1 and premium_year →
  // level9, and returns "level0" ONLY when the entitlement is not premium
  // (gated by entitlementIsPremium: is_premium + active status — never
  // price_id, per the PR 700/709 derivation lock). So any non-free resolved
  // tier means an active paid entitlement.
  //
  // The previous check compared against the raw "premium_month"/"premium_year"
  // provider strings, which the live path NEVER feeds in (it always passes the
  // resolved levelN value). That made hasPremium always false, so ParentView
  // (L6) showed <ParentPaywallGate /> to every paying customer. See the
  // false-green in useUserAccess.snapshot.test.ts, which mocked the resolver to
  // return the raw strings and never asserted hasPremium.
  return tier !== "level0";
}

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

  if (typeof explicitExpired === "boolean") return explicitExpired;

  const accessExpiresAt =
    readStringField(entitlement, "access_expires_at") ??
    readStringField(entitlement, "accessExpiresAt") ??
    readStringField(entitlement, "trial_expires_at") ??
    readStringField(entitlement, "trialExpiresAt");

  const expiresAtMs = parseDateMs(accessExpiresAt);
  if (expiresAtMs !== null) return Date.now() > expiresAtMs;

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
  const entitlementTier: TierId = "level0";
  const userTier = toEffectiveAccessTier(entitlementTier);
  const unlockMercyFeatures = FORCE_UNLOCK_MERCY_FEATURES;

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
  // adminLevel threshold must match the SQL admin policy in
  // supabase/migrations/20260701000000_subscriptions_rls_select_policies.sql:
  //   USING (public.get_admin_level(auth.uid()) >= 9)
  // No `Boolean(params.isAdmin) ||` disjunct: !86's SQL policy ignores
  // is_admin / params.isAdmin flags and only checks admin_level. The
  // flag-bypass disjunct that lived here was removed in the post-!100/!105
  // hardening pass — `params.isAdmin` was effectively dead (the only
  // caller of authenticatedFreeAccess in src/ does not pass it).
  // Post-!111 stylistic collapse: isHighAdmin already incorporates
  // `adminLevel >= 9` (line above), so `adminLevel >= 9 || isHighAdmin`
  // simplifies to just `isHighAdmin`.
  const isAdmin = isHighAdmin;
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
    user: { id: userId, email },
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

  // Stable user identity — only change when the actual user id changes
  // Avoids the effect re-running on every render due to derived string recalculation
  const userId = user?.id ?? null;
  const userEmail = user?.email ?? null;
  const profileQuery = useProfileQuery(authLoading ? null : userId);
  const profile = profileQuery.data ?? null;
  const profileLoading = Boolean(userId) && profileQuery.isLoading;

  // Run counter — discard results from stale concurrent runs
  const runIdRef = useRef(0);

  useEffect(() => {
    const runId = ++runIdRef.current;

    const run = async () => {
      if (authLoading) {
        if (runId !== runIdRef.current) return;
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
        if (runId !== runIdRef.current) return;
        setAccess(guestAccess());
        return;
      }

      if (runId !== runIdRef.current) return;
      setAccess(
        authenticatedFreeAccess({
          userId,
          email: userEmail,
          loading: true,
        }),
      );

      if (profileLoading) {
        return;
      }

      let adminLevel = 0;
      let isHighAdmin = false;
      let isAdmin = false;
      // Email always comes from auth session — never from profiles table
      // to prevent stale or spoofed profile email affecting access decisions
      const resolvedEmail = userEmail?.trim() || undefined;

      if (profile) {
        adminLevel = safeNumber(profile.admin_level, 0);
        isHighAdmin = adminLevel >= 9;
        // adminLevel threshold must match the SQL admin policy in
        // 20260701000000_subscriptions_rls_select_policies.sql:
        //   USING (public.get_admin_level(auth.uid()) >= 9)
        // No `Boolean(profile.is_admin) ||` disjunct: !86's SQL policy
        // ignores the is_admin column and only checks admin_level. The
        // flag-bypass disjunct that lived here was removed in the
        // post-!100/!105 hardening pass — in prod the only is_admin=true
        // row is Chau's at admin_level=10, which isHighAdmin below
        // already covers via `adminLevel >= 9`.
        // Post-!111 stylistic collapse: isHighAdmin is literally
        // `adminLevel >= 9` (assigned line above), so the old
        // `adminLevel >= 9 || isHighAdmin` simplifies to `isHighAdmin`.
        isAdmin = isHighAdmin;
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

      const userTier: TierId = isHighAdmin
        ? "level9"
        : toEffectiveAccessTier(entitlementTier);

      const unlockMercyFeatures =
        !isTrialExpired && (FORCE_UNLOCK_MERCY_FEATURES || isHighAdmin);

      const trialGating =
        isTrialExpired && !isHighAdmin && !isPremiumTier(entitlementTier);

      const features = buildFeatureAccess(entitlementTier, {
        unlockMercyFeatures,
        trialExpired: trialGating,
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
        canAccessPremium: () => isPremiumTier(entitlementTier) || isHighAdmin,
        isTrialExpired: trialGating,
        accessAnnouncement: trialGating ? TRIAL_ENDED_MESSAGE : undefined,
        email: resolvedEmail,
        userId: userId ?? undefined,
        user: {
          id: userId ?? undefined,
          email: resolvedEmail,
        },
      };

      if (runId !== runIdRef.current) return;
      setAccess(next);
    };

    void run();
  }, [authLoading, profile, profileLoading, user, userId, userEmail]);

  return useMemo(() => access, [access]);
};

export default useUserAccess;
