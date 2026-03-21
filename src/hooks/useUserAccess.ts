// src/hooks/useUserAccess.ts
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
}

function isPremiumTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
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
  };
};

function authenticatedFreeAccess(): UserAccess {
  return {
    ...guestAccess(),
    isAuthenticated: true,
    isDemoMode: false,
    loading: false,
    isLoading: false,
  };
}

function isDev(): boolean {
  try {
    return Boolean((import.meta as { env?: { DEV?: boolean } })?.env?.DEV);
  } catch {
    return false;
  }
}

export const useUserAccess = (): UserAccess => {
  const { user, isLoading: authLoading } = useAuth();

  const [access, setAccess] = useState<UserAccess>(() => ({
    ...guestAccess(),
    loading: true,
    isLoading: true,
    isDemoMode: false,
  }));

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
        }));
        return;
      }

      if (!userEmail) {
        if (!alive) return;
        setAccess(guestAccess());
        return;
      }

      if (!alive) return;
      setAccess((prev) => ({
        ...prev,
        loading: true,
        isLoading: true,
        isDemoMode: false,
        isAuthenticated: true,
      }));

      try {
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("email, is_admin, admin_level")
          .eq("email", userEmail)
          .maybeSingle();

        if (profileErr && isDev()) {
          console.warn("[useUserAccess] profiles lookup error:", profileErr);
        }

        const adminLevel = Number(profile?.admin_level ?? 0);
        const isHighAdmin = adminLevel >= 9;
        const isAdmin =
          Boolean(profile?.is_admin) || adminLevel > 0 || isHighAdmin;

        const entitlement = await fetchCurrentEntitlement(supabase);
        const entitlementTier = resolveEntitlementTier(entitlement);

        const finalTier: TierId = entitlementTier;

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
        };

        if (!alive) return;
        setAccess(next);
      } catch (err: unknown) {
        if (isDev()) console.warn("[useUserAccess] crashed:", err);
        if (!alive) return;
        setAccess(authenticatedFreeAccess());
      }
    };

    void run();

    return () => {
      alive = false;
    };
  }, [authLoading, userEmail]);

  return useMemo(() => access, [access]);
};