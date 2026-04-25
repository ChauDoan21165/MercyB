// FILE: src/billing/computeEntitlement.ts

import type { EntitlementResult, SubscriptionRow } from "./types";
import { deriveEntitlementFromSubscriptions } from "./subscriptionRepository";

export function computeEntitlement(
  subscriptions: SubscriptionRow[],
  _now: Date = new Date(),
): EntitlementResult {
  return deriveEntitlementFromSubscriptions(subscriptions);
}

// ── Family-plan flow-through ─────────────────────────────────────────────
//
// When a user is a member of an active family plan, the plan owner's
// premium entitlement flows through to them: if the owner has an active
// subscription, the member is treated as active, with `source` annotated
// so downstream code can distinguish "I bought this" from "my family
// covers me".
//
// Implementation rules (per the task brief):
//   - The existing `computeEntitlement` happy path above is unchanged.
//     `computeEntitlement(subs)` still returns exactly what it always
//     returned. New family logic is additive and lives in the new
//     `computeEntitlementForUser` function below.
//   - Dependency-injected loaders keep this function pure-by-default
//     and unit-testable without a Supabase mock. Both loaders are
//     async; both can throw — we never let a family-side failure
//     downgrade the user's own entitlement (safe fallback).
//   - One-hop family resolution. Owners-of-owners (a member who is also
//     an owner of a different plan) are not chained — depth=1 max.
//     Cycle protection is implicit: members.user_id is UNIQUE in the
//     schema, so a user can only ever be a member of one plan, and
//     that plan's owner can never be the member themselves.

export interface FamilyMembership {
  family_plan_id: string;
  owner_user_id: string;
  active: boolean;
}

/** Loader contract used by computeEntitlementForUser. */
export interface FamilyEntitlementDeps {
  /**
   * Resolve the membership row for a user. Returns null if they are not
   * in any active family plan.
   */
  getFamilyMembership(userId: string): Promise<FamilyMembership | null>;
  /** Load a user's own subscriptions (used for both the caller and the owner). */
  getSubscriptions(userId: string): Promise<SubscriptionRow[]>;
}

/**
 * Result of `computeEntitlementForUser`. Mirrors `EntitlementResult` and
 * adds a `via_family` flag so the UI can show "Covered by your family
 * plan" copy without a separate query.
 */
export interface EntitlementForUserResult extends EntitlementResult {
  via_family: boolean;
  family_plan_id: string | null;
}

/**
 * Convenience predicate. Returns true iff the user is currently in an
 * active family plan. Never throws — a loader error returns false so
 * downstream code fails closed (the user gets their own entitlement
 * computed without family flow-through, which is the safe direction).
 */
export async function isFamilyMember(
  userId: string,
  deps: Pick<FamilyEntitlementDeps, "getFamilyMembership">,
): Promise<boolean> {
  if (!userId) return false;
  try {
    const m = await deps.getFamilyMembership(userId);
    return !!m && m.active === true && m.owner_user_id !== userId;
  } catch {
    return false;
  }
}

/**
 * Compute entitlement for a user, with family-plan flow-through layered
 * on top. Algorithm:
 *
 *   1. Compute the user's own entitlement (own subscriptions). If
 *      active, return immediately (own subs always win).
 *   2. Else, look up family membership. If no membership or membership
 *      is inactive, return the inactive entitlement from step 1.
 *   3. Else, load the owner's subscriptions and compute their
 *      entitlement. If active, return it with `via_family = true` and
 *      `family_plan_id` set; if inactive, return the user's own
 *      inactive entitlement (unchanged).
 *
 * Any error in steps 2-3 falls back to the user's own entitlement —
 * the family layer is strictly additive and never penalises the caller.
 */
export async function computeEntitlementForUser(
  userId: string,
  deps: FamilyEntitlementDeps,
  now: Date = new Date(),
): Promise<EntitlementForUserResult> {
  const ownSubs = await deps.getSubscriptions(userId);
  const own = computeEntitlement(ownSubs, now);

  if (own.status === "active") {
    return { ...own, via_family: false, family_plan_id: null };
  }

  let membership: FamilyMembership | null = null;
  try {
    membership = await deps.getFamilyMembership(userId);
  } catch {
    return { ...own, via_family: false, family_plan_id: null };
  }

  if (!membership || !membership.active) {
    return { ...own, via_family: false, family_plan_id: null };
  }
  // The owner is themselves a "member" via the seed trigger, but we never
  // flow-through self → self. computeEntitlement already covered the
  // owner's own subs in step 1.
  if (membership.owner_user_id === userId) {
    return { ...own, via_family: false, family_plan_id: null };
  }

  let ownerEntitlement: EntitlementResult;
  try {
    const ownerSubs = await deps.getSubscriptions(membership.owner_user_id);
    ownerEntitlement = computeEntitlement(ownerSubs, now);
  } catch {
    return { ...own, via_family: false, family_plan_id: null };
  }

  if (ownerEntitlement.status !== "active") {
    return { ...own, via_family: false, family_plan_id: null };
  }

  return {
    ...ownerEntitlement,
    via_family: true,
    family_plan_id: membership.family_plan_id,
  };
}