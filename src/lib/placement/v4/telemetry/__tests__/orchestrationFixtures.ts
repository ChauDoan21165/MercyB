// Shared fixtures for the orchestration test suites.
// Deterministic, no Date.now, no Math.random.

import { UTC_MS_PER_DAY } from "../index";
import type {
  OrchestrationEvent,
  ProgressionSnapshotLike,
  StudyPlanLike,
} from "../index";
import { makePlan, makeSnapshot } from "./adapterFixtures";

export const ORCH_EPOCH_MS = 1_700_000_000_000;
export const ORCH_USER = "uhash_orchestration_aaaaaaaaaaaaaaaa";
export const ORCH_SESSION = "sess-orchestration-aaaaaaaaaaaa";

export function dayMs(d: number, hour = 9): number {
  return ORCH_EPOCH_MS + d * UTC_MS_PER_DAY + hour * 60 * 60 * 1000;
}

function ctx(prefix: string, nowMs: number) {
  return {
    userIdHash: ORCH_USER,
    sessionId: ORCH_SESSION,
    nowMs,
    eventIdPrefix: prefix,
  } as const;
}

export function buildCanonicalEventSequence(): OrchestrationEvent[] {
  const plan: StudyPlanLike = makePlan({
    planVersion: "v4.orch.001",
    generatedAtMs: ORCH_EPOCH_MS,
  });
  return [
    {
      type: "plan_generated",
      plan,
      ctx: ctx("plan-gen-001", dayMs(0, 8)),
    },
    {
      type: "lesson_start",
      input: { lessonId: "lesson-a", skill: "reading" },
      ctx: ctx("lesson-start-a", dayMs(0, 9)),
    },
    {
      type: "lesson_complete",
      input: {
        lessonId: "lesson-a",
        durationMs: 300_000,
        scoreRatio: 0.85,
        retries: 0,
      },
      ctx: ctx("lesson-complete-a", dayMs(0, 9, /*see helper*/) + 5 * 60_000),
    },
    {
      type: "lesson_start",
      input: { lessonId: "lesson-b", skill: "vocabulary" },
      ctx: ctx("lesson-start-b", dayMs(1, 9)),
    },
    {
      type: "lesson_skip",
      input: { lessonId: "lesson-b", progressRatio: 0.3, dwellMs: 60_000 },
      ctx: ctx("lesson-skip-b", dayMs(1, 10)),
    },
    {
      type: "speaking_retry",
      input: {
        lessonId: "lesson-c",
        promptId: "p1",
        attemptOrdinal: 1,
        pronunciationScore: 0.5,
      },
      ctx: ctx("speak-retry-c-1", dayMs(2, 10)),
    },
    {
      type: "speaking_retry",
      input: {
        lessonId: "lesson-c",
        promptId: "p1",
        attemptOrdinal: 2,
        pronunciationScore: 0.55,
      },
      ctx: ctx("speak-retry-c-2", dayMs(2, 10) + 30_000),
    },
    {
      type: "review_debt_changed",
      input: { reviewDebtCount: 3, reviewSkippedRecently: false, streakDays: 3 },
      ctx: ctx("review-debt-3", dayMs(3, 8)),
    },
    {
      type: "progression_checkpoint",
      input: {
        modality: "overall",
        fromLevel: "A2",
        toLevel: "B1",
        confidence: 0.7,
      },
      ctx: ctx("checkpoint-overall", dayMs(4, 9)),
    },
    {
      type: "recovery_started",
      reasonCode: "burnout_detected",
      ctx: ctx("recovery-start", dayMs(5, 9)),
    },
    {
      type: "recovery_completed",
      reasonCode: "user_returned",
      ctx: ctx("recovery-end", dayMs(6, 9)),
    },
  ];
}

export function buildOrchestrationSnapshotForUser(
  partial: Partial<ProgressionSnapshotLike> = {},
): ProgressionSnapshotLike {
  return makeSnapshot({
    userIdHash: ORCH_USER,
    sessionId: ORCH_SESSION,
    snapshotMs: dayMs(7, 8),
    plan: makePlan({ planVersion: "v4.orch.001" }),
    currentDay: 4,
    lastActiveDay: 4,
    streakDays: 4,
    reviewDebtCount: 3,
    ...partial,
  });
}

export function shuffleDeterministic<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr];
  let s = seed >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1_664_525 + 1_013_904_223) >>> 0;
    const j = s % (i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
