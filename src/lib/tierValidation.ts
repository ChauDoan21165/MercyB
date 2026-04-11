/**
 * Path: src/lib/tierValidation.ts
 * File: tierValidation.ts
 */

/**
 * Tier Validation Utilities
 *
 * Strict validation for tier system - NO GUESSING, NO FALLBACKS
 * Uses canonical tier constants from lib/constants/tiers.ts
 *
 * New access policy:
 * - premium_month / premium_year unlock the whole paid repo
 * - legacy VIP tiers remain allowed for backward compatibility
 * - kids tiers stay on their own progression path
 */

import {
  TIER_ID_TO_LABEL,
  TIERS,
  type TierId,
  type TierValue,
  isValidTier,
  normalizeTier,
} from "@/lib/constants/tiers";

/**
 * Validate that a database tier value matches expected canonical format.
 *
 * Strict behavior:
 * - Only canonical tier labels are accepted as valid DB values.
 * - Unknown / malformed values do not silently pass.
 */
export function validateDbTier(dbTier: string | null | undefined): {
  valid: boolean;
  canonical: TierValue | null;
  tierId: TierId | null;
  error?: string;
} {
  if (typeof dbTier !== "string" || !dbTier.trim()) {
    return {
      valid: false,
      canonical: null,
      tierId: null,
      error: "Tier is null/undefined/empty",
    };
  }

  const raw = dbTier.trim();

  if (!isValidTier(raw)) {
    return {
      valid: false,
      canonical: null,
      tierId: null,
      error: `Unknown tier value: "${dbTier}"`,
    };
  }

  const tierId = normalizeTier(raw);

  return {
    valid: true,
    canonical: tierIdToDbLabel(tierId),
    tierId,
  };
}

/**
 * Get all canonical tier labels for database queries
 */
export function getAllCanonicalTierLabels(): TierValue[] {
  return [...TIERS];
}

/**
 * Map TierId to database tier label for queries
 */
export function tierIdToDbLabel(tierId: TierId): TierValue {
  return TIER_ID_TO_LABEL[tierId] as TierValue;
}

function isKidsTier(tierId: TierId): boolean {
  return tierId === "kids_1" || tierId === "kids_2" || tierId === "kids_3";
}

function isPaidBillingTier(tierId: TierId): boolean {
  return tierId === "premium_month" || tierId === "premium_year";
}

function isLegacyVipTier(tierId: TierId): boolean {
  return /^vip[1-9]$/.test(String(tierId));
}

function isPaidRepoTier(tierId: TierId): boolean {
  return isPaidBillingTier(tierId) || isLegacyVipTier(tierId);
}

function kidsTierLevel(tierId: TierId): number {
  if (tierId === "kids_1") return 1;
  if (tierId === "kids_2") return 2;
  if (tierId === "kids_3") return 3;
  return 0;
}

/**
 * Verify tier access - returns true if userTier can access roomTier
 *
 * Policy:
 * - free users can only access free content
 * - paid billing tiers can access the whole adult paid repo
 * - legacy VIP tiers can access the whole adult paid repo for compatibility
 * - kids tiers only access kids progression by level
 * - adult users may access kids content only when the room itself is kids-tiered
 */
export function verifyTierAccess(userTierId: TierId, roomTierId: TierId): boolean {
  const userTier = normalizeTier(userTierId);
  const roomTier = normalizeTier(roomTierId);

  if (roomTier === "free") return true;
  if (userTier === roomTier) return true;

  // Kids progression stays isolated from adult paid tiers.
  if (isKidsTier(userTier)) {
    if (!isKidsTier(roomTier)) return false;
    return kidsTierLevel(userTier) >= kidsTierLevel(roomTier);
  }

  // Adult users can access kids content.
  if (isKidsTier(roomTier)) {
    return true;
  }

  // Paid adult users unlock the whole adult paid repo.
  if (isPaidRepoTier(userTier)) return true;

  // Free adult users cannot access paid adult content.
  if (userTier === "free") return false;

  return false;
}

/**
 * Debug helper - log tier mismatch details
 */
export function logTierMismatch(
  context: string,
  expected: string,
  actual: string | null | undefined,
): void {
  if (import.meta.env.DEV) {
    console.warn(`[TierValidation] ${context}:`, {
      expected,
      actual: actual ?? "null",
      match: expected === actual,
    });
  }
}