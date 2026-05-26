// supabase/functions/referral-recognition-email/index.ts
//
// Sends a Vietnamese-only "you're in the top 10 referrers this month"
// recognition email to users on the public monthly referral leaderboard.
//
// Cap: at most one email per user per calendar month, tracked via
// referral_leaderboard_optin.last_recognition_email_month ('YYYY-MM').
//
// Sender: admin@mercyblade.com (verified Resend domain).
// Auth:   x-admin-cron-secret header (matches admin-daily-digest pattern).
//
// Body template lives in ./templates/top10.json so copy edits don't
// require touching this file.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

import top10Template from "./templates/top10.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-cron-secret",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "MercyBlade <admin@mercyblade.com>";
const REPLY_TO = "admin@mercyblade.com";
const SEND_INTERLEAVE_MS = 200;

type TemplateShape = {
  campaign: string;
  subject: string;
  body: string;
};

const TEMPLATE = top10Template as TemplateShape;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fillPlaceholders(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

/** Current month bucket as 'YYYY-MM' (UTC). */
export function currentMonthBucket(ref: Date = new Date()): string {
  const y = ref.getUTCFullYear();
  const m = ref.getUTCMonth() + 1;
  return `${y}-${m < 10 ? "0" : ""}${m}`;
}

/** YYYY-MM-DD for the first day of the current month (UTC). */
function currentMonthStartIso(ref: Date = new Date()): string {
  const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1));
  return d.toISOString().slice(0, 10);
}

type LeaderboardRow = {
  user_id: string;
  display_name: string;
  successful_conversions: number;
  total_referrals_this_month: number;
};

type OptinRow = {
  user_id: string;
  last_recognition_email_month: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1) Auth (cron secret)
    const expected = Deno.env.get("ADMIN_CRON_SECRET") ?? "";
    const got = req.headers.get("x-admin-cron-secret") ?? "";
    if (!expected || got !== expected) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    let body: { dryRun?: boolean } = {};
    try {
      const txt = await req.text();
      body = txt ? JSON.parse(txt) : {};
    } catch { /* ignore — empty body OK */ }
    const dryRun = body.dryRun === true;

    // 2) Supabase service client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !serviceKey) {
      return json(
        { ok: false, error: "missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY" },
        500,
      );
    }
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const monthBucket = currentMonthBucket();
    const monthStart = currentMonthStartIso();

    // 3) Top 10 of the current month
    const { data: lbRows, error: lbErr } = await supabase
      .from("monthly_referral_leaderboard")
      .select(
        "user_id, display_name, successful_conversions, total_referrals_this_month",
      )
      .eq("month_starts_on", monthStart)
      .order("successful_conversions", { ascending: false })
      .order("total_referrals_this_month", { ascending: false })
      .limit(10);

    if (lbErr) return json({ ok: false, error: lbErr.message }, 500);
    const top10: LeaderboardRow[] = (lbRows ?? []) as LeaderboardRow[];

    if (top10.length === 0) {
      return json({ ok: true, sent: 0, skipped: 0, reason: "empty_board" });
    }

    // 4) Pull last_recognition_email_month + email per top-10 user
    const userIds = top10.map((r) => r.user_id);

    const { data: optinRows, error: optinErr } = await supabase
      .from("referral_leaderboard_optin")
      .select("user_id, last_recognition_email_month")
      .in("user_id", userIds);

    if (optinErr) return json({ ok: false, error: optinErr.message }, 500);

    const optinByUser = new Map<string, OptinRow>();
    for (const row of (optinRows ?? []) as OptinRow[]) {
      optinByUser.set(row.user_id, row);
    }

    const { data: profileRows, error: profileErr } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds);

    if (profileErr) return json({ ok: false, error: profileErr.message }, 500);

    const emailByUser = new Map<string, string | null>();
    for (const p of (profileRows ?? []) as ProfileRow[]) {
      emailByUser.set(p.id, p.email);
    }

    // 5) Send loop — skip anyone whose last_recognition_email_month
    //    matches the current bucket (already received this month).
    const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
    const resend = resendKey ? new Resend(resendKey) : null;

    let sent = 0;
    let skipped = 0;
    const failures: Array<{ user_id: string; error: string }> = [];

    for (let i = 0; i < top10.length; i++) {
      const row = top10[i]!;
      const rank = i + 1;
      const optin = optinByUser.get(row.user_id);
      if (optin?.last_recognition_email_month === monthBucket) {
        skipped++;
        continue;
      }

      const email = emailByUser.get(row.user_id);
      if (!email) {
        skipped++;
        continue;
      }

      const subject = fillPlaceholders(TEMPLATE.subject, {
        rank: String(rank),
        display_name: row.display_name,
      });
      const text = fillPlaceholders(TEMPLATE.body, {
        rank: String(rank),
        display_name: row.display_name,
      });

      if (dryRun || !resend) {
        // Counts but doesn't update the column — caller can re-run for
        // real after verifying the dry-run output.
        sent++;
        continue;
      }

      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: email,
          subject,
          text,
          replyTo: REPLY_TO,
        });

        // Mark this user as having been emailed this month.
        const { error: updErr } = await supabase
          .from("referral_leaderboard_optin")
          .update({
            last_recognition_email_month: monthBucket,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", row.user_id);

        if (updErr) {
          failures.push({ user_id: row.user_id, error: updErr.message });
        } else {
          sent++;
        }
      } catch (e) {
        failures.push({
          user_id: row.user_id,
          error: e instanceof Error ? e.message : String(e),
        });
      }

      // Pace the loop so Resend's per-second cap is comfortable.
      if (i < top10.length - 1) await sleep(SEND_INTERLEAVE_MS);
    }

    return json({
      ok: true,
      month: monthBucket,
      total_top10: top10.length,
      sent,
      skipped,
      failures,
      dryRun,
    });
  } catch (e) {
    return json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      500,
    );
  }
});
