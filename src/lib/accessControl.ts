/**
 * Path: src/lib/accessControl.ts
 * File: accessControl.ts
 */

import type { TierId } from "@/lib/constants/tiers";
import { KIDS_TIER_IDS } from "@/lib/constants/tiers";

type AccessTestCase = {
  userTier: TierId;
  roomTier: TierId;
  expected: boolean;
};

function normalizeTier(tier: TierId | null | undefined): string {
  return String(tier ?? "").toLowerCase().trim();
}

function isKidsTier(tier: TierId | null | undefined): boolean {
  const value = normalizeTier(tier);
  if (!value) return false;

  if (value === "kids_1" || value === "kids_2" || value === "kids_3") {
    return true;
  }

  if (Array.isArray(KIDS_TIER_IDS)) {
    return (KIDS_TIER_IDS as readonly TierId[]).includes(tier as TierId);
  }

  return false;
}

function isPremiumBillingTier(tier: TierId | null | undefined): boolean {
  const value = normalizeTier(tier);
  return value === "premium_month" || value === "premium_year";
}

function tierToLevel(tier: TierId): number {
  const value = normalizeTier(tier);

  if (!value || value === "level0") return 0;

  if (value === "level1") return 1;
  if (value === "level2") return 2;
  if (value === "level3") return 3;
  if (value === "level4") return 4;
  if (value === "level5") return 5;
  if (value === "level6") return 6;
  if (value === "level7") return 7;
  if (value === "level8") return 8;
  if (value === "level9") return 9;

  if (value.includes("level3")) return 3;

  if (value === "kids_1") return 1;
  if (value === "kids_2") return 2;
  if (value === "kids_3") return 3;

  if (isPremiumBillingTier(tier)) return 9;

  return 0;
}

export const ACCESS_TEST_MATRIX: AccessTestCase[] = [
  { userTier: "level0", roomTier: "level0", expected: true },
  { userTier: "level0", roomTier: "level1", expected: false },
  { userTier: "level0", roomTier: "kids_1", expected: false },

  { userTier: "premium_month", roomTier: "level1", expected: true },
  { userTier: "premium_month", roomTier: "level9", expected: true },
  { userTier: "premium_month", roomTier: "kids_3", expected: true },

  { userTier: "premium_year", roomTier: "level4", expected: true },
  { userTier: "premium_year", roomTier: "kids_2", expected: true },

  { userTier: "level1", roomTier: "level0", expected: true },
  { userTier: "level1", roomTier: "level1", expected: true },
  { userTier: "level1", roomTier: "level2", expected: false },
  { userTier: "level1", roomTier: "level9", expected: false },

  { userTier: "level2", roomTier: "level1", expected: true },
  { userTier: "level2", roomTier: "level2", expected: true },
  { userTier: "level2", roomTier: "level3", expected: false },

  { userTier: "level3", roomTier: "level1", expected: true },
  { userTier: "level3", roomTier: "level3", expected: true },
  { userTier: "level3", roomTier: "level4", expected: false },

  { userTier: "level6", roomTier: "level5", expected: true },
  { userTier: "level6", roomTier: "level9", expected: false },

  { userTier: "level9", roomTier: "level0", expected: true },
  { userTier: "level9", roomTier: "level6", expected: true },
  { userTier: "level9", roomTier: "level9", expected: true },

  { userTier: "kids_1", roomTier: "kids_1", expected: true },
  { userTier: "kids_1", roomTier: "kids_2", expected: false },
  { userTier: "kids_2", roomTier: "kids_1", expected: true },
  { userTier: "kids_2", roomTier: "level1", expected: true },
  { userTier: "kids_2", roomTier: "level2", expected: true },
  { userTier: "kids_2", roomTier: "level3", expected: false },
  { userTier: "kids_3", roomTier: "kids_2", expected: true },
];

export function canAccessVIPTier(
  userTier: TierId,
  requiredTier: TierId,
): boolean {
  if (requiredTier === "level0") return true;

  const userLevel = tierToLevel(userTier);
  const requiredLevel = tierToLevel(requiredTier);

  return userLevel >= requiredLevel;
}

export function canUserAccessRoom(
  userTier: TierId,
  roomTier: TierId,
  roomId?: string,
): boolean {
  void userTier;
  void roomTier;
  void roomId;

  // NEW RULE: all authenticated users can access all rooms
  return true;
}

export function getAccessibleTiers(userTier: TierId): TierId[] {
  void userTier;

  const allTiers: TierId[] = [
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
    "kids_1",
    "kids_2",
    "kids_3",
  ];

  return allTiers;
}

export function determineAccess(
  userTier: TierId,
  roomTier: TierId,
  roomId?: string,
): {
  hasFullAccess: boolean;
  reason?: string;
} {
  void userTier;
  void roomTier;
  void roomId;

  return {
    hasFullAccess: true,
    reason: undefined,
  };
}

export function validateAccessControl(
  matrix: AccessTestCase[] = ACCESS_TEST_MATRIX,
): {
  passed: number;
  failed: number;
  failures: Array<{
    userTier: TierId;
    roomTier: TierId;
    expected: boolean;
    actual: boolean;
  }>;
} {
  const failures: Array<{
    userTier: TierId;
    roomTier: TierId;
    expected: boolean;
    actual: boolean;
  }> = [];

  for (const test of matrix) {
    const actual = canUserAccessRoom(test.userTier, test.roomTier);

    if (actual !== test.expected) {
      failures.push({
        userTier: test.userTier,
        roomTier: test.roomTier,
        expected: test.expected,
        actual,
      });
    }
  }

  return {
    passed: matrix.length - failures.length,
    failed: failures.length,
    failures,
  };
}