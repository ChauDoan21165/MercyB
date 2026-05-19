// Pure aal=2 gating logic for the delete-account Edge Function.
//
// Why this exists as its own module: account deletion is irreversible
// and runs under the service-role key, which BYPASSES the Phase-1 RLS
// gate `require_aal2_when_factor_present`. So the database-layer 2FA
// protection does NOT reach this code path — the check has to be
// re-asserted here as defense in depth (issue #233).
//
// Policy decision (recorded here, not in a commit message so it stays
// with the code): we enforce aal=2 ONLY when the user has a verified
// second factor — exactly mirroring the `require_aal2_when_factor_present`
// RLS rule and the frontend `RequireAal2` guard. Requiring aal=2
// *unconditionally* would be impossible to satisfy for the (majority)
// of users who have no MFA factor at all: there is no TOTP factor to
// challenge, so they could never reach aal=2 and could never delete
// their account. Conditional-on-factor is the only rule that both
// closes the bypass and stays consistent with the rest of the product.
//
// Kept Deno-free and side-effect-free so it can be unit-tested with
// vitest (the Deno.serve handler in index.ts cannot).

/** Read the `aal` claim from a Supabase JWT without a network round
 * trip. Returns null only for a structurally invalid token (the token
 * has already passed `auth.getUser()` by the time we call this, so in
 * practice this is always "aal1" | "aal2"). */
export function readAalFromJwt(token: string): "aal1" | "aal2" | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const b64 = padded.padEnd(
      padded.length + ((4 - (padded.length % 4)) % 4),
      "=",
    );
    const claims = JSON.parse(atob(b64));
    return claims?.aal === "aal2" ? "aal2" : "aal1";
  } catch {
    return null;
  }
}

export type AalGateInput = {
  /** The `aal` claim from the caller's JWT (null = unparseable). */
  aal: "aal1" | "aal2" | null;
  /** Whether the user has at least one VERIFIED TOTP factor. */
  hasVerifiedFactor: boolean;
  /** True when the verified-factor lookup itself failed (e.g. the
   * GoTrue admin call threw / errored). For an irreversible op we
   * fail CLOSED rather than assume "no factor". */
  factorLookupFailed: boolean;
};

export type AalGateDenial = {
  status: number;
  payload: {
    error: "aal2_required" | "aal_check_unavailable";
    message: string; // Vietnamese-first (non-negotiable #1)
    en_message: string;
  };
};

/**
 * Returns null when deletion may proceed, or a denial (status + body)
 * when it must be blocked.
 *
 * Truth table:
 *   factorLookupFailed                → 503 aal_check_unavailable (fail closed)
 *   aal === "aal2"                    → allow (fully elevated)
 *   aal !== "aal2" && hasVerifiedFactor → 403 aal2_required
 *   aal !== "aal2" && !hasVerifiedFactor → allow (no MFA → no path to
 *                                          aal2; must stay deletable)
 */
export function evaluateDeleteAccountAal(
  input: AalGateInput,
): AalGateDenial | null {
  if (input.factorLookupFailed) {
    return {
      status: 503,
      payload: {
        error: "aal_check_unavailable",
        message:
          "Không thể xác minh trạng thái bảo mật của bạn ngay lúc này. " +
          "Vui lòng thử lại sau ít phút.",
        en_message:
          "Could not verify your security status right now. " +
          "Please try again in a few minutes.",
      },
    };
  }

  if (input.aal === "aal2") return null;

  if (input.hasVerifiedFactor) {
    return {
      status: 403,
      payload: {
        error: "aal2_required",
        message:
          "Xóa tài khoản là hành động không thể hoàn tác. Vui lòng xác " +
          "thực mã 2FA của bạn trước khi tiếp tục.",
        en_message:
          "Deleting your account is irreversible. Please verify your " +
          "2FA code before continuing.",
      },
    };
  }

  return null;
}
