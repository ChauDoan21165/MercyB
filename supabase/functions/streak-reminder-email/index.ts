/**
 * Streak Reminder Email — Edge Function
 *
 * Trigger: GitHub Actions cron, daily 12:00 UTC (19:00 Vietnam).
 * Sends a reminder to users who haven't studied today but have an
 * active streak worth protecting.
 *
 * Always returns HTTP 200 with { ok: boolean, ... }.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

import {
  buildFooter,
  buildListUnsubscribeHeaders,
} from "../_shared/unsubscribe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const EMAIL_CONFIG = {
  from: "MercyBlade <noreply@mercyblade.com>",
  siteUrl: "https://mercyblade.com",
};

function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
}

// ── Date helpers ──────────────────────────────────────────────────────

/** Yesterday's date in UTC (YYYY-MM-DD). Used to check if the user
 *  last studied exactly yesterday — meaning they haven't studied today. */
function yesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// ── Email HTML ────────────────────────────────────────────────────────

function buildHtml(params: {
  streak: number;
  siteUrl: string;
}): string {
  const { streak, siteUrl } = params;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>MercyBlade Streak Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f9f6f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;margin:40px auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.04);">
    <!-- Header -->
    <tr>
      <td style="padding:32px 32px 0 32px;text-align:center;">
        <img src="${siteUrl}/brand/mercy_wordmark.png" alt="MercyBlade" style="height:36px;width:auto;display:block;margin:0 auto 24px;">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;color:rgba(10,10,10,0.92);">
          🔥 Streak của bạn đang chờ!
        </h2>
        <p style="font-size:14px;font-weight:500;margin:0 0 20px;color:rgba(0,0,0,0.48);">
          Your streak is waiting!
        </p>

        <p style="font-size:16px;margin:8px 0;color:rgba(0,0,0,0.70);">
          Hôm nay bạn chưa học. Chỉ cần <b>5 phút</b> để giữ streak <b>${streak}</b> ngày của bạn!
        </p>
        <p style="font-size:14px;margin:8px 0 20px;color:rgba(0,0,0,0.50);line-height:1.6;">
          You haven&rsquo;t studied today. Just <b>5 minutes</b> to keep your <b>${streak}</b>-day streak!
        </p>

        <!-- CTA -->
        <div style="text-align:center;margin:24px 0;">
          <a href="${siteUrl}" style="display:inline-block;padding:14px 36px;background:#0f172a;color:#ffffff;border-radius:9999px;font-size:15px;font-weight:700;text-decoration:none;">
            Học ngay &middot; Study now
          </a>
        </div>
      </td>
    </tr>

    <!-- Compliant unsubscribe footer is spliced in at send time via
         buildFooter(token) — see the send loop. -->
  </table>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth — CRON_SECRET is required on every request.
    const cronSecret = Deno.env.get("CRON_SECRET");
    if (!cronSecret) {
      console.error("[streak-reminder-email] CRON_SECRET not set — refusing all requests");
      return send({ ok: false, error: "CRON_SECRET not configured" });
    }
    if (req.headers.get("x-cron-secret") !== cronSecret) {
      console.warn("[streak-reminder-email] Invalid or missing x-cron-secret header");
      return send({ ok: false, error: "Unauthorized" });
    }

    // Test hook: a caller already past the CRON_SECRET gate above may
    // pass {"testUserId":"<uuid>"} to send exactly one real email to
    // that user, bypassing the cohort-eligibility filters (last-studied
    // date / streak >= 1 / per-category flag) for a deterministic
    // end-to-end check. The global unsubscribe filter and the
    // unsubscribe-token requirement are STILL enforced — a self-test
    // never bypasses a hard opt-out. The daily cron sends no body, so
    // req.json() throws and we fall through to the normal cohort path.
    let testUserId: string | null = null;
    try {
      const body = (await req.json()) as { testUserId?: unknown };
      if (body && typeof body.testUserId === "string" && body.testUserId) {
        testUserId = body.testUserId;
      }
    } catch {
      // No / empty / non-JSON body — normal cron path.
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return send({ ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
    }
    if (!resendApiKey) {
      return send({ ok: false, error: "Missing RESEND_API_KEY" });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    const resend = new Resend(resendApiKey);

    const yesterday = yesterdayUTC();

    // 1. Find users who haven't studied today but have an active streak.
    //    Query profiles where:
    //    - streak_last_studied_date = yesterday (meaning they last studied
    //      yesterday — NOT today, so they missed today)
    //    - streak_current >= 1 (has a streak worth protecting)
    //    - email_unsubscribed_at IS NULL (not globally opted out)
    //    - email_streak_reminder_enabled = true (per-category opt-in)
    let profilesQuery = adminClient
      .from("profiles")
      .select(
        "id, streak_current, email_unsubscribed_at, email_streak_reminder_enabled, email_unsubscribe_token",
      )
      // Global opt-out is sacred — enforced in BOTH the cron and the
      // single-user test path.
      .is("email_unsubscribed_at", null);

    if (testUserId) {
      profilesQuery = profilesQuery.eq("id", testUserId);
    } else {
      profilesQuery = profilesQuery
        .eq("streak_last_studied_date", yesterday)
        .gte("streak_current", 1)
        .eq("email_streak_reminder_enabled", true);
    }

    const { data: profiles, error: profErr } = await profilesQuery;

    if (profErr) {
      console.error("[streak-reminder-email] profiles query error:", profErr);
      return send({ ok: false, error: "Failed to query profiles" });
    }

    if (!profiles || profiles.length === 0) {
      return send({
        ok: true,
        sent: 0,
        total_eligible: 0,
        test_mode: testUserId != null,
        note: testUserId
          ? `Test user ${testUserId} not found, globally unsubscribed, or missing`
          : `No users with streak >= 1 who last studied on ${yesterday}`,
      });
    }

    // 2. Get auth.users emails
    const { data: authUsers, error: authErr } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 10000,
    });

    const emailMap = new Map<string, string>();
    if (!authErr && authUsers?.users) {
      for (const u of authUsers.users) {
        if (u.email) emailMap.set(u.id, u.email!);
      }
    }

    // 3. Send individual emails (fire-and-forget)
    let sent = 0;
    const errors: string[] = [];

    for (const prof of profiles) {
      const email = emailMap.get(prof.id);
      if (!email) {
        errors.push(`${prof.id}: no email in auth.users`);
        continue;
      }

      // Real, non-rotating per-user token (profiles.email_unsubscribe_token,
      // PR #190). Required for a working one-click unsubscribe — skip the
      // send entirely if it's missing rather than ship an email with a
      // dead unsubscribe link (CASL / RFC 8058).
      const unsubToken =
        typeof prof.email_unsubscribe_token === "string"
          ? prof.email_unsubscribe_token
          : null;
      if (!unsubToken) {
        errors.push(`${prof.id}: missing email_unsubscribe_token`);
        continue;
      }

      const streak = Number(prof.streak_current ?? 0);

      const baseHtml = buildHtml({
        streak,
        siteUrl: EMAIL_CONFIG.siteUrl,
      });
      const footer = buildFooter(unsubToken);
      const html = baseHtml.replace("</body>", `${footer.html}</body>`);

      const subject =
        "🔥 Đừng để streak bị mất! / Don\u2019t lose your streak!";

      try {
        const { error: sendErr } = await resend.emails.send({
          from: EMAIL_CONFIG.from,
          to: [email],
          subject,
          html,
          headers: buildListUnsubscribeHeaders(unsubToken),
        });

        if (sendErr) {
          console.error(
            `[streak-reminder-email] Resend error for ${email}:`,
            sendErr,
          );
          errors.push(`${email}: ${sendErr.message}`);
        } else {
          sent++;
        }
      } catch (e: any) {
        console.error(
          `[streak-reminder-email] Exception for ${email}:`,
          e?.message ?? e,
        );
        errors.push(`${email}: ${e?.message ?? "unknown"}`);
      }
    }

    console.log(
      `[streak-reminder-email] Done. sent=${sent} errors=${errors.length}`,
    );

    return send({
      ok: true,
      sent,
      total_eligible: profiles.length,
      test_mode: testUserId != null,
      yesterday,
      errors: errors.slice(0, 10),
    });
  } catch (err) {
    console.error("[streak-reminder-email] Unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
