// PATH: supabase/functions/client-error-alert/index.ts
//
// R1 SENTINEL interim spike detector.
// Schedule every 5-10 minutes. Finds any 5xx client-error signature with
// >= 3 real, non-synthetic users in the last 10 minutes, dedupes
// through client_error_alert_history, and emails admin@mercyblade.com.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const ADMIN_EMAIL = "admin@mercyblade.com";
const WINDOW_MINUTES = 10;
const MIN_REAL_USERS = 3;
const DEDUPE_MINUTES = 60;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Content-Type": "application/json",
};

type ClientErrorRow = {
  id: string;
  created_at: string;
  route: string | null;
  user_id: string | null;
  build_sha: string | null;
  endpoint: string | null;
  status: number | null;
  method: string | null;
  duration_ms: number | null;
  error_signature: string;
};

type SignatureGroup = {
  signatureKey: string;
  errorSignature: string;
  route: string | null;
  endpoint: string | null;
  status: number | null;
  buildSha: string | null;
  rows: ClientErrorRow[];
  realUsers: Set<string>;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const expectedSecret = Deno.env.get("CLIENT_ERROR_ALERT_CRON_SECRET");
  if (expectedSecret) {
    const provided = req.headers.get("x-cron-secret");
    if (provided !== expectedSecret) return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "Missing Supabase service env" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = new Date();
  const since = new Date(now.getTime() - WINDOW_MINUTES * 60_000);
  const dedupeSince = new Date(now.getTime() - DEDUPE_MINUTES * 60_000);

  const { data, error } = await supabase
    .from("client_errors")
    .select("id,created_at,route,user_id,build_sha,endpoint,status,method,duration_ms,error_signature")
    .gte("created_at", since.toISOString())
    .gte("status", 500)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    console.error("[client-error-alert] query failed:", error.message);
    return jsonResponse({ error: error.message }, 500);
  }

  const rows = (data ?? []) as ClientErrorRow[];
  const userIds = [...new Set(rows.map((row) => row.user_id).filter((id): id is string => Boolean(id)))];
  const syntheticUserIds = new Set<string>();
  if (userIds.length > 0) {
    const { data: syntheticProfiles, error: syntheticErr } = await supabase
      .from("profiles")
      .select("id")
      .in("id", userIds)
      .eq("is_synthetic", true);
    if (syntheticErr) {
      console.error("[client-error-alert] synthetic profile query failed:", syntheticErr.message);
      return jsonResponse({ error: syntheticErr.message }, 500);
    }
    for (const profile of syntheticProfiles ?? []) syntheticUserIds.add(profile.id);
  }

  const groups = groupRows(rows, syntheticUserIds);
  const result = {
    checked: groups.length,
    sent: 0,
    skipped: 0,
    details: [] as Array<{ signature: string; outcome: string; real_users: number; events: number }>,
  };

  for (const group of groups) {
    if (group.realUsers.size < MIN_REAL_USERS) {
      result.skipped++;
      result.details.push({
        signature: group.errorSignature,
        outcome: "below_threshold",
        real_users: group.realUsers.size,
        events: group.rows.length,
      });
      continue;
    }

    const { data: recentAlerts, error: recentErr } = await supabase
      .from("client_error_alert_history")
      .select("id,created_at")
      .eq("signature_key", group.signatureKey)
      .gte("created_at", dedupeSince.toISOString())
      .limit(1);
    if (recentErr) {
      console.error("[client-error-alert] dedupe query failed:", recentErr.message);
      result.skipped++;
      result.details.push({
        signature: group.errorSignature,
        outcome: "dedupe_query_failed",
        real_users: group.realUsers.size,
        events: group.rows.length,
      });
      continue;
    }
    if ((recentAlerts ?? []).length > 0) {
      result.skipped++;
      result.details.push({
        signature: group.errorSignature,
        outcome: "deduped",
        real_users: group.realUsers.size,
        events: group.rows.length,
      });
      continue;
    }

    const diagnosis = diagnose(group);
    const dispatcher = await sendDispatcherAlert(group, diagnosis);
    const ok = dispatcher.ok || await sendAlertEmail(group, diagnosis, since, now);
    const { error: insertErr } = await supabase
      .from("client_error_alert_history")
      .insert({
        signature_key: group.signatureKey,
        error_signature: group.errorSignature,
        route: group.route,
        endpoint: group.endpoint,
        status: group.status,
        build_sha: group.buildSha,
        window_started_at: since.toISOString(),
        window_ended_at: now.toISOString(),
        real_user_count: group.realUsers.size,
        event_count: group.rows.length,
        email_sent: ok,
        diagnosis,
      });
    if (insertErr) console.error("[client-error-alert] history insert failed:", insertErr.message);

    result.sent++;
    result.details.push({
      signature: group.errorSignature,
      outcome: ok ? "sent" : "email_failed_history_recorded",
      real_users: group.realUsers.size,
      events: group.rows.length,
    });
  }

  return jsonResponse(result, 200);
});

function groupRows(rows: ClientErrorRow[], syntheticUserIds: Set<string>): SignatureGroup[] {
  const groups = new Map<string, SignatureGroup>();
  for (const row of rows) {
    if (row.user_id && syntheticUserIds.has(row.user_id)) continue;
    const actorKey = row.user_id ? `user:${row.user_id}` : `anonymous:${row.id}`;
    const key = [
      row.error_signature,
      row.status ?? "network",
      row.endpoint ?? "unknown",
      row.build_sha ?? "unknown",
    ].join("|");
    const existing = groups.get(key);
    if (existing) {
      existing.rows.push(row);
      existing.realUsers.add(actorKey);
      continue;
    }
    groups.set(key, {
      signatureKey: key,
      errorSignature: row.error_signature,
      route: row.route,
      endpoint: row.endpoint,
      status: row.status,
      buildSha: row.build_sha,
      rows: [row],
      realUsers: new Set([actorKey]),
    });
  }
  return [...groups.values()];
}

function diagnose(group: SignatureGroup): string {
  const endpoint = group.endpoint ?? "unknown endpoint";
  const route = group.route ?? "unknown route";
  if (endpoint.includes("/api/mercy-ai")) {
    return `Real users are receiving ${group.status ?? "5xx"} from /api/mercy-ai on ${route}. This points at the Cloudflare Pages function or upstream LLM path, not a client-only route bug. Check R2 Cloudflare logs for timeout/exception around build ${group.buildSha ?? "unknown"}.`;
  }
  return `Real users are receiving ${group.status ?? "5xx"} from ${endpoint} on ${route}. This is a server/API failure visible to clients; inspect the owning function or upstream service before changing UI code.`;
}

async function sendAlertEmail(
  group: SignatureGroup,
  diagnosis: string,
  since: Date,
  now: Date,
): Promise<boolean> {
  const apiKey = (Deno.env.get("RESEND_API_KEY") ?? "").trim();
  if (!apiKey) {
    console.warn("[client-error-alert] RESEND_API_KEY missing; skipping email");
    return false;
  }
  console.log("[client-error-alert] RESEND_API_KEY length:", apiKey.length);

  const resend = new Resend(apiKey);
  const subject = `R1 SENTINEL: ${group.status ?? "5xx"} spike ${group.endpoint ?? group.errorSignature}`;
  const text = [
    "MercyBlade R1 SENTINEL client-error spike",
    "",
    `Window: ${since.toISOString()} - ${now.toISOString()}`,
    `Impact: ${group.realUsers.size} real non-synthetic users, ${group.rows.length} events`,
    `Route: ${group.route ?? "unknown"}`,
    `Endpoint: ${group.endpoint ?? "unknown"}`,
    `Status: ${group.status ?? "unknown"}`,
    `Build: ${group.buildSha ?? "unknown"}`,
    `Signature: ${group.errorSignature}`,
    "",
    `Diagnosis: ${diagnosis}`,
    "",
    "Next action: inspect matching server logs and recent deploys for the endpoint above.",
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: "MercyBlade R1 Sentinel <admin@mercyblade.com>",
      to: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject,
      text,
    });
    if (error) {
      console.error("[client-error-alert] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[client-error-alert] resend threw:", err);
    return false;
  }
}

async function sendDispatcherAlert(
  group: SignatureGroup,
  diagnosis: string,
): Promise<{ ok: boolean; attempted: boolean }> {
  const dispatcherUrl = Deno.env.get("DISPATCHER_URL")?.trim();
  const dispatcherSecret = Deno.env.get("DISPATCHER_SECRET")?.trim();
  if (!dispatcherUrl || !dispatcherSecret) return { ok: false, attempted: false };

  try {
    const response = await fetch(dispatcherUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dispatcher-secret": dispatcherSecret,
      },
      body: JSON.stringify({
        robot: "R1 SENTINEL",
        severity: "high",
        signature: group.signatureKey,
        summary: `${group.realUsers.size} real users / ${group.rows.length} failed requests: ${group.errorSignature}`,
        evidence_url: "https://mercyblade.com/admin/frontend-perf",
        metadata: {
          route: group.route,
          endpoint: group.endpoint,
          status: group.status,
          buildSha: group.buildSha,
          diagnosis,
        },
      }),
    });
    if (!response.ok) {
      console.error("[client-error-alert] dispatcher failed:", response.status, await response.text());
      return { ok: false, attempted: true };
    }
    return { ok: true, attempted: true };
  } catch (err) {
    console.error("[client-error-alert] dispatcher threw:", err instanceof Error ? err.message : "unknown");
    return { ok: false, attempted: true };
  }
}
