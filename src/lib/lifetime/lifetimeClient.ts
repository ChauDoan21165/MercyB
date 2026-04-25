// src/lib/lifetime/lifetimeClient.ts
//
// Thin client for lifetime_intent_signups. Strictly intent-capture —
// there is no purchase, no Stripe product, no charge. The client only
// records "this user said they would buy a Lifetime tier if offered."
//
// All writes are owner-bound by RLS (auth.uid() = user_id). Anonymous
// intent capture is intentionally not supported by this client today —
// add a SECURITY DEFINER RPC if Chau decides anonymous signal is worth
// the abuse surface.

import { supabase } from "@/lib/supabaseClient";

export type LifetimeReasonCode =
  | "gift"
  | "commitment"
  | "savings"
  | "other";

export type LifetimeSignupInput = {
  userId: string;
  email: string;
  country?: string | null;
  reasonCode: LifetimeReasonCode;
  reasonText?: string | null;
};

export type LifetimeSignupResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Record one lifetime-intent signup row. Idempotent at the UI level —
 * the form short-circuits when getMySignup() is true. The DB allows
 * multiple rows so a user can come back with an updated reason.
 */
export async function signUpForLifetime(
  input: LifetimeSignupInput,
): Promise<LifetimeSignupResult> {
  const trimmedEmail = (input.email ?? "").trim();
  if (!trimmedEmail) {
    return { ok: false, error: "email required" };
  }

  const { error } = await (supabase
    .from("lifetime_intent_signups") as unknown as {
      insert: (
        row: Record<string, unknown>,
      ) => Promise<{ error: { message: string } | null }>;
    })
    .insert({
      user_id: input.userId,
      email: trimmedEmail,
      country: input.country ?? null,
      reason_code: input.reasonCode,
      reason_text: input.reasonText ?? null,
    });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * True if the user has at least one intent row. The dialog uses this
 * to short-circuit the form with the "thank you" state on revisit.
 */
export async function getMySignup(userId: string): Promise<boolean> {
  type Row = { id: string } | null;
  const { data, error } = await (supabase
    .from("lifetime_intent_signups") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          limit: (n: number) => {
            maybeSingle: () => Promise<{
              data: Row;
              error: { message: string } | null;
            }>;
          };
        };
      };
    })
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}

/**
 * Public-readable count of total signups, surfaced via a SECURITY
 * DEFINER RPC so RLS doesn't leak rows. Returns 0 on any error so the
 * UI can simply hide the "X people" label.
 */
export async function getSignupCount(): Promise<number> {
  type Resp = { data: number | null; error: { message: string } | null };
  const result = (await (supabase as unknown as {
    rpc: (fn: string) => Promise<Resp>;
  }).rpc("lifetime_intent_count")) as Resp;

  if (result.error || typeof result.data !== "number") return 0;
  return result.data;
}

// ── Email validation (used by both the client + the dialog) ───────────────
// Deliberately permissive. Stricter checks would reject valid Vietnamese
// university and corporate addresses (e.g. .edu.vn aliases with a +tag).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isLikelyValidEmail(input: string): boolean {
  return EMAIL_REGEX.test(input.trim());
}
