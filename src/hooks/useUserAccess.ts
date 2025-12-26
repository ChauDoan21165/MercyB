/**
 * MercyBlade Blue — useUserAccess (AUTH-DRIVEN, NO DUPLICATE TIMELINES)
 * Path: src/hooks/useUserAccess.ts
 * Version: MB-BLUE-94.14.14 — 2025-12-25 (+0700)
 *
 * GOAL (LOCKED):
 * - useUserAccess MUST NOT call supabase.auth.getUser() or subscribe to auth changes.
 * - Auth timeline must come ONLY from AuthProvider via useAuth().
 * - Supabase queries here are allowed ONLY for: roles, tiers, subscriptions, admin level, etc.
 *
 * CHANGE (94.14.14):
 * - Ensure this hook exports ONLY the hook + types (NO UI components).
 * - Use canonical client: "@/lib/supabaseClient"
 * - Consume auth from useAuth() (single source of truth)
 */

import { useEffect, useMemo, useState } from "react";
import type { TierId } from "@/lib/constants/tiers";
import { normalizeTier } from "@/lib/constants/tiers";
import { canAccessVIPTier } from "@/lib/accessControl";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

export interface UserAccess {
  isAdmin: boolean;
  isHighAdmin: boolean; // Level >= 9 in admin_users
  adminLevel: number;

  isAuthenticated: boolean;
  isDemoMode: boolean;

  tier: TierId;

  canAccessVIP1: boolean;
  canAccessVIP2: boolean;
  canAccessVIP3: boolean;
  canAccessVIP3II: boolean;
  canAccessVIP4: boolean;
  canAccessVIP5: boolean;
  canAccessVIP6: boolean;
  canAccessVIP9: boolean;

  loading: boolean;
  isLoading: boolean;

  canAccessTier: (tierId: TierId) => boolean;
}

const guestAccess = (): UserAccess => {
  const canAccessTier = (tierId: TierId) => tierId === "free";

  return {
    isAdmin: false,
    isHighAdmin: false,
    adminLevel: 0,

    isAuthenticated: false,
    isDemoMode: true,

    tier: "free",

    canAccessVIP1: false,
    canAccessVIP2: false,
    canAccessVIP3: false,
    canAccessVIP3II: false,
    canAccessVIP4: false,
    canAccessVIP5: false,
    canAccessVIP6: false,
    canAccessVIP9: false,

    loading: false,
    isLoading: false,

    canAccessTier,
  };
};

export const useUserAccess = (): UserAccess => {
  const { user, isLoading: authLoading } = useAuth();

  const [access, setAccess] = useState<UserAccess>(() => ({
    ...guestAccess(),
    loading: true,
    isLoading: true,
    isDemoMode: false,
  }));

  const userId = user?.id || null;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      // 1) Auth still loading → keep loading state
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

      // 2) Not logged in → guest access
      if (!userId) {
        if (!alive) return;
        setAccess(guestAccess());
        return;
      }

      // 3) Logged in → compute access
      if (!alive) return;
      setAccess((prev) => ({
        ...prev,
        loading: true,
        isLoading: true,
        isDemoMode: false,
        isAuthenticated: true,
      }));

      try {
        const { data: isAdminRpc, error: adminError } = await supabase.rpc("has_role", {
          _role: "admin",
          _user_id: userId,
        });

        if (adminError && import.meta.env.DEV) {
          console.warn("[useUserAccess] has_role RPC error:", adminError);
        }

        const { data: adminUserData, error: adminUserErr } = await supabase
          .from("admin_users")
          .select("level")
          .eq("user_id", userId)
          .maybeSingle();

        if (adminUserErr && import.meta.env.DEV) {
          console.warn("[useUserAccess] admin_users lookup error:", adminUserErr);
        }

        const adminLevel = adminUserData?.level || 0;
        const isHighAdmin = adminLevel >= 9;
        const isAdmin = Boolean(isAdminRpc) || isHighAdmin;

        const { data: subscription, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("*, subscription_tiers(*)")
          .eq("user_id", userId)
          .eq("status", "active")
          .maybeSingle();

        if (subErr && import.meta.env.DEV) {
          console.warn("[useUserAccess] subscription lookup error:", subErr);
        }

        const rawTierName = subscription?.subscription_tiers?.name || "Free / Miễn phí";
        const tierFromDb: TierId = normalizeTier(rawTierName);

        const finalTier: TierId = isAdmin ? "vip9" : tierFromDb;

        const canAccessTier = (targetTier: TierId): boolean => {
          if (isHighAdmin) return true;
          return canAccessVIPTier(finalTier, targetTier);
        };

        const next: UserAccess = {
          isAdmin,
          isHighAdmin,
          adminLevel,

          isAuthenticated: true,
          isDemoMode: false,

          tier: finalTier,

          canAccessVIP1: canAccessTier("vip1"),
          canAccessVIP2: canAccessTier("vip2"),
          canAccessVIP3: canAccessTier("vip3"),
          canAccessVIP3II: canAccessTier("vip3ii"),
          canAccessVIP4: canAccessTier("vip4"),
          canAccessVIP5: canAccessTier("vip5"),
          canAccessVIP6: canAccessTier("vip6"),
          canAccessVIP9: canAccessTier("vip9"),

          loading: false,
          isLoading: false,

          canAccessTier,
        };

        if (!alive) return;
        setAccess(next);
      } catch (err: any) {
        if (import.meta.env.DEV) console.warn("[useUserAccess] crashed:", err);
        if (!alive) return;
        setAccess(guestAccess());
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [authLoading, userId]);

  return useMemo(() => access, [access]);
};
