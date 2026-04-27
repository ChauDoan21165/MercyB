// Step 9 (Monetization) — trial-expiry email funnel.
//
// Counter-side to the trial_extension_days column from PR #referral_grant.
// Runs daily (cron or admin-invoked) and processes a 3-stage email funnel:
//   D-3 — friendly reminder ("Mercy is excited to teach you")
//   D-1 — gentle urgency ("trial wraps in 24h")
//   D+1 — re-engagement ("here's what you missed")
//
// Two-pass within one invocation:
//   1. Queue pending rows in `email_sends_log` (skeleton behaviour preserved).
//   2. For each pending row from THIS run, call Resend, then flip the row to
//      `sent` / `failed` with `sent_at` and `error_message` set accordingly.
//
// Pacing: 200ms gap between sends — comfortably under Resend's paid 10 req/s
// rate limit and well under the 2 req/s free limit. We DO NOT promise
// transactional delivery; if the function process is killed mid-loop, the
// remaining rows stay `pending` and the next invocation picks them up
// (the `(user_id, campaign) WHERE status='pending'` unique index prevents
// duplicates if A6's insert had already produced a pending row).
//
// Sender: admin@mercyblade.com (verified domain, per project memory).
//
// Endpoint: POST /trial-expiry-emails
// Auth:     admin level >= 9 (mirrors email-reengagement)
// Response: { ok, scanned, buckets, queued, already_queued, skipped, sent,
//             failed, errors }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  TRIAL_STAGE_TO_CAMPAIGN,
  categorizeForTrialExpiry,
  type TrialUserRow,
} from "./categorizeForTrialExpiry.ts";

import dMinus3Template from "./templates/trial-d-3.json" with { type: "json" };
import dMinus1Template from "./templates/trial-d-1.json" with { type: "json" };
import dPlus1Template from "./templates/trial-plus-1.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "Mercy Blade <admin@mercyblade.com>";
const REPLY_TO = "admin@mercyblade.com";
// Pacing between Resend calls. Resend free tier is 2 req/s, paid is 10 req/s.
// 200ms (5 req/s) sits comfortably between them and avoids 429s.
const SEND_INTERLEAVE_MS = 200;

type TemplateShape = {
  campaign: string;
  stage: string;
  tone: string;
  subject_vi: string;
  subject_en: string;
  body_vi: string;
  body_en: string;
  notes: string;
};

const TEMPLATES: Record<string, TemplateShape> = {
  trial_expiry_d_minus_3: dMinus3Template as TemplateShape,
  trial_expiry_d_minus_1: dMinus1Template as TemplateShape,
  trial_expiry_d_plus_1: dPlus1Template as TemplateShape,
};

function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
}

function pickFirstName(user: TrialUserRow): string {
  const preferred = String((user as unknown as { preferred_name?: string }).preferred_name ?? "").trim();
  if (preferred) return preferred;
  const emailLocal = String(user.email ?? "").split("@")[0] ?? "";
  return emailLocal || "bạn";
}

function fillPlaceholders(text: string, firstName: string): string {
  return text.replaceAll("{{first_name}}", firstName);
}

/**
 * Bilingual subject — VI first, then a thin separator, then EN. Real-world
 * mail clients render the joined string; the divider keeps both halves
 * legible. Capped at 998 bytes per RFC 5322 (we're well under).
 */
function bilingualSubject(template: TemplateShape): string {
  return `${template.subject_vi} · ${template.subject_en}`;
}

/**
 * Bilingual body — VI first (primary surface for VN-diaspora users per
 * CLAUDE.md), then a divider, then EN. Returned in both `text` and `html`
 * forms so HTML and plain-text clients render cleanly.
 */
function bilingualBody(
  template: TemplateShape,
  firstName: string,
): { text: string; html: string } {
  const vi = fillPlaceholders(template.body_vi, firstName);
  const en = fillPlaceholders(template.body_en, firstName);
  const text = `${vi}\n\n— — —\n\n${en}`;

  const escape = (s: string) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  const toHtml = (s: string) =>
    escape(s)
      .split("\n\n")
      .map((para) =>
        `<p style="margin:0 0 16px;line-height:1.6;">${
          para.replaceAll("\n", "<br>")
        }</p>`
      )
      .join("");
  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;background:#fafafa;padding:24px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      ${toHtml(vi)}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      ${toHtml(en)}
    </div>
  </body></html>`;

  return { text, html };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth: admin level >= 9 ───────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return send({ ok: false, error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("[trial-expiry-emails] RESEND_API_KEY not configured");
      return send({ ok: false, error: "Email service not configured (set RESEND_API_KEY)" });
    }

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);

    if (userError || !userData?.user) {
      return send({ ok: false, error: "Invalid or expired session" });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: adminData, error: adminError } = await adminClient
      .from("admin_users")
      .select("level")
      .eq("user_id", userData.user.id)
      .single();

    if (adminError || !adminData || adminData.level < 9) {
      return send({ ok: false, error: "Insufficient permissions. Admin level 9+ required." });
    }

    // ── Scan profiles ────────────────────────────────────────────────────
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, email, preferred_name, created_at, is_premium, trial_extension_days");

    if (profilesError) {
      console.error("[trial-expiry-emails] profiles query failed:", profilesError);
      return send({ ok: false, error: "Failed to query profiles" });
    }

    const rows = (profiles ?? []) as TrialUserRow[];
    const now = new Date();
    const buckets = categorizeForTrialExpiry(rows, now);

    // ── Queue pending rows + capture inserted ids for the send pass ─────
    const queueable: { user: TrialUserRow; campaign: string }[] = [
      ...buckets.d_minus_3.map((u) => ({ user: u, campaign: TRIAL_STAGE_TO_CAMPAIGN.D_minus_3 })),
      ...buckets.d_minus_1.map((u) => ({ user: u, campaign: TRIAL_STAGE_TO_CAMPAIGN.D_minus_1 })),
      ...buckets.d_plus_1.map((u) => ({ user: u, campaign: TRIAL_STAGE_TO_CAMPAIGN.D_plus_1 })),
    ];

    type SendableRow = { id: string; user: TrialUserRow; campaign: string };
    const sendable: SendableRow[] = [];
    let queued = 0;
    let alreadyQueued = 0;

    for (const { user, campaign } of queueable) {
      const { data: inserted, error: insertError } = await adminClient
        .from("email_sends_log")
        .insert({
          user_id: user.id,
          email: user.email,
          campaign,
          campaign_type: "trial_expiry",
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          // Pending row already exists — pick it up so the send pass still
          // processes it. Without this, A6's earlier-run pending rows would
          // sit forever.
          const { data: existing } = await adminClient
            .from("email_sends_log")
            .select("id")
            .eq("user_id", user.id)
            .eq("campaign", campaign)
            .eq("status", "pending")
            .maybeSingle();
          if (existing?.id) sendable.push({ id: existing.id, user, campaign });
          alreadyQueued++;
          continue;
        }
        console.warn("[trial-expiry-emails] insert failed", {
          user_id: user.id,
          campaign,
          error: insertError,
        });
        continue;
      }
      if (inserted?.id) sendable.push({ id: inserted.id, user, campaign });
      queued++;
    }

    // ── Send pass ───────────────────────────────────────────────────────
    const resend = new Resend(resendApiKey);
    let sent = 0;
    let failed = 0;
    const errors: Array<{ user_id: string; campaign: string; error: string }> = [];

    for (let i = 0; i < sendable.length; i++) {
      const { id, user, campaign } = sendable[i];
      const template = TEMPLATES[campaign];
      if (!template) {
        const msg = `Unknown campaign template: ${campaign}`;
        await adminClient
          .from("email_sends_log")
          .update({ status: "failed", error_message: msg, sent_at: new Date().toISOString() })
          .eq("id", id);
        errors.push({ user_id: user.id, campaign, error: msg });
        failed++;
        continue;
      }

      const firstName = pickFirstName(user);
      const subject = bilingualSubject(template);
      const { text, html } = bilingualBody(template, firstName);

      try {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: FROM_ADDRESS,
          to: [user.email],
          reply_to: REPLY_TO,
          subject,
          text,
          html,
        });

        if (emailError) {
          const msg = String(emailError.message ?? emailError);
          console.warn("[trial-expiry-emails] resend send failed", {
            user_id: user.id,
            campaign,
            error: msg,
          });
          await adminClient
            .from("email_sends_log")
            .update({
              status: "failed",
              error_message: msg.slice(0, 500),
              sent_at: new Date().toISOString(),
            })
            .eq("id", id);
          errors.push({ user_id: user.id, campaign, error: msg });
          failed++;
        } else {
          await adminClient
            .from("email_sends_log")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
              error_message: null,
            })
            .eq("id", id);
          sent++;
          // Optional: log the provider message id for traceability. Cast
          // through unknown because email_sends_log doesn't have a column
          // for it yet — kept as a console line for now.
          console.log("[trial-expiry-emails] sent", {
            user_id: user.id,
            campaign,
            provider_message_id: (emailData as { id?: string } | null)?.id ?? null,
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[trial-expiry-emails] resend threw", {
          user_id: user.id,
          campaign,
          error: msg,
        });
        await adminClient
          .from("email_sends_log")
          .update({
            status: "failed",
            error_message: msg.slice(0, 500),
            sent_at: new Date().toISOString(),
          })
          .eq("id", id);
        errors.push({ user_id: user.id, campaign, error: msg });
        failed++;
      }

      // Pace the next send. Skip the wait on the last item.
      if (i < sendable.length - 1) {
        await sleep(SEND_INTERLEAVE_MS);
      }
    }

    return send({
      ok: true,
      scanned: rows.length,
      buckets: {
        d_minus_3: buckets.d_minus_3.length,
        d_minus_1: buckets.d_minus_1.length,
        d_plus_1: buckets.d_plus_1.length,
      },
      queued,
      already_queued: alreadyQueued,
      skipped: buckets.skipped.length,
      sent,
      failed,
      errors: errors.slice(0, 20),
    });
  } catch (err) {
    console.error("[trial-expiry-emails] unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
