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
    return { ok: true, status: "applied" };
  }
  if (status === "self_referral" || status === "already_used" || status === "invalid_code") {
    return { ok: false, status };
  }
  return { ok: false, status: "invalid_code" };
}

// ── Stats — count uses + reward eligibility ───────────────────────────────

export type ReferralStats = {
  code: string | null;
  usesCount: number;
  /**
   * Reward eligibility is "did anyone redeem your code AND has the
   * reward not been delivered yet?" — we check `reward_granted_owner =
   * false` rows. The actual reward delivery is out of scope here.
   */
  pendingOwnerRewards: number;
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
    return { code: null, usesCount: 0, pendingOwnerRewards: 0 };
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

  return {
    code: codeRowQ.data.code,
    usesCount: codeRowQ.data.uses_count ?? 0,
    pendingOwnerRewards: pending,
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
