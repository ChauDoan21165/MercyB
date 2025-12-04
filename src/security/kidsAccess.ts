// Kids Access Logic - Separate access rules for kids content

import { type TierId, isKidsTier as canonicalIsKidsTier, KIDS_TIER_IDS } from '@/lib/constants/tiers';

const ADULT_TIERS: TierId[] = [
  'free',
  'vip1',
  'vip2',
  'vip3',
  'vip4',
  'vip5',
  'vip6',
  'vip7',
  'vip8',
  'vip9',
];

/**
 * Check if tier is a kids tier
 */
export function isKidsTier(tier: TierId): boolean {
  return canonicalIsKidsTier(tier);
}

/**
 * Check if tier is an adult tier
 */
export function isAdultTier(tier: TierId): boolean {
  return ADULT_TIERS.includes(tier);
}

/**
 * Check if adult user can access kids content
 * Adults CAN access kids content (it's safe for all ages)
 */
export function canAdultAccessKids(userTier: TierId): boolean {
  // Adults can always access kids content
  return isAdultTier(userTier);
}

/**
 * Check if kids user can access adult content
 * Kids CANNOT access adult content (restricted)
 */
export function canKidsAccessAdult(userTier: TierId, targetTier: TierId): boolean {
  // If user has kids tier, they can only access kids content
  if (isKidsTier(userTier)) {
    return isKidsTier(targetTier);
  }

  // Non-kids users can access anything
  return true;
}

/**
 * Get appropriate error message for access denial
 */
export function getKidsAccessError(userTier: TierId, targetTier: TierId): string {
  if (isKidsTier(userTier) && isAdultTier(targetTier)) {
    return 'This content is for adult users only. Kids accounts can only access Kids Level content.';
  }

  return 'You do not have access to this content.';
}

/**
 * Check if room is appropriate for kids
 */
export function isRoomKidsSafe(roomTier: TierId): boolean {
  return isKidsTier(roomTier);
}

/**
 * Get kids tier level (1-3)
 */
export function getKidsTierLevel(tier: TierId): number {
  if (tier === 'kids_1') return 1;
  if (tier === 'kids_2') return 2;
  if (tier === 'kids_3') return 3;
  return 0;
}
