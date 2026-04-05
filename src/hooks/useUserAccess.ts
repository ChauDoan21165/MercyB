/**
 * MercyBlade Blue — useUserAccess (AUTH-DRIVEN, ENTITLEMENT PREMIUM TRUTH)
 * Path: src/hooks/useUserAccess.ts
 *
 * GOAL (LOCKED):
 * - Auth timeline comes ONLY from AuthProvider via useAuth().
 * - Premium truth comes ONLY from backend entitlement.
 * - Supabase queries here are allowed ONLY for admin/role fields.
 * - Current product model:
 *   - free
 *   - premium_month
 *   - premium_year
 *
 * FIXES:
 * - Never downgrade an authenticated user into demo mode because of entitlement/profile errors.
 * - If auth resolves with a user, isAuthenticated stays true.
 * - Entitlement failures safely fall back to free tier only.
 * - Profile/admin lookup failures safely fall back to non-admin only.
 * - Missing user.id does NOT force guest mode if user object exists.
 * - Admin/profile resolution still attempts safely even when userId is absent in mocked/test flows.
 */

import { useEffect, useMemo, useState } from "react";
import type { TierId } from "@/lib/constants/tiers";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchCurrentEntitlement,
  resolveEntitlementTier,
} from "@/lib/authService";

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

function isPremiumTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function safeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isDev(): boolean {
  try {
    return Boolean((import.meta as { env?: { DEV?: boolean } })?.env?.DEV);
  } catch {
    return false;
  }
}

export const guestAccess = (): UserAccess => {
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

        const { data: profile, error: profileErr } = profileResult;

        console.log(
          "[useUserAccess] profile result JSON",
          JSON.stringify(
            {
              userId,
              userEmail,
              profile,
              profileErrMessage: profileErr?.message ?? null,
              profileErrCode: profileErr?.code ?? null,
              profileErrDetails: profileErr?.details ?? null,
              profileErrHint: profileErr?.hint ?? null,
            },
            null,
            2,
          ),
        );

        if (profileErr && isDev()) {
          console.warn("[useUserAccess] profiles lookup error:", profileErr);
        }

        if (profile) {
          adminLevel = safeNumber(profile.admin_level, 0);
          isHighAdmin = adminLevel >= 9;
          isAdmin = Boolean(profile.is_admin) || adminLevel > 0 || isHighAdmin;
          resolvedEmail =
            (profile.email || userEmail || "").trim() || undefined;
        }
      } catch (profileCrash) {
        if (isDev()) {
          console.warn("[useUserAccess] profiles lookup crashed:", profileCrash);
        }
      }

      let finalTier: TierId = "free";

      try {
        const entitlement = await fetchCurrentEntitlement(supabase);
        finalTier = resolveEntitlementTier(entitlement);

        console.log(
          "[useUserAccess] entitlement result JSON",
          JSON.stringify(
            {
              userId,
              entitlement,
              finalTier,
            },
            null,
            2,
          ),
        );
      } catch (entitlementErr) {
        if (isDev()) {
          console.warn(
            "[useUserAccess] entitlement fetch failed, defaulting to free tier:",
            entitlementErr,
          );
        }
        finalTier = "free";
      }

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

        loading: false,
        isLoading: false,

        canAccessPremium: () => isPremiumTier(finalTier) || isHighAdmin,

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