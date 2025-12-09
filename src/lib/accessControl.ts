/**
 * Centralized VIP Access Control
 * 
 * Uses canonical tier system from lib/constants/tiers.ts
 * This module defines the single source of truth for tier-based access control.
 * All access checks in the app should use these functions.
 * 
 * IMPORTANT:
 * Access control determines *full access*, not *visibility*.
 * RoomLoader must ALWAYS load the room for ALL users, including visitors.
 * If canUserAccessRoom() returns false, RoomLoader must return a PREVIEW
 * instead of blocking or returning an empty room.
 */

import { type TierId, isKidsTier, KIDS_TIER_IDS } from '@/lib/constants/tiers';

/**
 * Tier hierarchy (higher tiers include access to all lower tiers)
 * Keys must match TierId exactly
 * 
 * NOTE: Kids tiers share numeric values with VIP tiers (kids_1=2, kids_2=3, kids_3=4)
 * but cross-family access is ALWAYS blocked except for VIP9.
 * This is intentional - the numeric comparison only applies within the same family.
 * Do NOT "fix" this by giving kids tiers unique numbers.
 */
/**
 * Canonical tier levels per user's authoritative tier structure:
 * FREE = 0, VIP1 = 1, VIP2 = 2, VIP3 = 3, VIP3II = 3 (same level, specialization), 
 * VIP4 = 4, VIP5 = 5, VIP6 = 6, VIP7 = 7, VIP8 = 8, VIP9 = 9
 */
const TIER_HIERARCHY: Record<TierId, number> = {
  free: 0,
  vip1: 1,  // English Foundation
  vip2: 2,  // A2 + B1
  vip3: 3,  // B2 + C1 + C2 core
  vip3ii: 3, // VIP3 specialization (same level as VIP3 - unlocked by VIP3)
  vip4: 4,  // CareerZ
  vip5: 5,  // Writing
  vip6: 6,  // Psychology
  vip7: 7,  // Critical Thinking, Interpersonal Intelligence
  vip8: 8,  // Coming soon
  vip9: 9,  // Strategy Mindset - highest access
  kids_1: 1, // Kids tiers use same numeric scale but are blocked from VIP rooms
  kids_2: 2, // Cross-family blocking happens BEFORE numeric comparison
  kids_3: 3, // Only VIP9 bypasses the cross-family block
};

/**
 * Determines if a user can access a specific room based on tier
 * 
 * @param userTier - The user's canonical tier ID
 * @param roomTier - The tier requirement of the room (canonical tier ID)
 * @returns true if user has FULL access, false if preview only
 */
export function canUserAccessRoom(userTier: TierId, roomTier: TierId): boolean {
  // Kids tiers are separate from VIP tiers - can't cross access
  const userIsKids = isKidsTier(userTier);
  const roomIsKids = isKidsTier(roomTier);
  
  // If one is kids and other isn't, no access (unless user is VIP9)
  if (userIsKids !== roomIsKids && userTier !== 'vip9') {
    return false;
  }
  
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const roomLevel = TIER_HIERARCHY[roomTier] || 0;
  
  return userLevel >= roomLevel;
}

/**
 * Helper for roomLoader to determine access mode
 * Returns hasFullAccess and isPreview flags
 * 
 * RoomLoader should use this to decide:
 * - hasFullAccess: true → show all entries
 * - isPreview: true → show preview entries (first 2)
 * - NEVER hide the room entirely
 */
export function determineAccess(userTier: TierId, roomTier: TierId) {
  const hasFullAccess = canUserAccessRoom(userTier, roomTier);
  return {
    hasFullAccess,
    isPreview: !hasFullAccess,
  };
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
  if (userLevel >= TIER_HIERARCHY.vip3) {
    tiers.push('vip3');
    tiers.push('vip3ii'); // VIP3 users get VIP3II access (same level)
  }
  if (userLevel >= TIER_HIERARCHY.vip4) tiers.push('vip4');
  if (userLevel >= TIER_HIERARCHY.vip5) tiers.push('vip5');
  if (userLevel >= TIER_HIERARCHY.vip6) tiers.push('vip6');
  if (userLevel >= TIER_HIERARCHY.vip7) tiers.push('vip7');
  if (userLevel >= TIER_HIERARCHY.vip8) tiers.push('vip8');
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
  { tier: 'vip2' as TierId, roomId: 'vip3ii_room', roomTier: 'vip3ii' as TierId, expected: false }, // VIP2 can't access VIP3II
  
  // VIP3 tier - should access both VIP3 and VIP3II (same level)
  { tier: 'vip3' as TierId, roomId: 'public_speaking_structure_vip3', roomTier: 'vip3' as TierId, expected: true },
  { tier: 'vip3' as TierId, roomId: 'vip3ii_english_specialization', roomTier: 'vip3ii' as TierId, expected: true }, // VIP3 CAN access VIP3II
  { tier: 'vip3' as TierId, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as TierId, expected: false },
  
  // VIP3II tier - same level as VIP3
  { tier: 'vip3ii' as TierId, roomId: 'vip3_room', roomTier: 'vip3' as TierId, expected: true }, // VIP3II can access VIP3
  { tier: 'vip3ii' as TierId, roomId: 'vip3ii_room', roomTier: 'vip3ii' as TierId, expected: true },
  { tier: 'vip3ii' as TierId, roomId: 'vip4_room', roomTier: 'vip4' as TierId, expected: false },
  
  // VIP4 tier
  { tier: 'vip4' as TierId, roomId: 'personal_safety_self_protection_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip4' as TierId, roomId: 'essential_money_risk_management_vip4_bonus', roomTier: 'vip4' as TierId, expected: true },
  { tier: 'vip4' as TierId, roomId: 'some_vip5_room', roomTier: 'vip5' as TierId, expected: false },
  
  // VIP5-8 tiers
  { tier: 'vip5' as TierId, roomId: 'some_vip5_room', roomTier: 'vip5' as TierId, expected: true },
  { tier: 'vip6' as TierId, roomId: 'some_vip6_room', roomTier: 'vip6' as TierId, expected: true },
  { tier: 'vip7' as TierId, roomId: 'some_vip7_room', roomTier: 'vip7' as TierId, expected: true },
  { tier: 'vip8' as TierId, roomId: 'some_vip8_room', roomTier: 'vip8' as TierId, expected: true },
  
  // Kids tiers (separate from VIP)
  { tier: 'kids_1' as TierId, roomId: 'kids_room_l1', roomTier: 'kids_1' as TierId, expected: true },
  { tier: 'kids_2' as TierId, roomId: 'kids_room_l1', roomTier: 'kids_1' as TierId, expected: true },
  { tier: 'kids_3' as TierId, roomId: 'kids_room_l2', roomTier: 'kids_2' as TierId, expected: true },
  { tier: 'kids_1' as TierId, roomId: 'vip_room', roomTier: 'vip1' as TierId, expected: false }, // Kids can't access VIP
  { tier: 'vip2' as TierId, roomId: 'kids_room', roomTier: 'kids_1' as TierId, expected: false }, // VIP can't access Kids
  
  // VIP9 (full access to everything)
  { tier: 'vip9' as TierId, roomId: 'any_room', roomTier: 'vip9' as TierId, expected: true },
  { tier: 'vip9' as TierId, roomId: 'any_vip6_room', roomTier: 'vip6' as TierId, expected: true },
  { tier: 'vip9' as TierId, roomId: 'kids_room', roomTier: 'kids_3' as TierId, expected: true }, // VIP9 can access kids
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
