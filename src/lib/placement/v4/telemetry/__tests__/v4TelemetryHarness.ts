/**
 * V4 Telemetry Harness — extended deterministic fixture factories, scenario
 * builders, and verification helpers for the V4 telemetry test suite.
 *
 * Design invariants:
 *   1. Zero randomness. Every value is declared or seed-derived.
 *   2. Pure functions. No mutable module-level state beyond id counters.
 *   3. Idempotent. Same inputs → same outputs (reset id counters first).
 *   4. No Vitest imports. Plain TS; tests import from vitest themselves.
 *   5. No global test setup changes. Lives entirely in V4-local paths.
 *
 * This harness supplements the existing fixtures.ts, adapterFixtures.ts,
 * and orchestrationFixtures.ts with:
 *   - Bulk scenario builders (many users, many events)
 *   - Edge-case factories (empty streams, malformed events, boundary values)
 *   - Cross-module scenario builders
 *   - Verification/assertion helper functions
 */

import { TELEMETRY_SCHEMA_VERSION, UTC_MS_PER_DAY } from "../index";
import type {
  TelemetryEvent,
  TelemetryEventType,
} from "../index";

import type {
  ProgressionSnapshotLike,
  StudyPlanLike,
} from "../index";

import {
  makePlan,
  makeSnapshot,
  noSignals,
  day as adapterDay,
  U1,
  U2,
  U3,
  SESSION as ADAPTER_SESSION,
  FIXED_EPOCH_MS as ADAPTER_EPOCH_MS,
} from "./adapterFixtures";

import {
  ORCH_EPOCH_MS,
  ORCH_USER,
  ORCH_SESSION,
  dayMs as orchDayMs,
} from "./orchestrationFixtures";

import {
  FIXED_EPOCH_MS,
  tDay,
  resetEventCounter,
  eid,
  lessonStart,
  lessonComplete,
  lessonRetry,
  lessonDropoff,
  speakingRetry,
  hesitationLoop,
  studyStreak,
  cefrCheckpoint,
  scenarioCommon,
} from "./fixtures";

// Re-export the core fixture functions so tests can import everything
// from one place.
export {
  FIXED_EPOCH_MS,
  tDay,
  resetEventCounter,
  eid,
  lessonStart,
  lessonComplete,
  lessonRetry,
  lessonDropoff,
  speakingRetry,
  hesitationLoop,
  studyStreak,
  cefrCheckpoint,
  scenarioCommon,
  makePlan,
  makeSnapshot,
  noSignals,
  ADAPTER_EPOCH_MS,
  U1,
  U2,
  U3,
  ADAPTER_SESSION as SESSION,
  ORCH_EPOCH_MS,
  ORCH_USER,
  ORCH_SESSION,
  orchDayMs,
};

// ─── Additional user / session identities ─────────────────────────────

export const U4 = "uhash_user_four_dddddddddddddddd";
export const U5 = "uhash_user_five_eeeeeeeeeeeeeeeee";
export const U6 = "uhash_user_six_ffffffffffffffffff";

export const ALL_USERS = [U1, U2, U3, U4, U5, U6] as const;

export function session(userIndex: number, label: string): string {
  return `sess-u${userIndex + 1}-${label}`;
}

// ─── Bulk scenario builders ───────────────────────────────────────────

/**
 * Builds a synthetic cohort of N users, each with a lesson-complete event
 * at a given day offset. Useful for aggregation and cohort tests.
 */
export function scenarioCohort(
  userCount: number,
  options?: {
    baseDay?: number;
    scoreRatio?: number;
    cefrTarget?: string;
  },
): TelemetryEvent[] {
  resetEventCounter();
  const baseDay = options?.baseDay ?? 0;
  const scoreRatio = options?.scoreRatio ?? 0.8;
  const cefrTarget = options?.cefrTarget ?? "A2";

  const events: TelemetryEvent[] = [];
  for (let i = 0; i < userCount; i += 1) {
    const userIdHash = ALL_USERS[i % ALL_USERS.length]!;
    const sess = session(i, "cohort");
    events.push(
      lessonStart({
        userIdHash,
        sessionId: sess,
        lessonId: `lesson-cohort-${i + 1}`,
        timestampMs: tDay(baseDay + i, 9, 0),
        cefrTarget,
      }),
      lessonComplete({
        userIdHash,
        sessionId: sess,
        lessonId: `lesson-cohort-${i + 1}`,
        timestampMs: tDay(baseDay + i, 9, 5),
        durationMs: 300_000,
        scoreRatio,
        retries: 0,
      }),
    );
  }
  return events;
}

/**
 * Builds a dense sequence of events for a single user over many days.
 */
export function scenarioDenseUserTimeline(options?: {
  dayCount?: number;
  userIdHash?: string;
  sessionId?: string;
}): TelemetryEvent[] {
  resetEventCounter();
  const dayCount = options?.dayCount ?? 30;
  const userIdHash = options?.userIdHash ?? U1;
  const sessionId = options?.sessionId ?? ADAPTER_SESSION;

  const events: TelemetryEvent[] = [];
  const lessons = ["lesson-a", "lesson-b", "lesson-c", "lesson-d", "lesson-e"];
  const modalities = ["reading", "writing", "speaking", "listening", "vocabulary"] as const;
  const cefrLevels = ["A1", "A2", "B1", "B2"] as const;

  for (let d = 0; d < dayCount; d += 1) {
    const lessonIdx = d % lessons.length;
    const lessonId = lessons[lessonIdx]!;
    const modality = modalities[lessonIdx]!;

    // Collect all events for this day, then sort by timestamp at the end
    // so insertion order doesn't break chronological ordering.
    const dayEvents: TelemetryEvent[] = [];

    dayEvents.push(
      lessonStart({
        userIdHash,
        sessionId,
        lessonId,
        timestampMs: tDay(d, 9, 0),
        cefrTarget: "A2",
        modality: modality as unknown as TelemetryEventType,
      }),
    );

    // Retry at 9:02 (before complete/dropoff at 9:03/9:05).
    if (d % 5 === 1) {
      dayEvents.push(
        lessonRetry({
          userIdHash,
          sessionId,
          lessonId,
          timestampMs: tDay(d, 9, 2),
          attemptOrdinal: 1 + (d % 3),
          reason: "incorrect",
        }),
      );
    }

    // Dropoff at 9:03 or complete at 9:05.
    if (d % 7 !== 3) {
      dayEvents.push(
        lessonComplete({
          userIdHash,
          sessionId,
          lessonId,
          timestampMs: tDay(d, 9, 5),
          durationMs: 300_000,
          scoreRatio: 0.7 + (d % 3) * 0.1,
          retries: d % 5 === 0 ? 1 : 0,
        }),
      );
    } else {
      dayEvents.push(
        lessonDropoff({
          userIdHash,
          sessionId,
          lessonId,
          timestampMs: tDay(d, 9, 3),
          progressRatio: 0.2 + (d % 3) * 0.2,
          dwellMs: 30_000 + d * 1_000,
        }),
      );
    }

    // Speaking retry at 9:04.
    if (modality === "speaking" && d % 4 === 0) {
      dayEvents.push(
        speakingRetry({
          userIdHash,
          sessionId,
          lessonId,
          promptId: `prompt-${d}`,
          timestampMs: tDay(d, 9, 4),
          attemptOrdinal: 1 + (d % 2),
          pronunciationScore: 0.4 + (d % 5) * 0.1,
        }),
      );
    }

    // Hesitation loop at 9:06.
    if (d % 6 === 0) {
      dayEvents.push(
        hesitationLoop({
          userIdHash,
          sessionId,
          lessonId,
          timestampMs: tDay(d, 9, 6),
          loopDurationMs: 5_000 + d * 500,
          silenceCount: 1 + (d % 3),
        }),
      );
    }

    // Streak at 9:30.
    if (d % 10 === 0) {
      dayEvents.push(
        studyStreak({
          userIdHash,
          sessionId,
          timestampMs: tDay(d, 9, 30),
          streakDays: 1 + Math.floor(d / 10),
          streakState: d === 0 ? "active" : "resumed",
        }),
      );
    }

    // CEFR checkpoint at 10:00.
    if (d > 0 && d % 15 === 0) {
      const cefrIdx = Math.min(Math.floor(d / 15), cefrLevels.length - 2);
      dayEvents.push(
        cefrCheckpoint({
          userIdHash,
          sessionId,
          timestampMs: tDay(d, 10, 0),
          fromLevel: cefrLevels[cefrIdx]!,
          toLevel: cefrLevels[cefrIdx + 1]!,
          confidence: 0.6 + (d % 4) * 0.1,
        }),
      );
    }

    // Sort day's events by timestamp for chronological order.
    dayEvents.sort((a, b) => a.timestampMs - b.timestampMs);
    events.push(...dayEvents);
  }

  return events;
}

/**
 * Builds a minimal valid event set (one start + one complete).
 */
export function scenarioMinimal(): TelemetryEvent[] {
  resetEventCounter();
  return [
    lessonStart({
      userIdHash: U1,
      sessionId: ADAPTER_SESSION,
      lessonId: "lesson-minimal",
      timestampMs: tDay(0, 9, 0),
    }),
    lessonComplete({
      userIdHash: U1,
      sessionId: ADAPTER_SESSION,
      lessonId: "lesson-minimal",
      timestampMs: tDay(0, 9, 5),
      durationMs: 300_000,
      scoreRatio: 0.9,
      retries: 0,
    }),
  ];
}

/**
 * Builds an empty event list.
 */
export function scenarioEmpty(): TelemetryEvent[] {
  resetEventCounter();
  return [];
}

/**
 * Builds an event stream with only lesson-start events (no completes).
 */
export function scenarioStartsOnly(count?: number): TelemetryEvent[] {
  resetEventCounter();
  const n = count ?? 5;
  const events: TelemetryEvent[] = [];
  for (let i = 0; i < n; i += 1) {
    events.push(
      lessonStart({
        userIdHash: U1,
        sessionId: ADAPTER_SESSION,
        lessonId: `lesson-startonly-${i + 1}`,
        timestampMs: tDay(i, 9, 0),
      }),
    );
  }
  return events;
}

// ─── Adapter scenario builders ────────────────────────────────────────

export function scenarioSnapshotAtCefr(
  cefr: "A1" | "A2" | "B1" | "B2",
  dayOffset?: number,
  overrides?: Partial<ProgressionSnapshotLike>,
): ProgressionSnapshotLike {
  return makeSnapshot({
    userIdHash: U1,
    sessionId: ADAPTER_SESSION,
    snapshotMs: adapterDay(dayOffset ?? 3),
    currentDay: dayOffset ?? 3,
    lastActiveDay: dayOffset ?? 3,
    cefr: {
      overall: cefr,
      perSkill: {
        reading: cefr,
        writing: cefr,
        speaking: cefr,
        pronunciation: cefr === "A1" ? "A1" : cefr === "B2" ? "B1" : cefr,
        listening: cefr,
        vocabulary: cefr,
      },
    },
    ...(overrides ?? {}),
  });
}

export function scenarioPlan(
  days?: number,
  intensity?: "light" | "balanced" | "intensive",
  lessonsPerDay?: number,
): StudyPlanLike {
  const d = days ?? 7;
  const intens = intensity ?? "balanced";
  const lpd = lessonsPerDay ?? 2;
  return makePlan({
    planVersion: `v4.harness.${intens}`,
    totalDays: d,
    intensity: intens,
    days: Array.from({ length: d }, (_, dayIdx) => ({
      day: dayIdx + 1,
      lessons: Array.from({ length: lpd }, (__, l) => ({
        lessonId: `lesson-${dayIdx + 1}-${l + 1}`,
        skill: (["reading", "vocabulary", "speaking", "writing", "listening"] as const)[
          (dayIdx + l) % 5
        ]!,
        estimatedMinutes: 10 + l * 4,
      })),
      isRecoveryDay: intens === "light" && dayIdx % 4 === 3,
    })),
    generatedAtMs: adapterDay(0),
  });
}

// ─── Verification helpers ─────────────────────────────────────────────

export function uniqueUsers(events: readonly TelemetryEvent[]): string[] {
  return [...new Set(events.map((e) => e.userIdHash))].sort();
}

export function uniqueLessons(events: readonly TelemetryEvent[]): string[] {
  return [
    ...new Set(
      events
        .filter(
          (e): e is TelemetryEvent & { lessonId: string } =>
            "lessonId" in e && typeof (e as Record<string, unknown>).lessonId === "string",
        )
        .map((e) => e.lessonId),
    ),
  ].sort();
}

export function countByType(
  events: readonly TelemetryEvent[],
): Record<TelemetryEventType, number> {
  const counts: Record<string, number> = {};
  for (const event of events) {
    counts[event.type] = (counts[event.type] ?? 0) + 1;
  }
  return counts as Record<TelemetryEventType, number>;
}

export function eventsInDayRange(
  events: readonly TelemetryEvent[],
  startDay: number,
  endDay: number,
): TelemetryEvent[] {
  const startMs = tDay(startDay, 0, 0);
  const endMs = tDay(endDay, 23, 59);
  return events.filter((e) => e.timestampMs >= startMs && e.timestampMs <= endMs);
}

export function firstOutOfOrderIndex(
  events: readonly TelemetryEvent[],
): number {
  for (let i = 1; i < events.length; i += 1) {
    if (events[i]!.timestampMs < events[i - 1]!.timestampMs) {
      return i;
    }
  }
  return -1;
}

export function deepFreeze<T extends object>(value: T): T {
  for (const key of Object.keys(value) as Array<keyof T>) {
    const child = value[key];
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child as object);
    }
  }
  return Object.freeze(value);
}
