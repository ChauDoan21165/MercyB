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

// ── Corporate-seat entitlement (Step 9 multi-seat) ────────────────────────
//
// A corporate seat means the user belongs to an organisation with an
// active stripe subscription on `corporate_accounts`. When that's true,
// entitlement flows through to the seat-holder transparently — no
// separate billing relationship for the user themselves.
//
// Standalone from family-plan logic (different tables, different
// constraints). The two systems are independent: a learner can in
// theory be in a family plan AND a corporate seat, but each is
// tracked in its own table and either grants premium independently.
//
// All functions accept the supabase client as an optional second
// argument so tests can pass a mock without ESM dynamic-import
// gymnastics. In production callers, omit it and the singleton is
// imported on demand.

/** Minimal subset of the supabase-js client surface we need here. */
export interface CorporateEntitlementSupabase {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{
          data: unknown;
          error: { message: string } | null;
        }>;
      };
    };
  };
}

async function loadDefaultSupabase(): Promise<CorporateEntitlementSupabase> {
  const dynamicImport = Function("path", "return import(path)") as (
    path: string,
  ) => Promise<unknown>;
  const mod = await dynamicImport("@/lib/supabaseClient");
  return (mod as { supabase: CorporateEntitlementSupabase }).supabase;
}

type CorporateSeatRow = {
  corporate_account_id: string;
};

type CorporateAccountRow = {
  id: string;
  active: boolean;
  stripe_subscription_id: string | null;
};

/**
 * Returns true when the user holds an active seat in a corporate
 * account. Resolves false on any error (no seat, RLS denial, etc.) —
 * never throws — so callers can fold this into wider entitlement
 * decisions safely.
 */
export async function isCorporateSeat(
  userId: string,
  supabase?: CorporateEntitlementSupabase,
): Promise<boolean> {
  if (!userId) return false;
  const client = supabase ?? (await loadDefaultSupabase());
  try {
    const { data, error } = await client
      .from("corporate_seats")
      .select("corporate_account_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Project a user's corporate-seat membership into an EntitlementResult.
 *
 * Returns:
 *   - `null` when the user is NOT a corporate seat. The caller should
 *     fall back to subscription-based entitlement.
 *   - `{ status: 'active', source: 'stripe', expires_at: null }` when
 *     the user IS a seat AND the account has an active stripe
 *     subscription linked. Expiration mirrors the family-plan model:
 *     the seat is good as long as the account stays active.
 *   - `{ status: 'inactive', source: null, expires_at: null }` when
 *     the user is in an account that is `active = false` or has no
 *     stripe subscription linked yet (e.g. pre-sales accounts created
 *     in the admin shell before the Stripe product exists).
 *
 * No throws — errors degrade to `null` so subscription entitlement
 * can take over.
 */
export async function getCorporateSeatEntitlement(
  userId: string,
  supabase?: CorporateEntitlementSupabase,
): Promise<EntitlementResult | null> {
  if (!userId) return null;
  const client = supabase ?? (await loadDefaultSupabase());

  let seat: CorporateSeatRow | null = null;
  try {
    const { data, error } = await client
      .from("corporate_seats")
      .select("corporate_account_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    seat = (data as CorporateSeatRow | null) ?? null;
  } catch {
    return null;
  }
  if (!seat) return null;

  let account: CorporateAccountRow | null = null;
  try {
    const { data, error } = await client
      .from("corporate_accounts")
      .select("id,active,stripe_subscription_id")
      .eq("id", seat.corporate_account_id)
      .maybeSingle();
    if (error) return null;
    account = (data as CorporateAccountRow | null) ?? null;
  } catch {
    return null;
  }
  if (!account) return null;

  if (account.active && account.stripe_subscription_id) {
    return {
      status: "active",
      source: "stripe",
      expires_at: null,
    };
  }

  return { status: "inactive", source: null, expires_at: null };
}
