// Placement v4 telemetry — Zod runtime schemas.
//
// Strict-mode validation: unknown fields are rejected so events with extra
// data don't silently survive into the analytical pipeline. The aggregation
// layer trusts validated events implicitly, so this module is the boundary.

import { z } from "zod";

import { TELEMETRY_SCHEMA_VERSION } from "./types";
import type { TelemetryEvent } from "./types";

const cefrLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
const modalitySchema = z.enum([
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
]);
const checkpointModalitySchema = z.enum([
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
  "overall",
]);

const nonEmptyString = z.string().min(1).max(256);

const ratio = z.number().min(0).max(1);

const nonNegativeInt = z.number().int().nonnegative();
const positiveInt = z.number().int().positive();
const integerMs = z.number().int().min(0);

const eventBase = z.object({
  v: z.literal(TELEMETRY_SCHEMA_VERSION),
  eventId: nonEmptyString,
  userIdHash: nonEmptyString,
  sessionId: nonEmptyString,
  timestampMs: integerMs,
});

const lessonStartSchema = eventBase
  .extend({
    type: z.literal("lesson_start"),
    lessonId: nonEmptyString,
    cefrTarget: cefrLevelSchema,
    modality: modalitySchema,
  })
  .strict();

const lessonCompleteSchema = eventBase
  .extend({
    type: z.literal("lesson_complete"),
    lessonId: nonEmptyString,
    durationMs: integerMs,
    scoreRatio: ratio,
    retries: nonNegativeInt,
  })
  .strict();

const lessonRetrySchema = eventBase
  .extend({
    type: z.literal("lesson_retry"),
    lessonId: nonEmptyString,
    attemptOrdinal: positiveInt,
    reason: z.enum(["incorrect", "timeout", "skipped", "user_initiated"]),
  })
  .strict();

const lessonDropoffSchema = eventBase
  .extend({
    type: z.literal("lesson_dropoff"),
    lessonId: nonEmptyString,
    progressRatio: ratio,
    dwellMs: integerMs,
  })
  .strict();

const speakingRetrySchema = eventBase
  .extend({
    type: z.literal("speaking_retry"),
    lessonId: nonEmptyString,
    promptId: nonEmptyString,
    attemptOrdinal: positiveInt,
    pronunciationScore: ratio,
  })
  .strict();

const hesitationLoopSchema = eventBase
  .extend({
    type: z.literal("hesitation_loop"),
    lessonId: nonEmptyString,
    loopDurationMs: integerMs,
    silenceCount: nonNegativeInt,
  })
  .strict();

const studyStreakSchema = eventBase
  .extend({
    type: z.literal("study_streak"),
    streakDays: nonNegativeInt,
    streakState: z.enum(["active", "broken", "resumed"]),
  })
  .strict();

const cefrCheckpointSchema = eventBase
  .extend({
    type: z.literal("cefr_checkpoint"),
    modality: checkpointModalitySchema,
    fromLevel: cefrLevelSchema.nullable(),
    toLevel: cefrLevelSchema,
    confidence: ratio,
  })
  .strict();

export const telemetryEventSchema = z.discriminatedUnion("type", [
  lessonStartSchema,
  lessonCompleteSchema,
  lessonRetrySchema,
  lessonDropoffSchema,
  speakingRetrySchema,
  hesitationLoopSchema,
  studyStreakSchema,
  cefrCheckpointSchema,
]);

export interface ValidationResult {
  valid: readonly TelemetryEvent[];
  rejected: readonly RejectedEvent[];
}

export interface RejectedEvent {
  /** Best-effort eventId if extractable from the raw input. */
  eventId: string | null;
  /** Index of the rejected event in the input array. */
  index: number;
  /** Stable, human-readable failure reason. */
  reason: string;
}

/**
 * Validate a batch of unknown events.
 *
 * - Unknown fields, wrong types, missing fields, out-of-range numbers, and
 *   non-integer timestamps all result in rejection.
 * - The output preserves input order for the valid list (no implicit sorting).
 *   Callers wanting deterministic aggregation must pass valid events to the
 *   canonicalizer in ./aggregation.
 */
export function validateEvents(input: readonly unknown[]): ValidationResult {
  const valid: TelemetryEvent[] = [];
  const rejected: RejectedEvent[] = [];

  for (let i = 0; i < input.length; i++) {
    const raw = input[i];
    const parsed = telemetryEventSchema.safeParse(raw);
    if (parsed.success) {
      valid.push(parsed.data as TelemetryEvent);
      continue;
    }
    rejected.push({
      eventId: extractEventId(raw),
      index: i,
      reason: summarizeZodError(parsed.error),
    });
  }

  return { valid, rejected };
}

function extractEventId(raw: unknown): string | null {
  if (raw && typeof raw === "object" && "eventId" in raw) {
    const id = (raw as { eventId: unknown }).eventId;
    if (typeof id === "string" && id.length > 0) return id;
  }
  return null;
}

function summarizeZodError(err: z.ZodError): string {
  const first = err.issues[0];
  if (!first) return "validation_failed";
  const path = first.path.length > 0 ? first.path.join(".") : "<root>";
  // Surface unrecognized keys by name so callers can identify the rejected
  // field — important for malformed-event triage in production.
  if (first.code === "unrecognized_keys") {
    const keys =
      "keys" in first && Array.isArray((first as { keys?: unknown }).keys)
        ? ((first as { keys: string[] }).keys ?? [])
        : [];
    if (keys.length > 0) return `${path}:unrecognized_keys:${keys.join(",")}`;
  }
  return `${path}:${first.code}`;
}
