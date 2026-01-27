/**
 * MercyBlade Blue — useUserAccess (AUTH-DRIVEN, NO DUPLICATE TIMELINES)
 * Path: src/hooks/useUserAccess.ts
 * Version: MB-BLUE-94.14.17 — 2026-01-22 (+0700)
 *
 * GOAL (LOCKED):
 * - useUserAccess MUST NOT call supabase.auth.getUser() or subscribe to auth changes.
 * - Auth timeline must come ONLY from AuthProvider via useAuth().
 * - Supabase queries here are allowed ONLY for: roles, tiers, subscriptions, admin level, etc.
 *
 * CHANGE (94.14.17):
 * - REMOVE VIP3II everywhere (TierId no longer includes vip3ii)
 * - Legacy "vip3ii" from profiles/labels now normalizes to "vip3"
 * - Remove canAccessVIP3II field + remove any "vip3ii" tier checks
 */

import { useEffect, useMemo, useState } from "react";
import type { TierId } from "@/lib/constants/tiers";
import { normalizeTier } from "@/lib/constants/tiers";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

export interface UserAccess {
  isAdmin: boolean;
  isHighAdmin: boolean; // Level >= 9 (admin_level)
  adminLevel: number;

  isAuthenticated: boolean;
  isDemoMode: boolean;

  tier: TierId;

  canAccessVIP1: boolean;
  canAccessVIP2: boolean;
  canAccessVIP3: boolean;
  canAccessVIP4: boolean;
  canAccessVIP5: boolean;
  canAccessVIP6: boolean;
  canAccessVIP9: boolean;

  loading: boolean;
  isLoading: boolean;

  canAccessTier: (tierId: TierId) => boolean;
}

/**
 * Local tier gate (NO dependency on missing exports).
 */
function tierToLevel(t: TierId): number {
  const s = String(t || "free").toLowerCase();

  if (s === "free") return 0;

  const m = s.match(/^vip(\d+)$/);
  if (!m) return 0;

  const n = Number(m[1]);
  return Number.isFinite(n) ? n : 0;
}

function canAccessByTier(userTier: TierId, required: TierId): boolean {
  return tierToLevel(userTier) >= tierToLevel(required);
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
    canAccessVIP4: false,
    canAccessVIP5: false,
    canAccessVIP6: false,
    canAccessVIP9: false,

    loading: false,
    isLoading: false,

    canAccessTier,
  };
};

function normalizeProfileTier(v: unknown): TierId {
  // Accept direct TierId values, plus common variants like "VIP3", "vip3", "Free", "FREE"
  // Legacy "vip3ii" is mapped to "vip3".
  const raw = String(v ?? "").trim();
  if (!raw) return "free";

  const lower = raw.toLowerCase();

  // direct match (TierId only)
  if (
    lower === "free" ||
    lower === "vip1" ||
    lower === "vip2" ||
    lower === "vip3" ||
    lower === "vip4" ||
    lower === "vip5" ||
    lower === "vip6" ||
    lower === "vip9" ||
    lower === "kids_1" ||
    lower === "kids_2" ||
    lower === "kids_3"
  ) {
    return lower as TierId;
  }

  // common "VIP 3" / "VIP-3" / "VIP_3"
  const compact = lower.replace(/[\s_-]/g, "");

  // legacy VIP3II -> VIP3
  if (compact === "vip3ii") return "vip3";

  if (compact === "vip1") return "vip1";
  if (compact === "vip2") return "vip2";
  if (compact === "vip3") return "vip3";
  if (compact === "vip4") return "vip4";
  if (compact === "vip5") return "vip5";
  if (compact === "vip6") return "vip6";
  if (compact === "vip9") return "vip9";
  if (compact === "free") return "free";

  // kids compact forms
  if (compact === "kids1" || compact === "kidslevel1") return "kids_1";
  if (compact === "kids2" || compact === "kidslevel2") return "kids_2";
  if (compact === "kids3" || compact === "kidslevel3") return "kids_3";

  // fallback to existing normalizeTier (handles "Free / Miễn phí", etc.)
  // NOTE: normalizeTier is permissive and defaults unknown to "free" (by design).
  return normalizeTier(raw);
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

      // 2) Not logged in (or no email) → guest access
      if (!userEmail) {
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
        // SOURCE OF TRUTH: profiles (lookup by email, NOT user.id)
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("email, tier, is_admin, admin_level")
          .eq("email", userEmail)
          .maybeSingle();

        if (profileErr && import.meta.env.DEV) {
          console.warn("[useUserAccess] profiles lookup error:", profileErr);
        }

        // If profiles row missing, fall back to FREE (do NOT silently grant)
        const profileTier: TierId = normalizeProfileTier(profile?.tier);
        const adminLevel = Number(profile?.admin_level ?? 0);
        const isHighAdmin = adminLevel >= 9;
        const isAdmin = Boolean(profile?.is_admin) || adminLevel > 0 || isHighAdmin;

        // Admin bypass (LOCKED behavior in your app): high admin => vip9
        const finalTier: TierId = isHighAdmin ? "vip9" : profileTier;

        const canAccessTier = (targetTier: TierId): boolean => {
          if (isHighAdmin) return true;
          return canAccessByTier(finalTier, targetTier);
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
      } catch (err: unknown) {
        if (import.meta.env.DEV) console.warn("[useUserAccess] crashed:", err);
        if (!alive) return;
        setAccess(guestAccess());
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [authLoading, userEmail]);

  return useMemo(() => access, [access]);
};
