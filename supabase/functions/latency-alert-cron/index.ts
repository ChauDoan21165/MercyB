// PATH: supabase/functions/latency-alert-cron/index.ts
//
// 15-minute cron that scans MONITORED_OPERATIONS for slow degradation.
// On each operation:
//   1. compute_operation_p95(op, now() - 1h)  → current
//   2. compute_operation_p95(op, now() - 7d)  → baseline
//   3. classifyDegradation(...)               → status
//   4. decideAlert(...) using last hour of alert_history + alert_pause
//   5. on send: insert alert_history row + email admin@mercyblade.com
//
// Companion migration: 20260518000000_latency_events.sql.
// Companion config:    src/config/latencyThresholds.ts (mirrored in
//                       _shared/latencyDetection.ts because Deno can't
//                       reach into the React app's src/ tree).
//
// SCHEDULING
//   Run via Supabase scheduled triggers OR pg_cron via http RPC. The
//   simplest path: schedule via the dashboard's Edge Functions →
//   Schedule (every 15 minutes, no payload). Falling back to a manual
//   cron entry that hits the function URL with the SECURITY_ALERT_TOKEN
//   header is also supported — the function accepts both.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  classifyDegradation,
  decideAlert,
  LATENCY_THRESHOLDS,
  MIN_SAMPLES_FOR_ALERT,
  MONITORED_OPERATIONS,
  SUSTAINED_WINDOW_MINUTES,
  type DegradationResult,
} from "../_shared/latencyDetection.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Content-Type": "application/json",
};

const ADMIN_EMAIL = "admin@mercyblade.com";

interface CronResult {
  checked: number;
  alerts_sent: number;
  alerts_skipped: number;
  paused: boolean;
  results: Array<{
    operation: string;
    status: string;
    severity?: string;
    skipped_reason?: string;
    current_p95_ms: number;
    baseline_p95_ms: number;
    increase_percent: number;
  }>;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const expectedSecret = Deno.env.get("LATENCY_CRON_SECRET");
  if (expectedSecret) {
    const provided = req.headers.get("x-cron-secret");
    if (provided !== expectedSecret) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const result: CronResult = {
    checked: 0,
    alerts_sent: 0,
    alerts_skipped: 0,
    paused: false,
    results: [],
  };

  // Pause check.
  const { data: pauseRow } = await supabase
    .from("alert_pause")
    .select("paused_until")
    .eq("id", 1)
    .maybeSingle();
  const pausedUntil = (pauseRow as { paused_until?: string | null } | null)?.paused_until ?? null;
  if (pausedUntil && Date.parse(pausedUntil) > Date.now()) {
    result.paused = true;
  }

  for (const operation of MONITORED_OPERATIONS) {
    result.checked++;
    const degradation = await computeDegradation(supabase, operation);
    const threshold = LATENCY_THRESHOLDS[operation];

    // Read recent alert history for dedup + escalation.
    const sinceIso = new Date(
      Date.now() - SUSTAINED_WINDOW_MINUTES * 60_000,
    ).toISOString();
    const { data: recentAlertsRaw } = await supabase
      .from("alert_history")
      .select("sent_at, severity")
      .eq("operation", operation)
      .gte("sent_at", sinceIso)
      .order("sent_at", { ascending: false });
    const recentAlerts = (recentAlertsRaw ?? []) as Array<{
      sent_at: string;
      severity: string;
    }>;

    const decision = decideAlert({
      status: degradation.status,
      recentAlerts,
      pausedUntil,
    });

    const row = {
      operation,
      status: degradation.status,
      current_p95_ms: degradation.current_p95_ms,
      baseline_p95_ms: degradation.baseline_p95_ms,
      increase_percent: degradation.increase_percent,
    };

    if (!decision.send) {
      result.alerts_skipped++;
      result.results.push({ ...row, skipped_reason: decision.reason });
      continue;
    }

    // Insert history row first so a failed email still leaves a record
    // (and so the next cron's dedup window includes this attempt).
    const { error: insertErr } = await supabase
      .from("alert_history")
      .insert({
        operation,
        current_p95_ms: degradation.current_p95_ms,
        baseline_p95_ms: degradation.baseline_p95_ms,
        increase_percent: degradation.increase_percent,
        severity: decision.severity,
        email_sent: false,
        metadata: { sample_count: degradation.sample_count },
      });
    if (insertErr) {
      console.error("[latency-alert-cron] alert_history insert failed:", insertErr.message);
    }

    const emailOk = await sendAlertEmail({
      operation,
      severity: decision.severity,
      degradation,
      label: threshold?.label ?? operation,
      labelVi: threshold?.labelVi ?? operation,
    });

    if (emailOk) {
      await supabase
        .from("alert_history")
        .update({ email_sent: true })
        .eq("operation", operation)
        .order("sent_at", { ascending: false })
        .limit(1);
    }

    result.alerts_sent++;
    result.results.push({ ...row, severity: decision.severity });
  }

  return jsonResponse(result, 200);
});

async function computeDegradation(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  operation: string,
): Promise<DegradationResult> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [currentResp, baselineResp] = await Promise.all([
    supabase.rpc("compute_operation_p95", {
      p_operation: operation,
      p_since: oneHourAgo,
    }),
    supabase.rpc("compute_operation_p95", {
      p_operation: operation,
      p_since: sevenDaysAgo,
    }),
  ]);

  const current = (currentResp.data as Array<{ p95_ms?: number; sample_count?: number }> | null)?.[0];
  const baseline = (baselineResp.data as Array<{ p95_ms?: number; sample_count?: number }> | null)?.[0];

  const seedBaseline = LATENCY_THRESHOLDS[operation]?.baselineMs ?? 1000;
  const alertCeiling = LATENCY_THRESHOLDS[operation]?.alertMs;

  const baselineP95 =
    baseline && (baseline.sample_count ?? 0) >= MIN_SAMPLES_FOR_ALERT
      ? Number(baseline.p95_ms ?? 0)
      : seedBaseline;

  return classifyDegradation({
    operation,
    currentP95Ms: Number(current?.p95_ms ?? 0),
    baselineP95Ms: baselineP95,
    sampleCount: Number(current?.sample_count ?? 0),
    alertCeilingMs: alertCeiling,
  });
}

async function sendAlertEmail(args: {
  operation: string;
  severity: "alert" | "sustained";
  degradation: DegradationResult;
  label: string;
  labelVi: string;
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[latency-alert-cron] RESEND_API_KEY missing; skipping email");
    return false;
  }
  const resend = new Resend(apiKey);

  const isSustained = args.severity === "sustained";
  const emoji = isSustained ? "🚨" : "🐌";
  const titleEn = isSustained
    ? "SUSTAINED DEGRADATION"
    : "Slow degradation detected";
  const titleVi = isSustained
    ? "Chậm kéo dài"
    : "Phát hiện chậm bất thường";

  const subject = `${emoji} MercyBlade ${
    isSustained ? "SUSTAINED" : "slow"
  } degradation: ${args.operation} P95 up ${args.degradation.increase_percent}%`;

  const dashboardUrl = "https://mercyblade.com/admin/latency";

  const html = `
<!doctype html>
<html><body style="font-family: ui-sans-serif, system-ui; line-height: 1.5; color: #111">
  <h2 style="margin: 0 0 12px 0">${emoji} ${titleVi}</h2>
  <p style="margin: 0 0 16px 0; color: #444">
    <b>${args.labelVi}</b> đang chậm hơn bình thường.
  </p>
  <table cellpadding="6" style="border-collapse: collapse; font-size: 14px; margin-bottom: 16px">
    <tr><td><b>P95 hiện tại</b></td><td>${args.degradation.current_p95_ms} ms</td></tr>
    <tr><td><b>P95 baseline (7 ngày)</b></td><td>${args.degradation.baseline_p95_ms} ms</td></tr>
    <tr><td><b>Tăng</b></td><td>+${args.degradation.increase_percent}%</td></tr>
    <tr><td><b>Số mẫu (1h)</b></td><td>${args.degradation.sample_count}</td></tr>
    <tr><td><b>Mức độ</b></td><td>${isSustained ? "Kéo dài (cảnh báo lặp lại)" : "Cảnh báo lần đầu"}</td></tr>
  </table>
  <p style="margin: 0 0 8px 0">
    <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 14px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px">
      Xem dashboard /admin/latency
    </a>
  </p>
  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb" />
  <p style="font-size: 12px; color: #666">
    <b>${titleEn} (EN summary)</b><br/>
    Operation: ${args.operation}<br/>
    Current P95: ${args.degradation.current_p95_ms} ms · baseline: ${args.degradation.baseline_p95_ms} ms · +${args.degradation.increase_percent}%<br/>
    Samples in last hour: ${args.degradation.sample_count}.
  </p>
</body></html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: "MercyBlade Alerts <admin@mercyblade.com>",
      to: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject,
      html,
    });
    if (error) {
      console.error("[latency-alert-cron] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[latency-alert-cron] resend threw:", err);
    return false;
  }
}
