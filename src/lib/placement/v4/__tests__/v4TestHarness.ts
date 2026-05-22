/**
 * V4 Test Harness — deterministic fixture factories, scenario builders, and
 * replay verification helpers for the Placement V4 module family.
 *
 * Purpose:
 *   Provide a single import surface that any V4 test can use to construct
 *   reproducible, byte-identical test data without touching global test setup.
 *   This harness lives entirely within the V4 test directory; it does not
 *   modify `src/test/setup.ts` and does not depend on Vitest globals.
 *
 * Design invariants:
 *   1. Zero randomness. Every value is derived from a seed or declared inline.
 *      No `Math.random()`, no `Date.now()`, no `crypto.getRandomValues()`.
 *   2. Pure functions. Factories accept explicit inputs and return fresh objects
 *      — no mutable module-level state (except the id counter for event ids).
 *   3. Idempotent. Calling a factory twice with the same arguments produces
 *      byte-identical output (modulo internal id counters which are reset-table).
 *   4. No Vitest imports. The harness exports plain TS values; tests import what
 *      they need from `vitest` themselves.
 */

import type {
  CEFRAssessment,
  CEFRLevel,
  PlacementV3L1InterferenceFlag,
  PlacementV3PerSkillProfile,
} from "../../../../types/placement-v3";

import {
  LEARNER_MEMORY_SCHEMA_VERSION,
  buildPlacementSnapshot,
  createLearnerMemory,
  type LearnerKey,
  type LearnerMemory,
  type LearnerMemoryEvent,
  type LearnerProgressionSnapshot,
  type LessonMasteryLevel,
  type LessonMasteryRecord,
} from "../learnerMemory";

import {
  PLACEMENT_V4_MOCK_PROVIDERS,
  createPlacementV4Boundary,
  normalizePlacementV4HealthSnapshot,
  type PlacementV4BoundaryMode,
  type PlacementV4ProviderCapability,
  type PlacementV4ProviderDescriptor,
  type PlacementV4ProviderHealthSnapshot,
  type PlacementV4ProviderSelectionRequest,
  type PlacementV4ProviderTrustTier,
  type PlacementV4Region,
  type PlacementV4PrivacyTier,
  type PlacementV4ValidationBoundary,
} from "../providerRegistry";

import type {
  PlacementV3ProgressionInput,
  ProgressionSimulationResult,
  StudyPlanAssumptions,
} from "../progressionSimulator";

import type {
  CompletedCurriculumLesson,
  CurriculumLearnerState,
  CurriculumPlanLength,
} from "../curriculumSequencer";

// ─── Shared seeds ─────────────────────────────────────────────────────

export const FIXED_EPOCH_MS = 1_711_929_600_000; // 2024-04-01T00:00:00.000Z
export const FIXED_EPOCH = "2024-04-01T00:00:00.000Z";

export function isoDaysAfter(base: string, days: number): string {
  const ts = new Date(base).getTime();
  return new Date(ts + days * 24 * 60 * 60 * 1000).toISOString();
}

export function isoDaysAgo(base: string, days: number): string {
  return isoDaysAfter(base, -days);
}

// ─── Learner keys ─────────────────────────────────────────────────────

export const LEARNER_A: LearnerKey = "learner_hash_aaaaaaaaaaaaaa";
export const LEARNER_B: LearnerKey = "learner_hash_bbbbbbbbbbbbbb";
export const LEARNER_C: LearnerKey = "learner_hash_cccccccccccccc";

export const LEARNER_KEYS = [LEARNER_A, LEARNER_B, LEARNER_C] as const;

// ─── CEFR helpers ─────────────────────────────────────────────────────

export const CEFR_ALL: readonly CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export function fullSkillProfile(
  level: CEFRLevel,
  confidence: number,
): PlacementV3PerSkillProfile {
  return {
    speaking: { level, confidence },
    listening: { level, confidence },
    reading: { level, confidence },
    writing: { level, confidence },
    conversation: { level, confidence },
  };
}

export function l1Flag(
  patternId: string,
  severity: PlacementV3L1InterferenceFlag["severity"] = "medium",
  evidence?: string,
): PlacementV3L1InterferenceFlag {
  const flag: PlacementV3L1InterferenceFlag = { patternId, severity };
  if (evidence) flag.evidence = evidence;
  return flag;
}

// ─── ID counter (reset-table; NOT stateful across tests unless caller calls reset) ──

let _idCounter = 0;

export function resetIdCounter(): void {
  _idCounter = 0;
}

export function nextId(prefix = "id"): string {
  _idCounter += 1;
  return `${prefix}-${_idCounter.toString(16).padStart(6, "0")}`;
}

// ═══════════════════════════════════════════════════════════════════════
// learnerMemory fixtures
// ═══════════════════════════════════════════════════════════════════════

export function emptyMemory(
  learnerKey: LearnerKey = LEARNER_A,
  createdAt: string = FIXED_EPOCH,
): LearnerMemory {
  return createLearnerMemory({ learnerKey, createdAt });
}

export function snapshotFixture(input: {
  learnerKey?: LearnerKey;
  recordedAt?: string;
  sourceId?: string;
  overallCefr?: CEFRLevel;
  overallConfidence?: number;
  perSkill?: PlacementV3PerSkillProfile;
  l1Flags?: PlacementV3L1InterferenceFlag[];
}): LearnerProgressionSnapshot {
  return buildPlacementSnapshot({
    learnerKey: input.learnerKey ?? LEARNER_A,
    recordedAt: input.recordedAt ?? FIXED_EPOCH,
    sourceId: input.sourceId ?? nextId("src"),
    overallCefr: input.overallCefr ?? "A2",
    overallConfidence: input.overallConfidence ?? 0.7,
    perSkill: input.perSkill ?? fullSkillProfile(input.overallCefr ?? "A2", input.overallConfidence ?? 0.7),
    l1Flags: input.l1Flags,
  });
}

/**
 * Build a LearnerMemory populated with N snapshots spaced evenly backward
 * from `endIso`. Each snapshot places the learner at the given CEFR level.
 */
export function populatedMemory(
  learnerKey: LearnerKey = LEARNER_A,
  count: number = 3,
  endIso: string = FIXED_EPOCH,
  levels?: CEFRLevel[],
): LearnerMemory {
  resetIdCounter();
  const mem = emptyMemory(learnerKey, isoDaysAgo(endIso, count * 30));
  for (let i = count - 1; i >= 0; i -= 1) {
    const recordedAt = isoDaysAgo(endIso, i * 30);
    const level = levels?.[count - 1 - i] ?? CEFR_ALL[Math.min(i, CEFR_ALL.length - 1)]!;
    // We skip the event-log append and directly manipulate snapshots for
    // fixture brevity — callers wanting events should use the scenario
    // builders below.
    const snap = snapshotFixture({
      learnerKey,
      recordedAt,
      sourceId: `src-${i}`,
      overallCefr: level,
      overallConfidence: 0.6 + i * 0.1,
    });
    // Direct insertion (not through appendPlacementSnapshotEvent) so
    // callers can test the append flow separately.
    mem.snapshots.push(snap);
    mem.cefrTimeline.push({
      at: snap.recordedAt,
      overallCefr: snap.overallCefr,
      overallConfidence: snap.overallConfidence,
      sourceId: snap.sourceId,
    });
  }
  // Sort chronologically.
  mem.snapshots.sort((a, b) => (a.recordedAt < b.recordedAt ? -1 : 1));
  mem.cefrTimeline.sort((a, b) => (a.at < b.at ? -1 : 1));
  return mem;
}

/**
 * Build two memories that contradict each other — same learner, same
 * timestamps, different CEFR levels. Useful for drift-detection tests.
 */
export function contradictoryMemoryPair(): [LearnerMemory, LearnerMemory] {
  resetIdCounter();
  const baseIso = FIXED_EPOCH;
  const days = [0, 30, 60, 90];

  const a = emptyMemory(LEARNER_A, isoDaysAgo(baseIso, 90));
  const b = emptyMemory(LEARNER_A, isoDaysAgo(baseIso, 90));

  const aLevels: CEFRLevel[] = ["A1", "A2", "B1", "B2"];
  const bLevels: CEFRLevel[] = ["A1", "A2", "A2", "B1"]; // diverges at day 60

  for (let i = 0; i < days.length; i += 1) {
    const at = isoDaysAgo(baseIso, days[i]!);
    a.snapshots.push(snapshotFixture({
      learnerKey: LEARNER_A,
      recordedAt: at,
      sourceId: `src-a-${i}`,
      overallCefr: aLevels[i]!,
      overallConfidence: 0.75,
    }));
    b.snapshots.push(snapshotFixture({
      learnerKey: LEARNER_A,
      recordedAt: at,
      sourceId: `src-b-${i}`,
      overallCefr: bLevels[i]!,
      overallConfidence: 0.75,
    }));
  }

  return [a, b];
}

export function masteryRecordFixture(
  roomId: string,
  attempts: number = 1,
  bestScore: number = 0.7,
  lastAttemptAt: string = FIXED_EPOCH,
): LessonMasteryRecord {
  const levels: LessonMasteryLevel[] = ["none", "exposed", "practicing", "competent", "mastered"];
  let masteryLevel: LessonMasteryLevel;
  if (attempts <= 0) {
    masteryLevel = "none";
  } else if (bestScore >= 0.85) {
    masteryLevel = "mastered";
  } else if (bestScore >= 0.6) {
    masteryLevel = "competent";
  } else if (attempts === 1 && bestScore < 0.4) {
    masteryLevel = "exposed";
  } else {
    masteryLevel = "practicing";
  }
  return { roomId, attempts, bestScore, lastAttemptAt, masteryLevel };
}

// ═══════════════════════════════════════════════════════════════════════
// providerRegistry fixtures
// ═══════════════════════════════════════════════════════════════════════

export function defaultBoundary(
  overrides: Partial<PlacementV4ValidationBoundary> = {},
): PlacementV4ValidationBoundary {
  return createPlacementV4Boundary(overrides);
}

export function healthyHealth(
  providerId: string,
  nowMs: number = FIXED_EPOCH_MS,
): PlacementV4ProviderHealthSnapshot {
  return normalizePlacementV4HealthSnapshot(
    providerId,
    {
      status: "healthy",
      errorRate: 0,
      p95LatencyMs: 100,
      authFailureRate: 0,
      timeoutRate: 0,
      quotaRemaining: 100,
      consecutiveFailures: 0,
    },
    nowMs,
  );
}

export function failingHealth(
  providerId: string,
  nowMs: number = FIXED_EPOCH_MS,
  overrides: Partial<PlacementV4ProviderHealthSnapshot> = {},
): PlacementV4ProviderHealthSnapshot {
  return normalizePlacementV4HealthSnapshot(
    providerId,
    {
      status: "failing",
      errorRate: 0.8,
      p95LatencyMs: 3_000,
      authFailureRate: 0.1,
      timeoutRate: 0.5,
      quotaRemaining: 0,
      consecutiveFailures: 5,
      ...overrides,
    },
    nowMs,
  );
}

export function degradedHealth(
  providerId: string,
  nowMs: number = FIXED_EPOCH_MS,
): PlacementV4ProviderHealthSnapshot {
  return normalizePlacementV4HealthSnapshot(
    providerId,
    {
      status: "degraded",
      errorRate: 0.2,
      p95LatencyMs: 1_500,
      authFailureRate: 0.02,
      timeoutRate: 0.1,
      quotaRemaining: 5,
      consecutiveFailures: 1,
    },
    nowMs,
  );
}

export function staleHealth(
  providerId: string,
  nowMs: number = FIXED_EPOCH_MS,
  ageMs: number = 120_000,
): PlacementV4ProviderHealthSnapshot {
  return normalizePlacementV4HealthSnapshot(providerId, {
    status: "healthy",
    observedAtMs: nowMs - ageMs,
    errorRate: 0,
    p95LatencyMs: 100,
    authFailureRate: 0,
    timeoutRate: 0,
    quotaRemaining: 100,
    consecutiveFailures: 0,
  }, nowMs);
}

export function quarantinedHealth(
  providerId: string,
  nowMs: number = FIXED_EPOCH_MS,
  quarantineDurationMs: number = 60_000,
): PlacementV4ProviderHealthSnapshot {
  return normalizePlacementV4HealthSnapshot(
    providerId,
    {
      status: "failing",
      errorRate: 0.5,
      p95LatencyMs: 500,
      authFailureRate: 0,
      timeoutRate: 0,
      quotaRemaining: 50,
      consecutiveFailures: 4,
      quarantineUntilMs: nowMs + quarantineDurationMs,
    },
    nowMs,
  );
}

export function selectionRequest(
  capability: PlacementV4ProviderCapability,
  overrides: Partial<PlacementV4ProviderSelectionRequest> = {},
): PlacementV4ProviderSelectionRequest {
  return {
    capability,
    nowMs: FIXED_EPOCH_MS,
    estimatedUnits: 1,
    boundary: defaultBoundary(),
    ...overrides,
  };
}

export function healthMapFor(
  providers: readonly PlacementV4ProviderDescriptor[],
  healthFactory: (id: string) => PlacementV4ProviderHealthSnapshot = (id) => healthyHealth(id),
): Readonly<Record<string, PlacementV4ProviderHealthSnapshot | undefined>> {
  return Object.fromEntries(
    providers.map((p) => [p.identity.providerId, healthFactory(p.identity.providerId)]),
  );
}

/**
 * Returns a clone of `provider` with the given identity/descriptor overrides
 * shallow-merged. Does not deeply merge nested objects.
 */
export function withProviderOverride(
  provider: PlacementV4ProviderDescriptor,
  override: Partial<PlacementV4ProviderDescriptor>,
): PlacementV4ProviderDescriptor {
  return { ...provider, ...override };
}

// ═══════════════════════════════════════════════════════════════════════
// progressionSimulator fixtures
// ═══════════════════════════════════════════════════════════════════════

export function placementInput(
  cefrOverall: CEFRLevel = "A2",
  confidence: number = 0.86,
  perSkill?: PlacementV3PerSkillProfile,
  flags?: PlacementV3L1InterferenceFlag[],
): PlacementV3ProgressionInput {
  return {
    cefr_overall: cefrOverall,
    cefr_overall_confidence: confidence,
    cefr_per_skill: perSkill,
    l1_interference_flags: flags,
  };
}

export function intenseStudyAssumptions(): Required<StudyPlanAssumptions> {
  return {
    timelineDays: [30, 90, 180],
    weeklyStudyDays: 6,
    minutesPerStudyDay: 75,
    lessonsPerStudyDay: 2,
    lessonCompletionVariance: [1, 0.95, 0.9, 1],
    dropoutVariance: [0, 0.05, 0.1, 0],
    spacedReviewRate: 0.82,
    speakingPracticeShare: 0.34,
    reviewCadenceDays: 4,
    seedLabel: "intense",
  };
}

export function weakStudyAssumptions(): Required<StudyPlanAssumptions> {
  return {
    timelineDays: [30, 90, 180],
    weeklyStudyDays: 2,
    minutesPerStudyDay: 20,
    lessonsPerStudyDay: 0.6,
    lessonCompletionVariance: [0.35, 0.25, 0.4, 0.2],
    dropoutVariance: [0.35, 0.45, 0.5, 0.3],
    spacedReviewRate: 0.12,
    speakingPracticeShare: 0.08,
    reviewCadenceDays: 14,
    seedLabel: "weak",
  };
}

// ═══════════════════════════════════════════════════════════════════════
// curriculumSequencer fixtures
// ═══════════════════════════════════════════════════════════════════════

export function balancedAssessment(overallCefr: CEFRLevel = "B1"): CEFRAssessment {
  return {
    overallCefr,
    skillCefr: {
      grammar: overallCefr,
      vocabulary: overallCefr,
      pronunciation: overallCefr,
      listening: overallCefr,
      speaking: overallCefr,
      reading: overallCefr,
      writing: overallCefr,
    },
    gaps: [],
    l1InterferenceFlags: [],
  };
}

export function learnerStateFixture(
  overrides: Partial<CurriculumLearnerState> = {},
): CurriculumLearnerState {
  return {
    assessment: balancedAssessment(),
    ...overrides,
  };
}

export function freshLearner(): CurriculumLearnerState {
  return learnerStateFixture({
    assessment: balancedAssessment("A1"),
    recentLessonHistory: [],
    completedLessons: [],
    skillProgress: {},
    weakSkills: [],
    fatigue: { score: 0, missedDaysLast14: 0, averageSessionMinutes: 15, streakDays: 0 },
    speaking: { confidence: 0.55, avoidanceDays: 0, recentAttempts: 0 },
    startDay: 1,
  });
}

export function experiencedLearner(): CurriculumLearnerState {
  return learnerStateFixture({
    assessment: balancedAssessment("B2"),
    recentLessonHistory: ["daily:advanced-grammar", "daily:business-english"],
    completedLessons: Array.from({ length: 20 }, (_, i) => ({
      lessonId: `daily:lesson-${i + 1}`,
      completedDay: -(20 - i),
      skill: (["grammar", "vocabulary", "speaking", "listening", "reading"] as const)[i % 5]!,
      score: 0.7 + Math.min(0.25, i * 0.01),
    })),
    skillProgress: {
      grammar: { mastery: 0.82, confidence: 0.78, attempts: 25 },
      vocabulary: { mastery: 0.76, confidence: 0.72, attempts: 22 },
      speaking: { mastery: 0.68, confidence: 0.64, attempts: 18 },
      listening: { mastery: 0.74, confidence: 0.7, attempts: 20 },
      reading: { mastery: 0.85, confidence: 0.8, attempts: 24 },
    },
    weakSkills: ["speaking", "pronunciation"],
    fatigue: { score: 0.2, missedDaysLast14: 1, averageSessionMinutes: 25, streakDays: 14 },
    speaking: { confidence: 0.64, avoidanceDays: 2, recentAttempts: 8 },
    startDay: 30,
  });
}

export function fatiguedLearner(): CurriculumLearnerState {
  return learnerStateFixture({
    assessment: balancedAssessment("A2"),
    recentLessonHistory: ["daily:basic-reading", "daily:basic-listening"],
    completedLessons: Array.from({ length: 5 }, (_, i) => ({
      lessonId: `daily:fatigue-${i + 1}`,
      completedDay: -(5 - i),
      skill: "vocabulary",
      score: 0.5,
    })),
    skillProgress: {
      vocabulary: { mastery: 0.4, confidence: 0.35, attempts: 5 },
    },
    weakSkills: ["speaking"],
    fatigue: { score: 0.82, missedDaysLast14: 7, averageSessionMinutes: 8, streakDays: 1 },
    speaking: { confidence: 0.18, avoidanceDays: 8, recentAttempts: 0 },
    startDay: 1,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Scenario builders — multi-module synthetic learner journeys
// ═══════════════════════════════════════════════════════════════════════

export interface ScenarioV4 {
  label: string;
  learnerKey: LearnerKey;
  /** Snapshots that would be recorded by the placement engine over time. */
  snapshots: LearnerProgressionSnapshot[];
  /** Provider health across the scenario timeline. */
  healthSnapshots: Record<string, PlacementV4ProviderHealthSnapshot>;
}

/**
 * Scenario: learner steadily advances A1 → A2 → B1 → B2 over ~6 months.
 * All providers are healthy throughout.
 */
export function scenarioSteadyAdvance(): ScenarioV4 {
  resetIdCounter();
  const learnerKey = LEARNER_A;
  const base = FIXED_EPOCH;
  const timeline = [
    { daysAgo: 180, level: "A1" as CEFRLevel, conf: 0.85 },
    { daysAgo: 120, level: "A2" as CEFRLevel, conf: 0.8 },
    { daysAgo: 60, level: "B1" as CEFRLevel, conf: 0.78 },
    { daysAgo: 0, level: "B2" as CEFRLevel, conf: 0.72 },
  ];

  const snapshots = timeline.map(({ daysAgo, level, conf }) =>
    snapshotFixture({
      learnerKey,
      recordedAt: isoDaysAgo(base, daysAgo),
      sourceId: nextId("placement"),
      overallCefr: level,
      overallConfidence: conf,
    }),
  );

  return {
    label: "steady-advance",
    learnerKey,
    snapshots,
    healthSnapshots: {
      "mock-grading-primary": healthyHealth("mock-grading-primary"),
      "mock-speech-primary": healthyHealth("mock-speech-primary"),
      "mock-language-primary": healthyHealth("mock-language-primary"),
    },
  };
}

/**
 * Scenario: learner progresses A2 → B1, but one snapshot provider
 * disagrees (A2), creating a contradiction in the event log.
 */
export function scenarioContradictoryProgress(): ScenarioV4 {
  resetIdCounter();
  const learnerKey = LEARNER_B;
  const base = FIXED_EPOCH;

  const mainSnap = snapshotFixture({
    learnerKey,
    recordedAt: isoDaysAgo(base, 30),
    sourceId: nextId("main"),
    overallCefr: "B1",
    overallConfidence: 0.8,
  });

  const contradictorySnap = snapshotFixture({
    learnerKey,
    recordedAt: isoDaysAgo(base, 30),
    sourceId: nextId("shadow"),
    overallCefr: "A2",
    overallConfidence: 0.75,
  });

  const oldSnap = snapshotFixture({
    learnerKey,
    recordedAt: isoDaysAgo(base, 90),
    sourceId: nextId("old"),
    overallCefr: "A2",
    overallConfidence: 0.85,
  });

  return {
    label: "contradictory-progress",
    learnerKey,
    snapshots: [oldSnap, mainSnap, contradictorySnap],
    healthSnapshots: {
      "mock-grading-primary": healthyHealth("mock-grading-primary"),
    },
  };
}

/**
 * Scenario: provider degrades over time — starts healthy, then
 * degrades, then fails, then recovers.
 */
export function scenarioProviderLifecycle(): Array<{
  day: number;
  health: PlacementV4ProviderHealthSnapshot;
}> {
  const baseMs = FIXED_EPOCH_MS;
  const dayMs = 24 * 60 * 60 * 1000;
  const providerId = "mock-speech-primary";

  return [
    { day: 0, health: healthyHealth(providerId, baseMs) },
    {
      day: 7,
      health: degradedHealth(providerId, baseMs + 7 * dayMs),
    },
    {
      day: 14,
      health: failingHealth(providerId, baseMs + 14 * dayMs),
    },
    {
      day: 21,
      health: quarantinedHealth(providerId, baseMs + 21 * dayMs, 3 * dayMs),
    },
    {
      day: 28,
      health: healthyHealth(providerId, baseMs + 28 * dayMs),
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════
// Replay verification helpers
// ═══════════════════════════════════════════════════════════════════════

/**
 * Rounds a number to a fixed decimal count for deterministic comparison.
 * Uses the same 4-decimal rounding as learnerMemory.confidence.
 */
export function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/**
 * Deep-freezes an object so tests cannot accidentally mutate shared fixtures.
 * Only freezes own enumerable properties; does not handle cycles.
 */
export function deepFreeze<T extends object>(value: T): T {
  for (const key of Object.keys(value) as Array<keyof T>) {
    const child = value[key];
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child as object);
    }
  }
  return Object.freeze(value);
}

/**
 * Verifies that two LearnerMemory objects have the same snapshot count,
 * event count, and CEFR timeline length. Does NOT compare serialized
 * equality — use serializeLearnerMemory for that.
 */
export function describeMemoryDiff(
  a: LearnerMemory,
  b: LearnerMemory,
): string[] {
  const diffs: string[] = [];
  if (a.snapshots.length !== b.snapshots.length) {
    diffs.push(`snapshots: ${a.snapshots.length} vs ${b.snapshots.length}`);
  }
  if (a.events.length !== b.events.length) {
    diffs.push(`events: ${a.events.length} vs ${b.events.length}`);
  }
  if (a.cefrTimeline.length !== b.cefrTimeline.length) {
    diffs.push(`cefrTimeline: ${a.cefrTimeline.length} vs ${b.cefrTimeline.length}`);
  }
  if (a.lessonMastery.length !== b.lessonMastery.length) {
    diffs.push(`lessonMastery: ${a.lessonMastery.length} vs ${b.lessonMastery.length}`);
  }
  if (a.skillTrends.length !== b.skillTrends.length) {
    diffs.push(`skillTrends: ${a.skillTrends.length} vs ${b.skillTrends.length}`);
  }
  return diffs;
}

/**
 * Returns the set of (providerId, capability) pairs that the given mock
 * providers support. Useful for testing that no capability silently loses
 * coverage across provider-set changes.
 */
export function mockProviderCapabilityMatrix(
  providers: readonly PlacementV4ProviderDescriptor[] = PLACEMENT_V4_MOCK_PROVIDERS,
): Map<PlacementV4ProviderCapability, string[]> {
  const matrix = new Map<PlacementV4ProviderCapability, string[]>();
  for (const p of providers) {
    for (const cap of p.capabilities) {
      const ids = matrix.get(cap.capability) ?? [];
      ids.push(p.identity.providerId);
      matrix.set(cap.capability, ids);
    }
  }
  return matrix;
}
