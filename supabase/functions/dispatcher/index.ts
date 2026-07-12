// PATH: supabase/functions/dispatcher/index.ts
//
// Dispatcher: one alert triage front for R0/R1/R2/R3/R4 robots.
// Robots keep their direct email paths as fallback; this function is the
// consolidated, deduped primary path when reachable.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  buildDigestEmail,
  buildIncidentEmail,
  highestSeverity,
  normalizeAlert,
  normalizeSeverity,
  shouldAlert,
  type DispatcherSeverity,
  type NormalizedAlert,
} from "./core.ts";

const ADMIN_EMAIL = "admin@mercyblade.com";
const DIGEST_WINDOW_HOURS = 24;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-dispatcher-secret, x-cron-secret",
  "Content-Type": "application/json",
};

type QueryError = { code?: string; message?: string };
type QueryResult<T> = { data: T | null; error: QueryError | null };
type QueryBuilder<T = Record<string, unknown>[]> = PromiseLike<QueryResult<T>> & {
  select(columns: string): QueryBuilder<T>;
  insert(row: Record<string, unknown>): PromiseLike<QueryResult<T>>;
  upsert(row: Record<string, unknown>, options?: Record<string, unknown>): QueryBuilder<T>;
  update(row: Record<string, unknown>): QueryBuilder<T>;
  eq(column: string, value: unknown): QueryBuilder<T>;
  in(column: string, values: unknown[]): QueryBuilder<T>;
  gte(column: string, value: unknown): QueryBuilder<T>;
  lt(column: string, value: unknown): QueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  single(): PromiseLike<QueryResult<Record<string, unknown>>>;
};
type SupabaseDispatcherClient = {
  from(table: string): QueryBuilder;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function authorized(req: Request): boolean {
  const expected = Deno.env.get("DISPATCHER_SECRET")?.trim();
  if (!expected) return true;
  return req.headers.get("x-dispatcher-secret") === expected ||
    req.headers.get("x-cron-secret") === expected;
}

function supabaseClient(): SupabaseDispatcherClient {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase service env");
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as SupabaseDispatcherClient;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!authorized(req)) return jsonResponse({ error: "Unauthorized" }, 401);

  try {
    const url = new URL(req.url);
    if (req.method === "POST" && url.searchParams.get("digest") === "1") {
      return await sendDigest(supabaseClient());
    }
    if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

    const payload = await req.json();
    const alert = normalizeAlert(payload);
    return await receiveAlert(supabaseClient(), alert);
  } catch (err) {
    const message = err instanceof Error ? err.message : "dispatcher_failed";
    console.error("[dispatcher] request failed:", message);
    return jsonResponse({ error: message }, /required|invalid/i.test(message) ? 400 : 500);
  }
});

async function receiveAlert(
  supabase: SupabaseDispatcherClient,
  alert: NormalizedAlert,
): Promise<Response> {
  const minSeverity = normalizeSeverity(Deno.env.get("DISPATCHER_ALERT_MIN_SEVERITY") ?? "high");
  const alertable = shouldAlert(alert.severity, minSeverity);

  const { data: eventRows, error: eventErr } = await supabase
    .from("error_events")
    .insert({
      robot: alert.robot,
      severity: alert.severity,
      signature: alert.signature,
      incident_key: alert.incidentKey,
      summary: alert.summary,
      evidence_url: alert.evidenceUrl,
      occurred_at: alert.occurredAt,
      below_alert_threshold: !alertable,
      metadata: alert.metadata,
    })
    .select("id")
    .limit(1);
  if (eventErr) throw new Error(eventErr.message ?? "event_insert_failed");
  const eventId = String((eventRows as Record<string, unknown>[] | null)?.[0]?.id ?? "");

  const { data: existingIncident, error: existingErr } = await supabase
    .from("incidents")
    .select("id,status,severity,event_count,robots,first_seen_at,last_seen_at,email_sent_at")
    .eq("incident_key", alert.incidentKey)
    .limit(1)
    .single();
  if (existingErr && existingErr.code !== "PGRST116") {
    throw new Error(existingErr.message ?? "incident_lookup_failed");
  }

  const incident = await upsertIncident(supabase, alert, existingIncident, alertable);
  if (eventId) {
    await supabase.from("error_events").update({ incident_id: incident.id }).eq("id", eventId);
  }

  await supabase.from("error_signatures").upsert({
    signature: alert.signature,
    incident_key: alert.incidentKey,
    last_robot: alert.robot,
    last_severity: alert.severity,
    last_summary: alert.summary,
    last_seen_at: alert.occurredAt,
  }, { onConflict: "signature" });

  let emailSent = false;
  const shouldSendIncidentEmail = alertable && incident.status !== "resolved" && !incident.emailSentAt;
  if (shouldSendIncidentEmail) {
    const email = buildIncidentEmail({
      incidentId: incident.id,
      alert,
      eventCount: incident.eventCount,
      robots: incident.robots,
      firstSeenAt: incident.firstSeenAt,
      lastSeenAt: incident.lastSeenAt,
    });
    emailSent = await sendEmail("MercyBlade Dispatcher <admin@mercyblade.com>", email.subject, email.text);
    await supabase.from("alert_threads").insert({
      incident_id: incident.id,
      thread_type: "incident",
      subject: email.subject,
      email_sent: emailSent,
      sent_at: emailSent ? new Date().toISOString() : null,
    });
    await supabase.from("alert_history").insert({
      incident_id: incident.id,
      event_id: eventId || null,
      alert_type: "incident",
      robot: alert.robot,
      signature: alert.signature,
      severity: alert.severity,
      email_sent: emailSent,
      subject: email.subject,
    });
    if (emailSent) {
      await supabase
        .from("incidents")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("id", incident.id);
    }
  }

  return jsonResponse({
    ok: true,
    incident_id: incident.id,
    incident_status: incident.status,
    deduped: Boolean(existingIncident),
    below_alert_threshold: !alertable,
    email_sent: emailSent,
  });
}

async function upsertIncident(
  supabase: SupabaseDispatcherClient,
  alert: NormalizedAlert,
  existing: Record<string, unknown> | null,
  alertable: boolean,
) {
  if (!existing) {
    const { data, error } = await supabase
      .from("incidents")
      .insert({
        incident_key: alert.incidentKey,
        signature: alert.signature,
        status: alertable ? "open" : "open",
        severity: alert.severity,
        summary: alert.summary,
        evidence_url: alert.evidenceUrl,
        robots: [alert.robot],
        event_count: 1,
        first_seen_at: alert.occurredAt,
        last_seen_at: alert.occurredAt,
        below_alert_threshold: !alertable,
      })
      .select("id,status,severity,event_count,robots,first_seen_at,last_seen_at,email_sent_at")
      .limit(1);
    if (error) throw new Error(error.message ?? "incident_insert_failed");
    return rowToIncident((data as Record<string, unknown>[] | null)?.[0]);
  }

  const robots = new Set<string>(Array.isArray(existing.robots) ? existing.robots.map(String) : []);
  robots.add(alert.robot);
  const currentSeverity = normalizeSeverity(existing.severity);
  const nextSeverity = highestSeverity(currentSeverity, alert.severity);
  const eventCount = Number(existing.event_count ?? 0) + 1;
  const firstSeenAt = String(existing.first_seen_at ?? alert.occurredAt);
  const lastSeenAt = new Date(String(existing.last_seen_at ?? alert.occurredAt)) > new Date(alert.occurredAt)
    ? String(existing.last_seen_at)
    : alert.occurredAt;

  const { data, error } = await supabase
    .from("incidents")
    .update({
      severity: nextSeverity,
      summary: alert.summary,
      evidence_url: alert.evidenceUrl,
      robots: [...robots],
      event_count: eventCount,
      last_seen_at: lastSeenAt,
      below_alert_threshold: Boolean(existing.below_alert_threshold) && !alertable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .select("id,status,severity,event_count,robots,first_seen_at,last_seen_at,email_sent_at")
    .limit(1);
  if (error) throw new Error(error.message ?? "incident_update_failed");
  return rowToIncident((data as Record<string, unknown>[] | null)?.[0], {
    firstSeenAt,
    eventCount,
    robots: [...robots],
  });
}

function rowToIncident(
  row: Record<string, unknown> | undefined,
  fallback: Partial<{
    firstSeenAt: string;
    eventCount: number;
    robots: string[];
  }> = {},
) {
  if (!row?.id) throw new Error("incident_row_missing");
  return {
    id: String(row.id),
    status: String(row.status ?? "open"),
    severity: normalizeSeverity(row.severity),
    eventCount: Number(row.event_count ?? fallback.eventCount ?? 1),
    robots: Array.isArray(row.robots) ? row.robots.map(String) : fallback.robots ?? [],
    firstSeenAt: String(row.first_seen_at ?? fallback.firstSeenAt ?? new Date().toISOString()),
    lastSeenAt: String(row.last_seen_at ?? new Date().toISOString()),
    emailSentAt: row.email_sent_at ? String(row.email_sent_at) : null,
  };
}

async function sendDigest(supabase: SupabaseDispatcherClient): Promise<Response> {
  const now = new Date();
  const since = new Date(now.getTime() - DIGEST_WINDOW_HOURS * 60 * 60_000);

  const { data, error } = await supabase
    .from("error_events")
    .select("robot,severity,signature,summary,evidence_url,occurred_at,metadata")
    .eq("below_alert_threshold", true)
    .gte("occurred_at", since.toISOString())
    .lt("occurred_at", now.toISOString())
    .order("occurred_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message ?? "digest_query_failed");

  const events = ((data ?? []) as Record<string, unknown>[]).map((row) =>
    normalizeAlert({
      robot: row.robot,
      severity: row.severity,
      signature: row.signature,
      summary: row.summary,
      evidence_url: row.evidence_url,
      occurred_at: row.occurred_at,
      metadata: row.metadata,
    })
  );

  if (events.length === 0) {
    return jsonResponse({
      ok: true,
      digest_sent: false,
      reason: "no_below_threshold_events",
      window_started_at: since.toISOString(),
      window_ended_at: now.toISOString(),
    });
  }

  const email = buildDigestEmail({
    events,
    since: since.toISOString(),
    until: now.toISOString(),
  });
  const emailSent = await sendEmail("MercyBlade Dispatcher <admin@mercyblade.com>", email.subject, email.text);
  await supabase.from("alert_threads").insert({
    incident_id: null,
    thread_type: "daily_digest",
    subject: email.subject,
    email_sent: emailSent,
    sent_at: emailSent ? now.toISOString() : null,
  });
  await supabase.from("alert_history").insert({
    incident_id: null,
    event_id: null,
    alert_type: "daily_digest",
    robot: "DISPATCHER",
    signature: "below-threshold-digest",
    severity: "info",
    email_sent: emailSent,
    subject: email.subject,
  });

  return jsonResponse({
    ok: true,
    digest_sent: emailSent,
    events: events.length,
    window_started_at: since.toISOString(),
    window_ended_at: now.toISOString(),
  });
}

async function sendEmail(from: string, subject: string, text: string): Promise<boolean> {
  const apiKey = (Deno.env.get("RESEND_API_KEY") ?? "").trim();
  if (!apiKey) {
    console.warn("[dispatcher] RESEND_API_KEY missing; skipping email");
    return false;
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject,
      text,
    });
    if (error) {
      console.error("[dispatcher] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[dispatcher] resend threw:", err instanceof Error ? err.message : "unknown");
    return false;
  }
}
