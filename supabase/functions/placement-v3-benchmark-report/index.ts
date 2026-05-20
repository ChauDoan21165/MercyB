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
  wrapHandler("placement-v3-benchmark-report", async (req) => {
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
      new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? 200)));

    const { data: runs, error: runsError } = await db
      .from("placement_v3_benchmark_runs")
      .select("*")
      .gte("started_at", since)
      .order("started_at", { ascending: false })
      .limit(limit);
    if (runsError) return json({ ok: false, error: runsError.message }, 500);

    const runIds = (runs ?? []).map((row: { id: string }) => row.id);
    const { data: steps, error: stepsError } = runIds.length
      ? await db
        .from("placement_v3_benchmark_steps")
        .select("*")
        .in("run_id", runIds)
      : { data: [], error: null };
    if (stepsError) return json({ ok: false, error: stepsError.message }, 500);

    return json({
      ok: true,
      since,
      generatedAt: new Date().toISOString(),
      runs: runs ?? [],
      steps: steps ?? [],
      summary: summarize(runs ?? [], steps ?? []),
    });
  }),
);

function summarize(runs: Record<string, unknown>[], steps: Record<string, unknown>[]) {
  const durations = steps.map((row) => Number(row.duration_ms ?? 0)).sort((a, b) => a - b);
  const failovers = steps.filter((row) => row.failover === true);
  const errors = steps.filter((row) => row.status !== "success");
  const providerCounts: Record<string, number> = {};
  const modalityCounts: Record<string, number> = {};
  for (const row of steps) {
    const provider = String(row.provider ?? "none");
    const modality = String(row.modality ?? "unknown");
    providerCounts[provider] = (providerCounts[provider] ?? 0) + 1;
    modalityCounts[modality] = (modalityCounts[modality] ?? 0) + 1;
  }
  return {
    runCount: runs.length,
    stepCount: steps.length,
    p50LatencyMs: percentile(durations, 0.5),
    p95LatencyMs: percentile(durations, 0.95),
    estimatedCostUsd: round(sum(runs, "estimated_cost_usd")),
    avgCostPerSessionUsd: runs.length ? round(sum(runs, "estimated_cost_usd") / runs.length) : 0,
    tokensInput: sum(runs, "total_tokens_input"),
    tokensOutput: sum(runs, "total_tokens_output"),
    failoverRate: steps.length ? round(failovers.length / steps.length) : 0,
    errorRate: steps.length ? round(errors.length / steps.length) : 0,
    providerCounts,
    modalityCounts,
  };
}

function percentile(sortedAsc: number[], p: number): number {
  if (!sortedAsc.length) return 0;
  return sortedAsc[Math.min(sortedAsc.length - 1, Math.ceil(sortedAsc.length * p) - 1)];
}

function sum(rows: Record<string, unknown>[], column: string): number {
  return rows.reduce((total, row) => total + Number(row[column] ?? 0), 0);
}

function round(value: number): number {
  return Number(value.toFixed(6));
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
