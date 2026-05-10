// supabase/functions/redeem-access-code/core.ts
//
// Pure handler logic for the redeem-access-code Edge Function. Mirrors
// the mock-interview pattern: a `handleRequest(req, deps)` function that
// can be unit-tested without spinning up Deno or Postgres.
//
// Response contract:
//   - Always HTTP 200 (so the Supabase JS SDK never collapses the body
//     into "Edge Function returned a non-2xx status code").
//   - Body: { ok: true,  message, tier, days, valid_until } on success
//   - Body: { ok: false, error }                          on any failure
//   The UI's redeem dialog (src/components/GiftCodeModal.tsx) reads
//   `data.ok` and falls back to `data.error` for the user-facing message.
//
// Atomicity: actual redemption work is delegated to the
// `redeem_access_code_atomic(p_user_id, p_code)` Postgres RPC. All four
// writes (subscription upsert, payment_transactions insert,
// access_code_redemptions insert, used_count bump) run inside the
// implicit function transaction. A failure in any step rolls back the
// rest — no orphan rows.

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

export type AuthedUser = { id: string };

export type RedeemRpcRow = {
  tier_name: string | null;
  days: number;
  is_lifetime: boolean;
  valid_until: string;
};

export type RedeemRpcResult =
  | { ok: true; row: RedeemRpcRow }
  | { ok: false; pgCode: string | null; message: string };

export interface Deps {
  /** Validate the JWT in the Authorization header and return the user, or null. */
  getUserFromAuthHeader(authHeader: string | null): Promise<AuthedUser | null>;
  /** Call the redeem_access_code_atomic RPC. */
  redeemAtomic(userId: string, code: string): Promise<RedeemRpcResult>;
}

// ── Stable error codes raised by the RPC ──────────────────────────────
//
// The RPC raises these via `RAISE EXCEPTION '...' USING ERRCODE = 'P000N'`.
// We map them to user-facing copy here so the Edge Function stays
// language-agnostic on the database side.

const ERROR_MESSAGES: Record<string, string> = {
  CODE_NOT_FOUND: "Invalid or inactive access code",
  CODE_EXPIRED: "This access code has expired",
  CODE_FULLY_REDEEMED: "This access code has been fully redeemed",
  ALREADY_REDEEMED: "You have already redeemed this access code",
};

function ok(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ ok: true, success: true, ...body }), {
    status: 200,
    headers: corsHeaders,
  });
}

function fail(error: string, extra?: Record<string, unknown>): Response {
  return new Response(
    JSON.stringify({ ok: false, success: false, error, ...(extra ?? {}) }),
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

  if (req.method !== "POST") {
    return fail("Method not allowed");
  }

  const user = await deps.getUserFromAuthHeader(
    req.headers.get("Authorization"),
  );
  if (!user) {
    return fail("Please log in to redeem your access code.");
  }

  let payload: { code?: unknown };
  try {
    payload = await req.json();
  } catch {
    return fail("Invalid request body");
  }

  const code = typeof payload.code === "string" ? payload.code.trim() : "";
  if (!code) {
    return fail("Invalid code format");
  }

  const result = await deps.redeemAtomic(user.id, code);

  if (!result.ok) {
    // RPC raised a stable error message — translate to user-facing copy.
    const userFacing = ERROR_MESSAGES[result.message] ?? result.message;
    return fail(userFacing, { pg_code: result.pgCode });
  }

  const { row } = result;
  return ok({
    message: row.is_lifetime
      ? "Lifetime access code redeemed successfully"
      : "Access code redeemed successfully",
    tier: row.tier_name,
    days: row.is_lifetime ? "lifetime" : row.days,
    valid_until: row.is_lifetime ? "never" : row.valid_until,
  });
}
