// PATH: supabase/functions/error-budget-alert/index.ts
//
// Burn-rate alert cron. Schedule every hour via Supabase Edge Functions
// → Schedule (the FAST window is 1 hour, so checking more often than
// hourly is wasted work).
//
// Per SLO with data_source='latency_events':
//   1. Count good/total in last 1h (fast window) and last 6h (slow).
//   2. Compute burn rates against the SLO's allowed budget.
//   3. decideBurnAlert() — fires when fast ≥ 14.4× OR slow ≥ 6×.
//   4. On send: insert slo_burn_alerts row + email admin@mercyblade.com.
//   5. Auto-manage slo_incidents (open on critical, resolve on healthy
//      for INCIDENT_AUTO_RESOLVE_HOURS).
//
// Companion files:
//   - src/lib/admin/errorBudget.ts (canonical math, mirrored here)
//   - src/lib/admin/incidentLog.ts (incident lifecycle, mirrored here)
//   - supabase/migrations/20260520000000_slo_incidents.sql

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  BURN_RATE_RULES,
  classifyStatus,
  computeBurnRate,
  decideBurnAlert,
  INCIDENT_AUTO_RESOLVE_HOURS,
  MIN_BURN_SAMPLES,
  SLOS,
  type BudgetResult,
  type SloDefinition,
} from "../_shared/sloConfig.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Content-Type": "application/json",
};

const ADMIN_EMAIL = "admin@mercyblade.com";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

interface CountResult {
  good: number;
  total: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const expectedSecret = Deno.env.get("SLO_CRON_SECRET");
  if (expectedSecret) {
    const provided = req.headers.get("x-cron-secret");
    if (provided !== expectedSecret) return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data: pauseRow } = await supabase
    .from("alert_pause")
    .select("paused_until")
    .eq("id", 1)
    .maybeSingle();
  const pausedUntil = (pauseRow as { paused_until?: string | null } | null)?.paused_until ?? null;

  const results: Array<{ slo_id: string; status: string; severity?: string; skipped_reason?: string }> = [];
  let alertsSent = 0;
  let alertsSkipped = 0;
  let incidentsOpened = 0;
  let incidentsResolved = 0;

  for (const slo of SLOS) {
    if (slo.data_source !== "latency_events") {
      results.push({ slo_id: slo.id, status: "skipped_no_data_source" });
      continue;
    }
    if (!slo.operation || typeof slo.good_threshold_ms !== "number") continue;

    const fastSinceIso = new Date(
      Date.now() - BURN_RATE_RULES.FAST_WINDOW_HOURS * 3_600_000,
    ).toISOString();
    const slowSinceIso = new Date(
      Date.now() - BURN_RATE_RULES.SLOW_WINDOW_HOURS * 3_600_000,
    ).toISOString();
    const windowSinceIso = new Date(
      Date.now() - slo.window_days * 24 * 3_600_000,
    ).toISOString();

    const [windowCounts, fastCounts, slowCounts] = await Promise.all([
      countOutcomes(supabase, slo, windowSinceIso),
      countOutcomes(supabase, slo, fastSinceIso),
      countOutcomes(supabase, slo, slowSinceIso),
    ]);

    const budget = computeBudget(slo, windowCounts, fastCounts);

    const sloBudgetPercent = Math.max(0.0001, 100 - slo.target_percent);
    const fastBurn = computeBurnRate({
      sloBudgetPercent,
      burnWindowBadCount: fastCounts.total - fastCounts.good,
      burnWindowTotalCount: fastCounts.total,
    });
    const slowBurn = computeBurnRate({
      sloBudgetPercent,
      burnWindowBadCount: slowCounts.total - slowCounts.good,
      burnWindowTotalCount: slowCounts.total,
    });

    const sinceDedup = new Date(Date.now() - 24 * 3_600_000).toISOString();
    const { data: recentRaw } = await supabase
      .from("slo_burn_alerts")
      .select("sent_at, severity")
      .eq("slo_id", slo.id)
      .gte("sent_at", sinceDedup)
      .order("sent_at", { ascending: false });
    const recentAlerts = (recentRaw ?? []) as Array<{ sent_at: string; severity: string }>;

    const decision = decideBurnAlert({
      fastBurnRate: fastBurn,
      slowBurnRate: slowBurn,
      recentAlerts,
      pausedUntil,
    });

    if (decision.send) {
      const { error: insertErr } = await supabase.from("slo_burn_alerts").insert({
        slo_id: slo.id,
        severity: decision.severity,
        burn_rate: decision.severity === "fast" ? fastBurn : slowBurn,
        budget_remaining_percent: budget.budget_remaining_percent,
        email_sent: false,
      });
      if (insertErr) console.error("[error-budget-alert] alert insert failed:", insertErr.message);

      const emailOk = await sendBurnAlertEmail({
        slo,
        budget,
        severity: decision.severity,
        burnRate: decision.severity === "fast" ? fastBurn : slowBurn,
      });
      if (emailOk) {
        await supabase
          .from("slo_burn_alerts")
          .update({ email_sent: true })
          .eq("slo_id", slo.id)
          .order("sent_at", { ascending: false })
          .limit(1);
      }
      alertsSent++;
      results.push({ slo_id: slo.id, status: budget.status, severity: decision.severity });
    } else {
      alertsSkipped++;
      results.push({ slo_id: slo.id, status: budget.status, skipped_reason: decision.reason });
    }

    // Incident lifecycle.
    const { data: openIncRaw } = await supabase
      .from("slo_incidents")
      .select("id, slo_id, started_at, peak_burn_rate")
      .eq("slo_id", slo.id)
      .is("resolved_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const openIncident = openIncRaw as { id: number; peak_burn_rate: number | null } | null;

    if (budget.status === "critical" || budget.status === "exhausted") {
      if (!openIncident) {
        await supabase.from("slo_incidents").insert({
          slo_id: slo.id,
          peak_burn_rate: Math.max(fastBurn, slowBurn),
          peak_status: budget.status,
        });
        incidentsOpened++;
      } else {
        const newPeak = Math.max(openIncident.peak_burn_rate ?? 0, fastBurn, slowBurn);
        if (newPeak > (openIncident.peak_burn_rate ?? 0)) {
          await supabase
            .from("slo_incidents")
            .update({ peak_burn_rate: newPeak, peak_status: budget.status })
            .eq("id", openIncident.id);
        }
      }
    } else if (budget.status === "healthy" && openIncident) {
      // Resolve only if the SLO has been healthy for AUTO_RESOLVE_HOURS.
      // Heuristic: if no burn alert AND no critical reading in the last
      // AUTO_RESOLVE_HOURS, treat as resolved.
      const auto = INCIDENT_AUTO_RESOLVE_HOURS;
      const sinceHealthyIso = new Date(Date.now() - auto * 3_600_000).toISOString();
      const { data: recentBadRaw } = await supabase
        .from("slo_burn_alerts")
        .select("sent_at")
        .eq("slo_id", slo.id)
        .gte("sent_at", sinceHealthyIso)
        .limit(1);
      const recentBadCount = (recentBadRaw ?? []).length;
      if (recentBadCount === 0) {
        await supabase
          .from("slo_incidents")
          .update({ resolved_at: new Date().toISOString() })
          .eq("id", openIncident.id);
        incidentsResolved++;
      }
    }
  }

  return jsonResponse(
    {
      results,
      alerts_sent: alertsSent,
      alerts_skipped: alertsSkipped,
      incidents_opened: incidentsOpened,
      incidents_resolved: incidentsResolved,
    },
    200,
  );
});

async function countOutcomes(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  slo: SloDefinition,
  sinceIso: string,
): Promise<CountResult> {
  if (!slo.operation || typeof slo.good_threshold_ms !== "number") {
    return { good: 0, total: 0 };
  }
  const { data, error } = await supabase
    .from("latency_events")
    .select("duration_ms, status")
    .eq("operation", slo.operation)
    .gte("recorded_at", sinceIso);
  if (error || !data) return { good: 0, total: 0 };
  let good = 0;
  let total = 0;
  for (const row of data as Array<{ duration_ms: number; status: string }>) {
    total++;
    if (row.status === "success" && row.duration_ms <= slo.good_threshold_ms) good++;
  }
  return { good, total };
}

function computeBudget(
  slo: SloDefinition,
  windowCounts: CountResult,
  burnCounts: CountResult,
): BudgetResult {
  const total = windowCounts.total;
  const good = Math.min(total, windowCounts.good);
  const bad = Math.max(0, total - good);

  if (total < MIN_BURN_SAMPLES) {
    return {
      slo_id: slo.id,
      total_count: total,
      good_count: good,
      bad_count: bad,
      actual_percent: total === 0 ? 100 : (good / total) * 100,
      target_percent: slo.target_percent,
      budget_remaining_percent: 100,
      burn_rate_per_hour: 0,
      projected_exhaustion_at: null,
      status: "no_data",
    };
  }

  const actualPercent = (good / total) * 100;
  const budgetTotal = Math.max(0.0001, 100 - slo.target_percent);
  const consumedPercent = ((100 - actualPercent) / budgetTotal) * 100;
  const remainingPercent = Math.max(0, 100 - consumedPercent);

  const burnRate = computeBurnRate({
    sloBudgetPercent: budgetTotal,
    burnWindowBadCount: burnCounts.total - burnCounts.good,
    burnWindowTotalCount: burnCounts.total,
  });

  return {
    slo_id: slo.id,
    total_count: total,
    good_count: good,
    bad_count: bad,
    actual_percent: round2(actualPercent),
    target_percent: slo.target_percent,
    budget_remaining_percent: round2(remainingPercent),
    burn_rate_per_hour: round2(burnRate),
    projected_exhaustion_at: null,
    status: classifyStatus(remainingPercent),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

async function sendBurnAlertEmail(args: {
  slo: SloDefinition;
  budget: BudgetResult;
  severity: "fast" | "slow";
  burnRate: number;
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[error-budget-alert] RESEND_API_KEY missing; skipping email");
    return false;
  }
  const resend = new Resend(apiKey);

  const burnX = Math.round(args.burnRate * 10) / 10;
  const subject = `🔥 SLO burn rate alert: ${args.slo.name_en} is burning at ${burnX}× normal`;
  const dashboardUrl = `https://mercyblade.com/admin/slo/${args.slo.id}`;

  const isFast = args.severity === "fast";
  const windowLabelVi = isFast ? "1 giờ qua" : "6 giờ qua";
  const suggestionVi = isFast
    ? "Pause non-critical merges. Investigate the most recent change to azure-phoneme/ai-chat/mercy-tts. Roll back if needed."
    : "Pause non-critical merges. Review the last 6 hours of traffic patterns and recent deploys.";

  const html = `
<!doctype html>
<html><body style="font-family: ui-sans-serif, system-ui; line-height: 1.5; color: #111">
  <h2 style="margin: 0 0 12px 0">🔥 Cảnh báo cháy ngân sách lỗi</h2>
  <p style="margin: 0 0 16px 0; color: #444">
    SLO <b>${args.slo.name_vi}</b> đang đốt ngân sách lỗi nhanh hơn bình thường <b>${burnX}×</b>
    (cửa sổ ${windowLabelVi}).
  </p>
  <table cellpadding="6" style="border-collapse: collapse; font-size: 14px; margin-bottom: 16px">
    <tr><td><b>SLO</b></td><td>${args.slo.name_vi} / ${args.slo.id}</td></tr>
    <tr><td><b>Mục tiêu</b></td><td>${args.slo.target_percent}%</td></tr>
    <tr><td><b>Tỉ lệ đạt thực tế</b></td><td>${args.budget.actual_percent}%</td></tr>
    <tr><td><b>Ngân sách còn lại</b></td><td>${args.budget.budget_remaining_percent}%</td></tr>
    <tr><td><b>Burn rate</b></td><td>${burnX}× (cửa sổ ${windowLabelVi})</td></tr>
    <tr><td><b>Mức độ</b></td><td>${isFast ? "Khẩn (FAST)" : "Cảnh báo (SLOW)"}</td></tr>
  </table>
  <p style="margin: 0 0 4px 0"><b>Đề xuất:</b></p>
  <p style="margin: 0 0 16px 0; color: #444">${suggestionVi}</p>
  <p style="margin: 0 0 8px 0">
    <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 14px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px">
      Xem chi tiết SLO
    </a>
  </p>
  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb" />
  <p style="font-size: 12px; color: #666">
    <b>EN summary:</b> SLO ${args.slo.name_en} (${args.slo.id}) burn rate is ${burnX}× normal in the ${isFast ? "1-hour" : "6-hour"} window.
    Budget remaining: ${args.budget.budget_remaining_percent}%. Pause non-critical work and investigate.
  </p>
</body></html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: "MercyBlade SLO Alerts <admin@mercyblade.com>",
      to: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject,
      html,
    });
    if (error) {
      console.error("[error-budget-alert] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[error-budget-alert] resend threw:", err);
    return false;
  }
}
