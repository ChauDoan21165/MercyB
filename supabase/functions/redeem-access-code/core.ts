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

// ── Welcome email template (VI-first bilingual) ───────────────────────

export function renderWelcomeEmailHtml(row: RedeemRpcRow): string {
  const tier = row.tier_name ?? "Premium";
  const duration = row.is_lifetime
    ? "trọn đời / lifetime"
    : `${row.days} ngày / ${row.days} days`;
  const expiryLine = row.is_lifetime
    ? "Không giới hạn thời gian / No expiry"
    : `Có hiệu lực đến ${row.valid_until} / Valid until ${row.valid_until}`;

  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;padding:40px 20px;margin:0">
<div style="max-width:480px;margin:0 auto;background:white;border-radius:12px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.08)">
<h1 style="color:#b8541b;margin:0 0 8px;font-size:24px">Chào mừng bạn đến với MercyBlade!</h1>
<p style="color:#71717a;margin:0 0 24px;font-size:14px">Welcome to MercyBlade!</p>

<p style="color:#27272a;font-size:16px;line-height:1.6;margin:0 0 16px">
Chào mừng bạn! Bạn vừa kích hoạt <strong>${duration}</strong> học tiếng Anh miễn phí trên MercyBlade.
</p>
<p style="color:#52525b;font-size:14px;line-height:1.5;margin:0 0 24px">
You've just activated <strong>${duration}</strong> of free English learning on MercyBlade.
</p>

<p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 16px">
MercyBlade giúp bạn học tiếng Anh thực tế — từ giao tiếp hàng ngày đến luyện thi VSTEP.
</p>
<p style="color:#52525b;font-size:13px;line-height:1.5;margin:0 0 24px">
MercyBlade helps you learn practical English — from daily conversation to VSTEP exam prep.
</p>

<div style="background:linear-gradient(135deg,#b8541b,#d97706);border-radius:8px;padding:20px;margin:24px 0;color:white">
<p style="margin:0 0 8px;font-size:13px;opacity:0.9">Gói của bạn / Your plan</p>
<p style="margin:0 0 12px;font-size:20px;font-weight:bold">${tier}</p>
<p style="margin:0 0 4px;font-size:13px;opacity:0.9">Thời hạn / Duration</p>
<p style="margin:0;font-size:16px;font-weight:bold">${expiryLine}</p>
</div>

<div style="text-align:center;margin:32px 0">
<a href="https://mercyblade.com" style="display:inline-block;background:#b8541b;color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px">
Bắt đầu học ngay / Start learning →
</a>
</div>

<hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0">
<p style="color:#a1a1aa;font-size:12px;text-align:center;margin:0;line-height:1.5">
Nếu bạn có câu hỏi, reply email này.<br>
If you have questions, reply to this email.
</p>
</div>
</body>
</html>`;
}

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
  /** Send a welcome email after successful redemption. Fire-and-forget —
   *  failure must never break the redemption response. */
  sendWelcomeEmail(userId: string, row: RedeemRpcRow): Promise<void>;
}

// ── Stable error codes raised by the RPC ──────────────────────────────
//
// The RPC raises these via `RAISE EXCEPTION '...' USING ERRCODE = 'P000N'`.
// We map them to user-facing copy here so the Edge Function stays
// language-agnostic on the database side.
//
// IMPORTANT: any RPC error message NOT in this whitelist is treated as
// an internal/platform error and surfaced to the user as GENERIC_ERROR.
// The raw Postgres error text never reaches the client. This prevents
// leaks like "column st.key does not exist" from reaching the redeem
// dialog. The raw message + pg_code still go to Edge Function logs and
// to the response's `pg_code` / `internal_message` fields for engineers
// debugging from network tab — UI code MUST display `error`, not those.

const ERROR_MESSAGES: Record<string, string> = {
  CODE_NOT_FOUND: "Invalid or inactive access code",
  CODE_EXPIRED: "This access code has expired",
  CODE_FULLY_REDEEMED: "This access code has been fully redeemed",
  ALREADY_REDEEMED: "You have already redeemed this access code",
};

const GENERIC_ERROR =
  "Something went wrong, please try again. / Có lỗi xảy ra, vui lòng thử lại.";

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
    const friendly = ERROR_MESSAGES[result.message];
    if (friendly) {
      return fail(friendly, { pg_code: result.pgCode });
    }
    // Unknown error — log raw, hide from user. Engineers can still see
    // pg_code + internal_message in the network tab / function logs.
    console.error(
      "[redeem-access-code] internal error:",
      result.pgCode,
      result.message,
    );
    return fail(GENERIC_ERROR, {
      pg_code: result.pgCode,
      internal_message: result.message,
    });
  }

  const { row } = result;

  // Fire-and-forget welcome email. We explicitly DON'T await — the
  // redemption is complete and the user gets their 200 response
  // immediately. Email delivery is best-effort; failures are logged
  // to console (captured by Sentry) but never surfaced to the user.
  deps.sendWelcomeEmail(user.id, row).catch((err) => {
    console.error("[redeem-access-code] welcome email failed:", err);
  });

  return ok({
    message: row.is_lifetime
      ? "Lifetime access code redeemed successfully"
      : "Access code redeemed successfully",
    tier: row.tier_name,
    days: row.is_lifetime ? "lifetime" : row.days,
    valid_until: row.is_lifetime ? "never" : row.valid_until,
  });
}