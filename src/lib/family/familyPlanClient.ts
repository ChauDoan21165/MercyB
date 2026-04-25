// Client API for the family-plan feature.
//
// Backed by tables defined in supabase/migrations/20260503000000_family_plans.sql:
//   - family_plans
//   - family_plan_members
//   - family_plan_invites
// And the SECURITY DEFINER RPC family_plan_redeem_invite(p_code).
//
// Auth: every call relies on the caller's session JWT for RLS. We pass
// userId for fail-fast when there's no session, but RLS is the gate.
//
// Invite codes are 8-char alphanumeric, uppercase, with the unambiguous
// set I/O/0/1 stripped. We generate the code client-side and let the DB
// CHECK constraint enforce the format — keeps the responsibility in one
// place.

import { supabase } from "@/lib/supabaseClient";

export type FamilyRole = "owner" | "member";

export type FamilyPlan = {
  id: string;
  ownerUserId: string;
  stripeSubscriptionId: string | null;
  maxMembers: number;
  active: boolean;
  createdAt: string;
};

export type FamilyMember = {
  familyPlanId: string;
  userId: string;
  invitedBy: string | null;
  joinedAt: string;
};

export type FamilyInvite = {
  id: string;
  familyPlanId: string;
  invitedEmail: string | null;
  inviteCode: string;
  expiresAt: string;
  redeemedByUserId: string | null;
  redeemedAt: string | null;
  createdAt: string;
};

export type FamilyMembership =
  | { role: "owner"; familyPlanId: string; plan: FamilyPlan }
  | { role: "member"; familyPlanId: string; ownerUserId: string }
  | null;

const INVITE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1
const INVITE_CODE_LENGTH = 8;

/** Generate an 8-char invite code from the unambiguous alphabet. */
export function generateInviteCode(): string {
  // Web Crypto when available; falls back to Math.random for tests / SSR.
  const buf = new Uint32Array(INVITE_CODE_LENGTH);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
      buf[i] = Math.floor(Math.random() * 0x100000000);
    }
  }
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET[buf[i] % INVITE_CODE_ALPHABET.length];
  }
  return code;
}

// ── Plans ────────────────────────────────────────────────────────────────

/**
 * Create a new family plan owned by the caller. The DB enforces:
 *   - owner_user_id = auth.uid() (RLS WITH CHECK)
 *   - max_members between 2 and 8 (CHECK constraint)
 *   - one active plan per owner (partial unique index)
 * The owner is auto-added as a member via the seed trigger.
 */
export async function createFamilyPlan(
  ownerId: string,
  maxMembers: number = 5,
): Promise<FamilyPlan | null> {
  if (!ownerId) return null;
  if (maxMembers < 2 || maxMembers > 8) {
    console.warn("[familyPlan] maxMembers out of range:", maxMembers);
    return null;
  }

  const { data, error } = await supabase
    .from("family_plans")
    .insert({
      owner_user_id: ownerId,
      max_members: maxMembers,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    console.warn("[familyPlan] createFamilyPlan failed:", error.message);
    return null;
  }
  return data ? toPlan(data) : null;
}

/**
 * Resolve the caller's family-plan membership, if any. Returns:
 *   - { role: "owner", … } when the caller owns an active plan
 *   - { role: "member", … } when the caller is in someone else's plan
 *   - null otherwise
 */
export async function getMyFamilyMembership(
  userId: string,
): Promise<FamilyMembership> {
  if (!userId) return null;

  // 1. Are we an owner?
  const { data: ownedPlan } = await supabase
    .from("family_plans")
    .select("*")
    .eq("owner_user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (ownedPlan) {
    const plan = toPlan(ownedPlan);
    return { role: "owner", familyPlanId: plan.id, plan };
  }

  // 2. Are we a member of someone else's plan? (UNIQUE(user_id) → at most 1)
  const { data: membership } = await supabase
    .from("family_plan_members")
    .select("family_plan_id, family_plans!inner(owner_user_id, active)")
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;

  const familyPlan = (membership as Record<string, unknown>)
    .family_plans as Record<string, unknown> | null;
  const ownerId = familyPlan ? String(familyPlan.owner_user_id ?? "") : "";
  const planActive = familyPlan ? Boolean(familyPlan.active) : false;
  if (!ownerId || !planActive) return null;

  return {
    role: "member",
    familyPlanId: String((membership as Record<string, unknown>).family_plan_id),
    ownerUserId: ownerId,
  };
}

/**
 * Mint an invite for someone to join the caller's family plan. Caller must
 * be the owner (RLS enforces it). The invite_code is generated client-side
 * from the unambiguous alphabet.
 */
export async function inviteMember(
  familyPlanId: string,
  email: string | null,
): Promise<FamilyInvite | null> {
  if (!familyPlanId) return null;

  const inviteCode = generateInviteCode();
  const { data, error } = await supabase
    .from("family_plan_invites")
    .insert({
      family_plan_id: familyPlanId,
      invited_email: email && email.trim() ? email.trim() : null,
      invite_code: inviteCode,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    console.warn("[familyPlan] inviteMember failed:", error.message);
    return null;
  }
  return data ? toInvite(data) : null;
}

/**
 * Redeem an invite code. Routes through the SECURITY DEFINER RPC so the
 * caller doesn't need write privileges on family_plan_invites or on
 * other people's family_plan_members rows.
 *
 * The userId arg is for fail-fast on unauth callers; auth.uid() inside
 * the RPC is what actually attributes the membership.
 */
export async function redeemInvite(
  inviteCode: string,
  userId: string,
): Promise<{ familyPlanId: string } | { error: string }> {
  if (!userId) return { error: "not authenticated" };
  if (!inviteCode || !inviteCode.trim()) return { error: "missing invite code" };

  const { data, error } = await supabase.rpc("family_plan_redeem_invite", {
    p_code: inviteCode.trim().toUpperCase(),
  });
  if (error) {
    return { error: humanizeRedeemError(error) };
  }
  if (!data) return { error: "no plan returned" };
  return { familyPlanId: String(data) };
}

/**
 * Owner removes a specific member. The DB allows the owner to delete any
 * row in family_plan_members where the parent plan's owner_user_id =
 * auth.uid(). We pass the family_plan_id explicitly so the caller can't
 * accidentally delete a row they shouldn't see.
 */
export async function removeMember(
  familyPlanId: string,
  memberId: string,
): Promise<boolean> {
  if (!familyPlanId || !memberId) return false;
  const { error } = await supabase
    .from("family_plan_members")
    .delete()
    .eq("family_plan_id", familyPlanId)
    .eq("user_id", memberId);
  if (error) {
    console.warn("[familyPlan] removeMember failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Member self-leave. Deletes their own membership row. Owners cannot
 * "leave" their own plan via this function — they should call
 * deactivateOwnPlan instead.
 */
export async function leaveFamily(userId: string): Promise<boolean> {
  if (!userId) return false;
  const { error } = await supabase
    .from("family_plan_members")
    .delete()
    .eq("user_id", userId);
  if (error) {
    console.warn("[familyPlan] leaveFamily failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Owner-only: deactivate (don't delete — keep audit) the caller's family
 * plan. CASCADE handles members + invites if the row is later hard-deleted.
 */
export async function deactivateOwnPlan(planId: string): Promise<boolean> {
  if (!planId) return false;
  const { error } = await supabase
    .from("family_plans")
    .update({ active: false })
    .eq("id", planId);
  if (error) {
    console.warn("[familyPlan] deactivateOwnPlan failed:", error.message);
    return false;
  }
  return true;
}

/** List members of a plan (visible to owner via RLS, not to other members). */
export async function listMembers(familyPlanId: string): Promise<FamilyMember[]> {
  if (!familyPlanId) return [];
  const { data, error } = await supabase
    .from("family_plan_members")
    .select("*")
    .eq("family_plan_id", familyPlanId)
    .order("joined_at", { ascending: true });
  if (error) {
    console.warn("[familyPlan] listMembers failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toMember) : [];
}

/** List active (un-redeemed, non-expired) invites for a plan (owner only). */
export async function listActiveInvites(familyPlanId: string): Promise<FamilyInvite[]> {
  if (!familyPlanId) return [];
  const { data, error } = await supabase
    .from("family_plan_invites")
    .select("*")
    .eq("family_plan_id", familyPlanId)
    .is("redeemed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[familyPlan] listActiveInvites failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toInvite) : [];
}

// ── helpers ──────────────────────────────────────────────────────────────

function toPlan(raw: unknown): FamilyPlan {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    ownerUserId: String(r.owner_user_id ?? ""),
    stripeSubscriptionId: r.stripe_subscription_id
      ? String(r.stripe_subscription_id)
      : null,
    maxMembers: Number(r.max_members ?? 5),
    active: Boolean(r.active),
    createdAt: String(r.created_at ?? ""),
  };
}

function toMember(raw: unknown): FamilyMember {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    familyPlanId: String(r.family_plan_id ?? ""),
    userId: String(r.user_id ?? ""),
    invitedBy: r.invited_by ? String(r.invited_by) : null,
    joinedAt: String(r.joined_at ?? ""),
  };
}

function toInvite(raw: unknown): FamilyInvite {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    familyPlanId: String(r.family_plan_id ?? ""),
    invitedEmail: r.invited_email ? String(r.invited_email) : null,
    inviteCode: String(r.invite_code ?? ""),
    expiresAt: String(r.expires_at ?? ""),
    redeemedByUserId: r.redeemed_by_user_id ? String(r.redeemed_by_user_id) : null,
    redeemedAt: r.redeemed_at ? String(r.redeemed_at) : null,
    createdAt: String(r.created_at ?? ""),
  };
}

function humanizeRedeemError(err: { message?: string; code?: string }): string {
  const msg = err.message ?? "";
  if (/already in a family plan/i.test(msg)) return "already in a family plan";
  if (/not found/i.test(msg)) return "invite not found";
  if (/already redeemed/i.test(msg)) return "invite already redeemed";
  if (/expired/i.test(msg)) return "invite expired";
  if (/full/i.test(msg)) return "family plan is full";
  return msg || "redeem failed";
}
