// PATH: supabase/functions/r2-logwatch/index.ts
//
// R2 LOGWATCH Supabase-side scanner. Invoked by pg_cron every 15 minutes.
// Scans queryable server-side failure sources, dedupes through
// r2_logwatch_alert_history, and emails admin@mercyblade.com.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  diagnose,
  formatEmailText,
  groupEvents,
  type R2Event,
  type R2Group,
  type R2Source,
  SYNTHETIC_USER_ID_PREFIX,
} from "./core.ts";

const ADMIN_EMAIL = "admin@mercyblade.com";
const WINDOW_MINUTES = 15;
const DEDUPE_MINUTES = 60;
const MAX_ROWS_PER_SOURCE = 1000;
const PROJECT_REF = "buemdfxyhxunzpgdoqin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

type SourceResult = {
  source: R2Source;
  count: number;
  skipped?: boolean;
  reason?: string;
  error?: QueryError;
};

type QueryError = { code?: string; message?: string };
type QueryResult = { data: Record<string, unknown>[] | null; error: QueryError | null };
type QueryBuilder = PromiseLike<QueryResult> & {
  select(columns: string): QueryBuilder;
  insert(row: Record<string, unknown>): PromiseLike<{ error: QueryError | null }>;
  eq(column: string, value: unknown): QueryBuilder;
  neq(column: string, value: unknown): QueryBuilder;
  gte(column: string, value: unknown): QueryBuilder;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder;
  limit(count: number): QueryBuilder;
};
type SupabaseLogClient = {
  from(table: string): QueryBuilder;
  rpc(functionName: string, args?: Record<string, unknown>): PromiseLike<QueryResult>;
};

function queryErrorDetail(error: QueryError | null): QueryError | undefined {
  if (!error) return undefined;
  return {
    ...(error.code ? { code: error.code } : {}),
    ...(error.message ? { message: error.message } : {}),
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const selftest = url.searchParams.get("selftest") === "1";

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "Missing Supabase service env" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as SupabaseLogClient;

  const now = new Date();
  const since = new Date(now.getTime() - WINDOW_MINUTES * 60_000);
  const dedupeSince = new Date(now.getTime() - DEDUPE_MINUTES * 60_000);

  const sourceResults: SourceResult[] = [];
  const events: R2Event[] = [];

  for (const loader of [
    queryFunctionFailureLogs,
    queryCronFailures,
    queryNetHttpFailures,
    querySupabaseManagementLogs,
  ]) {
    const result = await loader(supabase, since, now);
    sourceResults.push(result.result);
    events.push(...result.events);
  }

  const groups = groupEvents(events, SYNTHETIC_USER_ID_PREFIX);
  const details = [] as Array<{
    signature: string;
    source: R2Source;
    outcome: string;
    count: number;
    first_seen_at: string;
    last_seen_at: string;
  }>;
  const alertable: R2Group[] = [];

  for (const group of groups) {
    const { data: recentAlerts, error: recentErr } = await supabase
      .from("r2_logwatch_alert_history")
      .select("id,created_at")
      .eq("signature_key", group.signatureKey)
      .gte("created_at", dedupeSince.toISOString())
      .limit(1);

    if (recentErr) {
      console.error("[r2-logwatch] dedupe query failed:", recentErr.message);
      details.push(detail(group, "dedupe_query_failed"));
      continue;
    }

    if ((recentAlerts ?? []).length > 0) {
      details.push(detail(group, "deduped"));
      continue;
    }

    alertable.push(group);
    details.push(detail(group, selftest ? "selftest_would_alert" : "pending_send"));
  }

  if (selftest) {
    return jsonResponse({
      selftest: true,
      window_started_at: since.toISOString(),
      window_ended_at: now.toISOString(),
      sources: sourceResults,
      checked: groups.length,
      would_alert: alertable.length,
      details,
    });
  }

  let emailSent = false;
  if (alertable.length > 0) {
    const dispatcherResults = await Promise.all(alertable.map((group) => sendDispatcherAlert(group)));
    const dispatcherFullyHandled = dispatcherResults.length > 0 && dispatcherResults.every((result) => result.ok);
    emailSent = dispatcherFullyHandled || await sendAlertEmail(alertable, since, now);
    for (const group of alertable) {
      const { error: insertErr } = await supabase
        .from("r2_logwatch_alert_history")
        .insert({
          signature_key: group.signatureKey,
          source: group.source,
          provider: group.provider,
          route: group.route,
          mode: group.mode,
          status: group.status,
          error_class: group.errorClass,
          window_started_at: since.toISOString(),
          window_ended_at: now.toISOString(),
          first_seen_at: group.firstSeenAt,
          last_seen_at: group.lastSeenAt,
          event_count: group.count,
          email_sent: emailSent,
          diagnosis: diagnose(group),
        });
      if (insertErr) console.error("[r2-logwatch] history insert failed:", insertErr.message);
    }
  }

  return jsonResponse({
    selftest: false,
    window_started_at: since.toISOString(),
    window_ended_at: now.toISOString(),
    sources: sourceResults,
    checked: groups.length,
    sent: emailSent ? 1 : 0,
    alertable: alertable.length,
    details: details.map((row) =>
      row.outcome === "pending_send" ? { ...row, outcome: emailSent ? "sent" : "email_failed_history_recorded" } : row
    ),
  });
});

function detail(group: R2Group, outcome: string) {
  return {
    signature: group.signatureKey,
    source: group.source,
    outcome,
    count: group.count,
    first_seen_at: group.firstSeenAt,
    last_seen_at: group.lastSeenAt,
  };
}

function isMissingRelation(error: { code?: string; message?: string } | null): boolean {
  return error?.code === "42P01" || /does not exist|not found|schema cache/i.test(error?.message ?? "");
}

async function queryFunctionFailureLogs(
  supabase: SupabaseLogClient,
  since: Date,
): Promise<{ result: SourceResult; events: R2Event[] }> {
  const { data, error } = await supabase
    .from("function_failure_logs")
    .select("id,created_at,source,function_name,endpoint,status,error_signature,message,request_id,user_id,detail")
    .gte("created_at", since.toISOString())
    .gte("status", 500)
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS_PER_SOURCE);

  if (error) {
    if (isMissingRelation(error)) {
      return {
        result: { source: "function_failure_logs", count: 0, skipped: true, reason: "table_not_present" },
        events: [],
      };
    }
    console.error("[r2-logwatch] function_failure_logs query failed:", error.message);
    return {
      result: {
        source: "function_failure_logs",
        count: 0,
        skipped: true,
        reason: "query_failed",
        error: queryErrorDetail(error),
      },
      events: [],
    };
  }

  const events = (data ?? []).map((row: Record<string, unknown>): R2Event => ({
    source: "function_failure_logs",
    id: String(row.id),
    occurredAt: String(row.created_at),
    provider: String(row.source ?? "unknown"),
    route: stringOrNull(row.endpoint),
    mode: stringOrNull(row.function_name),
    status: numberOrNull(row.status),
    errorClass: String(row.error_signature ?? "unknown"),
    message: stringOrNull(row.message),
    requestId: stringOrNull(row.request_id),
    userId: stringOrNull(row.user_id),
    detail: recordOrNull(row.detail),
  }));

  return { result: { source: "function_failure_logs", count: events.length }, events };
}

async function queryCronFailures(
  supabase: SupabaseLogClient,
  since: Date,
): Promise<{ result: SourceResult; events: R2Event[] }> {
  const { data, error } = await supabase.rpc("r2_recent_cron_failures", {
    window_start: since.toISOString(),
  });

  if (error) {
    console.error("[r2-logwatch] r2_recent_cron_failures query failed:", error.message);
    return {
      result: {
        source: "cron.job_run_details",
        count: 0,
        skipped: true,
        reason: "query_failed",
        error: queryErrorDetail(error),
      },
      events: [],
    };
  }

  const events = (data ?? []).map((row: Record<string, unknown>): R2Event => ({
    source: "cron.job_run_details",
    id: `${row.job_name ?? "job"}:${row.start_time ?? "run"}`,
    occurredAt: String(row.end_time ?? row.start_time),
    provider: "pg_cron",
    route: String(row.job_name ?? "unknown").slice(0, 160),
    mode: "postgres",
    status: null,
    errorClass: String(row.status ?? "failed"),
    message: stringOrNull(row.return_message),
    requestId: `${row.job_name ?? "job"}:${row.start_time ?? ""}`,
    userId: null,
  }));

  return { result: { source: "cron.job_run_details", count: events.length }, events };
}

async function queryNetHttpFailures(
  supabase: SupabaseLogClient,
  since: Date,
): Promise<{ result: SourceResult; events: R2Event[] }> {
  const { data, error } = await supabase.rpc("r2_recent_http_errors", {
    window_start: since.toISOString(),
  });

  if (error) {
    console.error("[r2-logwatch] r2_recent_http_errors query failed:", error.message);
    return {
      result: {
        source: "net._http_response",
        count: 0,
        skipped: true,
        reason: "query_failed",
        error: queryErrorDetail(error),
      },
      events: [],
    };
  }

  const events = (data ?? []).map((row: Record<string, unknown>): R2Event => ({
    source: "net._http_response",
    id: String(row.id),
    occurredAt: String(row.created),
    provider: "pg_net",
    route: null,
    mode: "http",
    status: numberOrNull(row.status_code),
    errorClass: `http_${row.status_code ?? "unknown"}`,
    message: stringOrNull(row.content),
    requestId: String(row.id),
    userId: null,
  }));

  return { result: { source: "net._http_response", count: events.length }, events };
}

async function querySupabaseManagementLogs(
  _supabase: SupabaseLogClient,
  since: Date,
  now: Date,
): Promise<{ result: SourceResult; events: R2Event[] }> {
  const token = Deno.env.get("SUPABASE_MGMT_TOKEN")?.trim();
  if (!token) return { result: { source: "supabase_mgmt_logs", count: 0, skipped: true, reason: "token_absent" }, events: [] };

  const ref = Deno.env.get("SUPABASE_PROJECT_REF")?.trim() || PROJECT_REF;
  const sql = [
    "select timestamp, event_message, metadata",
    "from edge_logs",
    "where timestamp >= timestamp_sub(now(), interval 15 minute)",
    "and (event_message ilike '%error%' or event_message ilike '%exception%' or event_message ilike '%fail%')",
    "limit 100",
  ].join(" ");
  const url = new URL(`https://api.supabase.com/v1/projects/${ref}/analytics/endpoints/logs.all`);
  url.searchParams.set("iso_timestamp_start", since.toISOString());
  url.searchParams.set("iso_timestamp_end", now.toISOString());
  url.searchParams.set("sql", sql);

  try {
    const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    const body = await response.text();
    if (!response.ok) {
      console.error("[r2-logwatch] Supabase Management logs query failed:", response.status, body.slice(0, 200));
      return { result: { source: "supabase_mgmt_logs", count: 0, skipped: true, reason: "query_failed" }, events: [] };
    }

    const parsed = JSON.parse(body) as { result?: unknown[] };
    const events = (parsed.result ?? []).map((row, index): R2Event => {
      const record = asRecord(row);
      return {
        source: "supabase_mgmt_logs",
        id: `mgmt:${index}:${String(record.timestamp ?? "")}`,
        occurredAt: String(record.timestamp ?? now.toISOString()),
        provider: "supabase_platform",
        route: null,
        mode: null,
        status: null,
        errorClass: "platform_log_error",
        message: stringOrNull(record.event_message),
        requestId: null,
        userId: null,
        detail: recordOrNull(record.metadata),
      };
    });
    return { result: { source: "supabase_mgmt_logs", count: events.length }, events };
  } catch (err) {
    console.error("[r2-logwatch] Supabase Management logs query threw:", err instanceof Error ? err.message : "unknown");
    return { result: { source: "supabase_mgmt_logs", count: 0, skipped: true, reason: "query_failed" }, events: [] };
  }
}

async function sendAlertEmail(groups: R2Group[], since: Date, now: Date): Promise<boolean> {
  const apiKey = (Deno.env.get("RESEND_API_KEY") ?? "").trim();
  if (!apiKey) {
    console.warn("[r2-logwatch] RESEND_API_KEY missing; skipping email");
    return false;
  }

  const resend = new Resend(apiKey);
  const subject = `MercyBlade R2 LOGWATCH: ${groups.length} server failure signature${groups.length === 1 ? "" : "s"}`;
  try {
    const { error } = await resend.emails.send({
      from: "MercyBlade R2 Logwatch <admin@mercyblade.com>",
      to: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject,
      text: formatEmailText(groups, since, now),
    });
    if (error) {
      console.error("[r2-logwatch] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[r2-logwatch] resend threw:", err instanceof Error ? err.message : "unknown");
    return false;
  }
}

async function sendDispatcherAlert(group: R2Group): Promise<{ ok: boolean; attempted: boolean }> {
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
        robot: "R2 LOGWATCH",
        severity: "high",
        signature: group.signatureKey,
        summary: `${group.count} server failure event(s): ${group.errorClass}`,
        evidence_url: "https://mercyblade.com/admin/slo",
        occurred_at: group.lastSeenAt,
        metadata: {
          source: group.source,
          provider: group.provider,
          route: group.route,
          mode: group.mode,
          status: group.status,
          firstSeenAt: group.firstSeenAt,
          requestIds: group.requestIds,
          diagnosis: diagnose(group),
        },
      }),
    });
    if (!response.ok) {
      console.error("[r2-logwatch] dispatcher failed:", response.status, await response.text());
      return { ok: false, attempted: true };
    }
    return { ok: true, attempted: true };
  } catch (err) {
    console.error("[r2-logwatch] dispatcher threw:", err instanceof Error ? err.message : "unknown");
    return { ok: false, attempted: true };
  }
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberOrNull(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function recordOrNull(value: unknown): Record<string, unknown> | null {
  const record = asRecord(value);
  return Object.keys(record).length > 0 ? record : null;
}
