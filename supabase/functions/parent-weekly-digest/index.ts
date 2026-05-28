// supabase/functions/parent-weekly-digest/index.ts
//
// L6 — Parent / Family layer. Weekly parent digest email (Q8=A opt-in).
//
// Mirrors supabase/functions/weekly-digest-email structure (admin gate,
// Resend send, unsubscribe footer/headers, per-week dedupe via
// email_sends_log) but for the parent persona:
//
//   • Audience: profiles with email_parent_digest_enabled = true (OPT-IN,
//     default false — Q8=A). One-click unsubscribe flips this off.
//   • Signal: server-available per-account placement writeback only
//     (placement_cefr + placement_weaknesses). The richer device-local
//     weakness map is NOT server-synced yet (doc § Data flow — that sync
//     is future work), so the digest reports descriptively (Q9=A) on what
//     the server already holds. No "Mercy helped" attribution.
//   • Voice: Mercy (Q10=C) — the digest is the one warm surface.
//   • Privacy: a parent's email contains ONLY that account's own learner
//     data. No cross-account aggregation.
//
// Triggered by:
//   1. Weekly cron (migration 20260528120000 → action "daily_pass").
//   2. Admin POST { action: "send_test", to } / { action: "run_now" }.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  buildListUnsubscribeHeaders,
  withFooter,
} from "../_shared/unsubscribe.ts";

import digestTemplate from "./templates/digest.json" with { type: "json" };
import {
  renderParentDigest,
  toEmailHtml,
  type ParentDigestData,
  type ParentDigestTemplate,
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
const CAMPAIGN = "parent_weekly_digest";

const FALLBACK_NAME_VI = "Con bạn";
const FALLBACK_NAME_EN = "your learner";

const TEMPLATE: ParentDigestTemplate = digestTemplate as ParentDigestTemplate;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function env(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

// ── Admin gate (shared shape with weekly-digest-email) ───────────────────

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

// ── Candidate loading ────────────────────────────────────────────────────

type TargetParent = {
  id: string;
  email: string;
  email_unsubscribe_token: string | null;
  data: ParentDigestData;
};

function toDigestData(row: Record<string, unknown>): ParentDigestData {
  const cefrRaw = row.placement_cefr;
  const cefr =
    typeof cefrRaw === "string" && cefrRaw.trim() ? cefrRaw.trim() : null;
  const weaknesses = Array.isArray(row.placement_weaknesses)
    ? row.placement_weaknesses
    : [];
  return {
    learner_name_vi: FALLBACK_NAME_VI,
    learner_name_en: FALLBACK_NAME_EN,
    cefr,
    weakness_count: weaknesses.length,
  };
}

async function loadCandidates(
  client: ReturnType<typeof createClient>,
  weekStart: string,
): Promise<TargetParent[]> {
  const { data: profiles, error } = await client
    .from("profiles")
    .select(
      "user_id, email, email_unsubscribe_token, placement_cefr, placement_weaknesses",
    )
    .eq("email_parent_digest_enabled", true)
    .not("email", "is", null);
  if (error || !profiles) return [];

  const userIds = profiles.map((p) => p.user_id as string);
  if (userIds.length === 0) return [];

  // Skip anyone who already received this week's parent digest.
  const { data: alreadySent } = await client
    .from("email_sends_log")
    .select("user_id, week_key")
    .eq("campaign", CAMPAIGN)
    .eq("week_key", weekStart)
    .in("user_id", userIds);
  const sentSet = new Set((alreadySent ?? []).map((r) => r.user_id as string));

  return profiles
    .filter((p) => !sentSet.has(p.user_id as string))
    .map((p) => ({
      id: p.user_id as string,
      email: String(p.email),
      email_unsubscribe_token:
        typeof (p as { email_unsubscribe_token?: unknown })
          .email_unsubscribe_token === "string"
          ? ((p as { email_unsubscribe_token?: string })
              .email_unsubscribe_token ?? null)
          : null,
      data: toDigestData(p as Record<string, unknown>),
    }));
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
    campaign: CAMPAIGN,
    week_key: args.week_key,
    status: args.status,
    error_message: args.error_message,
    provider_message_id: args.provider_message_id,
    sent_at: args.status === "sent" ? new Date().toISOString() : null,
  });
}

// ── Main pass ────────────────────────────────────────────────────────────

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
  skipped_empty: number;
  dry_run: boolean;
}> {
  const all = await loadCandidates(client, weekStart);
  const targets = all.slice(0, RUN_CAP);

  let sent = 0;
  let failed = 0;
  let skippedEmpty = 0;

  for (const target of targets) {
    const rendered = renderParentDigest(TEMPLATE, target.data);

    // Nothing to report yet — don't email an empty digest. Still counted.
    if (rendered.is_empty) {
      skippedEmpty += 1;
      continue;
    }

    if (options.dryRun || !resend) {
      sent += 1;
      continue;
    }

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
          provider_message_id: (data as { id?: string } | null)?.id ?? null,
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
    skipped_empty: skippedEmpty,
    dry_run: options.dryRun,
  };
}

function currentWeekStart(): string {
  // ISO week (Monday) anchor — same as weekly-digest-email.
  const now = new Date();
  const day = now.getUTCDay();
  const daysSinceMonday = (day + 6) % 7; // Mon=0, Sun=6
  const weekStartDate = new Date(now);
  weekStartDate.setUTCDate(now.getUTCDate() - daysSinceMonday);
  return weekStartDate.toISOString().slice(0, 10);
}

// ── HTTP entrypoint ──────────────────────────────────────────────────────

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

  if (action === "send_test" || action === "run_now") {
    const guard = await requireAdmin(req);
    if (!guard.ok) return json({ error: guard.error }, guard.status);
  }

  if (action === "send_test") {
    const to = String(body.to ?? "");
    if (!to) return json({ error: "missing_to" }, 400);
    const sample: ParentDigestData = {
      learner_name_vi: FALLBACK_NAME_VI,
      learner_name_en: FALLBACK_NAME_EN,
      cefr: "B1",
      weakness_count: 2,
    };
    const rendered = renderParentDigest(TEMPLATE, sample);
    if (!resend) return json({ ok: true, dry_run: true, rendered });
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

  const weekStart = currentWeekStart();
  const dryRun = body.dry_run === true || !resend;
  const result = await runPass(adminClient, resend, weekStart, { dryRun });
  return json({ ok: true, ...result });
});
