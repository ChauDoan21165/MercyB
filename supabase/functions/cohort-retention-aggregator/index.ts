// cohort-retention-aggregator
//
// Fills the existing public.cohort_retention_daily table (see migration
// 20260535000000_cohort_retention.sql) that /admin/retention reads via the
// get_cohort_retention RPC. Runs daily; intended trigger = pg_cron (the cron
// SQL is drafted in the feature_outcome_events migration, NOT applied here —
// Chau applies schema/cron manually per the Supabase lockout).
//
// Auth: cron-secret header (ADMIN_CRON_SECRET), same pattern as admin-daily-digest.
// Writes with the service-role key. verify_jwt = false (registered in config.toml).
//
// Aggregation (self-contained, no extra SQL function): for each user that
// signed up in the last ~13 weeks, bucket by ISO-week cohort and segment
// (all / free=tier0 / paid=tier>=1); a user is "active at day D" if they have
// a user_sessions row dated signup_date + D. Upserts active_users / total_users
// per (cohort_week_start, days_since_signup, segment) for D in {0,1,3,7,14,30}.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RETENTION_OFFSETS = [0, 1, 3, 7, 14, 30] as const;
const LOOKBACK_WEEKS = 13;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// UTC date string (YYYY-MM-DD) from an ISO timestamp.
function dayUTC(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

// Whole days between two YYYY-MM-DD dates (b - a).
function daysBetween(a: string, b: string): number {
  const ms = Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z");
  return Math.round(ms / 86_400_000);
}

// ISO-week Monday (YYYY-MM-DD) for a YYYY-MM-DD date — matches
// date_trunc('week', ...) in Postgres (week starts Monday).
function isoWeekStart(date: string): string {
  const d = new Date(date + "T00:00:00Z");
  const dow = d.getUTCDay(); // 0=Sun..6=Sat
  const deltaToMonday = (dow + 6) % 7;
  d.setUTCDate(d.getUTCDate() - deltaToMonday);
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Cron-secret auth — reject anything without the shared secret.
  const expected = Deno.env.get("ADMIN_CRON_SECRET") ?? "";
  const provided = req.headers.get("x-cron-secret") ?? "";
  if (!expected || provided !== expected) {
    return json({ error: "unauthorized" }, 401);
  }

  const url = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SB_URL") ?? "";
  const serviceKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SB_SERVICE_ROLE_KEY") ??
    "";
  if (!url || !serviceKey) {
    return json({ error: "missing SUPABASE_URL / SERVICE_ROLE_KEY" }, 500);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sinceIso = new Date(
    Date.now() - LOOKBACK_WEEKS * 7 * 86_400_000,
  ).toISOString();

  // 1) Cohort users (signed up in the lookback window).
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, created_at, tier")
    .eq("is_synthetic", false)
    .gte("created_at", sinceIso);
  if (pErr) return json({ error: "profiles read failed", detail: pErr.message }, 500);

  // 2) Sessions in the window (the "return visit" signal).
  const { data: sessions, error: sErr } = await supabase
    .from("user_sessions")
    .select("user_id, created_at")
    .gte("created_at", sinceIso);
  if (sErr) return json({ error: "user_sessions read failed", detail: sErr.message }, 500);

  type Cohort = { week: string; total: Set<string>; active: Map<number, Set<string>> };
  // key = `${week}|${segment}`
  const buckets = new Map<string, Cohort>();
  const signup = new Map<string, string>(); // user_id -> signup day (UTC)
  const segOf = new Map<string, "free" | "paid">();

  const ensure = (week: string, seg: string): Cohort => {
    const key = `${week}|${seg}`;
    let c = buckets.get(key);
    if (!c) {
      c = { week, total: new Set(), active: new Map() };
      for (const d of RETENTION_OFFSETS) c.active.set(d, new Set());
      buckets.set(key, c);
    }
    return c;
  };

  for (const p of profiles ?? []) {
    if (!p.id || !p.created_at) continue;
    const day = dayUTC(p.created_at as string);
    const week = isoWeekStart(day);
    const seg: "free" | "paid" = Number(p.tier ?? 0) >= 1 ? "paid" : "free";
    signup.set(p.id as string, day);
    segOf.set(p.id as string, seg);
    ensure(week, "all").total.add(p.id as string);
    ensure(week, seg).total.add(p.id as string);
  }

  for (const s of sessions ?? []) {
    const uid = s.user_id as string | null;
    if (!uid) continue;
    const su = signup.get(uid);
    if (!su) continue; // session for an out-of-window cohort
    const d = daysBetween(su, dayUTC(s.created_at as string));
    if (!(RETENTION_OFFSETS as readonly number[]).includes(d)) continue;
    const week = isoWeekStart(su);
    const seg = segOf.get(uid)!;
    ensure(week, "all").active.get(d)!.add(uid);
    ensure(week, seg).active.get(d)!.add(uid);
  }

  // 3) Build upsert rows.
  const computed_at = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];
  for (const [key, c] of buckets) {
    const seg = key.split("|")[1];
    for (const d of RETENTION_OFFSETS) {
      rows.push({
        cohort_week_start: c.week,
        days_since_signup: d,
        segment: seg,
        active_users: c.active.get(d)!.size,
        total_users: c.total.size,
        computed_at,
      });
    }
  }

  if (rows.length) {
    const { error: uErr } = await supabase
      .from("cohort_retention_daily")
      .upsert(rows, { onConflict: "cohort_week_start,days_since_signup,segment" });
    if (uErr) return json({ error: "upsert failed", detail: uErr.message }, 500);
  }

  return json({
    ok: true,
    cohorts: buckets.size,
    rows_upserted: rows.length,
    lookback_weeks: LOOKBACK_WEEKS,
    computed_at,
  });
});
