// PATH: src/lib/tierValidation.ts
// File: tierValidation.ts

/**
 * Tier Validation Utilities
 *
 * Strict validation for tier system — NO GUESSING, NO FALLBACKS
 * Uses canonical tier constants from lib/constants/tiers.ts
 *
 * Access policy:
 * - premium_month / premium_year unlock the whole paid repo
 * - legacy level1..level9 tiers remain allowed for backward compatibility
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

  if (!tierId) {
    return {
      valid: false,
      canonical: null,
      tierId: null,
      error: `Could not normalize tier value: "${dbTier}"`,
    };
  }

  return {
    valid: true,
    canonical: tierIdToDbLabel(tierId),
    tierId,
  };
}

/**
 * Get all canonical tier labels for database queries.
 */
export function getAllCanonicalTierLabels(): TierValue[] {
  return [...TIERS];
}

/**
 * Map TierId to database tier label for queries.
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

/**
 * Legacy compatibility tiers — canonical IDs are level1..level9,
 * not vip1..vip9. The regex must match the actual TierId values.
 */
function isLegacyVipTier(tierId: TierId): boolean {
  return /^level[1-9]$/.test(String(tierId));
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
 * Verify tier access — returns true if userTier can access roomTier.
 *
 * Policy:
 * - level0 users can only access level0 content
 * - paid billing tiers unlock the whole adult paid repo
 * - legacy level1..level9 tiers unlock the whole adult paid repo (compatibility)
 * - kids tiers only access kids progression by level
 * - adult users may access kids-tiered rooms
 */
export function verifyTierAccess(userTierId: TierId, roomTierId: TierId): boolean {
  const userTier = normalizeTier(String(userTierId).trim());
  const roomTier = normalizeTier(String(roomTierId).trim());

  if (!userTier || !roomTier) return false;

  if (roomTier === "level0") return true;
  if (userTier === roomTier) return true;

  // Kids progression stays isolated from adult paid tiers
  if (isKidsTier(userTier)) {
    if (!isKidsTier(roomTier)) return false;
    return kidsTierLevel(userTier) >= kidsTierLevel(roomTier);
  }

  // Adult users can access kids content
  if (isKidsTier(roomTier)) return true;

  // Paid adult users unlock the whole adult paid repo
  if (isPaidRepoTier(userTier)) return true;

  // Level 0 adult users cannot access paid adult content
  return false;
}

/**
 * Debug helper — log tier mismatch details in development only.
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