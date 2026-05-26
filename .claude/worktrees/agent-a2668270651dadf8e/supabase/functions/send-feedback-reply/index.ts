// supabase/functions/send-feedback-reply/index.ts
//
// Admin-only endpoint to email a reply to a piece of user feedback.
//
// Hardened in security/a3-feedback-reply-hardening (C2 from the
// 2026-04-25 edge-function audit). Before that fix this was an open
// Resend relay: it accepted an arbitrary recipient from the body with
// no admin gate, no rate limit, no audit trail.
//
// Contract (NEW, post-fix):
//   POST /send-feedback-reply
//   Authorization: Bearer <user JWT, admin level >= 9>
//   Body: { feedback_id: uuid, subject?: string, replyMessage: string }
//
// What changed:
//   1. Caller MUST pass a valid `feedback_id`. The recipient email is
//      derived server-side from feedback.user_id → profiles/auth.users.
//      The body's recipient (if any) is IGNORED. This eliminates the
//      open-relay vector entirely.
//   2. Admin gate via get_admin_level RPC (>= 9). 401 on missing JWT,
//      403 on non-admin.
//   3. Per-admin rate limit: ≤ 10 emails / hour, enforced by the
//      check_admin_email_rate_limit RPC against email_audit.
//   4. Subject + body sanitisation: HTML stripped from caller-supplied
//      strings; subject ≤ 200 chars; body ≤ 10 000 chars.
//   5. Every send (success or failure) is logged to email_audit.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_SUBJECT_CHARS = 200;
const MAX_BODY_CHARS = 10_000;
const RATE_LIMIT_PER_HOUR = 10;
const FROM_ADDRESS = "Mercy Blade Admin <admin@mercyblade.com>";

interface FeedbackReplyRequest {
  feedback_id?: string;
  subject?: string;
  replyMessage?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Sanitisation ─────────────────────────────────────────────────────────

/** Strip HTML tags + collapse whitespace. Returns plaintext. */
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** HTML-escape a sanitised plaintext string for safe embedding in our template. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ── Handler ──────────────────────────────────────────────────────────────

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // 1. Authenticate caller via JWT.
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(
    token,
  );
  const adminUser = userResult?.user;
  if (userError || !adminUser) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // 2. Admin-level gate.
  const { data: levelData, error: levelError } = await supabaseAdmin.rpc(
    "get_admin_level",
    { _user_id: adminUser.id },
  );
  const adminLevel = typeof levelData === "number" ? levelData : 0;
  if (levelError || adminLevel < 9) {
    return jsonResponse({ error: "Admin required" }, 403);
  }

  // 3. Parse + validate body.
  let body: FeedbackReplyRequest;
  try {
    body = (await req.json()) as FeedbackReplyRequest;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!isUuid(body.feedback_id)) {
    return jsonResponse({ error: "feedback_id required (uuid)" }, 400);
  }

  const replyRaw = stripHtml(String(body.replyMessage ?? ""));
  if (replyRaw.length === 0) {
    return jsonResponse({ error: "replyMessage required" }, 400);
  }
  if (replyRaw.length > MAX_BODY_CHARS) {
    return jsonResponse(
      { error: `replyMessage exceeds ${MAX_BODY_CHARS} chars` },
      400,
    );
  }

  const subjectRaw = stripHtml(
    String(body.subject ?? "Reply to your feedback"),
  ).slice(0, MAX_SUBJECT_CHARS);
  if (subjectRaw.length === 0) {
    return jsonResponse({ error: "subject required" }, 400);
  }

  // 4. Per-admin rate limit (≤ 10/hr).
  const { data: allowed, error: rateError } = await supabaseAdmin.rpc(
    "check_admin_email_rate_limit",
    {
      p_admin_id: adminUser.id,
      p_max: RATE_LIMIT_PER_HOUR,
    },
  );
  if (rateError) {
    // Fail-closed.
    return jsonResponse({ error: "Rate limit check failed" }, 429);
  }
  if (allowed === false) {
    return jsonResponse(
      {
        error: "Rate limit exceeded",
        limit: RATE_LIMIT_PER_HOUR,
        window: "1 hour",
      },
      429,
    );
  }

  // 5. Resolve recipient from feedback row (NEVER from request body).
  type FeedbackRow = {
    id: string;
    user_id: string | null;
    message: string;
  } | null;
  const { data: feedbackRow, error: feedbackErr } = await (supabaseAdmin
    .from("feedback") as unknown as {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{
          data: FeedbackRow;
          error: { message: string } | null;
        }>;
      };
    };
  })
    .select("id, user_id, message")
    .eq("id", body.feedback_id)
    .maybeSingle();

  if (feedbackErr || !feedbackRow) {
    return jsonResponse({ error: "Feedback not found" }, 404);
  }
  if (!feedbackRow.user_id) {
    return jsonResponse({ error: "Feedback has no associated user" }, 422);
  }

  type AuthUserRow = { user: { id: string; email?: string | null } | null };
  const { data: targetUserData, error: targetUserError } =
    (await supabaseAdmin.auth.admin.getUserById(
      feedbackRow.user_id,
    )) as unknown as { data: AuthUserRow; error: { message: string } | null };

  const recipient = targetUserData?.user?.email ?? null;
  if (targetUserError || !isEmail(recipient)) {
    return jsonResponse(
      { error: "Could not resolve recipient email" },
      422,
    );
  }

  // 6. Send via Resend.
  const safeSubject = subjectRaw;
  const safeReply = escapeHtml(replyRaw);
  const safeOriginal = escapeHtml(stripHtml(String(feedbackRow.message ?? "")));

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #000;">Reply from MercyBlade Admin</h2>
      <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #000; margin: 20px 0;">
        <p style="margin: 0; color: #666; font-size: 12px;">Your original message:</p>
        <p style="margin: 10px 0 0 0; color: #333;">${safeOriginal}</p>
      </div>
      <div style="margin: 20px 0;">
        <p style="font-weight: bold; color: #000;">Admin Reply:</p>
        <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${safeReply}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
      <p style="color: #666; font-size: 12px;">
        Thank you for your feedback!<br/>
        The MercyBlade Team
      </p>
    </div>
  `;

  let success = false;
  let resendId: string | null = null;
  let errorMessage: string | null = null;

  try {
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [recipient],
        subject: safeSubject,
        html,
        reply_to: "admin@mercyblade.com",
      }),
    });

    if (!resendResp.ok) {
      const errorJson = (await resendResp.json().catch(() => ({}))) as {
        message?: string;
      };
      errorMessage = errorJson.message ?? `Resend HTTP ${resendResp.status}`;
    } else {
      const data = (await resendResp.json().catch(() => ({}))) as {
        id?: string;
      };
      resendId = data.id ?? null;
      success = true;
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Resend call failed";
  }

  // 7. Audit log (best-effort, never throws).
  try {
    await supabaseAdmin.from("email_audit").insert({
      admin_user_id: adminUser.id,
      feedback_id: feedbackRow.id,
      recipient_email: recipient,
      subject: safeSubject,
      success,
      error_message: success ? null : errorMessage,
      metadata: { resend_id: resendId, source: "send-feedback-reply" },
    });
  } catch (err) {
    console.error("[send-feedback-reply] audit insert failed:", err);
  }

  if (!success) {
    return jsonResponse(
      { error: errorMessage ?? "Failed to send email" },
      502,
    );
  }

  return jsonResponse({ ok: true, id: resendId });
};

Deno.serve(handler);
