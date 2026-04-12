// PATH: src/security/AccessPolicy.ts
// File: AccessPolicy.ts

// Global Access Policy - Central access control rules

import { type TierId, ALL_TIER_IDS } from "@/lib/constants/tiers";
import type { AppRole } from "./typeGuards";
import { isKidsTier, canKidsAccessAdult } from "./kidsAccess";

export interface AccessRule {
  allowedRoles: AppRole[];
  allowedTiers: readonly TierId[];
  requireAuth: boolean;
  description: string;
}

// All tiers for pages accessible to everyone
const ALL_TIERS: readonly TierId[] = ALL_TIER_IDS;

// Adult tiers only (no kids)
const ADULT_TIERS: readonly TierId[] = [
  "level0",
  "premium_month",
  "premium_year",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
] as const;

// Paid billing tiers only.
// Level 1..Level 9 are curriculum labels, not payment plans.
const PAID_BILLING_TIERS: readonly TierId[] = [
  "premium_month",
  "premium_year",
] as const;

// Adult paid access across the app.
// We keep VIP tiers for backward compatibility with any legacy stored user tier,
// but premium_month/year are the real paid billing tiers.
const PAID_ADULT_ACCESS_TIERS: readonly TierId[] = [
  "premium_month",
  "premium_year",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
] as const;

// Kids + adult tiers that can access kids content
const KIDS_ACCESSIBLE_TIERS: readonly TierId[] = [
  "kids_1",
  "kids_2",
  "kids_3",
  ...ADULT_TIERS,
] as const;

export const ACCESS_POLICIES: Record<string, AccessRule> = {
  homepage: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: false,
    description: "Public homepage - accessible to all",
  },

  pricing: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: false,
    description: "Pricing page - accessible to all",
  },

  free_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: ADULT_TIERS,
    requireAuth: true,
    description: "Level 0 rooms - accessible to all authenticated adult users",
  },

  vip1_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 1 curriculum room - any paid adult user can access",
  },

  vip2_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 2 curriculum room - any paid adult user can access",
  },

  vip3_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 3 curriculum room - any paid adult user can access",
  },

  vip4_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 4 curriculum room - any paid adult user can access",
  },

  vip5_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 5 curriculum room - any paid adult user can access",
  },

  vip6_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 6 curriculum room - any paid adult user can access",
  },

  vip7_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 7 curriculum room - any paid adult user can access",
  },

  vip8_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 8 curriculum room - any paid adult user can access",
  },

  vip9_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "Level 9 curriculum room - any paid adult user can access",
  },

  kids_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: KIDS_ACCESSIBLE_TIERS,
    requireAuth: true,
    description: "Kids rooms - accessible to kids tiers and all adult tiers",
  },

  admin_dashboard: {
    allowedRoles: ["admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: true,
    description: "Admin dashboard - requires admin role",
  },

  mod_dashboard: {
    allowedRoles: ["moderator", "admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: true,
    description: "Moderator dashboard - requires moderator or admin role",
  },

  profile: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: true,
    description: "User profile - accessible to all authenticated users",
  },
};

function normalizePageId(input: string): string {
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return raw;

  if (ACCESS_POLICIES[raw]) return raw;

  const clean = raw.split("?")[0].split("#")[0];

  const aliasMap: Record<string, string> = {
    home: "homepage",
    index: "homepage",

    level0: "free_rooms",
    free_room: "free_rooms",
    free_rooms: "free_rooms",

    level1: "vip1_rooms",
    vip1_room: "vip1_rooms",
    vip1_rooms: "vip1_rooms",

    level2: "vip2_rooms",
    vip2_room: "vip2_rooms",
    vip2_rooms: "vip2_rooms",

    level3: "vip3_rooms",
    vip3_room: "vip3_rooms",
    vip3_rooms: "vip3_rooms",

    level4: "vip4_rooms",
    vip4_room: "vip4_rooms",
    vip4_rooms: "vip4_rooms",

    level5: "vip5_rooms",
    vip5_room: "vip5_rooms",
    vip5_rooms: "vip5_rooms",

    level6: "vip6_rooms",
    vip6_room: "vip6_rooms",
    vip6_rooms: "vip6_rooms",

    level7: "vip7_rooms",
    vip7_room: "vip7_rooms",
    vip7_rooms: "vip7_rooms",

    level8: "vip8_rooms",
    vip8_room: "vip8_rooms",
    vip8_rooms: "vip8_rooms",

    level9: "vip9_rooms",
    vip9_room: "vip9_rooms",
    vip9_rooms: "vip9_rooms",

    kids: "kids_rooms",
    kids_room: "kids_rooms",
    kids_rooms: "kids_rooms",
  };

  if (aliasMap[clean]) return aliasMap[clean];

  if (/(^|\/|_|-)(vip[1-9])($|\/|_|-)/i.test(clean)) {
    const m = clean.match(/(vip[1-9])/i);
    if (m?.[1]) return `${m[1].toLowerCase()}_rooms`;
  }

  if (/(^|\/|_|-)(level0)($|\/|_|-)/i.test(clean)) {
    return "free_rooms";
  }

  if (/(^|\/|_|-)(kids)(?:_|-|\/|$)/i.test(clean)) {
    return "kids_rooms";
  }

  return clean;
}

function safeTier(value: unknown): TierId {
  const raw = String(value || "").trim().toLowerCase() as TierId;

  if (ALL_TIER_IDS.includes(raw)) {
    return raw;
  }

  return "level0";
}

function normalizeRoomTier(roomTier: TierId): TierId {
  return safeTier(roomTier);
}

/**
 * Compatibility normalization for older VIP-based room/page checks.
 * Raw tier stays canonical; this is only for compatibility matching.
 */
function normalizeUserTierForAccess(userTier: TierId): TierId {
  const raw = safeTier(userTier);

  if (raw === "premium_month" || raw === "premium_year") {
    return "level9";
  }

  return raw;
}

function isPaidAdultTier(tier: TierId): boolean {
  const normalized = normalizeUserTierForAccess(tier);
  const raw = safeTier(tier);

  return (
    PAID_ADULT_ACCESS_TIERS.includes(normalized) ||
    PAID_BILLING_TIERS.includes(raw)
  );
}

function matchesAllowedTierPolicy(
  userTier: TierId,
  allowedTiers: readonly TierId[],
): boolean {
  const raw = safeTier(userTier);
  const normalized = normalizeUserTierForAccess(raw);

  if (allowedTiers.includes(raw)) return true;
  if (allowedTiers.includes(normalized)) return true;

  // Premium billing plans should satisfy any adult paid-access policy
  // even when older policy lists still use VIP compatibility tiers.
  if (
    (raw === "premium_month" || raw === "premium_year") &&
    allowedTiers.some((tier) => PAID_ADULT_ACCESS_TIERS.includes(tier))
  ) {
    return true;
  }

  return false;
}

/**
 * Check if user has access to a page
 */
export function checkPageAccess(
  pageId: string,
  userRole: AppRole,
  userTier: TierId,
): { allowed: boolean; reason?: string } {
  const normalizedPageId = normalizePageId(pageId);
  const rawUserTier = safeTier(userTier);
  const policy = ACCESS_POLICIES[normalizedPageId];

  if (!policy) {
    if (/^vip[1-9](_rooms?)?$/.test(normalizedPageId)) {
      return checkRoomAccess(
        rawUserTier,
        normalizedPageId.replace(/_rooms?$/, "") as TierId,
      );
    }
    if (/^level0(_rooms?)?$/.test(normalizedPageId)) {
      return checkRoomAccess(rawUserTier, "level0");
    }
    if (/^kids(_rooms?)?$/.test(normalizedPageId)) {
      return checkRoomAccess(rawUserTier, "kids_1");
    }
    return { allowed: false, reason: "Unknown page" };
  }

  if (!policy.allowedRoles.includes(userRole)) {
    return {
      allowed: false,
      reason: `This page requires ${policy.allowedRoles.join(" or ")} role`,
    };
  }

  if (!matchesAllowedTierPolicy(rawUserTier, policy.allowedTiers)) {
    if (/^(level0|vip[1-9]|kids)_rooms$/.test(normalizedPageId)) {
      const roomTier =
        normalizedPageId === "free_rooms"
          ? "level0"
          : normalizedPageId === "kids_rooms"
            ? "kids_1"
            : normalizedPageId.replace("_rooms", "");

      return checkRoomAccess(rawUserTier, roomTier as TierId);
    }

    return {
      allowed: false,
      reason: `This page requires ${policy.allowedTiers.join(", ")} tier`,
    };
  }

  if (/^(level0|vip[1-9]|kids)_rooms$/.test(normalizedPageId)) {
    const roomTier =
      normalizedPageId === "free_rooms"
        ? "level0"
        : normalizedPageId === "kids_rooms"
          ? "kids_1"
          : normalizedPageId.replace("_rooms", "");

    return checkRoomAccess(rawUserTier, roomTier as TierId);
  }

  return { allowed: true };
}

/**
 * Check if user can access a room
 *
 * Business rule:
 * - kids tiers remain governed by kidsAccess
 * - level0 adult users can access only level0 adult rooms
 * - paid adult users can access all adult curriculum rooms
 * - Level 1..Level 9 are curriculum labels, not payment gates
 */
export function checkRoomAccess(
  userTier: TierId,
  roomTier: TierId,
): { allowed: boolean; reason?: string } {
  const rawUserTier = safeTier(userTier);
  const normalizedUserTier = normalizeUserTierForAccess(rawUserTier);
  const normalizedRoomTier = normalizeRoomTier(roomTier);

  if (isKidsTier(normalizedUserTier)) {
    if (!canKidsAccessAdult(normalizedUserTier, normalizedRoomTier)) {
      return {
        allowed: false,
        reason: "Kids accounts can only access Kids Level content",
      };
    }
    return { allowed: true };
  }

  if (isKidsTier(normalizedRoomTier)) {
    return { allowed: true };
  }

  if (normalizedRoomTier === "level0") {
    return { allowed: true };
  }

  if (isPaidAdultTier(rawUserTier)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: "This room is part of the paid app. One paid plan unlocks all adult rooms.",
  };
}

/**
 * Optional helper:
 * billing-level paid check only
 */
export function isPaidBillingTier(tier: TierId): boolean {
  return PAID_BILLING_TIERS.includes(safeTier(tier));
}