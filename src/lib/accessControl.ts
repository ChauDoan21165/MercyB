/**
 * Centralized VIP Access Control
 * 
 * Uses canonical tier system from lib/constants/tiers.ts
 * This module defines the single source of truth for tier-based access control.
 * All access checks in the app should use these functions.
 */

import { type TierId } from '@/lib/constants/tiers';

/**
 * Tier hierarchy (higher tiers include access to all lower tiers)
 * Keys must match TierId exactly
 */
const TIER_HIERARCHY: Record<TierId, number> = {
  free: 1,
  vip1: 2,
  vip2: 3,
  vip3: 4,
  vip3ii: 4.5, // VIP3 II has same level as VIP3 for most content
  vip4: 5,
  vip5: 6,
  vip6: 7,
  vip9: 10, // Admins and VIP9 have full access
  kids_1: 2, // Kids tiers map to VIP1 level
  kids_2: 3, // Kids tier 2 maps to VIP2 level
  kids_3: 4, // Kids tier 3 maps to VIP3 level
};

/**
 * Determines if a user can access a specific room based on tier
 * 
 * @param userTier - The user's canonical tier ID
 * @param roomTier - The tier requirement of the room (canonical tier ID)
 * @returns true if user can access the room, false otherwise
 */
export function canUserAccessRoom(userTier: TierId, roomTier: TierId): boolean {
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const roomLevel = TIER_HIERARCHY[roomTier] || 0;
  
  return userLevel >= roomLevel;
}

/**
 * Determines if a user can access a specific VIP tier level
 */
export function canAccessVIPTier(userTier: TierId, targetTier: TierId): boolean {
  return canUserAccessRoom(userTier, targetTier);
}

/**
 * Get all tiers a user can access (VIP tiers only, excludes kids tiers)
 */
export function getAccessibleTiers(userTier: TierId): TierId[] {
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const tiers: TierId[] = ['free'];
  
  if (userLevel >= TIER_HIERARCHY.vip1) tiers.push('vip1');
  if (userLevel >= TIER_HIERARCHY.vip2) tiers.push('vip2');
  if (userLevel >= TIER_HIERARCHY.vip3) tiers.push('vip3');
  if (userLevel >= TIER_HIERARCHY.vip3ii) tiers.push('vip3ii');
  if (userLevel >= TIER_HIERARCHY.vip4) tiers.push('vip4');
  if (userLevel >= TIER_HIERARCHY.vip5) tiers.push('vip5');
  if (userLevel >= TIER_HIERARCHY.vip6) tiers.push('vip6');
  if (userLevel >= TIER_HIERARCHY.vip9) tiers.push('vip9');
  
  return tiers;
}

/**
 * Test matrix for access control verification
 */
export const ACCESS_TEST_MATRIX = [
  // Free tier
  { tier: 'free' as TierId, roomId: 'women-health', roomTier: 'free' as TierId, expected: true },
  { tier: 'free' as TierId, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as TierId, expected: false },
  
  // VIP2 tier
  { tier: 'vip2' as TierId, roomId: 'women-health', roomTier: 'free' as TierId, expected: true },
  { tier: 'vip2' as TierId, roomId: 'some_vip2_room', roomTier: 'vip2' as TierId, expected: true },
  { tier: 'vip2' as TierId, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as TierId, expected: false },
  
  // VIP3 tier
  { tier: 'vip3' as TierId, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as TierId, expected: true },
  { tier: 'vip3' as TierId, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as TierId, expected: false },
  
  // VIP3 II tier
  { tier: 'vip3ii' as TierId, roomId: 'vip3ii_exclusive', roomTier: 'vip3ii' as TierId, expected: true },
  { tier: 'vip3ii' as TierId, roomId: 'vip3_room', roomTier: 'vip3' as TierId, expected: true },
  
  // VIP4 tier
  { tier: 'vip4' as TierId, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip4' as TierId, roomId: 'essential_money_risk_management_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip4' as TierId, roomId: 'life_logistics_adulting_skills_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip4' as TierId, roomId: 'everyday_survival_thinking_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip4' as TierId, roomId: 'some_vip5_room', roomTier: 'vip5' as TierId, expected: false },
  
  // VIP5 tier
  { tier: 'vip5' as TierId, roomId: 'some_vip5_room', roomTier: 'vip5' as TierId, expected: true },
  { tier: 'vip5' as TierId, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip5' as TierId, roomId: 'some_vip6_room', roomTier: 'vip6' as TierId, expected: false },
  
  // Kids tiers
  { tier: 'kids_1' as TierId, roomId: 'kids_room_l1', roomTier: 'kids_1' as TierId, expected: true },
  { tier: 'kids_2' as TierId, roomId: 'kids_room_l1', roomTier: 'kids_1' as TierId, expected: true },
  { tier: 'kids_3' as TierId, roomId: 'kids_room_l2', roomTier: 'kids_2' as TierId, expected: true },
  
  // VIP9 (full access)
  { tier: 'vip9' as TierId, roomId: 'any_room', roomTier: 'vip9' as TierId, expected: true },
  { tier: 'vip9' as TierId, roomId: 'any_vip6_room', roomTier: 'vip6' as TierId, expected: true },
];

/**
 * Validate the access control logic against the test matrix
 */
export function validateAccessControl(): { passed: number; failed: number; failures: any[] } {
  let passed = 0;
  let failed = 0;
  const failures: any[] = [];
  
  for (const test of ACCESS_TEST_MATRIX) {
    const result = canUserAccessRoom(test.tier, test.roomTier);
    if (result === test.expected) {
      passed++;
    } else {
      failed++;
      failures.push({
        ...test,
        actual: result
      });
    }
  }
  
  return { passed, failed, failures };
}
