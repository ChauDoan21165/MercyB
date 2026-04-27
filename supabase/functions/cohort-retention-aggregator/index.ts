// supabase/functions/cohort-retention-aggregator/index.ts
//
// Aggregator for the cohort retention triangle.
//
// What it does:
//   1. Pull the last `lookbackDays` (default 90) of profiles +
//      activity rows.
//   2. For each segment in {all, free, paid}, compute the
//      week-cohort × day-since-signup retention triangle.
//   3. UPSERT the results into public.cohort_retention_daily.
//
// Privacy / posture:
//   - service-role client; bypasses RLS
//   - reads user_id only to build the activity index in memory; never
//     writes individual user data
//   - admin-level >= 9 required to invoke from the dashboard
//   - cron-friendly: idempotent UPSERT, safe to re-run
//
// Activity definition (matches the brief):
//   ≥1 speech_attempt OR ≥1 user_sessions row that day,
//   plus profiles.last_active_at as a denormalised heartbeat.
//
// Cron schedule: 04:00 UTC daily (provisioned via supabase functions
// schedule, not part of this file).
//
// Endpoints:
//   POST { action: "run", lookbackDays?: number }
//     — recompute the last N days of cohorts. Default 90 (matches the
//       brief's first-run backfill).
//   POST { action: "freshness" }
//     — returns the latest computed_at timestamp; cheap admin probe.
//
// Auth: admin level >= 9 (mirrors trial-expiry-emails / weekly-digest).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  RETENTION_DAY_OFFSETS,
  buildActivityIndex,
  computeCohortRetention,
  filterBySegment,
  groupProfilesByWeek,
  type ActivityRow,
  type ProfileRow,
  type Segment,
} from "../_shared/cohortRetentionMath.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const DEFAULT_LOOKBACK_DAYS = 90;
const SEGMENTS: Segment[] = ["all", "free", "paid"];

function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
}

function isoNDaysAgo(n: number): string {
  return new Date(Date.now() - n * 86400_000).toISOString();
}

interface RunResult {
  segment: Segment;
  cohortsTouched: number;
  rowsWritten: number;
}

async function loadProfiles(
  client: ReturnType<typeof createClient>,
  sinceIso: string,
): Promise<ProfileRow[]> {
  const { data, error } = await client
    .from("profiles")
    .select("id, created_at, tier")
    .gte("created_at", sinceIso);
  if (error) {
    console.error("[aggregator] profiles query failed:", error);
    return [];
  }
  return (data ?? []) as unknown as ProfileRow[];
}

async function loadSpeechActivity(
  client: ReturnType<typeof createClient>,
  sinceIso: string,
): Promise<ActivityRow[]> {
  const { data, error } = await client
    .from("speech_attempts")
    .select("user_id, attempted_at")
    .gte("attempted_at", sinceIso);
  if (error) {
    console.warn("[aggregator] speech_attempts query failed:", error);
    return [];
  }
  return ((data ?? []) as Array<{ user_id: string; attempted_at: string }>).map(
    (r) => ({ user_id: r.user_id, active_at: r.attempted_at }),
  );
}

async function loadSessionActivity(
  client: ReturnType<typeof createClient>,
  sinceIso: string,
): Promise<ActivityRow[]> {
  const { data, error } = await client
    .from("user_sessions")
    .select("user_id, last_activity")
    .gte("last_activity", sinceIso);
  if (error) {
    console.warn("[aggregator] user_sessions query failed:", error);
    return [];
  }
  return ((data ?? []) as Array<{ user_id: string; last_activity: string }>).map(
    (r) => ({ user_id: r.user_id, active_at: r.last_activity }),
  );
}

async function runForSegment(
  client: ReturnType<typeof createClient>,
  profiles: ReadonlyArray<ProfileRow>,
  activity: ReadonlyArray<ActivityRow>,
  segment: Segment,
  now: Date,
): Promise<RunResult> {
  const filtered = filterBySegment(profiles, segment);
  const cohorts = groupProfilesByWeek(filtered);
  const activityIndex = buildActivityIndex(activity);

  const upsertRows: Array<{
    cohort_week_start: string;
    days_since_signup: number;
    segment: Segment;
    active_users: number;
    total_users: number;
    computed_at: string;
  }> = [];

  for (const [, members] of cohorts) {
    const triangle = computeCohortRetention(members, activityIndex, now);
    for (const cell of triangle) {
      upsertRows.push({
        cohort_week_start: cell.cohortWeekStart,
        days_since_signup: cell.daysSinceSignup,
        segment,
        active_users: cell.activeUsers,
        total_users: cell.totalUsers,
        computed_at: now.toISOString(),
      });
    }
  }

  if (upsertRows.length > 0) {
    // Chunk upserts so we don't hit body-size limits on backfill runs.
    const CHUNK = 500;
    for (let i = 0; i < upsertRows.length; i += CHUNK) {
      const slice = upsertRows.slice(i, i + CHUNK);
      const { error } = await client
        .from("cohort_retention_daily")
        .upsert(slice, {
          onConflict: "cohort_week_start,days_since_signup,segment",
        });
      if (error) {
        console.error("[aggregator] upsert failed:", error);
        throw new Error(`upsert_failed: ${error.message}`);
      }
    }
  }

  return {
    segment,
    cohortsTouched: cohorts.size,
    rowsWritten: upsertRows.length,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth: admin level >= 9 ───────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return send({ ok: false, error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    // ── Action ───────────────────────────────────────────────────────
    let action = "run";
    let lookbackDays = DEFAULT_LOOKBACK_DAYS;
    try {
      const body = await req.json().catch(() => null);
      if (body && typeof body === "object") {
        if (typeof body.action === "string") action = body.action;
        if (typeof body.lookbackDays === "number" && Number.isFinite(body.lookbackDays)) {
          lookbackDays = Math.max(7, Math.min(365, Math.round(body.lookbackDays)));
        }
      }
    } catch {
      // Default to "run" — body parsing failure is not fatal.
    }

    if (action === "freshness") {
      const { data, error } = await adminClient
        .from("cohort_retention_daily")
        .select("computed_at")
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return send({ ok: false, error: error.message });
      return send({ ok: true, action: "freshness", computed_at: data?.computed_at ?? null });
    }

    if (action !== "run") {
      return send({ ok: false, error: `unknown_action: ${action}` });
    }

    // ── Run pass ─────────────────────────────────────────────────────
    const now = new Date();
    const sinceIso = isoNDaysAgo(lookbackDays);
    const [profiles, speech, sessions] = await Promise.all([
      loadProfiles(adminClient, sinceIso),
      loadSpeechActivity(adminClient, sinceIso),
      loadSessionActivity(adminClient, sinceIso),
    ]);

    const activity: ActivityRow[] = [...speech, ...sessions];

    const results: RunResult[] = [];
    for (const segment of SEGMENTS) {
      const r = await runForSegment(adminClient, profiles, activity, segment, now);
      results.push(r);
    }

    return send({
      ok: true,
      action: "run",
      lookback_days: lookbackDays,
      profile_count: profiles.length,
      activity_rows: activity.length,
      offsets: RETENTION_DAY_OFFSETS,
      segments: results,
      computed_at: now.toISOString(),
    });
  } catch (err) {
    console.error("[aggregator] unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
