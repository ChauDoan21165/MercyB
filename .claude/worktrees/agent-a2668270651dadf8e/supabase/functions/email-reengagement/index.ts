// A10 — Re-engagement funnel for lapsed users.
//
// Layered on top of A6's skeleton (PR #81). Two passes per invocation:
//
//   Pass 1 (existing, kept for back-compat) — time-based buckets:
//     warm/cool/cold → reengagement_7d / 14d / 30d. Queues pending rows in
//     email_sends_log without sending. (Backwards compatible with the old
//     GET /reengagement/check shape; the front end / cron may still call
//     this for the original flow.)
//
//   Pass 2 (new, A10) — behavior-based buckets:
//     active_then_silent / trial_completed_no_subscribe /
//     post_subscribe_disengaged / almost_lapsed → 4 dedicated campaigns,
//     each gated by a 30-day per-user-per-campaign cap and a 100/day global
//     cap. Sends via Resend after queueing.
//
// Manual broadcast (POST { action: "monthly_broadcast", features: [a,b,c] }):
//   Sends the `we_added_something_new` template to all users with a valid
//   email + last_active_at within the past 90 days. Same caps apply.
//
// Auth: admin level >= 9 (mirrors trial-expiry-emails).
// Sender: admin@mercyblade.com (verified Resend domain).
// Pacing: 200ms between sends (well under Resend's 10 req/s paid ceiling).
//
// If RESEND_API_KEY is unset, the function still queues pending rows but
// returns sent=0 with a note — preserves the A6 skeleton behavior so a
// half-configured environment can dry-run.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  categorizeUsers,
  categorizeUsersForReengagement,
  REENGAGEMENT_BUCKET_TO_CAMPAIGN,
  type UserActivityRow,
  type ReengagementUserRow,
  type RecentActivity,
} from "./categorizeUsers.ts";
import {
  buildListUnsubscribeHeaders,
  withFooter,
} from "../_shared/unsubscribe.ts";

import warmTemplate from "./templates/warm.json" with { type: "json" };
import coolTemplate from "./templates/cool.json" with { type: "json" };
import coldTemplate from "./templates/cold.json" with { type: "json" };
import activeThenSilentTemplate from "./templates/active_then_silent.json" with { type: "json" };
import trialCompletedTemplate from "./templates/trial_completed_d_plus_14.json" with { type: "json" };
import postSubscribeTemplate from "./templates/post_subscribe_d_plus_7.json" with { type: "json" };
import almostLapsedTemplate from "./templates/almost_lapsed.json" with { type: "json" };
import addedSomethingNewTemplate from "./templates/we_added_something_new.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "Mercy Blade <admin@mercyblade.com>";
const REPLY_TO = "admin@mercyblade.com";
const SEND_INTERLEAVE_MS = 200;
const DAILY_GLOBAL_CAP = 100;
const PER_USER_CAMPAIGN_CAP_DAYS = 30;

type TemplateShape = {
  campaign: string;
  bucket: string;
  tone: string;
  subject_vi: string;
  subject_en: string;
  body_vi: string;
  body_en: string;
  notes: string;
};

const REENGAGEMENT_TEMPLATES: Record<string, TemplateShape> = {
  reengagement_active_then_silent: activeThenSilentTemplate as TemplateShape,
  reengagement_trial_completed_d_plus_14: trialCompletedTemplate as TemplateShape,
  reengagement_post_subscribe_d_plus_7: postSubscribeTemplate as TemplateShape,
  reengagement_almost_lapsed: almostLapsedTemplate as TemplateShape,
  reengagement_added_something_new: addedSomethingNewTemplate as TemplateShape,
};

// Time-based templates retained so A6's existing flow keeps working.
const TIME_BASED_TEMPLATES = {
  reengagement_7d: warmTemplate,
  reengagement_14d: coolTemplate,
  reengagement_30d: coldTemplate,
} as const;

function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickFirstName(user: { email?: string | null; preferred_name?: string | null }): string {
  const preferred = String(user.preferred_name ?? "").trim();
  if (preferred) return preferred;
  const emailLocal = String(user.email ?? "").split("@")[0] ?? "";
  return emailLocal || "bạn";
}

function fillPlaceholders(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

function bilingualSubject(template: TemplateShape, vars: Record<string, string>): string {
  const vi = fillPlaceholders(template.subject_vi, vars);
  const en = fillPlaceholders(template.subject_en, vars);
  return `${vi} · ${en}`;
}

function bilingualBody(
  template: TemplateShape,
  vars: Record<string, string>,
): { text: string; html: string } {
  const vi = fillPlaceholders(template.body_vi, vars);
  const en = fillPlaceholders(template.body_en, vars);
  const text = `${vi}\n\n— — —\n\n${en}`;

  const escape = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const toHtml = (s: string) =>
    escape(s)
      .split("\n\n")
      .map(
        (para) =>
          `<p style="margin:0 0 16px;line-height:1.6;">${para.replaceAll("\n", "<br>")}</p>`,
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

interface CapState {
  recentByUserCampaign: Set<string>; // key: `${user_id}:${campaign}`
  sentToday: number;
}

async function loadCapState(
  adminClient: ReturnType<typeof createClient>,
  now: Date,
): Promise<CapState> {
  // Per-user-per-campaign cap window: anything sent in last 30 days blocks
  // a re-send of the same campaign. We pull the matrix once at the start of
  // the run instead of per-user round-trips.
  const since30 = new Date(now.getTime() - PER_USER_CAMPAIGN_CAP_DAYS * 86400_000).toISOString();
  const { data: recentRows } = await adminClient
    .from("email_sends_log")
    .select("user_id, campaign")
    .gte("scheduled_at", since30)
    .in("status", ["pending", "sent"]);

  const recentByUserCampaign = new Set<string>();
  for (const r of (recentRows ?? []) as { user_id: string; campaign: string }[]) {
    recentByUserCampaign.add(`${r.user_id}:${r.campaign}`);
  }

  // Daily global cap: count rows status='sent' since UTC midnight today.
  const utcMidnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();
  const { count: sentToday } = await adminClient
    .from("email_sends_log")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("scheduled_at", utcMidnight);

  return {
    recentByUserCampaign,
    sentToday: sentToday ?? 0,
  };
}

interface SendableRow {
  logId: string;
  user: {
    id: string;
    email: string;
    preferred_name?: string | null;
    /** Required by withFooter / buildListUnsubscribeHeaders. */
    email_unsubscribe_token?: string | null;
  };
  campaign: string;
}

async function dispatchSends(
  adminClient: ReturnType<typeof createClient>,
  resend: Resend | null,
  sendable: SendableRow[],
  cap: CapState,
  templateVars: (campaign: string) => Record<string, string>,
): Promise<{
  sent: number;
  failed: number;
  throttled: number;
  errors: Array<{ user_id: string; campaign: string; error: string }>;
}> {
  let sent = 0;
  let failed = 0;
  let throttled = 0;
  const errors: Array<{ user_id: string; campaign: string; error: string }> = [];

  for (let i = 0; i < sendable.length; i++) {
    if (cap.sentToday >= DAILY_GLOBAL_CAP) {
      throttled++;
      // Mark this row 'skipped' (not failed) so the next run treats it as a
      // fresh decision instead of a retryable error. Remaining queued rows
      // stay 'pending' for tomorrow.
      const { logId } = sendable[i];
      await adminClient
        .from("email_sends_log")
        .update({
          status: "skipped",
          error_message: "daily global cap (100) reached",
          sent_at: new Date().toISOString(),
        })
        .eq("id", logId);
      continue;
    }

    const { logId, user, campaign } = sendable[i];
    const template = REENGAGEMENT_TEMPLATES[campaign];
    if (!template) {
      const msg = `Unknown campaign template: ${campaign}`;
      await adminClient
        .from("email_sends_log")
        .update({ status: "failed", error_message: msg, sent_at: new Date().toISOString() })
        .eq("id", logId);
      errors.push({ user_id: user.id, campaign, error: msg });
      failed++;
      continue;
    }

    const firstName = pickFirstName(user);
    const vars = { first_name: firstName, ...templateVars(campaign) };
    const subject = bilingualSubject(template, vars);
    const baseBody = bilingualBody(template, vars);

    if (!resend) {
      // Skeleton mode: leave row 'pending' so a future configured run can
      // pick it up. Mirrors the original A6 behavior.
      continue;
    }

    // Every marketing email gets the bilingual unsubscribe footer and
    // List-Unsubscribe headers. Skip the send if the user has no token
    // (defensive — the migration backfilled all rows + the trigger
    // generates one on insert) rather than emit footer-less mail.
    const token = user.email_unsubscribe_token ?? null;
    if (!token) {
      const msg = "missing_unsubscribe_token";
      console.warn("[email-reengagement] skipping send:", { user_id: user.id, msg });
      await adminClient
        .from("email_sends_log")
        .update({ status: "skipped", error_message: msg, sent_at: new Date().toISOString() })
        .eq("id", logId);
      continue;
    }
    const { text, html } = withFooter(baseBody, token);
    const headers = buildListUnsubscribeHeaders(token);

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: [user.email],
        reply_to: REPLY_TO,
        subject,
        text,
        html,
        headers,
      });

      if (emailError) {
        const msg = String(emailError.message ?? emailError);
        await adminClient
          .from("email_sends_log")
          .update({
            status: "failed",
            error_message: msg.slice(0, 500),
            sent_at: new Date().toISOString(),
          })
          .eq("id", logId);
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
          .eq("id", logId);
        sent++;
        cap.sentToday++;
        console.log("[email-reengagement] sent", {
          user_id: user.id,
          campaign,
          provider_message_id: (emailData as { id?: string } | null)?.id ?? null,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await adminClient
        .from("email_sends_log")
        .update({
          status: "failed",
          error_message: msg.slice(0, 500),
          sent_at: new Date().toISOString(),
        })
        .eq("id", logId);
      errors.push({ user_id: user.id, campaign, error: msg });
      failed++;
    }

    if (i < sendable.length - 1) {
      await sleep(SEND_INTERLEAVE_MS);
    }
  }

  return { sent, failed, throttled, errors };
}

async function queuePending(
  adminClient: ReturnType<typeof createClient>,
  user: { id: string; email: string; preferred_name?: string | null },
  campaign: string,
  campaignType: string,
): Promise<{ logId: string | null; alreadyQueued: boolean }> {
  const { data: inserted, error: insertError } = await adminClient
    .from("email_sends_log")
    .insert({
      user_id: user.id,
      email: user.email,
      campaign,
      campaign_type: campaignType,
      status: "pending",
    })
    .select("id")
    .single();

  if (!insertError) {
    return { logId: inserted?.id ?? null, alreadyQueued: false };
  }
  if (insertError.code === "23505") {
    const { data: existing } = await adminClient
      .from("email_sends_log")
      .select("id")
      .eq("user_id", user.id)
      .eq("campaign", campaign)
      .eq("status", "pending")
      .maybeSingle();
    return { logId: existing?.id ?? null, alreadyQueued: true };
  }
  console.warn("[email-reengagement] insert failed", {
    user_id: user.id,
    campaign,
    error: insertError,
  });
  return { logId: null, alreadyQueued: false };
}

interface ProfileWithSubscription {
  id: string;
  email: string | null;
  preferred_name: string | null;
  last_active_at: string | null;
  tier: number | null;
  /** Per-user opt-out gate; default true. */
  email_re_engagement_enabled: boolean | null;
  /** Required for the unsubscribe footer + List-Unsubscribe header. */
  email_unsubscribe_token: string | null;
  subscriptions:
    | {
        status: string | null;
        trial_started_at: string | null;
        trial_ends_at: string | null;
        current_period_start_at: string | null;
        current_period_end_at: string | null;
      }[]
    | null;
}

function flattenSubscription(p: ProfileWithSubscription): ReengagementUserRow & {
  preferred_name: string | null;
  email_re_engagement_enabled: boolean | null;
  email_unsubscribe_token: string | null;
} {
  const sub = p.subscriptions?.[0] ?? null;
  return {
    id: p.id,
    email: p.email,
    preferred_name: p.preferred_name,
    last_active_at: p.last_active_at,
    tier: p.tier,
    subscription_status: sub?.status ?? null,
    trial_started_at: sub?.trial_started_at ?? null,
    trial_ends_at: sub?.trial_ends_at ?? null,
    current_period_start_at: sub?.current_period_start_at ?? null,
    current_period_end_at: sub?.current_period_end_at ?? null,
    email_re_engagement_enabled: p.email_re_engagement_enabled,
    email_unsubscribe_token: p.email_unsubscribe_token,
  };
}

async function loadActivityCounts(
  adminClient: ReturnType<typeof createClient>,
  candidateUserIds: string[],
  now: Date,
): Promise<Map<string, RecentActivity>> {
  // Used only for almost_lapsed gating. Counts distinct days with at least
  // one user_sessions row in the last 30 days. If user_sessions is missing
  // or the query fails, we return an empty map and almost_lapsed simply
  // does not fire — safer than over-emailing.
  const out = new Map<string, RecentActivity>();
  if (candidateUserIds.length === 0) return out;

  const since30 = new Date(now.getTime() - 30 * 86400_000).toISOString();
  const { data: rows, error } = await adminClient
    .from("user_sessions")
    .select("user_id, started_at, last_activity, created_at")
    .in("user_id", candidateUserIds)
    .gte("started_at", since30);

  if (error) {
    console.warn(
      "[email-reengagement] user_sessions query failed (skip almost_lapsed):",
      error.message,
    );
    return out;
  }

  const daySetByUser = new Map<string, Set<string>>();
  for (const r of (rows ?? []) as Array<{
    user_id: string;
    started_at: string | null;
    last_activity: string | null;
    created_at: string | null;
  }>) {
    const ts = r.started_at ?? r.last_activity ?? r.created_at;
    if (!ts) continue;
    const day = ts.slice(0, 10); // YYYY-MM-DD bucket (UTC)
    const set = daySetByUser.get(r.user_id) ?? new Set<string>();
    set.add(day);
    daySetByUser.set(r.user_id, set);
  }
  for (const [user_id, set] of daySetByUser) {
    out.set(user_id, { activeDaysLast30: set.size });
  }
  return out;
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
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? null;

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

    // ── Parse body for action selection ──────────────────────────────────
    let action: string | null = null;
    let broadcastFeatures: string[] = [];
    if (req.method === "POST") {
      try {
        const body = await req.json().catch(() => null);
        if (body && typeof body === "object") {
          action = typeof body.action === "string" ? body.action : null;
          if (action === "monthly_broadcast" && Array.isArray(body.features)) {
            broadcastFeatures = body.features
              .filter((x: unknown) => typeof x === "string")
              .slice(0, 3);
          }
        }
      } catch {
        // ignore — default action runs
      }
    }

    const resend = resendApiKey ? new Resend(resendApiKey) : null;
    const now = new Date();
    const cap = await loadCapState(adminClient, now);

    // ── Action: monthly_broadcast ────────────────────────────────────────
    if (action === "monthly_broadcast") {
      if (broadcastFeatures.length !== 3) {
        return send({
          ok: false,
          error: "monthly_broadcast requires exactly 3 features in body.features[]",
        });
      }

      const since90 = new Date(now.getTime() - 90 * 86400_000).toISOString();
      const { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select(
          "id, email, preferred_name, last_active_at, email_re_engagement_enabled, email_unsubscribe_token",
        )
        .gte("last_active_at", since90);

      if (profilesError) {
        return send({ ok: false, error: "Failed to query profiles for broadcast" });
      }

      const campaign = "reengagement_added_something_new";
      const sendable: SendableRow[] = [];
      let queued = 0;
      let alreadyQueued = 0;
      let cappedOut = 0;
      let optedOut = 0;

      for (const p of (profiles ?? []) as Array<{
        id: string;
        email: string | null;
        preferred_name: string | null;
        email_re_engagement_enabled: boolean | null;
        email_unsubscribe_token: string | null;
      }>) {
        if (!p.email) continue;
        if (p.email_re_engagement_enabled === false) {
          optedOut++;
          continue;
        }
        if (cap.recentByUserCampaign.has(`${p.id}:${campaign}`)) {
          cappedOut++;
          continue;
        }
        const { logId, alreadyQueued: dup } = await queuePending(
          adminClient,
          {
            id: p.id,
            email: p.email,
            preferred_name: p.preferred_name,
          },
          campaign,
          "reengagement",
        );
        if (logId) {
          sendable.push({
            logId,
            user: {
              id: p.id,
              email: p.email,
              preferred_name: p.preferred_name,
              email_unsubscribe_token: p.email_unsubscribe_token,
            },
            campaign,
          });
          if (dup) alreadyQueued++;
          else queued++;
        }
      }

      if (optedOut > 0) {
        console.log("[email-reengagement] skipped:user_unsubscribed", {
          count: optedOut,
          category: "re_engagement",
          action: "monthly_broadcast",
        });
      }

      const { sent, failed, throttled, errors } = await dispatchSends(
        adminClient,
        resend,
        sendable,
        cap,
        () => ({
          feature_1: broadcastFeatures[0],
          feature_2: broadcastFeatures[1],
          feature_3: broadcastFeatures[2],
        }),
      );

      return send({
        ok: true,
        action: "monthly_broadcast",
        scanned: profiles?.length ?? 0,
        queued,
        already_queued: alreadyQueued,
        capped_out: cappedOut,
        opted_out: optedOut,
        sent,
        failed,
        throttled,
        skeleton_mode: !resend,
        errors: errors.slice(0, 20),
      });
    }

    // ── Default action: daily bucket pass ────────────────────────────────
    const { data: profilesRaw, error: profilesError } = await adminClient
      .from("profiles")
      .select(
        "id, email, preferred_name, last_active_at, tier, email_re_engagement_enabled, email_unsubscribe_token, subscriptions:subscriptions(status,trial_started_at,trial_ends_at,current_period_start_at,current_period_end_at)",
      );

    if (profilesError) {
      console.error("[email-reengagement] profiles query failed:", profilesError);
      return send({ ok: false, error: "Failed to query profiles" });
    }

    const profilesAll = (profilesRaw ?? []) as ProfileWithSubscription[];
    // Honor per-user opt-out before any bucketing. Anyone who turned off
    // re-engagement email never enters the buckets, so we never queue
    // a pending row that would later be silently dropped.
    let dailyOptedOut = 0;
    const profiles = profilesAll.filter((p) => {
      if (p.email_re_engagement_enabled === false) {
        dailyOptedOut++;
        return false;
      }
      return true;
    });
    if (dailyOptedOut > 0) {
      console.log("[email-reengagement] skipped:user_unsubscribed", {
        count: dailyOptedOut,
        category: "re_engagement",
        action: "daily",
      });
    }
    const flattened = profiles.map(flattenSubscription);

    // ── Pass 1 (back-compat) — time-based queue (no Resend send) ────────
    const timeBuckets = categorizeUsers(
      flattened.map<UserActivityRow>((p) => ({
        id: p.id,
        email: p.email,
        last_active_at: p.last_active_at,
      })),
      now,
    );

    const timeQueueable: { user: UserActivityRow; campaign: string }[] = [
      ...timeBuckets.warm.map((u) => ({ user: u, campaign: "reengagement_7d" })),
      ...timeBuckets.cool.map((u) => ({ user: u, campaign: "reengagement_14d" })),
      ...timeBuckets.cold.map((u) => ({ user: u, campaign: "reengagement_30d" })),
    ];
    let timeQueued = 0;
    let timeAlreadyQueued = 0;
    for (const { user, campaign } of timeQueueable) {
      if (!user.email) continue;
      if (cap.recentByUserCampaign.has(`${user.id}:${campaign}`)) continue;
      const { error: insertError } = await adminClient
        .from("email_sends_log")
        .insert({
          user_id: user.id,
          email: user.email,
          campaign,
          campaign_type: "reengagement",
          status: "pending",
        });
      if (insertError) {
        if (insertError.code === "23505") timeAlreadyQueued++;
      } else {
        timeQueued++;
      }
    }

    // ── Pass 2 (A10) — behavior buckets, with Resend send + caps ─────────
    // Only paid users 25+ days into their period need the activity-day count
    // (it's the gate for almost_lapsed). Pre-filter to keep the query cheap.
    const almostLapsedCandidateIds = flattened
      .filter((u) => {
        if (!u.email) return false;
        const paid =
          (u.tier ?? 0) > 0 ||
          ["active", "past_due"].includes((u.subscription_status ?? "").toLowerCase());
        if (!paid) return false;
        if (!u.current_period_start_at) return false;
        const days =
          (now.getTime() - new Date(u.current_period_start_at).getTime()) / 86400_000;
        return days >= 25;
      })
      .map((u) => u.id);

    const activityByUser = await loadActivityCounts(adminClient, almostLapsedCandidateIds, now);

    const behaviorBuckets = categorizeUsersForReengagement(flattened, now, activityByUser);

    const behaviorQueueable: Array<{
      user: {
        id: string;
        email: string;
        preferred_name: string | null;
        email_unsubscribe_token: string | null;
      };
      campaign: string;
    }> = [];
    for (const [bucket, users] of Object.entries(behaviorBuckets)) {
      if (bucket === "skipped") continue;
      const campaign =
        REENGAGEMENT_BUCKET_TO_CAMPAIGN[bucket as keyof typeof REENGAGEMENT_BUCKET_TO_CAMPAIGN];
      for (const u of users as Array<
        ReengagementUserRow & {
          preferred_name: string | null;
          email_unsubscribe_token: string | null;
        }
      >) {
        if (!u.email) continue;
        behaviorQueueable.push({
          user: {
            id: u.id,
            email: u.email,
            preferred_name: u.preferred_name,
            email_unsubscribe_token: u.email_unsubscribe_token,
          },
          campaign,
        });
      }
    }

    const sendable: SendableRow[] = [];
    let queued = 0;
    let alreadyQueued = 0;
    let cappedOut = 0;
    for (const { user, campaign } of behaviorQueueable) {
      if (cap.recentByUserCampaign.has(`${user.id}:${campaign}`)) {
        cappedOut++;
        continue;
      }
      const { logId, alreadyQueued: dup } = await queuePending(
        adminClient,
        user,
        campaign,
        "reengagement",
      );
      if (logId) {
        sendable.push({ logId, user, campaign });
        if (dup) alreadyQueued++;
        else queued++;
      }
    }

    const { sent, failed, throttled, errors } = await dispatchSends(
      adminClient,
      resend,
      sendable,
      cap,
      () => ({}),
    );

    // Reference imports so tree-shakers don't drop them in skeleton mode.
    void TIME_BASED_TEMPLATES;

    return send({
      ok: true,
      action: "daily",
      scanned: flattened.length,
      opted_out: dailyOptedOut,
      time_based: {
        warm: timeBuckets.warm.length,
        cool: timeBuckets.cool.length,
        cold: timeBuckets.cold.length,
        queued: timeQueued,
        already_queued: timeAlreadyQueued,
      },
      behavior: {
        active_then_silent: behaviorBuckets.active_then_silent.length,
        trial_completed_no_subscribe: behaviorBuckets.trial_completed_no_subscribe.length,
        post_subscribe_disengaged: behaviorBuckets.post_subscribe_disengaged.length,
        almost_lapsed: behaviorBuckets.almost_lapsed.length,
        skipped: behaviorBuckets.skipped.length,
      },
      queued,
      already_queued: alreadyQueued,
      capped_out: cappedOut,
      sent,
      failed,
      throttled,
      skeleton_mode: !resend,
      errors: errors.slice(0, 20),
    });
  } catch (err) {
    console.error("[email-reengagement] unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
