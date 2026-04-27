// src/lib/referral/leaderboardOptIn.ts
//
// Opt-in client for the public monthly referral leaderboard.
//
// Privacy-first contract:
//   - No row ⇒ user is NOT on the leaderboard. The materialized views
//     INNER JOIN on referral_leaderboard_optin (status='active'), so
//     non-opted-in users never surface.
//   - status='opted_out' is a soft-delete: the user previously opted in,
//     then turned it off. Their counts disappear from the public views
//     (status='active' filter) but their chosen display_name + history
//     are preserved.
//   - status='flagged' is set by the admin / anti-gaming job.
//
// Display-name validation mirrors PR #156 (pronunciation leaderboard):
// 30 chars, only letters/digits/spaces + emoji whitelist ✨ 💎 🏆.

import { supabase } from "@/lib/supabaseClient";

// ── Display name validation ──────────────────────────────────────────────

const ALLOWED_EMOJI_REGEX = /[\u{2728}\u{1F48E}\u{1F3C6}]/u;
const DISALLOWED_EMOJI_RANGE =
  /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;

export type DisplayNameValidation =
  | { ok: true; value: string }
  | { ok: false; reason: "empty" | "too_long" | "disallowed_chars" };

/**
 * Validate a candidate display name.
 *
 * Rules (mirror PR #156):
 *   - 1 ≤ codepoint length ≤ 30 (matches the SQL CHECK constraint).
 *   - Letters / digits / spaces / common punctuation are fine.
 *   - The only emoji allowed are ✨ 💎 🏆.
 *   - Anything else in the unicode-emoji ranges is rejected.
 */
export function validateDisplayName(input: string): DisplayNameValidation {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  // Codepoint count (multi-byte emoji should count as 1, not 2).
  const codepointLength = Array.from(trimmed).length;
  if (codepointLength > 30) return { ok: false, reason: "too_long" };

  for (const ch of trimmed) {
    if (DISALLOWED_EMOJI_RANGE.test(ch) && !ALLOWED_EMOJI_REGEX.test(ch)) {
      return { ok: false, reason: "disallowed_chars" };
    }
  }
  return { ok: true, value: trimmed };
}

// ── Public types ─────────────────────────────────────────────────────────

export type OptInResult =
  | { ok: true }
  | { ok: false; reason: string; reasonVi: string };

const REASON_VI: Record<string, string> = {
  not_signed_in: "Vui lòng đăng nhập để tham gia bảng xếp hạng.",
  empty: "Vui lòng nhập tên hiển thị.",
  too_long: "Tên hiển thị tối đa 30 ký tự.",
  disallowed_chars:
    "Chỉ cho phép chữ, số, khoảng trắng, và biểu tượng ✨ 💎 🏆.",
  db_error: "Có lỗi xảy ra. Vui lòng thử lại.",
  unknown: "Có lỗi xảy ra. Vui lòng thử lại.",
};

function failure(reason: keyof typeof REASON_VI | string): OptInResult {
  return {
    ok: false,
    reason,
    reasonVi: REASON_VI[reason] ?? REASON_VI.unknown,
  };
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Opt the caller in (or update their display_name) on the monthly
 * referral leaderboard. UPSERTs the row with status='active'.
 *
 * Returns ok:true on success. Validation/DB errors return ok:false with
 * a stable English `reason` and a Vietnamese-localised `reasonVi`.
 */
export async function optInToReferralLeaderboard(
  userId: string,
  displayName: string,
): Promise<OptInResult> {
  if (!userId) return failure("not_signed_in");

  const validated = validateDisplayName(displayName);
  if (!validated.ok) return failure(validated.reason);

  type UpsertResp = { error: { message: string } | null };

  const result = (await (supabase
    .from("referral_leaderboard_optin") as unknown as {
      upsert: (
        row: Record<string, unknown>,
        opts?: { onConflict?: string },
      ) => Promise<UpsertResp>;
    })
    .upsert(
      {
        user_id: userId,
        display_name: validated.value,
        status: "active",
        opted_in_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )) as UpsertResp;

  if (result.error) return failure("db_error");
  return { ok: true };
}

/**
 * Opt the caller out — sets status='opted_out' (soft delete). The row
 * stays so we have a history; the public materialized views skip non-
 * active rows.
 */
export async function optOutOfReferralLeaderboard(
  userId: string,
): Promise<OptInResult> {
  if (!userId) return failure("not_signed_in");

  type UpdResp = { error: { message: string } | null };

  const result = (await (supabase
    .from("referral_leaderboard_optin") as unknown as {
      update: (row: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<UpdResp>;
      };
    })
    .update({ status: "opted_out", updated_at: new Date().toISOString() })
    .eq("user_id", userId)) as UpdResp;

  if (result.error) return failure("db_error");
  return { ok: true };
}

export type OptInStatus = {
  optedIn: boolean;
  displayName: string | null;
};

/**
 * Read the caller's current opt-in state. Returns optedIn:false +
 * displayName:null if no row exists OR if the row's status isn't
 * 'active'.
 */
export async function getOptInStatus(userId: string): Promise<OptInStatus> {
  if (!userId) return { optedIn: false, displayName: null };

  type SelResp = {
    data: { display_name: string | null; status: string | null } | null;
    error: { message: string } | null;
  };

  const result = (await (supabase
    .from("referral_leaderboard_optin") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<SelResp>;
        };
      };
    })
    .select("display_name, status")
    .eq("user_id", userId)
    .maybeSingle()) as SelResp;

  if (result.error || !result.data) {
    return { optedIn: false, displayName: null };
  }

  const isActive = result.data.status === "active";
  return {
    optedIn: isActive,
    displayName: isActive ? (result.data.display_name ?? null) : null,
  };
}
