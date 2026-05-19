/**
 * Weekly Progress Email — Edge Function
 *
 * Trigger: GitHub Actions cron, Monday 01:00 UTC (08:00 Vietnam).
 * Sends each active, unsubscribed user a bilingual weekly learning
 * summary: streak + lessons completed + encouragement + CTA.
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

/** Monday of the *previous* week. The cron fires Monday 01:00 UTC to
 *  summarize the week that just ended (Mon–Sun). */
function mondayOfPreviousWeekUTC(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon...
  // Monday of *current* week:
  const diff = day === 0 ? -6 : -(day - 1);
  const mon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
  // Go back 7 more days for the previous Monday:
  mon.setUTCDate(mon.getUTCDate() - 7);
  return `${mon.getUTCFullYear()}-${String(mon.getUTCMonth() + 1).padStart(2, "0")}-${String(mon.getUTCDate()).padStart(2, "0")}`;
}

// ── Encouragement line (VI-first, bilingual) ─────────────────────────

function encouragement(streak: number): string {
  if (streak > 7) {
    return "🔹 Ấn tượng! Bạn đang học rất đều đặn. / Impressive! You're learning very consistently.";
  }
  if (streak === 0) {
    return "🔹 Tuần này bực bội nhỉ? Bắt đầu lại hôm nay được ngay! / Rough week? You can restart today!";
  }
  if (streak > 0) {
    return "🔹 Tiếp tục phát huy nhé! / Keep it up!";
  }
  return "🔹 Mỗi ngày một chút — bạn sẽ bất ngờ với tiến bộ của mình. / A little each day — you'll be surprised by your progress.";
}

// ── Email HTML ────────────────────────────────────────────────────────

function buildHtml(params: {
  email: string;
  streak: number;
  lessonsCompleted: number;
  siteUrl: string;
}): string {
  const { email, streak, lessonsCompleted, siteUrl } = params;

  const lessonsLine =
    lessonsCompleted > 0
      ? `<p style="font-size:16px;margin:8px 0;color:rgba(0,0,0,0.70);">
           📖 Số bài học tuần này: <b>${lessonsCompleted}</b> / Lessons completed this week: <b>${lessonsCompleted}</b>
         </p>`
      : "";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>MercyBlade Weekly Progress</title>
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
          📚 Tuần này bạn học được gì?
        </h2>
        <p style="font-size:14px;font-weight:500;margin:0 0 20px;color:rgba(0,0,0,0.48);">
          Your weekly MercyBlade progress
        </p>

        <p style="font-size:16px;margin:8px 0;color:rgba(0,0,0,0.70);">
          🔥 Streak hiện tại: <b>${streak}</b> ngày / Current streak: <b>${streak}</b> days
        </p>

        ${lessonsLine}

        <p style="font-size:15px;margin:16px 0 20px;color:rgba(0,0,0,0.65);line-height:1.6;">
          ${encouragement(streak)}
        </p>

        <!-- CTA -->
        <div style="text-align:center;margin:24px 0;">
          <a href="${siteUrl}" style="display:inline-block;padding:14px 36px;background:#0f172a;color:#ffffff;border-radius:9999px;font-size:15px;font-weight:700;text-decoration:none;">
            Học ngay · Study now
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
    // Auth — CRON_SECRET is required on every request. The Supabase
    // gateway handles the Authorization header (JWT / anon key); we
    // read our own secret from x-cron-secret so the two don't collide.
    const cronSecret = Deno.env.get("CRON_SECRET");
    if (!cronSecret) {
      console.error("[weekly-progress-email] CRON_SECRET not set — refusing all requests");
      return send({ ok: false, error: "CRON_SECRET not configured" });
    }
    if (req.headers.get("x-cron-secret") !== cronSecret) {
      console.warn("[weekly-progress-email] Invalid or missing x-cron-secret header");
      return send({ ok: false, error: "Unauthorized" });
    }

    // Test hook: a caller already past the CRON_SECRET gate above may
    // pass {"testUserId":"<uuid>"} to send exactly one real email to
    // that user, bypassing the active-subscription gate and the
    // per-category opt-out for a deterministic end-to-end check. The
    // global unsubscribe flag and the unsubscribe-token requirement are
    // STILL enforced. The weekly cron sends no body, so req.json()
    // throws and we fall through to the normal cohort path.
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

    const weekStart = mondayOfPreviousWeekUTC();

    // 1. Get active users who haven't unsubscribed.
    // We fetch from auth.users (source of truth for email) joined via
    // profiles for streak data and filtered by active subscriptions.

    // Step A: Get user IDs with active subscriptions (or, in test mode,
    // target exactly the one requested user so the end-to-end check is
    // deterministic even for a free-tier account with no subscription).
    let activeUserIds: string[];
    if (testUserId) {
      activeUserIds = [testUserId];
    } else {
      const { data: subs, error: subsErr } = await adminClient
        .from("user_subscriptions")
        .select("user_id")
        .eq("status", "active");

      if (subsErr) {
        console.error("[weekly-progress-email] subs query error:", subsErr);
        return send({ ok: false, error: "Failed to query subscriptions" });
      }

      activeUserIds = [...new Set((subs ?? []).map((s) => s.user_id))];
      if (activeUserIds.length === 0) {
        return send({ ok: true, sent: 0, skipped: 0, note: "No active subscribers" });
      }
    }

    // Step B: Get profiles (streak + opt-out + token) for active users
    const { data: profiles, error: profErr } = await adminClient
      .from("profiles")
      .select(
        "id, streak_current, email_unsubscribed_at, email_weekly_progress_enabled, email_unsubscribe_token",
      )
      .in("id", activeUserIds);

    if (profErr) {
      console.error("[weekly-progress-email] profiles query error:", profErr);
      return send({ ok: false, error: "Failed to query profiles" });
    }

    // Step C: Get auth.users emails for these profiles
    const { data: authUsers, error: authErr } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 10000,
    });

    // Build a lookup map: profile.id → email
    const emailMap = new Map<string, string>();
    if (!authErr && authUsers?.users) {
      for (const u of authUsers.users) {
        if (u.email) emailMap.set(u.id, u.email!);
      }
    }

    // Step D: Get lesson counts for current week
    const { data: leaderboard, error: lbErr } = await adminClient
      .from("leaderboard_weekly")
      .select("user_id, lessons_completed")
      .eq("week_start", weekStart);

    const lessonMap = new Map<string, number>();
    if (!lbErr && leaderboard) {
      for (const row of leaderboard) {
        lessonMap.set(row.user_id, Number(row.lessons_completed ?? 0));
      }
    }

    // 2. Filter and send
    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const prof of profiles ?? []) {
      const userId = prof.id;

      // Global unsubscribe is always honored. The per-category opt-out
      // is bypassed only for an explicit single-user test send (already
      // past the CRON_SECRET gate) so the end-to-end check stays
      // deterministic regardless of the test account's preferences.
      if (
        prof.email_unsubscribed_at ||
        (!testUserId && prof.email_weekly_progress_enabled === false)
      ) {
        skipped++;
        continue;
      }

      // Real, non-rotating per-user token (PR #190). No token → no
      // working one-click unsubscribe → don't send (CASL / RFC 8058).
      const unsubToken =
        typeof prof.email_unsubscribe_token === "string"
          ? prof.email_unsubscribe_token
          : null;
      if (!unsubToken) {
        skipped++;
        continue;
      }

      // Get email from auth.users (source of truth)
      const email = emailMap.get(userId);
      if (!email) {
        skipped++;
        continue;
      }

      const streak = Number(prof.streak_current ?? 0);
      const lessonsCompleted = lessonMap.get(userId) ?? 0;

      const baseHtml = buildHtml({
        email,
        streak,
        lessonsCompleted,
        siteUrl: EMAIL_CONFIG.siteUrl,
      });
      const footer = buildFooter(unsubToken);
      const html = baseHtml.replace("</body>", `${footer.html}</body>`);

      const subject =
        "📚 Tuần này bạn học được gì? / Your weekly MercyBlade progress";

      try {
        const { error: sendErr } = await resend.emails.send({
          from: EMAIL_CONFIG.from,
          to: [email],
          subject,
          html,
          headers: buildListUnsubscribeHeaders(unsubToken),
        });

        if (sendErr) {
          console.error(`[weekly-progress-email] Resend error for ${email}:`, sendErr);
          errors.push(`${email}: ${sendErr.message}`);
        } else {
          sent++;
        }
      } catch (e: any) {
        console.error(`[weekly-progress-email] Exception for ${email}:`, e?.message ?? e);
        errors.push(`${email}: ${e?.message ?? "unknown"}`);
      }
    }

    console.log(
      `[weekly-progress-email] Done. sent=${sent} skipped=${skipped} errors=${errors.length}`,
    );

    return send({
      ok: true,
      week_start: weekStart,
      total_active: activeUserIds.length,
      test_mode: testUserId != null,
      sent,
      skipped,
      errors: errors.slice(0, 10), // cap at 10 to avoid huge responses
    });
  } catch (err) {
    console.error("[weekly-progress-email] Unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
