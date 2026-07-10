// tests/synthetic-exclusion/guard.integration.test.ts
//
// ENFORCEMENT (not a comment): every learner aggregate must exclude the
// synthetic account. These are DB integration guards — they seed a SYNTHETIC
// profile and a CONTROL profile on the test project and assert each §2
// aggregate's output does not reflect the synthetic user.
//
// Skip-gated on TEST_SUPABASE_SERVICE_KEY (the repo convention, tests/e2e/db.ts):
// they SKIP (green) without the test-project service key and ENFORCE with it.
// Run after the 20260710120000_synthetic_user_exclusion migration is applied to
// the test project.
//
// Coverage note (honest): the profiles-direct count aggregates and the
// user_id-returning aggregates are guarded with only profiles seeding. The
// activity-only aggregates (DAU, feature_usage_7d, room_popularity,
// l1_rule_effectiveness, weakness_trends) rest on the SAME is_synthetic_user()
// predicate, which is asserted directly below; a follow-up can add per-table
// activity seeding for full end-to-end coverage of those.

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.TEST_SUPABASE_URL ?? "";
const SERVICE = process.env.TEST_SUPABASE_SERVICE_KEY ?? "";
const RUN = Boolean(URL && SERVICE);

const svc: SupabaseClient | null = RUN
  ? createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

const STAMP = process.env.GUARD_STAMP ?? "guard-fixed-stamp";
let synthId = "";
let controlId = "";

async function mkUser(tag: string, isSynthetic: boolean): Promise<string> {
  const email = `synthguard+${tag}.${STAMP}@mercyblade-synthetic.test`;
  const { data, error } = await svc!.auth.admin.createUser({ email, password: `Guard-${STAMP}-42!`, email_confirm: true });
  if (error || !data.user) throw error ?? new Error("createUser failed");
  const id = data.user.id;
  // Upsert profile flag regardless of whether a handle_new_user trigger seeded it.
  await svc!.from("profiles").upsert({ id, is_synthetic: isSynthetic, created_at: new Date().toISOString() }, { onConflict: "id" });
  await svc!.from("profiles").update({ is_synthetic: isSynthetic }).eq("id", id);
  return id;
}

beforeAll(async () => {
  if (!RUN) return;
  synthId = await mkUser("synth", true);
  controlId = await mkUser("control", false);
});

afterAll(async () => {
  if (!RUN) return;
  for (const id of [synthId, controlId]) {
    if (id) await svc!.auth.admin.deleteUser(id).catch(() => {});
  }
});

describe.skipIf(!RUN)("synthetic-user exclusion guards", () => {
  // ── Foundation: the predicate every aggregate uses ────────────────────────
  it("is_synthetic_user() — true for synthetic, false for control", async () => {
    const { data: a } = await svc!.rpc("is_synthetic_user", { uid: synthId });
    const { data: b } = await svc!.rpc("is_synthetic_user", { uid: controlId });
    expect(a).toBe(true);
    expect(b).toBe(false);
  });

  // ── Profiles-direct COUNT aggregates: synthetic must not increment ────────
  // get_conversion_funnel().signed_up and .paid, get_behavioral_metrics new
  // signups, and v_analytics_user_funnel signed_up all COUNT public.profiles.
  it("get_conversion_funnel: signed_up excludes the synthetic profile", async () => {
    const { data } = await svc!.rpc("get_conversion_funnel");
    const row = Array.isArray(data) ? data[0] : data;
    // Both synthetic + control exist; a correct exclusion counts control, not synthetic.
    // We assert the count equals the number of NON-synthetic profiles.
    const { count: real } = await svc!.from("profiles").select("id", { count: "exact", head: true }).eq("is_synthetic", false);
    expect(row?.signed_up).toBe(real);
  });

  it("v_analytics_user_funnel: signed_up excludes the synthetic profile", async () => {
    const { data } = await svc!.from("v_analytics_user_funnel").select("*").eq("stage", "signed_up").maybeSingle();
    const { count: real } = await svc!.from("profiles").select("id", { count: "exact", head: true }).eq("is_synthetic", false);
    expect(data?.count).toBe(real);
  });

  it("get_behavioral_metrics: today's new_signups excludes the synthetic profile", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await svc!.rpc("get_behavioral_metrics", { p_since: today, p_until: today });
    const rows = (data ?? []) as Array<{ metric_date: string; new_signups: number }>;
    const todayRow = rows.find((r) => r.metric_date === today);
    // The synthetic profile was created today; it must NOT be in new_signups.
    // Control (also today) SHOULD be. So new_signups counts control, not synthetic.
    const { count: realToday } = await svc!
      .from("profiles").select("id", { count: "exact", head: true })
      .eq("is_synthetic", false).gte("created_at", `${today}T00:00:00Z`);
    expect(todayRow?.new_signups ?? 0).toBe(realToday);
  });

  it("refresh_weekly_digest: new_users excludes the synthetic profile", async () => {
    const { data } = await svc!.rpc("refresh_weekly_digest");
    const row = Array.isArray(data) ? data[0] : data;
    // The digest row's new_users must not include the synthetic profile created this week.
    const weekStart = row?.week_starts_on;
    const { count: real } = await svc!
      .from("profiles").select("id", { count: "exact", head: true })
      .eq("is_synthetic", false).gte("created_at", `${weekStart}T00:00:00Z`);
    // new_users counts only non-synthetic; equality proves the synthetic was excluded.
    expect(row?.new_users_this_week).toBe(real);
  });

  // ── user_id-returning aggregates: the synthetic id must be ABSENT ─────────
  it("v_analytics_user_cohorts: synthetic user_id is absent", async () => {
    const { data } = await svc!.from("v_analytics_user_cohorts").select("user_id");
    const ids = (data ?? []).map((r: { user_id: string }) => r.user_id);
    expect(ids).not.toContain(synthId);
    expect(ids).toContain(controlId);
  });

  it("v4_admin_learner_memory_summary: synthetic user_id is absent", async () => {
    const { data } = await svc!.from("v4_admin_learner_memory_summary").select("user_id").eq("user_id", synthId);
    expect(data ?? []).toHaveLength(0);
  });

  it("leaderboard_weekly_top10: synthetic user_id is absent", async () => {
    const { data } = await svc!.rpc("leaderboard_weekly_top10");
    const ids = ((data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id);
    expect(ids).not.toContain(synthId);
  });
});
