// PATH: supabase/functions/_shared/latencyTelemetry.ts
//
// Fire-and-forget latency recorder for critical edge functions.
//
// Why fire-and-forget: telemetry must never block the user request. If
// the latency_events insert fails or the table is missing, the request
// path keeps working. The cost we pay is occasional silently-dropped
// rows; the price we'd pay otherwise is a slow-telemetry stack stalling
// every Mercy chat reply.
//
// Companion migration: 20260518000000_latency_events.sql.
// Companion alert pipeline: supabase/functions/latency-alert-cron/.

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export type LatencyStatus = "success" | "error" | "timeout";

export type LatencyOperation =
  | "azure-phoneme.total"
  | "azure-phoneme.azure-call"
  | "ai-chat.total"
  | "ai-chat.llm-call"
  | "mercy-tts.total"
  | "mercy-tts.elevenlabs-call"
  | "mercy-guide.total";

export interface LatencyTrackArgs {
  operation: LatencyOperation | string;
  startedAt: number;
  status?: LatencyStatus;
  metadata?: Record<string, unknown>;
}

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

/**
 * Record one latency sample. Returns immediately — the DB insert is
 * scheduled on the microtask queue so the caller's response path is
 * unaffected. Errors are logged but never thrown.
 *
 * Pass `performance.now()` (or `Date.now()`) at the start of the
 * tracked block as `startedAt`; the helper computes the duration.
 */
export function trackLatency(args: LatencyTrackArgs): void {
  const durationMs = Math.max(0, Math.round(performance.now() - args.startedAt));
  const status: LatencyStatus = args.status ?? "success";

  // Schedule on the microtask queue. The serverless runtime keeps
  // background promises alive for a short tail after `serve` resolves
  // the response — long enough for a single insert.
  queueMicrotask(() => {
    void writeLatencyEvent({
      operation: args.operation,
      durationMs,
      status,
      metadata: args.metadata,
    }).catch((err) => {
      // Never let telemetry failures bubble.
      console.warn("[latencyTelemetry] insert failed:", err);
    });
  });
}

/**
 * Variant that accepts the raw duration. Use when you measured the
 * elapsed time yourself (e.g. wrapping `Date.now() - t0` from a
 * pre-existing instrumentation point).
 */
export function trackLatencyMs(
  operation: LatencyOperation | string,
  durationMs: number,
  options?: { status?: LatencyStatus; metadata?: Record<string, unknown> },
): void {
  const safeDuration = Math.max(0, Math.round(durationMs));
  const status: LatencyStatus = options?.status ?? "success";
  queueMicrotask(() => {
    void writeLatencyEvent({
      operation,
      durationMs: safeDuration,
      status,
      metadata: options?.metadata,
    }).catch((err) => {
      console.warn("[latencyTelemetry] insert failed:", err);
    });
  });
}

async function writeLatencyEvent(args: {
  operation: string;
  durationMs: number;
  status: LatencyStatus;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const client = getClient();
  if (!client) {
    // Telemetry without service-role creds is a soft no-op. Logged once
    // per cold start by the caller's startup; we don't spam here.
    return;
  }
  const { error } = await client.from("latency_events").insert({
    operation: args.operation,
    duration_ms: args.durationMs,
    status: args.status,
    metadata: args.metadata ?? {},
  });
  if (error) {
    console.warn("[latencyTelemetry] insert error:", error.message);
  }
}

/**
 * Convenience wrapper: time an async block and emit one event when it
 * resolves or rejects. The wrapped block's value/error is propagated
 * unchanged so this is a transparent passthrough.
 */
export async function withLatencyTracking<T>(
  operation: LatencyOperation | string,
  fn: () => Promise<T>,
  options?: { metadata?: Record<string, unknown> },
): Promise<T> {
  const startedAt = performance.now();
  try {
    const result = await fn();
    trackLatency({
      operation,
      startedAt,
      status: "success",
      metadata: options?.metadata,
    });
    return result;
  } catch (err) {
    const isTimeout =
      err instanceof Error &&
      (err.name === "AbortError" || /timeout/i.test(err.message));
    trackLatency({
      operation,
      startedAt,
      status: isTimeout ? "timeout" : "error",
      metadata: {
        ...(options?.metadata ?? {}),
        error: err instanceof Error ? err.message.slice(0, 200) : String(err),
      },
    });
    throw err;
  }
}

// Re-exported solely so test harnesses can reset the cached singleton.
export function __resetLatencyClientForTests(): void {
  cachedClient = null;
}
