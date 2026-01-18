/**
 * Tier Validation Utilities
 * 
 * Strict validation for tier system - NO GUESSING, NO FALLBACKS
 * Uses canonical tier constants from lib/constants/tiers.ts
 */

import { 
  TIER_ID_TO_LABEL, 
  TIERS, 
  type TierId, 
  type TierValue,
  isValidTierId,
  isValidTier,
  normalizeTier 
} from '@/lib/constants/tiers';

/**
 * Validate that a database tier value matches expected canonical format
 */
export function validateDbTier(dbTier: string | null | undefined): {
  valid: boolean;
  canonical: TierValue | null;
  tierId: TierId | null;
  error?: string;
} {
  if (!dbTier) {
    return { valid: false, canonical: null, tierId: null, error: 'Tier is null/undefined' };
  }

  // Check if it's already a canonical label
  if (isValidTier(dbTier)) {
    const tierId = normalizeTier(dbTier);
    return { valid: true, canonical: dbTier as TierValue, tierId };
  }

  // Try to normalize and get canonical
  const tierId = normalizeTier(dbTier);
  const canonical = TIER_ID_TO_LABEL[tierId];

  // If normalized to 'free' but input doesn't look like free, it's invalid
  if (tierId === 'free' && !dbTier.toLowerCase().includes('free') && !dbTier.toLowerCase().includes('miễn phí')) {
    return { 
      valid: false, 
      canonical: null, 
      tierId: null, 
      error: `Unknown tier value: "${dbTier}"` 
    };
  }

  return { valid: true, canonical, tierId };
}

/**
 * Get all canonical tier labels for database queries
 */
export function getAllCanonicalTierLabels(): TierValue[] {
  return Object.values(TIERS);
}

/**
 * Map TierId to database tier label for queries
 */
export function tierIdToDbLabel(tierId: TierId): TierValue {
  return TIER_ID_TO_LABEL[tierId];
}

/**
 * Verify tier access - returns true if userTier can access roomTier
 */
export function verifyTierAccess(userTierId: TierId, roomTierId: TierId): boolean {
  const tierOrder: TierId[] = [
    'free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip9'
  ];
  
  // VIP9 has full access
  if (userTierId === 'vip9') return true;
  
  // Kids tiers only access kids content
  const kidsUserTiers: TierId[] = ['kids_1', 'kids_2', 'kids_3'];
  const kidsRoomTiers: TierId[] = ['kids_1', 'kids_2', 'kids_3'];
  
  if (kidsUserTiers.includes(userTierId)) {
    if (!kidsRoomTiers.includes(roomTierId)) return false;
    const kidsOrder = kidsRoomTiers;
    return kidsOrder.indexOf(userTierId) >= kidsOrder.indexOf(roomTierId);
  }
  
  // Regular tier access
  const userIdx = tierOrder.indexOf(userTierId);
  const roomIdx = tierOrder.indexOf(roomTierId);
  
  if (userIdx === -1 || roomIdx === -1) return false;
  
  return userIdx >= roomIdx;
}

/**
 * Debug helper - log tier mismatch details
 */
export function logTierMismatch(
  context: string, 
  expected: string, 
  actual: string | null | undefined
): void {
  if (import.meta.env.DEV) {
    console.warn(`[TierValidation] ${context}:`, {
      expected,
      actual: actual ?? 'null',
      match: expected === actual,
    });
  }
}
