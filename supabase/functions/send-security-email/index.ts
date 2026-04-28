// Path: supabase/functions/send-security-email/index.ts
//
// 2FA Phase 1 — transactional security emails.
//
// Per reports/2fa-design-decisions-2026-04-27.md § Decision 4, this is a
// SEPARATE function from email-automations / send-email-campaign so that
// security emails never honor a marketing unsubscribe flag. A user who
// unsubscribed from marketing still NEEDS to know their 2FA was disabled.
//
// Phase 1 templates:
//   - security_2fa_enabled
//   - security_2fa_disabled
// Phase 2 will add: security_2fa_lockout (after the failed-attempt
// counter is wired up server-side).
//
// Auth model:
//   - Caller must be authenticated (JWT in Authorization header).
//   - Recipient email is derived server-side from auth.users via the
//     JWT's user id. The caller cannot specify a recipient — that
//     would be an open-relay vector (same lesson learned in
//     send-feedback-reply / C2 hardening).
//
// Rate limit:
//   - Reuse `_shared/rateLimit.ts`. 10 sends per user per hour. A
//     legit user enables/disables 2FA at most a few times in their
//     lifetime; 10/hour leaves headroom for retry but blocks abuse.
//
// Audit:
//   - Every send is logged to `email_audit` with kind=`security`.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { rateLimit } from "../_shared/rateLimit.ts";
import { wrapHandler } from "../_shared/sentry.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM_ADDRESS = "MercyBlade Security <admin@mercyblade.com>";
const RATE_LIMIT_MAX_CALLS = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

type SecurityEmailKind =
  | "security_2fa_enabled"
  | "security_2fa_disabled"
  // Phase 2 additions
  | "backup_codes_generated"
  | "backup_codes_regenerated"
  | "backup_code_used"
  | "lockout_triggered";

interface RequestBody {
  kind?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/** Resolve the calling user from the Authorization header. */
async function getUserFromAuthHeader(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}

function isValidKind(value: unknown): value is SecurityEmailKind {
  return (
    value === "security_2fa_enabled" ||
    value === "security_2fa_disabled" ||
    value === "backup_codes_generated" ||
    value === "backup_codes_regenerated" ||
    value === "backup_code_used" ||
    value === "lockout_triggered"
  );
}

interface Template {
  subject: string;
  textBody: string;
}

/** Bilingual VN-primary plaintext templates. No marketing styling, no
 * unsubscribe link (transactional security emails are exempt from
 * CAN-SPAM and GDPR unsubscribe requirements). */
function buildTemplate(kind: SecurityEmailKind): Template {
  if (kind === "security_2fa_enabled") {
    return {
      subject: "MercyBlade — 2FA đã được bật / 2FA enabled",
      textBody: [
        "Xin chào,",
        "",
        "Tài khoản MercyBlade của bạn vừa bật xác thực hai bước (2FA).",
        "Từ giờ, mỗi lần đăng nhập bạn sẽ cần nhập mã 6 số từ ứng dụng xác thực sau khi nhập mật khẩu.",
        "",
        "Nếu không phải bạn thực hiện thao tác này, hãy đổi mật khẩu ngay và liên hệ admin@mercyblade.com.",
        "",
        "—",
        "",
        "Hello,",
        "",
        "Two-factor authentication (2FA) has just been enabled on your MercyBlade account.",
        "From now on, each sign-in will require a 6-digit code from your authenticator app after your password.",
        "",
        "If you did not do this, change your password immediately and contact admin@mercyblade.com.",
        "",
        "— MercyBlade Security",
      ].join("\n"),
    };
  }

  if (kind === "security_2fa_disabled") {
    return {
      subject: "MercyBlade — 2FA đã được tắt / 2FA disabled",
      textBody: [
        "Xin chào,",
        "",
        "Xác thực hai bước (2FA) trên tài khoản MercyBlade của bạn vừa được tắt.",
        "Từ giờ, đăng nhập sẽ chỉ cần email và mật khẩu.",
        "",
        "NẾU KHÔNG PHẢI BẠN tắt 2FA, tài khoản của bạn có thể đang bị xâm nhập:",
        "  1. Đổi mật khẩu ngay tại mercyblade.com",
        "  2. Bật lại 2FA",
        "  3. Liên hệ admin@mercyblade.com để được hỗ trợ",
        "",
        "—",
        "",
        "Hello,",
        "",
        "Two-factor authentication (2FA) on your MercyBlade account has just been disabled.",
        "From now on, sign-in will only require email and password.",
        "",
        "IF YOU DID NOT DO THIS, your account may be compromised:",
        "  1. Change your password immediately at mercyblade.com",
        "  2. Re-enable 2FA",
        "  3. Contact admin@mercyblade.com for help",
        "",
        "— MercyBlade Security",
      ].join("\n"),
    };
  }

  // ─── Phase 2 templates ────────────────────────────────────────────

  if (kind === "backup_codes_generated") {
    return {
      subject: "MercyBlade — Mã dự phòng 2FA đã được tạo / Backup codes generated",
      textBody: [
        "Xin chào,",
        "",
        "Bạn vừa tạo 8 mã dự phòng cho 2FA trên tài khoản MercyBlade.",
        "Mỗi mã chỉ dùng được một lần — hãy lưu cẩn thận, ngoài ứng dụng xác thực của bạn.",
        "",
        "Nếu không phải bạn thực hiện thao tác này, đổi mật khẩu ngay và liên hệ admin@mercyblade.com.",
        "",
        "—",
        "",
        "Hello,",
        "",
        "Eight backup codes for 2FA were just generated on your MercyBlade account.",
        "Each code is single-use — store them somewhere safe, separate from your authenticator app.",
        "",
        "If you did not do this, change your password immediately and contact admin@mercyblade.com.",
        "",
        "— MercyBlade Security",
      ].join("\n"),
    };
  }

  if (kind === "backup_codes_regenerated") {
    return {
      subject: "MercyBlade — Mã dự phòng 2FA đã được tạo lại / Backup codes regenerated",
      textBody: [
        "Xin chào,",
        "",
        "Toàn bộ mã dự phòng 2FA cũ trên tài khoản MercyBlade đã bị huỷ và 8 mã mới đã được tạo.",
        "Các mã cũ giờ không dùng được nữa.",
        "",
        "Nếu không phải bạn thực hiện thao tác này, đổi mật khẩu ngay và liên hệ admin@mercyblade.com.",
        "",
        "—",
        "",
        "Hello,",
        "",
        "All previous backup codes on your MercyBlade account have been invalidated and 8 fresh codes generated.",
        "Old codes no longer work.",
        "",
        "If you did not do this, change your password immediately and contact admin@mercyblade.com.",
        "",
        "— MercyBlade Security",
      ].join("\n"),
    };
  }

  if (kind === "backup_code_used") {
    return {
      subject: "MercyBlade — Mã dự phòng vừa được sử dụng / Backup code used",
      textBody: [
        "Xin chào,",
        "",
        "Một mã dự phòng vừa được dùng để khôi phục quyền truy cập tài khoản MercyBlade của bạn.",
        "Để bảo vệ tài khoản, 2FA đã được TẠM TẮT — mã 6 số từ ứng dụng xác thực sẽ không còn cần thiết",
        "cho đến khi bạn bật lại 2FA tại trang Bảo mật.",
        "",
        "NẾU KHÔNG PHẢI BẠN khôi phục:",
        "  1. Đổi mật khẩu ngay tại mercyblade.com",
        "  2. Bật lại 2FA và tạo mã dự phòng mới",
        "  3. Liên hệ admin@mercyblade.com",
        "",
        "—",
        "",
        "Hello,",
        "",
        "A backup code was just used to recover access to your MercyBlade account.",
        "For your safety, 2FA has been TEMPORARILY DISABLED — your authenticator app will not be required",
        "until you re-enable 2FA from the Security page.",
        "",
        "IF YOU DID NOT DO THIS:",
        "  1. Change your password immediately at mercyblade.com",
        "  2. Re-enable 2FA and generate fresh backup codes",
        "  3. Contact admin@mercyblade.com",
        "",
        "— MercyBlade Security",
      ].join("\n"),
    };
  }

  // lockout_triggered
  return {
    subject: "MercyBlade — Tài khoản tạm khoá do nhập sai 2FA / Account temporarily locked",
    textBody: [
      "Xin chào,",
      "",
      "Tài khoản MercyBlade của bạn vừa bị tạm khoá vì nhập sai mã 2FA quá nhiều lần (5 lần trong 15 phút).",
      "Khoá sẽ tự động mở sau 30 phút.",
      "",
      "NẾU KHÔNG PHẢI BẠN cố gắng đăng nhập, ai đó có thể đang biết mật khẩu của bạn:",
      "  1. Đổi mật khẩu ngay tại mercyblade.com (sau khi khoá hết hạn)",
      "  2. Kiểm tra danh sách thiết bị đã đăng nhập",
      "  3. Liên hệ admin@mercyblade.com nếu nghi ngờ",
      "",
      "—",
      "",
      "Hello,",
      "",
      "Your MercyBlade account has been temporarily locked due to too many failed 2FA attempts (5 in 15 minutes).",
      "The lock will lift automatically after 30 minutes.",
      "",
      "IF THIS WASN'T YOU, someone may know your password:",
      "  1. Change your password immediately at mercyblade.com (after the lock lifts)",
      "  2. Review your active sessions",
      "  3. Contact admin@mercyblade.com if anything looks wrong",
      "",
      "— MercyBlade Security",
    ].join("\n"),
  };
}

async function sendViaResend(
  recipient: string,
  template: Template,
): Promise<{ ok: boolean; status: number; messageId?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, status: 500, error: "RESEND_API_KEY not configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [recipient],
      subject: template.subject,
      text: template.textBody,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: body.slice(0, 500) };
  }
  let messageId: string | undefined;
  try {
    const json = (await res.json()) as { id?: string };
    messageId = json?.id;
  } catch {
    /* ignore */
  }
  return { ok: true, status: res.status, messageId };
}

async function logAudit(params: {
  userId: string;
  email: string;
  kind: SecurityEmailKind;
  status: "ok" | "rate_limited" | "send_failed" | "unauthorized" | "invalid_kind";
  messageId?: string;
  errorMsg?: string;
}): Promise<void> {
  try {
    await supabase.from("email_audit").insert({
      user_id: params.userId,
      recipient_email: params.email,
      kind: "security",
      template_id: params.kind,
      status: params.status,
      provider_message_id: params.messageId ?? null,
      error_msg: params.errorMsg ?? null,
    });
  } catch (err) {
    // Audit failures must never block the email send — log and move on.
    console.error("email_audit insert failed", err);
  }
}

serve(
  wrapHandler("send-security-email", async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") {
      return jsonResponse({ error: "method_not_allowed" }, 405);
    }

    // 1. Identity from JWT — never from body.
    const user = await getUserFromAuthHeader(req);
    if (!user) {
      return jsonResponse({ error: "auth_required" }, 401);
    }
    const userId = user.id;
    const email = user.email ?? "";
    if (!email) {
      // No email on the account — can't send a security notification.
      // This is rare (phone-only signup) but possible. Best to log it.
      await logAudit({
        userId,
        email: "",
        kind: "security_2fa_enabled",
        status: "unauthorized",
        errorMsg: "no_email_on_account",
      });
      return jsonResponse({ error: "no_email_on_account" }, 400);
    }

    // 2. Per-user rate limit (10/hour). Re-using the existing
    // rate_limits table — same pattern as speech-analyze and the
    // azure-phoneme function.
    try {
      await rateLimit(`security_email:${userId}`, RATE_LIMIT_MAX_CALLS, RATE_LIMIT_WINDOW_MS);
    } catch (err) {
      if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
        await logAudit({
          userId,
          email,
          kind: "security_2fa_enabled",
          status: "rate_limited",
        });
        return jsonResponse(
          { error: "rate_limited", retry_after_seconds: 3600 },
          429,
        );
      }
      console.error("rate_limit subsystem error", err);
      // Fail-open on infra errors — better to send the security email
      // than to swallow it because the rate-limiter itself is broken.
    }

    // 3. Validate kind.
    let body: RequestBody;
    try {
      body = (await req.json()) as RequestBody;
    } catch {
      return jsonResponse({ error: "invalid_json" }, 400);
    }
    if (!isValidKind(body.kind)) {
      await logAudit({
        userId,
        email,
        kind: "security_2fa_enabled",
        status: "invalid_kind",
        errorMsg: `kind=${String(body.kind).slice(0, 50)}`,
      });
      return jsonResponse(
        { error: "invalid_kind", allowed: ["security_2fa_enabled", "security_2fa_disabled"] },
        400,
      );
    }
    const kind: SecurityEmailKind = body.kind;

    // 4. Send.
    const template = buildTemplate(kind);
    const result = await sendViaResend(email, template);
    if (!result.ok) {
      await logAudit({
        userId,
        email,
        kind,
        status: "send_failed",
        errorMsg: result.error?.slice(0, 200) ?? `http_${result.status}`,
      });
      return jsonResponse({ error: "send_failed" }, 502);
    }

    await logAudit({
      userId,
      email,
      kind,
      status: "ok",
      messageId: result.messageId,
    });

    return jsonResponse({ ok: true, kind });
  }),
);
