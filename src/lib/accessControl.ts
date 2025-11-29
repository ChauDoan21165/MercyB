/**
 * Centralized VIP Access Control
 * 
 * This module defines the single source of truth for tier-based access control.
 * All access checks in the app should use these functions.
 */

export type UserTier = 'demo' | 'free' | 'vip1' | 'vip2' | 'vip3' | 'vip3_ii' | 'vip4' | 'vip5' | 'vip6' | 'vip9';
export type RoomTier = 'free' | 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip5' | 'vip6' | 'vip9';

/**
 * Tier hierarchy (higher tiers include access to all lower tiers)
 */
const TIER_HIERARCHY: Record<UserTier, number> = {
  demo: 0,
  free: 1,
  vip1: 2,
  vip2: 3,
  vip3: 4,
  vip3_ii: 4.5, // VIP3 II has same level as VIP3 for most content
  vip4: 5,
  vip5: 6,
  vip6: 7,
  vip9: 10, // Admins and VIP9 have full access
};

/**
 * Determines if a user can access a specific room based on tier
 * 
 * @param userTier - The user's subscription tier or 'demo' if not authenticated
 * @param roomTier - The tier requirement of the room
 * @returns true if user can access the room, false otherwise
 */
export function canUserAccessRoom(userTier: UserTier, roomTier: RoomTier): boolean {
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const roomLevel = TIER_HIERARCHY[roomTier as UserTier] || 0;
  
  return userLevel >= roomLevel;
}

/**
 * Determines if a user can access a specific VIP tier level
 */
export function canAccessVIPTier(userTier: UserTier, targetTier: RoomTier): boolean {
  return canUserAccessRoom(userTier, targetTier);
}

/**
 * Get all tiers a user can access
 */
export function getAccessibleTiers(userTier: UserTier): RoomTier[] {
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const tiers: RoomTier[] = ['free'];
  
  if (userLevel >= TIER_HIERARCHY.vip1) tiers.push('vip1');
  if (userLevel >= TIER_HIERARCHY.vip2) tiers.push('vip2');
  if (userLevel >= TIER_HIERARCHY.vip3) tiers.push('vip3');
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
  { tier: 'free' as UserTier, roomId: 'women-health', roomTier: 'free' as RoomTier, expected: true },
  { tier: 'free' as UserTier, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as RoomTier, expected: false },
  
  // VIP2 tier
  { tier: 'vip2' as UserTier, roomId: 'women-health', roomTier: 'free' as RoomTier, expected: true },
  { tier: 'vip2' as UserTier, roomId: 'some_vip2_room', roomTier: 'vip2' as RoomTier, expected: true },
  { tier: 'vip2' as UserTier, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as RoomTier, expected: false },
  
  // VIP3 tier
  { tier: 'vip3' as UserTier, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as RoomTier, expected: true },
  { tier: 'vip3' as UserTier, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as RoomTier, expected: false },
  
  // VIP4 tier
  { tier: 'vip4' as UserTier, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as RoomTier, expected: true },
  { tier: 'vip4' as UserTier, roomId: 'essential_money_risk_management_vip4_bonus', roomTier: 'vip4' as RoomTier, expected: true },
  { tier: 'vip4' as UserTier, roomId: 'life_logistics_adulting_skills_vip4_bonus', roomTier: 'vip4' as RoomTier, expected: true },
  { tier: 'vip4' as UserTier, roomId: 'everyday_survival_thinking_vip4_bonus', roomTier: 'vip4' as RoomTier, expected: true },
  { tier: 'vip4' as UserTier, roomId: 'some_vip5_room', roomTier: 'vip5' as RoomTier, expected: false },
  
  // VIP5 tier
  { tier: 'vip5' as UserTier, roomId: 'some_vip5_room', roomTier: 'vip5' as RoomTier, expected: true },
  { tier: 'vip5' as UserTier, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as RoomTier, expected: true },
  { tier: 'vip5' as UserTier, roomId: 'some_vip6_room', roomTier: 'vip6' as RoomTier, expected: false },
  
  // VIP9 (full access)
  { tier: 'vip9' as UserTier, roomId: 'any_room', roomTier: 'vip9' as RoomTier, expected: true },
  { tier: 'vip9' as UserTier, roomId: 'any_vip6_room', roomTier: 'vip6' as RoomTier, expected: true },
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
