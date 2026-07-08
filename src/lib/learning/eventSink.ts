// src/lib/learning/eventSink.ts
//
// WP-PHASE2-01 v2 — durable learning-event sink (client side).
//
// Consumes the Lane A drain API (peekPendingEvents / ackEvents) and flushes
// safe, sanitized learning events to the Supabase `learning_events` table.
// localStorage remains the offline queue; this only *drains* it — events are
// removed only after a confirmed insert, so a failed flush loses nothing.
//
// Guarantees:
//   - Read-only w.r.t. Lane A: imports the drain API, never mutates tutor code.
//   - Never inserts raw learner text / audio / transcripts — payload is an
//     allowlist (the queued LearningEvent is already sanitized upstream).
//   - RLS-safe: sets user_id = current auth user; skips flush when signed out
//     (an anonymous insert cannot satisfy `user_id = auth.uid()`).
//   - Best-effort: any insert error triggers exponential backoff and leaves the
//     queue intact (no ack). The localStorage queue is bounded upstream
//     (200 events / 30 days), so unsent events can never grow without bound.
//   - Off by default behind VITE_LEARNING_EVENT_SINK_ENABLED.

import { supabase } from "@/lib/supabaseClient";
import { ackEvents, peekPendingEvents, type LearningEvent } from "@/lib/tutor/learningEvents";

export const LEARNING_EVENTS_TABLE = "learning_events";

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_SIZE_THRESHOLD = 25;
const DEFAULT_FLUSH_INTERVAL_MS = 30_000;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 5 * 60_000;

/** Row shape written to Supabase. Mirrors the migration columns exactly. */
export type LearningEventRow = {
  user_id: string;
  event_type: string;
  rule_or_detector_id: string | null;
  payload: Record<string, unknown>;
  client_ts: string | null;
  session_id: string | null;
  app_version: string | null;
};

export type InsertResult = { error: unknown | null };

export type LearningEventSinkDeps = {
  peek?: (limit: number) => LearningEvent[];
  ack?: (ids: string[]) => void;
  insertRows?: (rows: LearningEventRow[]) => Promise<InsertResult>;
  getUserId?: () => Promise<string | null>;
  now?: () => number;
  batchSize?: number;
  sizeThreshold?: number;
  flushIntervalMs?: number;
  appVersion?: string | null;
  enabled?: boolean;
};

export type FlushOutcome = {
  flushed: number;
  skipped?: "disabled" | "backoff" | "empty" | "signed_out";
  error?: unknown;
};

/**
 * Whether the sink is enabled. Off unless VITE_LEARNING_EVENT_SINK_ENABLED is
 * exactly "true". Kept as a function so tests and callers read the live value.
 */
export function isLearningEventSinkEnabled(): boolean {
  try {
    return import.meta.env?.VITE_LEARNING_EVENT_SINK_ENABLED === "true";
  } catch {
    return false;
  }
}

/**
 * Map a queued (already-sanitized) LearningEvent to a Supabase row. Only
 * allowlisted, non-PII fields are carried into `payload`; unknown/raw fields
 * cannot appear because the LearningEvent type does not model them.
 */
export function toLearningEventRow(
  event: LearningEvent,
  userId: string,
  appVersion: string | null,
): LearningEventRow {
  const payload: Record<string, unknown> = {};
  if (event.product !== undefined) payload.product = event.product;
  if (event.targetLanguage !== undefined) payload.target_language = event.targetLanguage;
  if (event.mode !== undefined) payload.mode = event.mode;
  if (event.safeTopicTag !== undefined) payload.safe_topic_tag = event.safeTopicTag;
  if (event.count !== undefined) payload.count = event.count;
  if (event.value !== undefined) payload.value = event.value;

  return {
    user_id: userId,
    event_type: event.eventType,
    rule_or_detector_id: event.ruleOrDetectorId ?? null,
    payload,
    client_ts: Number.isFinite(event.timestamp) ? new Date(event.timestamp).toISOString() : null,
    session_id: event.sessionId ?? null,
    app_version: appVersion ?? null,
  };
}

async function defaultInsertRows(rows: LearningEventRow[]): Promise<InsertResult> {
  const { error } = await supabase.from(LEARNING_EVENTS_TABLE).insert(rows);
  return { error: error ?? null };
}

async function defaultGetUserId(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export type LearningEventSink = {
  flush: () => Promise<FlushOutcome>;
  maybeFlushOnSize: () => Promise<FlushOutcome>;
  start: () => void;
  stop: () => void;
  isEnabled: () => boolean;
};

/**
 * Create a sink instance. Dependencies are injectable so the batching/ack/
 * backoff logic is unit-testable without a real Supabase client or timers.
 */
export function createLearningEventSink(deps: LearningEventSinkDeps = {}): LearningEventSink {
  const peek = deps.peek ?? peekPendingEvents;
  const ack = deps.ack ?? ackEvents;
  const insertRows = deps.insertRows ?? defaultInsertRows;
  const getUserId = deps.getUserId ?? defaultGetUserId;
  const now = deps.now ?? (() => Date.now());
  const batchSize = clampPositive(deps.batchSize, DEFAULT_BATCH_SIZE);
  const sizeThreshold = clampPositive(deps.sizeThreshold, DEFAULT_SIZE_THRESHOLD);
  const flushIntervalMs = clampPositive(deps.flushIntervalMs, DEFAULT_FLUSH_INTERVAL_MS);
  const appVersion = deps.appVersion ?? readAppVersion();
  const enabled = deps.enabled ?? isLearningEventSinkEnabled();

  let backoffUntil = 0;
  let backoffAttempts = 0;
  let inFlight = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  function backoff(): void {
    backoffAttempts += 1;
    const delay = Math.min(BASE_BACKOFF_MS * 2 ** (backoffAttempts - 1), MAX_BACKOFF_MS);
    backoffUntil = now() + delay;
  }

  function resetBackoff(): void {
    backoffAttempts = 0;
    backoffUntil = 0;
  }

  async function flush(): Promise<FlushOutcome> {
    if (!enabled) return { flushed: 0, skipped: "disabled" };
    if (now() < backoffUntil) return { flushed: 0, skipped: "backoff" };
    if (inFlight) return { flushed: 0, skipped: "empty" };

    inFlight = true;
    try {
      const batch = peek(batchSize);
      if (batch.length === 0) return { flushed: 0, skipped: "empty" };

      const userId = await getUserId();
      if (!userId) return { flushed: 0, skipped: "signed_out" };

      const rows = batch.map((event) => toLearningEventRow(event, userId, appVersion));
      const { error } = await insertRows(rows);
      if (error) {
        backoff(); // keep the events queued; retry after the delay
        return { flushed: 0, error };
      }

      const ids = batch.map((event) => event.id).filter((id): id is string => Boolean(id));
      ack(ids);
      resetBackoff();
      return { flushed: batch.length };
    } finally {
      inFlight = false;
    }
  }

  async function maybeFlushOnSize(): Promise<FlushOutcome> {
    if (!enabled) return { flushed: 0, skipped: "disabled" };
    if (peek(sizeThreshold).length < sizeThreshold) return { flushed: 0, skipped: "empty" };
    return flush();
  }

  function start(): void {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (timer) return;
    timer = setInterval(() => { void flush(); }, flushIntervalMs);
    void flush(); // opportunistic first drain on start
  }

  function stop(): void {
    if (timer) { clearInterval(timer); timer = null; }
  }

  return { flush, maybeFlushOnSize, start, stop, isEnabled: () => enabled };
}

function clampPositive(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
  return Math.floor(value);
}

function readAppVersion(): string | null {
  try {
    const v = import.meta.env?.VITE_APP_VERSION;
    return typeof v === "string" && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}
