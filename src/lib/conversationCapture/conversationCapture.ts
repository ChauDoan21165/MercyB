// src/lib/conversationCapture/conversationCapture.ts
//
// C2 — the learner-data capture pipeline, the foundation of the data flywheel.
//
// NOTE: this lives OUTSIDE src/lib/tutor/ on purpose. The "Study OS" tutor
// engine is a pure, offline, no-network layer (enforced by
// src/lib/tutor/tests/studyOsBoundary.test.ts — no Supabase, no remote writes,
// no raw-learner-text persistence). Capture does all three, so it is a sibling
// I/O layer here, next to conversationRetention.
//
// Every tutor conversation session must leave a durable record. Without this,
// conversations vanish and the moat never compounds. This module owns the
// WRITE side only: it exports startSession / logTurn / endSession and pushes
// rows to two Supabase tables (public.conversations + public.conversation_
// events; see supabase/migrations/20260716000000_conversation_capture.sql).
//
// Design rules (mirrors src/lib/analytics.ts emitFeatureOutcome + Lane D's
// recordActiveDay):
//   - Fail-silent, fire-and-forget. Capture must NEVER throw into, block, or
//     crash the conversation. Every Supabase call is wrapped; errors are
//     swallowed. A dropped record is acceptable; a broken conversation is not.
//   - User-owned. Rows carry the raw user_id and self-RLS protects them
//     (a learner reads/writes only their own). Not the anonymized Track-2
//     learner_interaction_capture lake — that is a separate surface.
//   - NOT wired into the UI here. Lane A calls these functions; this module
//     only builds and exports them (same split as the D1 retention hooks).
//   - Consent is the CALLER's job. This module writes whenever invoked; Lane A
//     gates the calls behind learning-data consent / LEARNING_CAPTURE_ENABLED.

import { supabase } from "@/lib/supabaseClient";

/** A grammar/vocabulary/etc. error the engine detected in a learner turn. */
export type CapturedError = {
  errorType?: string;
  learnerText?: string;
  correctedText?: string;
  explanation?: string;
  // Forward-compatible: the engine's full error shape lands in error_details.
  [key: string]: unknown;
};

/** A correction the learner accepted or rejected during a turn. */
export type CapturedCorrection = {
  /** true → correction_accepted event, false → correction_rejected event. */
  accepted: boolean;
  errorType?: string;
  learnerText?: string;
  correctedText?: string;
  [key: string]: unknown;
};

/**
 * Rollup passed to endSession(). A bare string is accepted as shorthand for
 * `{ text }`. The counts populate the conversations rollup columns; Lane A
 * already tracks them per session, so it can hand them straight through.
 */
export type ConversationSessionSummary = {
  turnCount?: number;
  errorsDetected?: number;
  correctionsAccepted?: number;
  /** Warm, Vietnamese-first recap text. */
  text?: string;
};

const MAX_TEXT_LENGTH = 4000;
const MAX_COUNT = 100000;

type ConversationEventInsert = {
  conversation_id: string;
  turn_number: number;
  event_type:
    | "turn_completed"
    | "error_detected"
    | "correction_accepted"
    | "correction_rejected";
  learner_input: string | null;
  ai_response: string | null;
  error_details: Record<string, unknown> | null;
  created_at: string;
};

/**
 * Open a conversation session. Generates the session id client-side (so turns
 * can log immediately without a round-trip), inserts the parent row, and
 * returns the id. Fail-silent: a failed insert still returns the id (the turn
 * inserts will simply no-op against the missing parent). Returns null only
 * when there is no usable user id (RLS would reject the row anyway) or off-browser.
 */
export async function startSession(
  userId: string,
  themeId?: string | null,
): Promise<string | null> {
  if (!isBrowser()) return null;
  const cleanUserId = String(userId ?? "").trim();
  if (!cleanUserId) return null;

  const sessionId = makeId();
  try {
    await supabase.from("conversations").insert({
      id: sessionId,
      user_id: cleanUserId,
      theme_id: toText(themeId),
      started_at: nowIso(),
    });
  } catch {
    // fire-and-forget — never break the conversation
  }
  return sessionId;
}

/**
 * Record one completed turn: always a `turn_completed` event (with the
 * learner input + AI response), plus one `error_detected` row per detected
 * error and one `correction_accepted` / `correction_rejected` row per
 * correction the learner acted on. All rows insert in a single batch.
 * No-ops on a falsy sessionId. Fail-silent.
 */
export async function logTurn(
  sessionId: string | null | undefined,
  turnNumber: number,
  learnerInput: string,
  aiResponse: string,
  errors: readonly CapturedError[] = [],
  corrections: readonly CapturedCorrection[] = [],
  meta: Record<string, unknown> = {},
): Promise<void> {
  if (!isBrowser()) return;
  const id = String(sessionId ?? "").trim();
  if (!id) return;

  const turn = normalizeCount(turnNumber);
  const learner = toText(learnerInput);
  const ai = toText(aiResponse);
  const at = nowIso();

  const rows: ConversationEventInsert[] = [
    {
      conversation_id: id,
      turn_number: turn,
      event_type: "turn_completed",
      learner_input: learner,
      ai_response: ai,
      // Step-12: record the cross-session recall signal in the existing jsonb
      // slot (no schema change) so telemetry proves the prior-session memory was
      // surfaced on this turn.
      error_details: toMetaDetails(meta),
      created_at: at,
    },
  ];

  for (const error of errors ?? []) {
    if (!error) continue;
    rows.push({
      conversation_id: id,
      turn_number: turn,
      event_type: "error_detected",
      learner_input: toText(error.learnerText) ?? learner,
      ai_response: null,
      error_details: toDetails(error),
      created_at: at,
    });
  }

  for (const correction of corrections ?? []) {
    if (!correction) continue;
    rows.push({
      conversation_id: id,
      turn_number: turn,
      event_type: correction.accepted ? "correction_accepted" : "correction_rejected",
      learner_input: toText(correction.learnerText) ?? learner,
      ai_response: toText(correction.correctedText),
      error_details: toDetails(correction),
      created_at: at,
    });
  }

  try {
    await supabase.from("conversation_events").insert(rows);
  } catch {
    // fire-and-forget
  }
}

/**
 * Close a conversation session: stamps ended_at and writes the rollup columns
 * + summary text. `summary` may be a bare string (→ summary text) or a
 * ConversationSessionSummary with the counts Lane A already tracks. No-ops on a
 * falsy sessionId. Fail-silent.
 */
export async function endSession(
  sessionId: string | null | undefined,
  summary?: string | ConversationSessionSummary,
): Promise<void> {
  if (!isBrowser()) return;
  const id = String(sessionId ?? "").trim();
  if (!id) return;

  const s: ConversationSessionSummary =
    typeof summary === "string" ? { text: summary } : summary ?? {};

  const patch: Record<string, unknown> = { ended_at: nowIso() };
  if (s.turnCount != null) patch.turn_count = normalizeCount(s.turnCount);
  if (s.errorsDetected != null) patch.errors_detected = normalizeCount(s.errorsDetected);
  if (s.correctionsAccepted != null) {
    patch.corrections_accepted = normalizeCount(s.correctionsAccepted);
  }
  const text = toText(s.text);
  if (text) patch.summary = text;

  try {
    await supabase.from("conversations").update(patch).eq("id", id);
  } catch {
    // fire-and-forget
  }
}

// ── helpers ────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function nowIso(): string {
  return new Date().toISOString();
}

/** A v4-format UUID (the id column is `uuid`). Prefers crypto.randomUUID. */
function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  // Fallback: RFC-4122 v4 shape using Math.random. Only hit on very old
  // engines; still a valid uuid so the insert/FK won't choke on shape.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = Math.floor(Math.random() * 16);
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Trim, cap length, and collapse empties to null (so we never store ""). */
function toText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

/** Non-negative integer, clamped — guards CHECK constraints + bad input. */
function normalizeCount(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(MAX_COUNT, Math.floor(n));
}

/** Pass through an object as jsonb detail; null for non-objects. */
function toDetails(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function toMetaDetails(meta: Record<string, unknown>): Record<string, unknown> | null {
  const details: Record<string, unknown> = {};
  if (meta.memoryRecalled === true) details.memory_recalled = true;
  if (meta.pronunciationEvidence) details.pronunciation_evidence = meta.pronunciationEvidence;
  if (meta.toneEvidence) details.tone_evidence = meta.toneEvidence;
  if (meta.masteryEvidence) details.mastery_evidence = meta.masteryEvidence;
  return Object.keys(details).length > 0 ? details : null;
}
