// WP-001 — storage adapter.
//
// STORAGE DECISION (stated): prediction and surprise rows go through the EXISTING
// learning-events sink and its drain path, UNCHANGED. There is no new table, no
// migration, no new Supabase client, no new drain — we record via the sink's public
// `recordLearningEvent()` as two new event types (`prediction_recorded`,
// `surprise_resolved`), which flow through the same localStorage queue → eventSink
// batch → `supabase.from("learning_events").insert()` path as every other event. This
// satisfies "no new write path to any registry".
//
// The `learning_events` payload allowlist is PII-safe and narrow, so we project each row
// onto the allowlisted fields: session_id + a PII-free letters-only turn anchor carry
// provenance, `value` carries the scaled scalar (p(resolve) or surprise), `count` carries
// issue count / resolved, and `rule_or_detector_id` carries the predictor version. The
// AUTHORITATIVE structured record remains the in-memory SurprisePair (emitted as an
// observation fact and shipped in the report artifact); the sink carries the drain-safe
// projection. Hindsight-rejected pairs are NEVER drained as surprise — they are excluded.

import { recordLearningEvent, type LearningEvent, type LearningEventInput } from "@/lib/tutor/learningEvents";
import { isPredictionCaptureEnabled } from "./flag";
import { stableHash } from "./predictor";
import { turnAnchor } from "./observe";
import {
  isAcceptedPair,
  type PredictionRow,
  type SurpriseResolution,
  type TurnAddress,
} from "./types";

/** Recorder injection point so tests can capture drained events without localStorage. */
export type EventRecorder = (event: LearningEventInput) => LearningEvent | null;

/** Letters-only, single-token anchor guaranteed to survive safeTopicTag sanitization. */
export function sinkAnchorToken(address: TurnAddress): string {
  let n = stableHash(turnAnchor(address));
  let token = "";
  for (let i = 0; i < 7; i += 1) {
    token += String.fromCharCode(97 + (n % 26));
    n = Math.floor(n / 26);
  }
  return `ta-${token}`;
}

function milli(value: number): number {
  return Math.round(Math.min(1, Math.max(0, value)) * 1000);
}

/** Project a prediction row onto a learning-events input (drain-safe, no PII). */
export function toPredictionEvent(row: PredictionRow): LearningEventInput {
  return {
    eventType: "prediction_recorded",
    product: "ai_tutor",
    mode: "grammar",
    targetLanguage: "en",
    sessionId: row.turnAddress.sessionId,
    safeTopicTag: sinkAnchorToken(row.turnAddress),
    value: milli(row.prediction.outcome.pResolve),
    count: Math.max(0, row.features.issueCount),
    ruleOrDetectorId: row.prediction.predictorVersion,
    timestamp: row.predictedAtMs,
  };
}

/** Project an ACCEPTED surprise pair onto a learning-events input (drain-safe, no PII). */
export function toSurpriseEvent(resolution: SurpriseResolution): LearningEventInput | null {
  if (!isAcceptedPair(resolution)) return null; // hindsight-rejected pairs are excluded
  return {
    eventType: "surprise_resolved",
    product: "ai_tutor",
    mode: "grammar",
    targetLanguage: "en",
    sessionId: resolution.turnAddress.sessionId,
    safeTopicTag: sinkAnchorToken(resolution.turnAddress),
    value: milli(resolution.surprise),
    count: resolution.actual.resolved ? 1 : 0,
    ruleOrDetectorId: resolution.predictorVersion,
    timestamp: resolution.outcomeAtMs,
  };
}

/**
 * Drain a prediction row through the existing sink. No-op unless the SHADOW-MODE flag is
 * on. Returns the recorded event (or null if gated off / not recorded). Best-effort.
 */
export function drainPrediction(row: PredictionRow, recorder: EventRecorder = recordLearningEvent): LearningEvent | null {
  if (!isPredictionCaptureEnabled()) return null;
  return recorder(toPredictionEvent(row));
}

/**
 * Drain an accepted surprise pair through the existing sink. No-op unless the SHADOW-MODE
 * flag is on and the pair is accepted (hindsight-rejected pairs are excluded).
 */
export function drainSurprise(resolution: SurpriseResolution, recorder: EventRecorder = recordLearningEvent): LearningEvent | null {
  if (!isPredictionCaptureEnabled()) return null;
  const event = toSurpriseEvent(resolution);
  return event ? recorder(event) : null;
}
