// PATH: src/security/typeGuards.ts
// File: typeGuards.ts
//
// Type Guards - Strict runtime type validation for user tier and roles

import type { TierId } from "@/lib/constants/tiers";

const VALID_TIERS: TierId[] = [
  "free",
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
  "premium_month",
  "premium_year",
  "kids_1",
  "kids_2",
  "kids_3",
];

const VALID_ROLES = ["admin", "moderator", "user"] as const;
export type AppRole = (typeof VALID_ROLES)[number];

function isKidsTier(tier: TierId): boolean {
  return tier === "kids_1" || tier === "kids_2" || tier === "kids_3";
}

function isPaidBillingTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function isLegacyVipTier(tier: TierId): boolean {
  return (
    tier === "vip1" ||
    tier === "vip2" ||
    tier === "vip3" ||
    tier === "vip4" ||
    tier === "vip5" ||
    tier === "vip6" ||
    tier === "vip7" ||
    tier === "vip8" ||
    tier === "vip9"
  );
}

function isPaidRepoTier(tier: TierId): boolean {
  return isPaidBillingTier(tier) || isLegacyVipTier(tier);
}

function kidsTierLevel(tier: TierId): number {
  if (tier === "kids_1") return 1;
  if (tier === "kids_2") return 2;
  if (tier === "kids_3") return 3;
  return 0;
}

/**
 * Guard: Ensure tier is valid, force to 'free' if poisoned
 */
export function guardTierId(tier: unknown): TierId {
  if (typeof tier !== "string") {
    if (import.meta.env.DEV) {
      console.error("[TypeGuard] Invalid tier type:", typeof tier);
    }
    return "free";
  }

  const normalized = tier.trim().toLowerCase() as TierId;

  if (!VALID_TIERS.includes(normalized)) {
    if (import.meta.env.DEV) {
      console.error("[TypeGuard] Invalid tier value:", tier, "- forcing to free");
    }
    return "free";
  }

  return normalized;
}

/**
 * Guard: Ensure role is valid
 */
export function guardRole(role: unknown): AppRole {
  if (typeof role !== "string") {
    return "user";
  }

  const normalized = role.trim().toLowerCase() as AppRole;

  if (!VALID_ROLES.includes(normalized)) {
    if (import.meta.env.DEV) {
      console.error("[TypeGuard] Invalid role:", role, "- forcing to user");
    }
    return "user";
  }

  return normalized;
}

/**
 * Guard: Ensure user ID is valid UUID
 */
export function guardUserId(userId: unknown): string | null {
  if (typeof userId !== "string") {
    return null;
  }

  const trimmed = userId.trim();

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(trimmed)) {
    if (import.meta.env.DEV) {
      console.error("[TypeGuard] Invalid user ID format");
    }
    return null;
  }

  return trimmed;
}

/**
 * Compare client tier vs server tier, detect spoofing
 */
export function detectTierSpoofing(
  clientTier: TierId,
  serverTier: TierId,
): boolean {
  const normalizedClient = guardTierId(clientTier);
  const normalizedServer = guardTierId(serverTier);

  if (normalizedClient !== normalizedServer) {
    if (import.meta.env.DEV) {
      console.warn("[TierSpoofing] Mismatch detected:", {
        client: normalizedClient,
        server: normalizedServer,
      });
    }
    return true;
  }

  return false;
}

/**
 * Get tier level for comparison / diagnostics only.
 *
 * Notes:
 * - premium_month / premium_year are canonical paid billing tiers
 * - vip1..vip9 remain legacy compatibility levels
 * - kids tiers remain scoped lower levels
 *
 * IMPORTANT:
 * - Do not use this alone as an access policy for mixed adult/kids access.
 * - Use canAccessTier() for policy-aware checks.
 */
export function getTierLevel(tier: TierId): number {
  const safeTier = guardTierId(tier);

  const tierLevels: Record<TierId, number> = {
    free: 0,
    vip1: 1,
    vip2: 2,
    vip3: 3,
    vip4: 4,
    vip5: 5,
    vip6: 6,
    vip7: 7,
    vip8: 8,
    vip9: 9,
    premium_month: 999,
    premium_year: 999,
    kids_1: 1,
    kids_2: 2,
    kids_3: 3,
  };

  return tierLevels[safeTier];
}

/**
 * Check if user tier grants access to required tier
 *
 * Safe behavior:
 * - unknown / poisoned user tier => treated as 'free'
 * - unknown / poisoned required tier => treated as 'free'
 *
 * Policy:
 * - free => only free
 * - premium_month / premium_year => all adult paid tiers + kids
 * - legacy VIP tiers => all adult paid tiers + kids (compatibility)
 * - kids tiers => only kids progression by level
 */
export function canAccessTier(
  userTier: TierId | string | null | undefined,
  requiredTier: TierId | string | null | undefined,
): boolean {
  const safeUserTier = guardTierId(userTier);
  const safeRequiredTier = guardTierId(requiredTier);

  if (safeRequiredTier === "free") return true;
  if (safeUserTier === safeRequiredTier) return true;

  // Kids accounts stay isolated from adult tiers.
  if (isKidsTier(safeUserTier)) {
    if (!isKidsTier(safeRequiredTier)) return false;
    return kidsTierLevel(safeUserTier) >= kidsTierLevel(safeRequiredTier);
  }

  // Adult paid users may access kids content.
  if (isKidsTier(safeRequiredTier)) {
    return isPaidRepoTier(safeUserTier);
  }

  // Adult paid access unlocks all adult paid tiers.
  if (isPaidRepoTier(safeUserTier)) return true;

  // Free adult users cannot access paid adult content.
  return false;
}