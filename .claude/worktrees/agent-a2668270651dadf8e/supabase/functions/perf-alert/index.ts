// PATH: supabase/functions/perf-alert/index.ts
//
// Slow-route detector. Schedule hourly via Supabase Edge Functions →
// Schedule. For each distinct route observed in the last hour, computes
// the LCP P95. If P95 ≥ PERF_ALERT_RULES.LCP_ALERT_MS for that hour, emails
// admin@mercyblade.com (bilingual VI primary).
//
// Dedup: 1 alert per route per 4 hours (perf_alert_history.sent_at).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  decidePerfAlert,
  PERF_ALERT_RULES,
} from "../_shared/perfDetection.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Content-Type": "application/json",
};

const ADMIN_EMAIL = "admin@mercyblade.com";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const expectedSecret = Deno.env.get("PERF_CRON_SECRET");
  if (expectedSecret) {
    const provided = req.headers.get("x-cron-secret");
    if (provided !== expectedSecret) return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  // Discover the routes that received LCP samples in the alert window.
  const sinceIso = new Date(
    Date.now() - PERF_ALERT_RULES.ALERT_WINDOW_HOURS * 3_600_000,
  ).toISOString();

  const { data: routesRaw, error: discoverErr } = await supabase
    .from("web_vitals_events")
    .select("route")
    .eq("metric_name", "LCP")
    .gte("recorded_at", sinceIso);
  if (discoverErr) {
    console.error("[perf-alert] discover failed:", discoverErr.message);
    return jsonResponse({ error: discoverErr.message }, 500);
  }
  const distinctRoutes = Array.from(
    new Set(((routesRaw ?? []) as { route: string }[]).map((r) => r.route)),
  );

  const result = {
    routes_checked: distinctRoutes.length,
    alerts_sent: 0,
    alerts_skipped: 0,
    details: [] as Array<{ route: string; outcome: string; p95?: number; samples?: number }>,
  };

  for (const route of distinctRoutes) {
    const [{ data: p95Resp }, { data: recentRaw }] = await Promise.all([
      supabase.rpc("compute_route_p95", {
        p_route: route,
        p_metric_name: "LCP",
        p_since: sinceIso,
      }),
      supabase
        .from("perf_alert_history")
        .select("sent_at")
        .eq("route", route)
        .eq("metric_name", "LCP")
        .gte("sent_at", new Date(Date.now() - 24 * 3_600_000).toISOString())
        .order("sent_at", { ascending: false }),
    ]);

    const p95Row = (p95Resp as Array<{ p95_value?: number; sample_count?: number }> | null)?.[0];
    const currentP95 = Number(p95Row?.p95_value ?? 0);
    const sampleCount = Number(p95Row?.sample_count ?? 0);
    const recentAlerts = (recentRaw ?? []) as Array<{ sent_at: string }>;

    const decision = decidePerfAlert({
      currentP95Ms: currentP95,
      thresholdMs: PERF_ALERT_RULES.LCP_ALERT_MS,
      sampleCount,
      recentAlerts,
    });

    if (!decision.send) {
      result.alerts_skipped++;
      result.details.push({
        route,
        outcome: decision.reason,
        p95: currentP95,
        samples: sampleCount,
      });
      continue;
    }

    const { error: insertErr } = await supabase.from("perf_alert_history").insert({
      route,
      metric_name: "LCP",
      current_p95_ms: currentP95,
      threshold_ms: PERF_ALERT_RULES.LCP_ALERT_MS,
      sample_count: sampleCount,
      email_sent: false,
    });
    if (insertErr) console.error("[perf-alert] insert failed:", insertErr.message);

    const ok = await sendPerfAlertEmail({
      route,
      currentP95,
      sampleCount,
    });
    if (ok) {
      await supabase
        .from("perf_alert_history")
        .update({ email_sent: true })
        .eq("route", route)
        .eq("metric_name", "LCP")
        .order("sent_at", { ascending: false })
        .limit(1);
    }
    result.alerts_sent++;
    result.details.push({ route, outcome: "sent", p95: currentP95, samples: sampleCount });
  }

  return jsonResponse(result, 200);
});

async function sendPerfAlertEmail(args: {
  route: string;
  currentP95: number;
  sampleCount: number;
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[perf-alert] RESEND_API_KEY missing; skipping email");
    return false;
  }
  const resend = new Resend(apiKey);

  const subject = `🐢 Slow page alert: ${args.route} LCP P95 = ${Math.round(args.currentP95)}ms`;
  const dashboardUrl = "https://mercyblade.com/admin/frontend-perf";

  const html = `
<!doctype html>
<html><body style="font-family: ui-sans-serif, system-ui; line-height: 1.5; color: #111">
  <h2 style="margin: 0 0 12px 0">🐢 Trang đang tải chậm bất thường</h2>
  <p style="margin: 0 0 16px 0; color: #444">
    Trang <b>${args.route}</b> đang có LCP P95 = <b>${Math.round(args.currentP95)} ms</b>
    trong giờ vừa qua, vượt ngưỡng cảnh báo <b>${PERF_ALERT_RULES.LCP_ALERT_MS} ms</b>.
  </p>
  <table cellpadding="6" style="border-collapse: collapse; font-size: 14px; margin-bottom: 16px">
    <tr><td><b>Route</b></td><td>${args.route}</td></tr>
    <tr><td><b>LCP P95 hiện tại</b></td><td>${Math.round(args.currentP95)} ms</td></tr>
    <tr><td><b>Ngưỡng cảnh báo</b></td><td>${PERF_ALERT_RULES.LCP_ALERT_MS} ms</td></tr>
    <tr><td><b>Số mẫu (1h)</b></td><td>${args.sampleCount}</td></tr>
  </table>
  <p style="margin: 0 0 8px 0">
    <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 14px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px">
      Mở dashboard /admin/frontend-perf
    </a>
  </p>
  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb" />
  <p style="font-size: 12px; color: #666">
    <b>EN summary:</b> Route ${args.route} LCP P95 = ${Math.round(args.currentP95)}ms over the last hour
    (${args.sampleCount} samples), above the ${PERF_ALERT_RULES.LCP_ALERT_MS}ms alert threshold.
    Investigate recent changes that touched this route's bundle.
  </p>
</body></html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: "MercyBlade Perf Alerts <admin@mercyblade.com>",
      to: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject,
      html,
    });
    if (error) {
      console.error("[perf-alert] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[perf-alert] resend threw:", err);
    return false;
  }
}
