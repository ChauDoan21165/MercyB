// supabase/functions/redeem-gift-code/core.ts
//
// Pure handler logic for the redeem-gift-code Edge Function. Mirrors the
// redeem-access-code pattern: a `handleRequest(req, deps)` that can be
// unit-tested without Deno or Postgres.
//
// Response contract (unchanged from the previous index.ts):
//   - Always HTTP 200 (so the Supabase JS SDK never collapses the body
//     into "Edge Function returned a non-2xx status code").
//   - Success: { ok: true, tier, message }
//   - Failure: { ok: false, error }  (+ NEW machine-readable error_code
//                                      on the silent-failure paths)
//
// ── The B22 silent-failure repair (this file's reason to exist) ───────
// The entitlement read path (src/lib/gift/fetchActiveGiftSubscription.ts)
// only honors a `user_subscriptions` row when
//   status = 'active' AND is_gift_redemption = true AND
//   current_period_end > now
// The previous redeem-gift-code wrote rows that omit `is_gift_redemption`
// (DB DEFAULT false), then marked the gift code used and returned
// `ok:true` with "Welcome! Your access is now active." Net effect: the
// customer's code was burned, no entitlement was granted, and nothing
// alerted anyone — a pure money-loss silent failure (B48 W5/B22).
//
// This module makes that failure HONEST and SAFE:
//   1. After the write, the redemption is verified against the SAME
//      predicate the read path uses (`deps.redeemGift` returns the
//      verification outcome).
//   2. The gift code is marked used ONLY after a verified-visible
//      redemption — a failed redemption leaves the code reusable.
//   3. Write / not-propagated failures return ok:false with an
//      actionable error_code and are surfaced to Sentry with context.
//
// This is the narrow carve-out. It does NOT fold user_subscriptions into
// subscriptions and does NOT change the write semantics (e.g. it does
// not start setting is_gift_redemption=true) — that propagation fix is
// D3 / P2 work and out of scope here.

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

export type AuthedUser = { id: string; email: string | null };

/**
 * Result of attempting the full redemption write + post-write
 * entitlement verification. `ok:true` means a `user_subscriptions` row
 * exists that the entitlement read path will actually honor.
 */
export type RedeemOutcome =
  | { ok: true; tier: string; giftId: string; userEmail: string | null }
  | { ok: false; kind: "not_found" }
  | { ok: false; kind: "expired" }
  | { ok: false; kind: "already_redeemed"; tier: string }
  | { ok: false; kind: "tier_not_configured"; tier: string }
  | {
      ok: false;
      kind: "write_failed";
      tier: string;
      giftId: string;
      detail: string;
    }
  | { ok: false; kind: "not_propagated"; tier: string; giftId: string };

export interface CaptureContext {
  userId: string;
  tags: Record<string, string>;
  extra: Record<string, unknown>;
}

export interface Deps {
  /** Validate the JWT in the Authorization header; return the user or null. */
  getUserFromAuthHeader(authHeader: string | null): Promise<AuthedUser | null>;
  /**
   * Look up the code, run every user_subscriptions write, then verify
   * the written row is visible to the entitlement read path. MUST NOT
   * mark the gift code used — that is the caller's decision, gated on a
   * verified-visible outcome.
   */
  redeemGift(user: AuthedUser, code: string): Promise<RedeemOutcome>;
  /**
   * Burn the gift code + write the audit log + send the confirmation
   * email. Called ONLY after a verified-visible redemption. Best-effort:
   * must never throw (a post-success bookkeeping failure must not turn a
   * real grant into an error).
   */
  finalizeRedemption(
    user: AuthedUser,
    giftId: string,
    tier: string,
  ): Promise<void>;
  /** Surface a money-path silent failure to Sentry. Must never throw. */
  captureError(error: unknown, ctx: CaptureContext): Promise<void>;
}

// User-facing copy for the silent-failure paths. The customer must know
// (a) it didn't work, (b) their code is NOT consumed, (c) the concrete
// next step. Retrying is not advised — `not_propagated` is structural
// until the P2 fold-in, and support can re-grant because the code is
// preserved.
const SUPPORT_MESSAGE =
  "We couldn't activate your gift right now. Your code has NOT been used — " +
  "please email admin@mercyblade.com with your code and we'll fix it for you.";

function ok(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ ok: true, ...body }), {
    status: 200,
    headers: corsHeaders,
  });
}

function fail(error: string, extra?: Record<string, unknown>): Response {
  return new Response(
    JSON.stringify({ ok: false, error, ...(extra ?? {}) }),
    { status: 200, headers: corsHeaders },
  );
}

export async function handleRequest(
  req: Request,
  deps: Deps,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return fail("Please log in to redeem a gift code.");
  }

  const user = await deps.getUserFromAuthHeader(authHeader);
  if (!user) {
    return fail("Session expired. Please log in again.");
  }

  let body: { code?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request format.");
  }

  const code =
    typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!code) {
    return fail("Gift code is required.");
  }

  const outcome = await deps.redeemGift(user, code);

  if (outcome.ok) {
    // Verified visible. Now (and only now) burn the code + send the
    // welcome email. Best-effort — never downgrade a real grant.
    await deps.finalizeRedemption(user, outcome.giftId, outcome.tier);
    return ok({
      tier: outcome.tier,
      message: `Welcome to ${outcome.tier}! Your access is now active.`,
    });
  }

  switch (outcome.kind) {
    case "not_found":
      return fail("Gift code not found or already used.");
    case "expired":
      return fail("This gift code has expired.");
    case "already_redeemed":
      return fail(`You have already redeemed a ${outcome.tier} code.`);
    case "tier_not_configured":
      return fail(
        `Tier ${outcome.tier} is not configured. Please contact support.`,
      );
    case "write_failed":
    case "not_propagated": {
      // ── The silent-failure carve-out ────────────────────────────────
      // The write did not produce an entitlement-visible row. DO NOT
      // mark the code used (it stays redeemable). Surface to Sentry and
      // tell the customer the truth + the next step.
      const errorCode =
        outcome.kind === "write_failed"
          ? "GIFT_REDEEM_WRITE_FAILED"
          : "GIFT_REDEEM_NOT_PROPAGATED";
      await deps.captureError(
        new Error(
          `[redeem-gift-code] ${outcome.kind}: gift redemption did not ` +
            `grant entitlement (gift code NOT consumed)`,
        ),
        {
          userId: user.id,
          tags: {
            stage:
              outcome.kind === "write_failed"
                ? "subscription_write"
                : "entitlement_verify",
            tier: outcome.tier,
          },
          extra: {
            code,
            gift_id: outcome.giftId,
            ...(outcome.kind === "write_failed"
              ? { detail: outcome.detail }
              : {}),
          },
        },
      );
      return fail(SUPPORT_MESSAGE, { error_code: errorCode });
    }
    default: {
      // Defensive: an unrecognized outcome is itself a silent failure.
      const _exhaustive: never = outcome;
      await deps.captureError(
        new Error("[redeem-gift-code] unrecognized redeem outcome"),
        {
          userId: user.id,
          tags: { stage: "unknown" },
          extra: { code, outcome: JSON.stringify(_exhaustive) },
        },
      );
      return fail(SUPPORT_MESSAGE, { error_code: "GIFT_REDEEM_UNKNOWN" });
    }
  }
}
