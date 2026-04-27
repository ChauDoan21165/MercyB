// teacher-notifications — three-action transactional email function
// for the teacher review portal (A11).
//
// Actions:
//   1. feedback_submitted — A teacher just submitted a review. Notify
//      every admin (level >= 9). Subject:
//      "Có phản hồi mới từ giáo viên: <content_type> <content_id>"
//   2. revision_requested — An admin requested the teacher to revise.
//      Notify the original reviewer.
//   3. content_updated — Admin marked correction_applied. Thank the
//      teacher for the review.
//
// Vietnamese-primary copy per CLAUDE.md non-negotiable #1. From
// `Mercy Blade <admin@mercyblade.com>` (verified Resend domain).
//
// All three actions auth-gate: the caller must be authenticated AND
// be admin level >= 5 (so a teacher can fire feedback_submitted from
// the review form, and an admin can fire the other two from triage).
//
// If RESEND_API_KEY is missing, the function still returns ok:true
// with skeleton_mode:true — same pattern story-prompt-email uses.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "Mercy Blade <admin@mercyblade.com>";
const REPLY_TO = "admin@mercyblade.com";

type Action = "feedback_submitted" | "revision_requested" | "content_updated";

interface Payload {
  action: Action;
  content_id: string;
  content_type: string;
  reviewer_id?: string;
  severity?: string;
  decision?: string;
}

function send(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function wrapHtml(plainText: string): string {
  const html = escapeHtml(plainText)
    .split("\n\n")
    .map((p) => `<p style="margin:0 0 16px;">${p.replaceAll("\n", "<br>")}</p>`)
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;background:#fafafa;padding:24px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);line-height:1.6;">
      ${html}
    </div>
  </body></html>`;
}

function buildSubjectFeedbackSubmitted(payload: Payload): string {
  return `Có phản hồi mới từ giáo viên: ${payload.content_type} ${payload.content_id}`;
}

function buildBodyFeedbackSubmitted(payload: Payload): string {
  return `Chào quản trị viên,

Một giáo viên vừa gửi phản hồi cho nội dung sau:

  • Loại nội dung: ${payload.content_type}
  • Mã nội dung: ${payload.content_id}
  • Mức độ: ${payload.severity ?? "không rõ"}
  • Quyết định: ${payload.decision ?? "không rõ"}

Vui lòng xem chi tiết tại trang triage:
https://mercyblade.com/admin/teacher-feedback

— Đội ngũ MercyBlade
admin@mercyblade.com`;
}

function buildSubjectRevisionRequested(payload: Payload): string {
  return `Yêu cầu chỉnh sửa lại đánh giá: ${payload.content_type} ${payload.content_id}`;
}

function buildBodyRevisionRequested(payload: Payload): string {
  return `Chào giáo viên,

Quản trị viên đã đề nghị bạn xem lại đánh giá trên nội dung:

  • Loại nội dung: ${payload.content_type}
  • Mã nội dung: ${payload.content_id}

Vui lòng vào cổng giáo viên để cập nhật:
https://mercyblade.com/teacher

Cảm ơn bạn đã đồng hành.

— Đội ngũ MercyBlade
admin@mercyblade.com`;
}

function buildSubjectContentUpdated(payload: Payload): string {
  return `Đánh giá của bạn đã được áp dụng: ${payload.content_type} ${payload.content_id}`;
}

function buildBodyContentUpdated(payload: Payload): string {
  return `Chào giáo viên,

Đánh giá bạn gửi cho nội dung sau đã được quản trị viên áp dụng:

  • Loại nội dung: ${payload.content_type}
  • Mã nội dung: ${payload.content_id}

Cảm ơn bạn đã giúp MercyBlade trở nên chính xác hơn cho người Việt.

— Đội ngũ MercyBlade
admin@mercyblade.com`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return send({ ok: false, error: "Missing Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? null;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return send({ ok: false, error: "Invalid session" });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Caller must be admin level >= 5 (teacher reviewer or higher).
    const { data: callerLevel } = await adminClient
      .from("admin_users")
      .select("level")
      .eq("user_id", userData.user.id)
      .maybeSingle<{ level: number | null }>();
    if (!callerLevel || (callerLevel.level ?? 0) < 5) {
      return send({ ok: false, error: "Admin level 5+ required" });
    }

    const payload = (await req.json()) as Payload;
    if (!payload?.action || !payload?.content_id || !payload?.content_type) {
      return send({ ok: false, error: "action, content_id, and content_type are required" });
    }

    let recipients: Array<{ email: string; user_id: string | null }> = [];
    let subject = "";
    let body = "";

    switch (payload.action) {
      case "feedback_submitted": {
        // All admins (level >= 9).
        const { data: admins, error: adminsError } = await adminClient
          .from("admin_users")
          .select("user_id, email, level")
          .gte("level", 9);
        if (adminsError) {
          return send({ ok: false, error: `admin lookup: ${adminsError.message}` });
        }
        recipients = (admins ?? [])
          .filter((a: { email: string | null }) => Boolean(a.email))
          .map((a: { user_id: string; email: string }) => ({
            email: a.email,
            user_id: a.user_id,
          }));
        subject = buildSubjectFeedbackSubmitted(payload);
        body = buildBodyFeedbackSubmitted(payload);
        break;
      }
      case "revision_requested": {
        if (!payload.reviewer_id) {
          return send({ ok: false, error: "reviewer_id required for revision_requested" });
        }
        const { data: reviewer } = await adminClient
          .from("profiles")
          .select("id, email")
          .eq("id", payload.reviewer_id)
          .maybeSingle<{ id: string; email: string | null }>();
        if (reviewer?.email) {
          recipients = [{ email: reviewer.email, user_id: reviewer.id }];
        }
        subject = buildSubjectRevisionRequested(payload);
        body = buildBodyRevisionRequested(payload);
        break;
      }
      case "content_updated": {
        if (!payload.reviewer_id) {
          return send({ ok: false, error: "reviewer_id required for content_updated" });
        }
        const { data: reviewer } = await adminClient
          .from("profiles")
          .select("id, email")
          .eq("id", payload.reviewer_id)
          .maybeSingle<{ id: string; email: string | null }>();
        if (reviewer?.email) {
          recipients = [{ email: reviewer.email, user_id: reviewer.id }];
        }
        subject = buildSubjectContentUpdated(payload);
        body = buildBodyContentUpdated(payload);
        break;
      }
      default:
        return send({ ok: false, error: `Unknown action: ${(payload as Payload).action}` });
    }

    if (recipients.length === 0) {
      return send({
        ok: true,
        action: payload.action,
        sent: 0,
        skipped: "no recipients",
      });
    }

    if (!resendApiKey) {
      return send({
        ok: true,
        action: payload.action,
        sent: 0,
        recipients_count: recipients.length,
        skeleton_mode: true,
      });
    }

    const resend = new Resend(resendApiKey);
    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    const html = wrapHtml(body);

    for (const r of recipients) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: FROM_ADDRESS,
          to: [r.email],
          reply_to: REPLY_TO,
          subject,
          text: body,
          html,
        });
        if (emailError) {
          failed++;
          errors.push({ email: r.email, error: String(emailError.message ?? emailError) });
          continue;
        }
        sent++;
      } catch (err) {
        failed++;
        errors.push({ email: r.email, error: err instanceof Error ? err.message : String(err) });
      }
    }

    return send({
      ok: true,
      action: payload.action,
      sent,
      failed,
      recipients_count: recipients.length,
      errors: errors.slice(0, 20),
    });
  } catch (err) {
    console.error("[teacher-notifications] error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal error",
    });
  }
});
