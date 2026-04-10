// PATH: src/security/AccessPolicy.ts

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
  "free",
  "premium_month",
  "premium_year",
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
] as const;

// Paid billing tiers only.
// VIP1..VIP9 are curriculum labels, not payment plans.
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
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
] as const;

// Kids + adult tiers that can access kids content
const KIDS_ACCESSIBLE_TIERS: readonly TierId[] = [
  "kids_1",
  "kids_2",
  "kids_3",
  ...ADULT_TIERS,
] as const;

export const ACCESS_POLICIES: Record<string, AccessRule> = {
  // Public pages
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

  // Adult room access model
  free_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: ADULT_TIERS,
    requireAuth: true,
    description: "Free rooms - accessible to all authenticated adult users",
  },

  vip1_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP1 curriculum room - any paid adult user can access",
  },

  vip2_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP2 curriculum room - any paid adult user can access",
  },

  vip3_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP3 curriculum room - any paid adult user can access",
  },

  vip4_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP4 curriculum room - any paid adult user can access",
  },

  vip5_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP5 curriculum room - any paid adult user can access",
  },

  vip6_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP6 curriculum room - any paid adult user can access",
  },

  vip7_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP7 curriculum room - any paid adult user can access",
  },

  vip8_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP8 curriculum room - any paid adult user can access",
  },

  vip9_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: PAID_ADULT_ACCESS_TIERS,
    requireAuth: true,
    description: "VIP9 curriculum room - any paid adult user can access",
  },

  // Kids content
  kids_rooms: {
    allowedRoles: ["user", "moderator", "admin"],
    allowedTiers: KIDS_ACCESSIBLE_TIERS,
    requireAuth: true,
    description: "Kids rooms - accessible to kids tiers and all adult tiers",
  },

  // Admin pages
  admin_dashboard: {
    allowedRoles: ["admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: true,
    description: "Admin dashboard - requires admin role",
  },

  // Moderator pages
  mod_dashboard: {
    allowedRoles: ["moderator", "admin"],
    allowedTiers: ALL_TIERS,
    requireAuth: true,
    description: "Moderator dashboard - requires moderator or admin role",
  },

  // Profile & settings
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

  // direct hit
  if (ACCESS_POLICIES[raw]) return raw;

  // remove query/hash
  const clean = raw.split("?")[0].split("#")[0];

  // exact aliases
  const aliasMap: Record<string, string> = {
    home: "homepage",
    index: "homepage",

    free: "free_rooms",
    free_room: "free_rooms",
    free_rooms: "free_rooms",

    vip1: "vip1_rooms",
    vip1_room: "vip1_rooms",
    vip1_rooms: "vip1_rooms",

    vip2: "vip2_rooms",
    vip2_room: "vip2_rooms",
    vip2_rooms: "vip2_rooms",

    vip3: "vip3_rooms",
    vip3_room: "vip3_rooms",
    vip3_rooms: "vip3_rooms",

    vip4: "vip4_rooms",
    vip4_room: "vip4_rooms",
    vip4_rooms: "vip4_rooms",

    vip5: "vip5_rooms",
    vip5_room: "vip5_rooms",
    vip5_rooms: "vip5_rooms",

    vip6: "vip6_rooms",
    vip6_room: "vip6_rooms",
    vip6_rooms: "vip6_rooms",

    vip7: "vip7_rooms",
    vip7_room: "vip7_rooms",
    vip7_rooms: "vip7_rooms",

    vip8: "vip8_rooms",
    vip8_room: "vip8_rooms",
    vip8_rooms: "vip8_rooms",

    vip9: "vip9_rooms",
    vip9_room: "vip9_rooms",
    vip9_rooms: "vip9_rooms",

    kids: "kids_rooms",
    kids_room: "kids_rooms",
    kids_rooms: "kids_rooms",
  };

  if (aliasMap[clean]) return aliasMap[clean];

  // route/path patterns
  if (/(^|\/|_|-)(vip[1-9])($|\/|_|-)/i.test(clean)) {
    const m = clean.match(/(vip[1-9])/i);
    if (m?.[1]) return `${m[1].toLowerCase()}_rooms`;
  }

  if (/(^|\/|_|-)(free)($|\/|_|-)/i.test(clean)) {
    return "free_rooms";
  }

  if (/(^|\/|_|-)(kids)(?:_|-|\/|$)/i.test(clean)) {
    return "kids_rooms";
  }

  return clean;
}

function normalizeRoomTier(roomTier: TierId): TierId {
  const raw = String(roomTier || "").trim().toLowerCase() as TierId;
  return raw;
}

function normalizeUserTierForAccess(userTier: TierId): TierId {
  const raw = String(userTier || "").trim().toLowerCase() as TierId;

  // Paid billing plans unlock the whole adult app.
  // Map them to vip9 for effective access comparisons.
  if (raw === "premium_month" || raw === "premium_year") {
    return "vip9";
  }

  return raw;
}

function isPaidAdultTier(tier: TierId): boolean {
  const normalized = normalizeUserTierForAccess(tier);
  return PAID_ADULT_ACCESS_TIERS.includes(normalized) || PAID_BILLING_TIERS.includes(tier);
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
  const normalizedUserTier = normalizeUserTierForAccess(userTier);
  const policy = ACCESS_POLICIES[normalizedPageId];

  // If the incoming pageId is actually a room/tier alias, resolve it safely.
  if (!policy) {
    if (/^vip[1-9](_rooms?)?$/.test(normalizedPageId)) {
      return checkRoomAccess(normalizedUserTier, normalizedPageId.replace(/_rooms?$/, "") as TierId);
    }
    if (/^free(_rooms?)?$/.test(normalizedPageId)) {
      return checkRoomAccess(normalizedUserTier, "free");
    }
    if (/^kids(_rooms?)?$/.test(normalizedPageId)) {
      return checkRoomAccess(normalizedUserTier, "kids_1");
    }
    return { allowed: false, reason: "Unknown page" };
  }

  if (!policy.allowedRoles.includes(userRole)) {
    return {
      allowed: false,
      reason: `This page requires ${policy.allowedRoles.join(" or ")} role`,
    };
  }

  if (!policy.allowedTiers.includes(normalizedUserTier)) {
    // fallback: for room policies, use room-aware rule instead of raw membership only
    if (/^(free|vip[1-9]|kids)_rooms$/.test(normalizedPageId)) {
      const roomTier =
        normalizedPageId === "free_rooms"
          ? "free"
          : normalizedPageId === "kids_rooms"
            ? "kids_1"
            : normalizedPageId.replace("_rooms", "");

      return checkRoomAccess(normalizedUserTier, roomTier as TierId);
    }

    return {
      allowed: false,
      reason: `This page requires ${policy.allowedTiers.join(", ")} tier`,
    };
  }

  // For room policies, enforce business rule through room-aware logic too.
  if (/^(free|vip[1-9]|kids)_rooms$/.test(normalizedPageId)) {
    const roomTier =
      normalizedPageId === "free_rooms"
        ? "free"
        : normalizedPageId === "kids_rooms"
          ? "kids_1"
          : normalizedPageId.replace("_rooms", "");

    return checkRoomAccess(normalizedUserTier, roomTier as TierId);
  }

  return { allowed: true };
}

/**
 * Check if user can access a room
 *
 * Business rule:
 * - kids tiers remain governed by kidsAccess
 * - free adult users can access only free adult rooms
 * - paid adult users can access all adult curriculum rooms
 * - VIP1..VIP9 are curriculum labels, not payment gates
 */
export function checkRoomAccess(
  userTier: TierId,
  roomTier: TierId,
): { allowed: boolean; reason?: string } {
  const normalizedUserTier = normalizeUserTierForAccess(userTier);
  const normalizedRoomTier = normalizeRoomTier(roomTier);

  // Kids tier users can only access content allowed by kids policy
  if (isKidsTier(normalizedUserTier)) {
    if (!canKidsAccessAdult(normalizedUserTier, normalizedRoomTier)) {
      return {
        allowed: false,
        reason: "Kids accounts can only access Kids Level content",
      };
    }
    return { allowed: true };
  }

  // Adult users accessing kids rooms is allowed by current policy
  if (isKidsTier(normalizedRoomTier)) {
    return { allowed: true };
  }

  // Free adult rooms
  if (normalizedRoomTier === "free") {
    return { allowed: true };
  }

  // Any paid adult tier unlocks all adult curriculum rooms
  if (isPaidAdultTier(normalizedUserTier)) {
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
  return PAID_BILLING_TIERS.includes(String(tier || "").trim().toLowerCase() as TierId);
}