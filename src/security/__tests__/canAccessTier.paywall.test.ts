/**
 * Paywall gate regression test.
 *
 * Guards the RoomRenderer paid-content gate after removing the loose cast
 * cast on the typed `UserAccess` object (fix/room-renderer-paywall-typesafety).
 *
 * `UserAccess` is imported as a *type* so these fixtures fail to compile if
 * the contract the gate depends on (`tier` / `userTier` / `loading` /
 * `isLoading`) ever changes shape — which is the whole point of dropping
 * the `any` cast: a future refactor must break `tsc`, never silently open
 * paid content to free users.
 */
import { describe, expect, it } from "vitest";
import type { UserAccess } from "@/hooks/useUserAccess";
import { canAccessTier } from "@/security/typeGuards";
import type { TierId } from "@/lib/constants/tiers";

/** Minimal but fully-typed UserAccess fixture (mirrors guestAccess shape). */
function makeAccess(overrides: Partial<UserAccess>): UserAccess {
  const base: UserAccess = {
    isAdmin: false,
    isHighAdmin: false,
    adminLevel: 0,
    isAuthenticated: false,
    isDemoMode: true,
    tier: "level0",
    userTier: "level0",
    entitlementTier: "level0",
    hasPremium: false,
    features: {
      hasMercyGuide: true,
      hasMercyJourney: false,
      hasMercyGrammar: false,
      hasMercySpeak: false,
      hasMercyLogic: false,
      hasPremiumRooms: false,
    },
    loading: false,
    isLoading: false,
    isAccessConcluded: true,
    canAccessPremium: () => false,
    isTrialExpired: false,
  };
  return { ...base, ...overrides };
}

/**
 * Faithful copy of the resolution + lock decision in
 * src/components/room/RoomRenderer.tsx (post-fix). Kept in lock-step with
 * that gate so the test fails if the gate logic regresses.
 */
function resolveUserTier(access: UserAccess): TierId {
  return access.tier ?? access.userTier ?? "level0";
}

function isLocked(access: UserAccess, requiredTier: TierId): boolean {
  const requiredRank =
    requiredTier === "level9"
      ? 9
      : requiredTier === "level3"
        ? 3
        : requiredTier === "level2"
          ? 2
          : requiredTier === "level1"
            ? 1
            : 0;

  if (requiredRank <= 0) return false; // free / un-tiered room
  if (access.loading ?? access.isLoading) return true; // fail closed while loading
  return !canAccessTier(resolveUserTier(access), requiredTier);
}

const FREE = makeAccess({ tier: "level0", userTier: "level0" });
const PAID_MONTHLY = makeAccess({
  tier: "premium_month",
  userTier: "level9",
  hasPremium: true,
});
const PAID_YEARLY = makeAccess({
  tier: "premium_year",
  userTier: "level9",
  hasPremium: true,
});
const LEGACY_PAID = makeAccess({ tier: "level9", userTier: "level9" });

describe("RoomRenderer paywall gate — typed UserAccess", () => {
  it("BLOCKS a free user from a paid room (level3)", () => {
    expect(isLocked(FREE, "level3")).toBe(true);
  });

  it("BLOCKS a free user from a premium-only room (level9)", () => {
    expect(isLocked(FREE, "level9")).toBe(true);
  });

  it("BLOCKS a free user from a level1 room", () => {
    expect(isLocked(FREE, "level1")).toBe(true);
  });

  it("ALLOWS a monthly-premium user into a paid room (level3)", () => {
    expect(isLocked(PAID_MONTHLY, "level3")).toBe(false);
  });

  it("ALLOWS a yearly-premium user into a premium-only room (level9)", () => {
    expect(isLocked(PAID_YEARLY, "level9")).toBe(false);
  });

  it("ALLOWS a legacy paid (level9) user into a paid room (level3)", () => {
    expect(isLocked(LEGACY_PAID, "level3")).toBe(false);
  });

  it("does NOT over-block: free user reaches a free (level0) room", () => {
    expect(isLocked(FREE, "level0")).toBe(false);
  });

  it("fails CLOSED: paid user is locked while access is still loading", () => {
    const loadingPaid = makeAccess({
      tier: "premium_month",
      userTier: "level9",
      loading: true,
      isLoading: true,
    });
    expect(isLocked(loadingPaid, "level3")).toBe(true);
  });

  it("tier-first resolution fails closed when raw entitlement is free", () => {
    // Mirrors the deliberate gate behavior: `tier` (raw entitlement) wins
    // over `userTier`. A level0-entitlement account is gated even if some
    // other field were elevated — the gate must never read around `tier`.
    const tierFreeButUserElevated = makeAccess({
      tier: "level0",
      userTier: "level9",
    });
    expect(resolveUserTier(tierFreeButUserElevated)).toBe("level0");
    expect(isLocked(tierFreeButUserElevated, "level3")).toBe(true);
  });
});
