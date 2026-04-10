// PATH: src/lib/accessControl.ts

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

  if (!value || value === "free") return 0;

  if (value === "vip1") return 1;
  if (value === "vip2") return 2;
  if (value === "vip3") return 3;
  if (value === "vip4") return 4;
  if (value === "vip5") return 5;
  if (value === "vip6") return 6;
  if (value === "vip7") return 7;
  if (value === "vip8") return 8;
  if (value === "vip9") return 9;

  // Collapses variants like vip3_ii / VIP3 II to level 3
  if (value.includes("vip3")) return 3;

  if (value === "kids_1") return 1;
  if (value === "kids_2") return 2;
  if (value === "kids_3") return 3;

  // Premium billing plans unlock all VIP rooms for access checks,
  // but should remain premium_* in hooks/UI.
  if (value === "premium_month" || value === "premium_year") return 9;

  return 0;
}

export const ACCESS_TEST_MATRIX: AccessTestCase[] = [
  { userTier: "free", roomTier: "free", expected: true },
  { userTier: "free", roomTier: "vip1", expected: false },

  { userTier: "vip1", roomTier: "free", expected: true },
  { userTier: "vip1", roomTier: "vip1", expected: true },
  { userTier: "vip1", roomTier: "vip2", expected: false },

  { userTier: "vip2", roomTier: "vip1", expected: true },
  { userTier: "vip2", roomTier: "vip2", expected: true },
  { userTier: "vip2", roomTier: "vip3", expected: false },

  { userTier: "vip3", roomTier: "vip1", expected: true },
  { userTier: "vip3", roomTier: "vip3", expected: true },
  { userTier: "vip3", roomTier: "vip4", expected: false },

  { userTier: "vip6", roomTier: "vip5", expected: true },
  { userTier: "vip6", roomTier: "vip9", expected: false },

  { userTier: "vip9", roomTier: "free", expected: true },
  { userTier: "vip9", roomTier: "vip6", expected: true },
  { userTier: "vip9", roomTier: "vip9", expected: true },

  { userTier: "kids_1", roomTier: "kids_1", expected: true },
  { userTier: "kids_1", roomTier: "kids_2", expected: false },
  { userTier: "kids_2", roomTier: "kids_1", expected: true },
  { userTier: "kids_2", roomTier: "vip1", expected: true },
];

export function canAccessVIPTier(
  userTier: TierId,
  requiredTier: TierId,
): boolean {
  if (requiredTier === "free") return true;

  const userLevel = tierToLevel(userTier);
  const requiredLevel = tierToLevel(requiredTier);

  return userLevel >= requiredLevel;
}

export function canUserAccessRoom(
  userTier: TierId,
  roomTier: TierId,
  roomId?: string,
): boolean {
  void roomId;
  return canAccessVIPTier(userTier, roomTier);
}

export function getAccessibleTiers(userTier: TierId): TierId[] {
  const allTiers: TierId[] = [
    "free",
    "vip1",
    "vip2",
    "vip3",
    "vip4",
    "vip5",
    "vip6",
    "vip7",
    "vip8",
    "vip9",
  ];

  // Keep this API focused on curriculum tiers, not billing-plan names.
  return allTiers.filter((tier) => canAccessVIPTier(userTier, tier));
}

export function determineAccess(
  userTier: TierId,
  roomTier: TierId,
  roomId?: string,
): {
  hasFullAccess: boolean;
  reason?: string;
} {
  const allowed = canUserAccessRoom(userTier, roomTier, roomId);

  return {
    hasFullAccess: allowed,
    reason: allowed ? undefined : "ACCESS_DENIED",
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