// Shared fixture builders for the V4 telemetry test suite.
//
// These are pure factory functions — no Date.now, no Math.random — so tests
// can describe arbitrary scenarios with confidence that the data is stable.

import {
  TELEMETRY_SCHEMA_VERSION,
  UTC_MS_PER_DAY,
} from "../index";
import type {
  CefrCheckpointEvent,
  HesitationLoopEvent,
  LessonCompleteEvent,
  LessonDropoffEvent,
  LessonRetryEvent,
  LessonStartEvent,
  SpeakingRetryEvent,
  StudyStreakEvent,
  TelemetryEvent,
} from "../index";

export const FIXED_EPOCH_MS = 1_700_000_000_000; // 2023-11-14T22:13:20Z

export function tDay(day: number, hour = 12, minute = 0): number {
  return (
    FIXED_EPOCH_MS +
    day * UTC_MS_PER_DAY +
    hour * 60 * 60 * 1000 +
    minute * 60 * 1000
  );
}

let evCounter = 0;
export function resetEventCounter(): void {
  evCounter = 0;
}
export function eid(prefix = "ev"): string {
  evCounter += 1;
  return `${prefix}-${evCounter.toString().padStart(6, "0")}`;
}

const BASE = {
  v: TELEMETRY_SCHEMA_VERSION,
} as const;

export function lessonStart(
  partial: Partial<LessonStartEvent> & {
    userIdHash: string;
    sessionId: string;
    lessonId: string;
    timestampMs: number;
  },
): LessonStartEvent {
  return {
    ...BASE,
    type: "lesson_start",
    eventId: partial.eventId ?? eid("ls"),
    cefrTarget: partial.cefrTarget ?? "A2",
    modality: partial.modality ?? "reading",
    ...partial,
  };
}

export function lessonComplete(
  partial: Partial<LessonCompleteEvent> & {
    userIdHash: string;
    sessionId: string;
    lessonId: string;
    timestampMs: number;
  },
): LessonCompleteEvent {
  return {
    ...BASE,
    type: "lesson_complete",
    eventId: partial.eventId ?? eid("lc"),
    durationMs: partial.durationMs ?? 60_000,
    scoreRatio: partial.scoreRatio ?? 0.8,
    retries: partial.retries ?? 0,
    ...partial,
  };
}

export function lessonRetry(
  partial: Partial<LessonRetryEvent> & {
    userIdHash: string;
    sessionId: string;
    lessonId: string;
    timestampMs: number;
  },
): LessonRetryEvent {
  return {
    ...BASE,
    type: "lesson_retry",
    eventId: partial.eventId ?? eid("lr"),
    attemptOrdinal: partial.attemptOrdinal ?? 1,
    reason: partial.reason ?? "incorrect",
    ...partial,
  };
}

export function lessonDropoff(
  partial: Partial<LessonDropoffEvent> & {
    userIdHash: string;
    sessionId: string;
    lessonId: string;
    timestampMs: number;
  },
): LessonDropoffEvent {
  return {
    ...BASE,
    type: "lesson_dropoff",
    eventId: partial.eventId ?? eid("ld"),
    progressRatio: partial.progressRatio ?? 0.3,
    dwellMs: partial.dwellMs ?? 15_000,
    ...partial,
  };
}

export function speakingRetry(
  partial: Partial<SpeakingRetryEvent> & {
    userIdHash: string;
    sessionId: string;
    lessonId: string;
    promptId: string;
    timestampMs: number;
  },
): SpeakingRetryEvent {
  return {
    ...BASE,
    type: "speaking_retry",
    eventId: partial.eventId ?? eid("sr"),
    attemptOrdinal: partial.attemptOrdinal ?? 1,
    pronunciationScore: partial.pronunciationScore ?? 0.6,
    ...partial,
  };
}

export function hesitationLoop(
  partial: Partial<HesitationLoopEvent> & {
    userIdHash: string;
    sessionId: string;
    lessonId: string;
    timestampMs: number;
  },
): HesitationLoopEvent {
  return {
    ...BASE,
    type: "hesitation_loop",
    eventId: partial.eventId ?? eid("hl"),
    loopDurationMs: partial.loopDurationMs ?? 8_000,
    silenceCount: partial.silenceCount ?? 2,
    ...partial,
  };
}

export function studyStreak(
  partial: Partial<StudyStreakEvent> & {
    userIdHash: string;
    sessionId: string;
    timestampMs: number;
  },
): StudyStreakEvent {
  return {
    ...BASE,
    type: "study_streak",
    eventId: partial.eventId ?? eid("ss"),
    streakDays: partial.streakDays ?? 3,
    streakState: partial.streakState ?? "active",
    ...partial,
  };
}

export function cefrCheckpoint(
  partial: Partial<CefrCheckpointEvent> & {
    userIdHash: string;
    sessionId: string;
    timestampMs: number;
  },
): CefrCheckpointEvent {
  return {
    ...BASE,
    type: "cefr_checkpoint",
    eventId: partial.eventId ?? eid("cc"),
    modality: partial.modality ?? "overall",
    fromLevel: partial.fromLevel ?? "A2",
    toLevel: partial.toLevel ?? "B1",
    confidence: partial.confidence ?? 0.7,
    ...partial,
  };
}

/**
 * Build a small but representative scenario: 3 users, 3 lessons, mix of
 * starts/completes/retries/dropoffs/speaking/hesitation/streak/cefr events.
 *
 * Returns events in declaration order; tests are responsible for shuffling
 * if they want to assert determinism under permutation.
 */
export function scenarioCommon(): TelemetryEvent[] {
  resetEventCounter();
  const sessU1 = "sess-u1-A";
  const sessU2a = "sess-u2-A";
  const sessU2b = "sess-u2-B";
  const sessU3 = "sess-u3-A";

  const u1 = "uhash_user_one_aaaaaaaaaaaaaaaa";
  const u2 = "uhash_user_two_bbbbbbbbbbbbbbbb";
  const u3 = "uhash_user_three_ccccccccccccccc";

  return [
    // Day 0: u1 starts and completes lesson-1 cleanly.
    lessonStart({
      userIdHash: u1,
      sessionId: sessU1,
      lessonId: "lesson-1",
      timestampMs: tDay(0, 9, 0),
    }),
    lessonComplete({
      userIdHash: u1,
      sessionId: sessU1,
      lessonId: "lesson-1",
      timestampMs: tDay(0, 9, 5),
      durationMs: 300_000,
      scoreRatio: 0.9,
      retries: 0,
    }),

    // Day 0: u1 study streak.
    studyStreak({
      userIdHash: u1,
      sessionId: sessU1,
      timestampMs: tDay(0, 9, 30),
      streakDays: 1,
      streakState: "active",
    }),

    // Day 1: u2 starts lesson-1 but struggles, drops off.
    lessonStart({
      userIdHash: u2,
      sessionId: sessU2a,
      lessonId: "lesson-1",
      timestampMs: tDay(1, 10, 0),
    }),
    lessonRetry({
      userIdHash: u2,
      sessionId: sessU2a,
      lessonId: "lesson-1",
      timestampMs: tDay(1, 10, 2),
      attemptOrdinal: 1,
      reason: "incorrect",
    }),
    lessonDropoff({
      userIdHash: u2,
      sessionId: sessU2a,
      lessonId: "lesson-1",
      timestampMs: tDay(1, 10, 8),
      progressRatio: 0.4,
      dwellMs: 480_000,
    }),

    // Day 3: u2 tries lesson-2, retries speaking many times.
    lessonStart({
      userIdHash: u2,
      sessionId: sessU2b,
      lessonId: "lesson-2",
      timestampMs: tDay(3, 18, 0),
      cefrTarget: "A2",
      modality: "speaking",
    }),
    speakingRetry({
      userIdHash: u2,
      sessionId: sessU2b,
      lessonId: "lesson-2",
      promptId: "prompt-A",
      timestampMs: tDay(3, 18, 5),
      attemptOrdinal: 1,
      pronunciationScore: 0.4,
    }),
    speakingRetry({
      userIdHash: u2,
      sessionId: sessU2b,
      lessonId: "lesson-2",
      promptId: "prompt-A",
      timestampMs: tDay(3, 18, 6),
      attemptOrdinal: 2,
      pronunciationScore: 0.5,
    }),
    hesitationLoop({
      userIdHash: u2,
      sessionId: sessU2b,
      lessonId: "lesson-2",
      timestampMs: tDay(3, 18, 7),
      loopDurationMs: 12_000,
      silenceCount: 3,
    }),
    lessonComplete({
      userIdHash: u2,
      sessionId: sessU2b,
      lessonId: "lesson-2",
      timestampMs: tDay(3, 18, 10),
      durationMs: 600_000,
      scoreRatio: 0.55,
      retries: 2,
    }),

    // Day 4: u3 starts lesson-3, completes very cleanly.
    lessonStart({
      userIdHash: u3,
      sessionId: sessU3,
      lessonId: "lesson-3",
      timestampMs: tDay(4, 8, 0),
      cefrTarget: "B1",
      modality: "writing",
    }),
    lessonComplete({
      userIdHash: u3,
      sessionId: sessU3,
      lessonId: "lesson-3",
      timestampMs: tDay(4, 8, 12),
      durationMs: 720_000,
      scoreRatio: 0.95,
      retries: 0,
    }),

    // Day 5: CEFR checkpoint for u1 (A2 → B1).
    cefrCheckpoint({
      userIdHash: u1,
      sessionId: sessU1,
      timestampMs: tDay(5, 11, 0),
      fromLevel: "A2",
      toLevel: "B1",
      confidence: 0.85,
    }),

    // Day 6: u1 active again, streak resumed.
    studyStreak({
      userIdHash: u1,
      sessionId: sessU1,
      timestampMs: tDay(6, 9, 0),
      streakDays: 4,
      streakState: "resumed",
    }),

    // Day 7: CEFR checkpoint for u2 (null → A2).
    cefrCheckpoint({
      userIdHash: u2,
      sessionId: sessU2b,
      timestampMs: tDay(7, 14, 0),
      fromLevel: null,
      toLevel: "A2",
      confidence: 0.6,
    }),
  ];
}
