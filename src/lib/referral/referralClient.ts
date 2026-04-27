// src/lib/referral/referralClient.ts
//
// Thin client for the referral_codes / referral_uses tables.
//
// Code generation + apply both go through SECURITY DEFINER RPCs:
//   - get_or_create_referral_code(): returns the caller's code, creating
//     one on first call. Atomic / collision-safe.
//   - apply_referral_code(p_code): inserts a referral_uses row, returns
//     a tagged status so the UI can render the right error message.
//
// Reads (getMyCode, getReferralStats) go through normal SELECTs since
// RLS already gates them to "owner reads own code + own uses."

import { supabase } from "@/lib/supabaseClient";

export const REFERRAL_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const REFERRAL_CODE_LENGTH = 6;
const REFERRAL_CODE_REGEX = /^[2-9A-HJ-NP-Z]{6}$/;

/** True if the string matches the canonical 6-char unambiguous shape. */
export function isValidReferralCodeShape(code: string): boolean {
  return REFERRAL_CODE_REGEX.test(code);
}

/** Trim + uppercase for comparison; mirrors the SQL normaliser. */
export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

// ── Generate / read own code ──────────────────────────────────────────────

export type GenerateCodeResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

export async function generateCode(_userId: string): Promise<GenerateCodeResult> {
  // userId is unused server-side (auth.uid() drives ownership) but kept
  // in the signature so callers can pass through their auth context
  // without thinking about it.
  void _userId;

  const result = (await (supabase as unknown as {
    rpc: (
      fn: string,
      args?: Record<string, unknown>,
    ) => Promise<{ data: string | null; error: { message: string } | null }>;
  }).rpc("get_or_create_referral_code"));

  if (result.error || typeof result.data !== "string") {
    return { ok: false, error: result.error?.message ?? "no code returned" };
  }
  return { ok: true, code: result.data };
}

type CodeRow = { code: string } | null;

export async function getMyCode(userId: string): Promise<string | null> {
  const { data, error } = await (supabase
    .from("referral_codes") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{
            data: CodeRow;
            error: { message: string } | null;
          }>;
        };
      };
    })
    .select("code")
    .eq("owner_user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data.code;
}

// ── Apply a code (record the use) ─────────────────────────────────────────

export type ApplyStatus =
  | "applied"
  | "self_referral"
  | "invalid_code"
  | "already_used";

export type ApplyReferralCodeResult =
  | { ok: true; status: "applied" }
  | { ok: false; status: Exclude<ApplyStatus, "applied">; error?: string };

type ApplyResponse = {
  data: { ok?: boolean; status?: string } | null;
  error: { message: string } | null;
};

export async function applyReferralCode(
  _referredUserId: string,
  code: string,
): Promise<ApplyReferralCodeResult> {
  void _referredUserId;

  const norm = normalizeReferralCode(code);
  if (!isValidReferralCodeShape(norm)) {
    return { ok: false, status: "invalid_code" };
  }

  const result = (await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<ApplyResponse>;
  }).rpc("apply_referral_code", { p_code: norm }));

  if (result.error || !result.data) {
    return {
      ok: false,
      status: "invalid_code",
      error: result.error?.message ?? "rpc failed",
    };
  }

  const status = result.data.status as ApplyStatus | undefined;
  if (result.data.ok && status === "applied") {
    // Reward delivery is best-effort and intentionally not awaited. If the
    // grant RPC fails (network, transient DB error), the apply still
    // succeeded — admins can retry via grantReferralReward later. The
    // alternative (failing the apply on grant failure) would force a user
    // to re-enter the code only to hit `already_used`.
    void grantReferralReward(_referredUserId).catch((err) => {
      console.warn("[referral] reward grant failed after apply:", err);
    });
    return { ok: true, status: "applied" };
  }
  if (status === "self_referral" || status === "already_used" || status === "invalid_code") {
    return { ok: false, status };
  }
  return { ok: false, status: "invalid_code" };
}

// ── Reward delivery ──────────────────────────────────────────────────────

export type GrantRewardResult =
  | {
      ok: true;
      grantedReferred: boolean;
      grantedOwner: boolean;
      ownerPendingDay3?: boolean;
      ownerAtCap?: boolean;
    }
  | { ok: false; error: GrantRewardError };

export type GrantRewardError =
  | "not_signed_in"
  | "not_self"
  | "no_referral_use"
  | "orphan_code"
  | "rpc_failed";

type GrantResponse = {
  data: {
    ok?: boolean;
    error?: string;
    granted_referred?: boolean;
    granted_owner?: boolean;
    owner_pending_day3?: boolean;
    owner_at_cap?: boolean;
  } | null;
  error: { message: string } | null;
};

/**
 * Grants the 7-day trial extension to BOTH the referred user (the caller)
 * and the code owner. Idempotent — safe to call multiple times; the RPC
 * skips already-granted rewards.
 *
 * The trial extension lands on profiles.trial_extension_days; the
 * me-entitlement edge function adds it to the 3-day base trial.
 */
export async function grantReferralReward(
  referredUserId: string,
): Promise<GrantRewardResult> {
  const result = (await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<GrantResponse | undefined>;
  }).rpc("grant_referral_reward", { p_referred_user_id: referredUserId }));

  if (!result || result.error || !result.data) {
    return { ok: false, error: "rpc_failed" };
  }

  if (result.data.ok) {
    return {
      ok: true,
      grantedReferred: Boolean(result.data.granted_referred),
      grantedOwner: Boolean(result.data.granted_owner),
      ownerPendingDay3: Boolean(result.data.owner_pending_day3),
      ownerAtCap: Boolean(result.data.owner_at_cap),
    };
  }

  const err = result.data.error as GrantRewardError | undefined;
  if (
    err === "not_signed_in" ||
    err === "not_self" ||
    err === "no_referral_use" ||
    err === "orphan_code"
  ) {
    return { ok: false, error: err };
  }
  return { ok: false, error: "rpc_failed" };
}

// ── Stats — count uses + reward eligibility ───────────────────────────────

export type ReferralStats = {
  code: string | null;
  usesCount: number;
  /**
   * Reward eligibility is "did anyone redeem your code AND has the
   * reward not been delivered yet?" — we check `reward_granted_owner =
   * false` rows.
   */
  pendingOwnerRewards: number;
  /** Number of completed owner-side rewards (already granted). */
  completedOwnerRewards: number;
  /** Days of free time the owner has earned in total (7 × completed). */
  totalDaysEarned: number;
};

type StatsCodeRow = { code: string; uses_count: number } | null;
type StatsUsesRow = { reward_granted_owner: boolean | null };

export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const codeRowQ = await (supabase
    .from("referral_codes") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{
            data: StatsCodeRow;
            error: { message: string } | null;
          }>;
        };
      };
    })
    .select("code, uses_count")
    .eq("owner_user_id", userId)
    .maybeSingle();

  if (codeRowQ.error || !codeRowQ.data) {
    return {
      code: null,
      usesCount: 0,
      pendingOwnerRewards: 0,
      completedOwnerRewards: 0,
      totalDaysEarned: 0,
    };
  }

  const usesQ: { data: StatsUsesRow[] | null; error: { message: string } | null } =
    await (supabase
      .from("referral_uses") as unknown as {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            eq: (col: string, val: boolean) => Promise<{
              data: StatsUsesRow[] | null;
              error: { message: string } | null;
            }>;
          };
        };
      })
      .select("reward_granted_owner")
      .eq("code", codeRowQ.data.code)
      .eq("reward_granted_owner", false);

  const pending = usesQ.error || !usesQ.data ? 0 : usesQ.data.length;
  const completed = Math.max(0, (codeRowQ.data.uses_count ?? 0) - pending);

  return {
    code: codeRowQ.data.code,
    usesCount: codeRowQ.data.uses_count ?? 0,
    pendingOwnerRewards: pending,
    completedOwnerRewards: completed,
    totalDaysEarned: completed * 7,
  };
}

// ── URL helpers (for share buttons) ───────────────────────────────────────

export const REFERRAL_QUERY_PARAM = "ref";

export function buildShareUrl(code: string, baseUrl?: string): string {
  const root =
    baseUrl ??
    (typeof window !== "undefined" ? window.location.origin : "https://mercyblade.com");
  const url = new URL(root);
  url.searchParams.set(REFERRAL_QUERY_PARAM, code);
  return url.toString();
}

/**
 * Read a referral code from the current URL query string. Returns null
 * if absent or malformed. Intended for the "?ref=ABC123" entry path.
 */
export function readReferralCodeFromUrl(href?: string): string | null {
  try {
    const target = href ?? (typeof window !== "undefined" ? window.location.href : null);
    if (!target) return null;
    const url = new URL(target);
    const raw = url.searchParams.get(REFERRAL_QUERY_PARAM);
    if (!raw) return null;
    const norm = normalizeReferralCode(raw);
    return isValidReferralCodeShape(norm) ? norm : null;
  } catch {
    return null;
  }
}

// ── Pending-referral capture (cross-signup persistence) ───────────────────
//
// When a user lands on `/?ref=ABC234` they may not be signed in yet —
// they'll go through the signup or OAuth flow first. We stash the code
// in sessionStorage so it survives the round-trip, then auto-apply on
// the first verified auth event.
//
// sessionStorage (not localStorage) so the capture dies with the tab —
// avoids a referral leaking across users on a shared device.

const PENDING_REFERRAL_STORAGE_KEY = "mb.pendingReferralCode";

export function capturePendingReferralFromUrl(href?: string): string | null {
  if (typeof window === "undefined") return null;
  const code = readReferralCodeFromUrl(href);
  if (!code) return null;
  try {
    window.sessionStorage.setItem(PENDING_REFERRAL_STORAGE_KEY, code);
  } catch {
    // Private mode / quota errors → silently skip; the user can still
    // type the code on /referral.
  }
  return code;
}

export function readPendingReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_REFERRAL_STORAGE_KEY);
    if (!raw) return null;
    const norm = normalizeReferralCode(raw);
    return isValidReferralCodeShape(norm) ? norm : null;
  } catch {
    return null;
  }
}

export function clearPendingReferralCode(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDING_REFERRAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Apply any pending referral code captured before signup. Called from
 * AuthProvider on the first verified auth event. Best-effort:
 *   - already_used / self_referral / invalid_code → clear and move on
 *   - applied → clear (the apply RPC also fires the grant in background)
 *
 * Returns the apply result for telemetry; safe to ignore.
 */
export async function applyPendingReferralOnAuth(
  userId: string,
): Promise<ApplyReferralCodeResult | null> {
  const code = readPendingReferralCode();
  if (!code) return null;

  const result = await applyReferralCode(userId, code);
  // Clear regardless of outcome — terminal states all warrant removing
  // the pending code (success consumed it; failure means the code is
  // not redeemable and re-trying won't change that).
  clearPendingReferralCode();
  return result;
}

/**
 * Re-attempt the owner-side reward grant. Used on every verified login
 * to flush the Day-3 gate once the referred user has aged in. Idempotent;
 * the SQL function short-circuits when both sides are already granted
 * or the gate hasn't lifted yet.
 */
export async function retryReferralRewardOnAuth(
  userId: string,
): Promise<GrantRewardResult | null> {
  // Cheap pre-check: if there's no referral_uses row for this user the
  // RPC will return 'no_referral_use'. Skipping the RPC entirely when
  // we know there's no row keeps the boot path quiet.
  const exists = await hasPendingReferralUse(userId);
  if (!exists) return null;
  return await grantReferralReward(userId);
}

type ExistsRow = { id: string } | null;

async function hasPendingReferralUse(userId: string): Promise<boolean> {
  try {
    const q = await (supabase
      .from("referral_uses") as unknown as {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            eq: (col: string, val: boolean) => {
              maybeSingle: () => Promise<{
                data: ExistsRow;
                error: { message: string } | null;
              }>;
            };
          };
        };
      })
      .select("id")
      .eq("referred_user_id", userId)
      .eq("reward_granted_owner", false)
      .maybeSingle();
    return !q.error && q.data != null;
  } catch {
    return false;
  }
}
