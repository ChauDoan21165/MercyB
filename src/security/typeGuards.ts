// PATH: src/security/typeGuards.ts
// File: typeGuards.ts
//
// Type Guards — Strict runtime type validation for user tier and roles

import type { TierId } from "@/lib/constants/tiers";

const VALID_TIERS_SET = new Set<string>([
  "level0",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
  "premium_month",
  "premium_year",
  "kids_1",
  "kids_2",
  "kids_3",
]);

const VALID_ROLES = ["admin", "moderator", "user"] as const;
export type AppRole = (typeof VALID_ROLES)[number];

const VALID_ROLES_SET = new Set<string>(VALID_ROLES);

function isKidsTier(tier: TierId): boolean {
  return tier === "kids_1" || tier === "kids_2" || tier === "kids_3";
}

function isPaidBillingTier(tier: TierId): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function isLegacyVipTier(tier: TierId): boolean {
  return (
    tier === "level1" ||
    tier === "level2" ||
    tier === "level3" ||
    tier === "level4" ||
    tier === "level5" ||
    tier === "level6" ||
    tier === "level7" ||
    tier === "level8" ||
    tier === "level9"
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
 * Guard: Ensure tier is valid, force to 'level0' if poisoned.
 */
export function guardTierId(tier: unknown): TierId {
  if (typeof tier !== "string") {
    if (import.meta.env.DEV) {
      console.warn("[TypeGuard] Invalid tier type:", typeof tier);
    }
    return "level0";
  }

  const normalized = tier.trim().toLowerCase();

  if (!VALID_TIERS_SET.has(normalized)) {
    if (import.meta.env.DEV) {
      console.warn("[TypeGuard] Invalid tier value:", tier, "— forcing to level0");
    }
    return "level0";
  }

  return normalized as TierId;
}

/**
 * Guard: Ensure role is valid, force to 'user' if unknown.
 */
export function guardRole(role: unknown): AppRole {
  if (typeof role !== "string") return "user";

  const normalized = role.trim().toLowerCase();

  if (!VALID_ROLES_SET.has(normalized)) {
    if (import.meta.env.DEV) {
      console.warn("[TypeGuard] Invalid role:", role, "— forcing to user");
    }
    return "user";
  }

  return normalized as AppRole;
}

/**
 * Guard: Ensure user ID is a valid UUID.
 * Returns null for any invalid or non-UUID value.
 */
export function guardUserId(userId: unknown): string | null {
  if (typeof userId !== "string") return null;

  const trimmed = userId.trim();
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(trimmed)) {
    if (import.meta.env.DEV) {
      console.warn("[TypeGuard] Invalid user ID format");
    }
    return null;
  }

  return trimmed;
}

/**
 * Compare client tier vs server tier, detect spoofing.
 * Returns true if a mismatch is detected.
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
 * - level1..level9 remain legacy compatibility levels
 * - kids tiers map to levels 1–3
 *
 * IMPORTANT: Do not use this alone as an access policy.
 * Use canAccessTier() for policy-aware checks.
 */
export function getTierLevel(tier: TierId): number {
  const safeTier = guardTierId(tier);

  const tierLevels: Record<TierId, number> = {
    level0: 0,
    level1: 1,
    level2: 2,
    level3: 3,
    level4: 4,
    level5: 5,
    level6: 6,
    level7: 7,
    level8: 8,
    level9: 9,
    premium_month: 999,
    premium_year: 999,
    kids_1: 1,
    kids_2: 2,
    kids_3: 3,
  };

  return tierLevels[safeTier];
}

/**
 * Check if user tier grants access to required tier.
 *
 * Safe behavior:
 * - unknown / poisoned user tier => treated as 'level0'
 * - unknown / poisoned required tier => treated as 'level0'
 *
 * Policy:
 * - level0 => only level0
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

  if (safeRequiredTier === "level0") return true;
  if (safeUserTier === safeRequiredTier) return true;

  // Kids accounts stay isolated from adult tiers
  if (isKidsTier(safeUserTier)) {
    if (!isKidsTier(safeRequiredTier)) return false;
    return kidsTierLevel(safeUserTier) >= kidsTierLevel(safeRequiredTier);
  }

  // Adult paid users may access kids content
  if (isKidsTier(safeRequiredTier)) {
    return isPaidRepoTier(safeUserTier);
  }

  // Adult paid access unlocks all adult paid tiers
  if (isPaidRepoTier(safeUserTier)) return true;

  // Level 0 adult users cannot access paid adult content
  return false;
}