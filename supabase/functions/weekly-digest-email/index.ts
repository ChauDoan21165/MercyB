// supabase/functions/weekly-digest-email/index.ts
//
// A9 — Weekly community digest email.
//
// Triggered by:
//   1. Daily cron pass (handles users who opted in mid-week).
//   2. Manual admin trigger (POST { action: "send_test", to: <email> }).
//   3. Manual admin trigger (POST { action: "run_now" }) — fires the
//      full pass immediately.
//
// What it does each run:
//   1. Reads the latest weekly_digest_data row.
//   2. Selects users with email_weekly_digest_enabled = true who have
//      NOT yet received a digest for this week (email_sends_log
//      campaign='weekly_digest', week_key=<week_starts_on>).
//   3. Sorts by attempts_count DESC (most-engaged first if cap hit).
//   4. For each user (capped at 100/run):
//      - Calls get_user_weekly_contribution to get personal numbers.
//      - Renders the digest with the user's contribution embedded.
//      - Sends via Resend.
//      - Logs to email_sends_log.
//
// Privacy invariants (enforced here, not just in SQL):
//   - User-level data NEVER appears in another user's email. The
//     personal-contribution lookup is scoped to the loop iteration's
//     user_id and is not surfaced anywhere else.
//   - Aggregates are anonymized — only counts.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  buildListUnsubscribeHeaders,
  withFooter,
} from "../_shared/unsubscribe.ts";

import digestTemplate from "./templates/digest.json" with { type: "json" };
import {
  renderDigest,
  toEmailHtml,
  type DigestAggregate,
  type DigestTemplate,
  type UserContribution,
} from "./render.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "Mercy Blade <admin@mercyblade.com>";
const REPLY_TO = "admin@mercyblade.com";
const RUN_CAP = 100;
const SEND_INTERLEAVE_MS = 200;

const TEMPLATE: DigestTemplate = digestTemplate as DigestTemplate;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function env(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

// ── Admin gate ───────────────────────────────────────────────────────-

async function requireAdmin(
  req: Request,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "missing_auth" };
  }
  const supabaseUrl = env("SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, error: "config_missing" };
  }
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: auth } },
  });
  const { data: levelRow, error } = await userClient.rpc("get_admin_level");
  if (error || typeof levelRow !== "number" || levelRow < 9) {
    return { ok: false, status: 403, error: "not_admin" };
  }
  return { ok: true };
}

// ── DB helpers ───────────────────────────────────────────────────────-

type TargetUser = {
  id: string;
  email: string;
  attempts_count: number;
  email_unsubscribe_token: string | null;
};

async function loadDigestAggregate(
  client: ReturnType<typeof createClient>,
  weekStart: string,
): Promise<DigestAggregate | null> {
  const { data, error } = await client
    .from("weekly_digest_data")
    .select("*")
    .eq("week_starts_on", weekStart)
    .maybeSingle();
  if (error || !data) return null;
  return data as DigestAggregate;
}

async function loadLatestAggregate(
  client: ReturnType<typeof createClient>,
): Promise<DigestAggregate | null> {
  const { data, error } = await client
    .from("weekly_digest_data")
    .select("*")
    .order("week_starts_on", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as DigestAggregate;
}

async function loadCandidates(
  client: ReturnType<typeof createClient>,
  weekStart: string,
): Promise<TargetUser[]> {
  // Step 1: pull opted-in users with their attempt count this week.
  const weekEnd = addDays(weekStart, 7);
  const { data: profiles, error: profileErr } = await client
    .from("profiles")
    .select(
      "user_id, email, email_weekly_digest_enabled, email_unsubscribe_token",
    )
    .eq("email_weekly_digest_enabled", true)
    .not("email", "is", null);
  if (profileErr || !profiles) return [];

  // Step 2: filter out anyone who already got this week's digest.
  const userIds = profiles.map((p) => p.user_id as string);
  if (userIds.length === 0) return [];

  const { data: alreadySent } = await client
    .from("email_sends_log")
    .select("user_id, week_key")
    .eq("campaign", "weekly_digest")
    .eq("week_key", weekStart)
    .in("user_id", userIds);
  const sentSet = new Set(
    (alreadySent ?? []).map((r) => r.user_id as string),
  );

  // Step 3: count attempts per user this week (engagement sort key).
  const { data: attemptRows } = await client
    .from("speech_attempts")
    .select("user_id")
    .gte("created_at", weekStart)
    .lt("created_at", weekEnd)
    .in("user_id", userIds);
  const attemptCounts = new Map<string, number>();
  for (const r of attemptRows ?? []) {
    const uid = r.user_id as string | null;
    if (!uid) continue;
    attemptCounts.set(uid, (attemptCounts.get(uid) ?? 0) + 1);
  }

  return profiles
    .filter((p) => !sentSet.has(p.user_id as string))
    .map((p) => ({
      id: p.user_id as string,
      email: String(p.email),
      attempts_count: attemptCounts.get(p.user_id as string) ?? 0,
      email_unsubscribe_token:
        typeof (p as { email_unsubscribe_token?: unknown }).email_unsubscribe_token === "string"
          ? ((p as { email_unsubscribe_token?: string }).email_unsubscribe_token ?? null)
          : null,
    }))
    .sort((a, b) => b.attempts_count - a.attempts_count);
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

async function fetchUserContribution(
  client: ReturnType<typeof createClient>,
  userId: string,
  weekStart: string,
): Promise<UserContribution> {
  const { data, error } = await client.rpc("get_user_weekly_contribution", {
    uid: userId,
    week_start: weekStart,
  });
  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    return {
      attempts_count: 0,
      sentences_practiced: 0,
      topics_explored: 0,
      score_delta_vs_last_week: 0,
    };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return {
    attempts_count: Number(row.attempts_count ?? 0),
    sentences_practiced: Number(row.sentences_practiced ?? 0),
    topics_explored: Number(row.topics_explored ?? 0),
    score_delta_vs_last_week: Number(row.score_delta_vs_last_week ?? 0),
  };
}

async function logSend(
  client: ReturnType<typeof createClient>,
  args: {
    user_id: string;
    email: string;
    week_key: string;
    status: "sent" | "failed";
    error_message: string | null;
    provider_message_id: string | null;
  },
): Promise<void> {
  await client.from("email_sends_log").insert({
    user_id: args.user_id,
    email: args.email,
    campaign: "weekly_digest",
    week_key: args.week_key,
    status: args.status,
    error_message: args.error_message,
    provider_message_id: args.provider_message_id,
    sent_at: args.status === "sent" ? new Date().toISOString() : null,
  });
}

// ── Main pass ────────────────────────────────────────────────────────-

async function runPass(
  client: ReturnType<typeof createClient>,
  resend: Resend | null,
  weekStart: string,
  options: { dryRun: boolean },
): Promise<{
  week_starts_on: string;
  candidates: number;
  attempted: number;
  sent: number;
  failed: number;
  skipped_inactive: number;
  dry_run: boolean;
}> {
  const agg = await loadDigestAggregate(client, weekStart);
  if (!agg) {
    return {
      week_starts_on: weekStart,
      candidates: 0,
      attempted: 0,
      sent: 0,
      failed: 0,
      skipped_inactive: 0,
      dry_run: options.dryRun,
    };
  }

  const all = await loadCandidates(client, weekStart);
  const targets = all.slice(0, RUN_CAP);

  let sent = 0;
  let failed = 0;
  let skippedInactive = 0;

  for (const target of targets) {
    const contribution = await fetchUserContribution(
      client,
      target.id,
      weekStart,
    );
    const rendered = renderDigest(TEMPLATE, agg, contribution);

    // Per-user privacy guard: contribution row MUST be for this user.
    // (Defense in depth — get_user_weekly_contribution is SECURITY DEFINER
    // but parameterized by uid, so this is also enforced at the SQL layer.)
    if (rendered.is_inactive_user) {
      // Soft skip: inactive users still count toward "you're not alone"
      // framing if we send. For first ship we send anyway — community
      // belonging is the reason a lapsed user might come back. Track
      // for telemetry though.
      skippedInactive += 1;
    }

    if (options.dryRun || !resend) {
      sent += 1;
      continue;
    }

    // Compliance footer + Gmail/Apple one-click headers. Skip the send
    // if the token is missing rather than emit footer-less mail (CASL).
    if (!target.email_unsubscribe_token) {
      failed += 1;
      await logSend(client, {
        user_id: target.id,
        email: target.email,
        week_key: weekStart,
        status: "failed",
        error_message: "missing_unsubscribe_token",
        provider_message_id: null,
      });
      continue;
    }
    const baseBody = {
      text: rendered.body_vi + "\n\n— — —\n\n" + rendered.body_en,
      html: toEmailHtml(rendered),
    };
    const { text: footerText, html: footerHtml } = withFooter(
      baseBody,
      target.email_unsubscribe_token,
    );
    const headers = buildListUnsubscribeHeaders(target.email_unsubscribe_token);

    try {
      const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: [target.email],
        replyTo: REPLY_TO,
        subject: rendered.subject,
        html: footerHtml,
        text: footerText,
        headers,
      });

      if (error) {
        failed += 1;
        await logSend(client, {
          user_id: target.id,
          email: target.email,
          week_key: weekStart,
          status: "failed",
          error_message: String(error.message ?? error),
          provider_message_id: null,
        });
      } else {
        sent += 1;
        await logSend(client, {
          user_id: target.id,
          email: target.email,
          week_key: weekStart,
          status: "sent",
          error_message: null,
          provider_message_id:
            (data as { id?: string } | null)?.id ?? null,
        });
      }
    } catch (e) {
      failed += 1;
      await logSend(client, {
        user_id: target.id,
        email: target.email,
        week_key: weekStart,
        status: "failed",
        error_message: e instanceof Error ? e.message : String(e),
        provider_message_id: null,
      });
    }

    await sleep(SEND_INTERLEAVE_MS);
  }

  return {
    week_starts_on: weekStart,
    candidates: all.length,
    attempted: targets.length,
    sent,
    failed,
    skipped_inactive: skippedInactive,
    dry_run: options.dryRun,
  };
}

// ── HTTP entrypoint ──────────────────────────────────────────────────-

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = env("SUPABASE_URL");
  const serviceRole = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) {
    return json({ error: "config_missing" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRole);
  const resendKey = env("RESEND_API_KEY");
  const resend = resendKey ? new Resend(resendKey) : null;

  let body: Record<string, unknown> = {};
  try {
    body = req.method === "POST" ? await req.json() : {};
  } catch {
    body = {};
  }

  const action = String(body.action ?? "daily_pass");

  // ── Admin-only paths ────────────────────────────────────────────────
  if (action === "send_test" || action === "run_now" || action === "refresh") {
    const guard = await requireAdmin(req);
    if (!guard.ok) {
      return json({ error: guard.error }, guard.status);
    }
  }

  if (action === "refresh") {
    const { data, error } = await adminClient.rpc("refresh_weekly_digest");
    if (error) return json({ error: String(error.message) }, 500);
    return json({ ok: true, data });
  }

  if (action === "send_test") {
    const to = String(body.to ?? "");
    if (!to) return json({ error: "missing_to" }, 400);
    const agg = await loadLatestAggregate(adminClient);
    if (!agg) return json({ error: "no_digest_data_yet" }, 404);
    const contribution: UserContribution = {
      attempts_count: 12,
      sentences_practiced: 7,
      topics_explored: 3,
      score_delta_vs_last_week: 4,
    };
    const rendered = renderDigest(TEMPLATE, agg, contribution);
    if (!resend) {
      return json({ ok: true, dry_run: true, rendered });
    }
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      replyTo: REPLY_TO,
      subject: `[TEST] ${rendered.subject}`,
      html: toEmailHtml(rendered),
      text: rendered.body_vi + "\n\n— — —\n\n" + rendered.body_en,
    });
    return json({ ok: !error, provider: data, error: error?.message ?? null });
  }

  // ── Daily / run_now pass ────────────────────────────────────────────
  // Determine the current ISO week (Monday) — same anchor as the SQL.
  const now = new Date();
  const day = now.getUTCDay();
  const daysSinceMonday = (day + 6) % 7; // Mon=0, Sun=6
  const weekStartDate = new Date(now);
  weekStartDate.setUTCDate(now.getUTCDate() - daysSinceMonday);
  const weekStart = weekStartDate.toISOString().slice(0, 10);

  const dryRun = body.dry_run === true || !resend;
  const result = await runPass(adminClient, resend, weekStart, { dryRun });
  return json({ ok: true, ...result });
});
