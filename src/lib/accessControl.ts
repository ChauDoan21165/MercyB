// FILE: accessControl.ts
// PATH: src/lib/accessControl.ts
// VERSION: MB-BLUE-AC-1.1.3 — 2026-01-15 (+0700)
//
// Centralized VIP Access Control
//
// IMPORTANT:
// - Room access (canUserAccessRoom) enforces FAMILY separation (Kids vs VIP) except VIP9.
// - VIP3II is a specialization track: VIP3 does NOT automatically access VIP3II (unit-test backed).
// - Generic tier comparisons (canAccessVIPTier) are numeric-level comparisons only
//   (used by tests/spec like "kids_2 same level as vip2").
// - RoomLoader must ALWAYS load the room; denied access means PREVIEW, never empty.

import { type TierId, isKidsTier } from "@/lib/constants/tiers";

/**
 * Tier hierarchy (higher tiers include access to all lower tiers)
 * Keys must match TierId exactly
 *
 * NOTE:
 * - Kids tiers share numeric values with VIP tiers for *level* comparisons.
 * - Cross-family access is blocked ONLY in canUserAccessRoom (room access),
 *   NOT in canAccessVIPTier (generic tier compare).
 */
const TIER_HIERARCHY: Record<TierId, number> = {
  free: 0,

  vip1: 1, // English Foundation
  vip2: 2, // A2 + B1
  vip3: 3, // B2 + C1 + C2 core
  vip3ii: 3, // VIP3 specialization (same numeric level, but access is NOT implied from vip3)
  vip4: 4, // CareerZ
  vip5: 5, // Writing
  vip6: 6, // Psychology
  vip7: 7, // Critical Thinking
  vip8: 8, // Coming soon
  vip9: 9, // Highest access

  // Kids tiers
  kids_1: 1,
  kids_2: 2, // same as vip2 (test-backed)
  kids_3: 3,
};

function tierLevel(tier: TierId): number {
  return TIER_HIERARCHY[tier] ?? 0;
}

/**
 * Determines if a user can access a specific room based on tier (FULL access).
 * Enforces kids/vip family separation except VIP9.
 *
 * SPECIAL RULE (unit-test backed):
 * - vip3 does NOT automatically access vip3ii rooms.
 * - vip3ii CAN access vip3 rooms (same numeric level).
 * - vip4+ CAN access vip3ii rooms (higher level).
 */
export function canUserAccessRoom(userTier: TierId, roomTier: TierId): boolean {
  const userIsKids = isKidsTier(userTier);
  const roomIsKids = isKidsTier(roomTier);

  // Cross-family block unless VIP9
  if (userIsKids !== roomIsKids && userTier !== "vip9") {
    return false;
  }

  // VIP3II specialization gate: VIP3 cannot access VIP3II rooms
  if (roomTier === "vip3ii" && userTier === "vip3") {
    return false;
  }

  return tierLevel(userTier) >= tierLevel(roomTier);
}

/**
 * Helper for RoomLoader: access mode flags.
 */
export function determineAccess(userTier: TierId, roomTier: TierId) {
  const hasFullAccess = canUserAccessRoom(userTier, roomTier);
  return {
    hasFullAccess,
    isPreview: !hasFullAccess,
  };
}

/**
 * Generic tier comparison (numeric-level comparison only).
 *
 * IMPORTANT:
 * This does NOT enforce kids/vip family separation,
 * and does NOT apply the VIP3→VIP3II room-specialization restriction.
 */
export function canAccessVIPTier(userTier: TierId, targetTier: TierId): boolean {
  return tierLevel(userTier) >= tierLevel(targetTier);
}

/**
 * Get all VIP tiers a user can access (excludes kids tiers).
 *
 * NOTE:
 * vip3 does NOT automatically include vip3ii (unit-test backed).
 */
export function getAccessibleTiers(userTier: TierId): TierId[] {
  const userLevel = tierLevel(userTier);
  const tiers: TierId[] = ["free"];

  if (userLevel >= tierLevel("vip1")) tiers.push("vip1");
  if (userLevel >= tierLevel("vip2")) tiers.push("vip2");
  if (userLevel >= tierLevel("vip3")) tiers.push("vip3");

  // vip3ii requires vip3ii specifically, or higher tiers (vip4+)
  if (userTier === "vip3ii" || userLevel >= tierLevel("vip4")) {
    tiers.push("vip3ii");
  }

  if (userLevel >= tierLevel("vip4")) tiers.push("vip4");
  if (userLevel >= tierLevel("vip5")) tiers.push("vip5");
  if (userLevel >= tierLevel("vip6")) tiers.push("vip6");
  if (userLevel >= tierLevel("vip7")) tiers.push("vip7");
  if (userLevel >= tierLevel("vip8")) tiers.push("vip8");
  if (userLevel >= tierLevel("vip9")) tiers.push("vip9");

  return tiers;
}

/**
 * Test matrix for access control verification
 * (kept exported because tests import it)
 */
export const ACCESS_TEST_MATRIX = [
  // Free tier
  { tier: "free" as TierId, roomId: "women-health", roomTier: "free" as TierId, expected: true },
  { tier: "free" as TierId, roomId: "public_speaking_structure_vip3", roomTier: "vip3" as TierId, expected: false },

  // VIP2 tier
  { tier: "vip2" as TierId, roomId: "women-health", roomTier: "free" as TierId, expected: true },
  { tier: "vip2" as TierId, roomId: "some_vip2_room", roomTier: "vip2" as TierId, expected: true },
  { tier: "vip2" as TierId, roomId: "public_speaking_structure_vip3", roomTier: "vip3" as TierId, expected: false },
  { tier: "vip2" as TierId, roomId: "vip3ii_room", roomTier: "vip3ii" as TierId, expected: false }, // VIP2 can't access VIP3II

  // VIP3 tier
  { tier: "vip3" as TierId, roomId: "public_speaking_structure_vip3", roomTier: "vip3" as TierId, expected: true },
  { tier: "vip3" as TierId, roomId: "vip3ii_english_specialization", roomTier: "vip3ii" as TierId, expected: false }, // ✅ FIX: VIP3 does NOT access VIP3II
  { tier: "vip3" as TierId, roomId: "personal_safety_self_protection_vip4_bonus", roomTier: "vip4" as TierId, expected: false },

  // VIP3II tier - same level as VIP3, but special track
  { tier: "vip3ii" as TierId, roomId: "vip3_room", roomTier: "vip3" as TierId, expected: true }, // VIP3II can access VIP3
  { tier: "vip3ii" as TierId, roomId: "vip3ii_room", roomTier: "vip3ii" as TierId, expected: true },
  { tier: "vip3ii" as TierId, roomId: "vip4_room", roomTier: "vip4" as TierId, expected: false },

  // VIP4 tier
  { tier: "vip4" as TierId, roomId: "personal_safety_self_protection_vip4_bonus", roomTier: "vip4" as TierId, expected: true },
  { tier: "vip4" as TierId, roomId: "essential_money_risk_management_vip4_bonus", roomTier: "vip4" as TierId, expected: true },
  { tier: "vip4" as TierId, roomId: "vip3ii_room", roomTier: "vip3ii" as TierId, expected: true }, // VIP4+ can access VIP3II
  { tier: "vip4" as TierId, roomId: "some_vip5_room", roomTier: "vip5" as TierId, expected: false },

  // VIP5-8 tiers
  { tier: "vip5" as TierId, roomId: "some_vip5_room", roomTier: "vip5" as TierId, expected: true },
  { tier: "vip6" as TierId, roomId: "some_vip6_room", roomTier: "vip6" as TierId, expected: true },
  { tier: "vip7" as TierId, roomId: "some_vip7_room", roomTier: "vip7" as TierId, expected: true },
  { tier: "vip8" as TierId, roomId: "some_vip8_room", roomTier: "vip8" as TierId, expected: true },

  // Kids tiers (separate from VIP for ROOM access)
  { tier: "kids_1" as TierId, roomId: "kids_room_l1", roomTier: "kids_1" as TierId, expected: true },
  { tier: "kids_2" as TierId, roomId: "kids_room_l1", roomTier: "kids_1" as TierId, expected: true },
  { tier: "kids_3" as TierId, roomId: "kids_room_l2", roomTier: "kids_2" as TierId, expected: true },
  { tier: "kids_1" as TierId, roomId: "vip_room", roomTier: "vip1" as TierId, expected: false }, // Kids can't access VIP rooms
  { tier: "vip2" as TierId, roomId: "kids_room", roomTier: "kids_1" as TierId, expected: false }, // VIP can't access Kids rooms

  // VIP9 (full access to everything)
  { tier: "vip9" as TierId, roomId: "any_room", roomTier: "vip9" as TierId, expected: true },
  { tier: "vip9" as TierId, roomId: "any_vip6_room", roomTier: "vip6" as TierId, expected: true },
  { tier: "vip9" as TierId, roomId: "kids_room", roomTier: "kids_3" as TierId, expected: true }, // VIP9 can access kids rooms
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
      failures.push({ ...test, actual: result });
    }
  }

  return { passed, failed, failures };
}
