import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getUserFromAuthHeader } from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const db = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

serve(
  wrapHandler("placement-v3-drift-report", async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "GET") return json({ ok: false, error: "method_not_allowed" }, 405);

    const user = await getUserFromAuthHeader(req);
    if (!user) return json({ ok: false, error: "auth_required" }, 401);

    const { data: level, error: levelError } = await db.rpc("get_admin_level", {
      p_user_id: user.id,
    });
    if (levelError || Number(level ?? 0) < 9) {
      return json({ ok: false, error: "admin_required" }, 403);
    }

    const url = new URL(req.url);
    const since = url.searchParams.get("since") ??
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const limit = Math.min(1_000, Math.max(1, Number(url.searchParams.get("limit") ?? 500)));

    const { data: runs, error: runsError } = await db
      .from("placement_v3_replay_runs")
      .select("*")
      .gte("started_at", since)
      .order("started_at", { ascending: false })
      .limit(50);
    if (runsError) return json({ ok: false, error: runsError.message }, 500);

    const runIds = (runs ?? []).map((row: { id: string }) => row.id);
    const { data: scores, error: scoresError } = runIds.length
      ? await db
        .from("placement_v3_replay_scores")
        .select("*")
        .in("run_id", runIds)
        .order("created_at", { ascending: false })
        .limit(limit)
      : { data: [], error: null };
    if (scoresError) return json({ ok: false, error: scoresError.message }, 500);

    const { data: alerts, error: alertsError } = runIds.length
      ? await db
        .from("placement_v3_drift_alerts")
        .select("*")
        .in("run_id", runIds)
        .order("created_at", { ascending: false })
        .limit(100)
      : { data: [], error: null };
    if (alertsError) return json({ ok: false, error: alertsError.message }, 500);

    const { data: providerVariance, error: providerError } = runIds.length
      ? await db
        .from("placement_v3_provider_variance")
        .select("*")
        .in("run_id", runIds)
        .order("created_at", { ascending: false })
      : { data: [], error: null };
    if (providerError) return json({ ok: false, error: providerError.message }, 500);

    return json({
      ok: true,
      since,
      generatedAt: new Date().toISOString(),
      runs: runs ?? [],
      scores: scores ?? [],
      alerts: alerts ?? [],
      providerVariance: providerVariance ?? [],
      summary: summarize(scores ?? [], alerts ?? []),
    });
  }),
);

function summarize(scores: Record<string, unknown>[], alerts: Record<string, unknown>[]) {
  const byModality = groupScores(scores, "modality");
  const byCefr = groupScores(scores, "expected_cefr");
  const byProvider = groupScores(scores, "provider");
  const retryVariance = groupRetry(scores);
  const taxonomy = groupTaxonomy(scores);
  const latency = scores.map((score) => Number(score.latency_ms ?? 0)).sort((a, b) => a - b);
  const successes = scores.filter((score) => score.status === "success");
  const malformed = scores.filter((score) => score.malformed === true || score.status === "malformed");
  return {
    scoreCount: scores.length,
    replaySuccessRate: ratio(successes.length, scores.length),
    malformedRate: ratio(malformed.length, scores.length),
    p95GradingLatencyMs: percentile(latency, 0.95),
    alertCount: alerts.length,
    criticalAlertCount: alerts.filter((alert) => alert.severity === "critical").length,
    byModality,
    byCefr,
    byProvider,
    retryVariance,
    taxonomy,
  };
}

function groupScores(scores: Record<string, unknown>[], key: string) {
  const out: Record<string, { count: number; successRate: number; malformedRate: number; p95LatencyMs: number }> = {};
  for (const value of new Set(scores.map((score) => String(score[key] ?? "unknown")))) {
    const subset = scores.filter((score) => String(score[key] ?? "unknown") === value);
    out[value] = {
      count: subset.length,
      successRate: ratio(subset.filter((score) => score.status === "success").length, subset.length),
      malformedRate: ratio(subset.filter((score) => score.malformed === true || score.status === "malformed").length, subset.length),
      p95LatencyMs: percentile(subset.map((score) => Number(score.latency_ms ?? 0)).sort((a, b) => a - b), 0.95),
    };
  }
  return out;
}

function groupRetry(scores: Record<string, unknown>[]) {
  const out: Record<string, number> = {};
  for (const score of scores) {
    const path = Array.isArray(score.retry_path) ? score.retry_path.join(">") : "unknown";
    out[path || "none"] = (out[path || "none"] ?? 0) + 1;
  }
  return out;
}

function groupTaxonomy(scores: Record<string, unknown>[]) {
  const out: Record<string, { count: number; malformedRate: number }> = {};
  for (const score of scores) {
    const tags = Array.isArray(score.taxonomy_tags) ? score.taxonomy_tags : [];
    for (const rawTag of tags) {
      const tag = String(rawTag);
      const current = out[tag] ?? { count: 0, malformedRate: 0 };
      current.count += 1;
      out[tag] = current;
    }
  }
  for (const tag of Object.keys(out)) {
    const subset = scores.filter((score) => Array.isArray(score.taxonomy_tags) && score.taxonomy_tags.includes(tag));
    out[tag].malformedRate = ratio(
      subset.filter((score) => score.malformed === true || score.status === "malformed").length,
      subset.length,
    );
  }
  return out;
}

function percentile(sortedAsc: number[], p: number): number {
  if (!sortedAsc.length) return 0;
  return sortedAsc[Math.min(sortedAsc.length - 1, Math.ceil(sortedAsc.length * p) - 1)];
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
