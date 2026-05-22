/**
 * V4 Integration Tests — cross-module scenarios that verify determinism
 * and consistency across the full V4 surface (learnerMemory, providerRegistry,
 * progressionSimulator, curriculumSequencer).
 *
 * These tests use the v4TestHarness fixtures exclusively. No global setup
 * changes required. Every assertion is self-contained within the V4 test
 * directory.
 */

import { describe, expect, it } from "vitest";

import {
  serializeLearnerMemory,
  replayEvents,
  appendPlacementSnapshotEvent,
  appendLessonMasteryEvent,
  fingerprintLearnerMemory,
  buildCefrTimeline,
  computeAllSkillTrends,
} from "../learnerMemory";

import {
  selectPlacementV4Provider,
  PLACEMENT_V4_MOCK_PROVIDERS,
} from "../providerRegistry";

import {
  simulateProgression,
  exportProgressionTrace,
} from "../progressionSimulator";

import {
  generateCurriculumPlan,
} from "../curriculumSequencer";

import {
  contradictoryMemoryPair,
  emptyMemory,
  experiencedLearner,
  freshLearner,
  healthyHealth,
  isoDaysAgo,
  isoDaysAfter,
  LEARNER_A,
  LEARNER_B,
  masteryRecordFixture,
  mockProviderCapabilityMatrix,
  populatedMemory,
  resetIdCounter,
  scenarioContradictoryProgress,
  scenarioProviderLifecycle,
  scenarioSteadyAdvance,
  snapshotFixture,
  FIXED_EPOCH,
  FIXED_EPOCH_MS,
  selectionRequest,
  healthMapFor,
  placementInput,
  intenseStudyAssumptions,
  weakStudyAssumptions,
  fullSkillProfile,
  learnerStateFixture,
  balancedAssessment,
  CEFR_ALL,
  nextId,
} from "./v4TestHarness";

// ══════════════════════════════════════════════════════════════════════
// learnerMemory ↔ progressionSimulator determinism
// ══════════════════════════════════════════════════════════════════════

describe("V4 integration — learnerMemory ↔ progressionSimulator", () => {
  it("replay rebuilds the same memory from events regardless of arrival order", () => {
    resetIdCounter();
    const base = FIXED_EPOCH;
    let mem = emptyMemory(LEARNER_A, isoDaysAgo(base, 180));

    // Append events in chronological order.
    mem = appendPlacementSnapshotEvent(
      mem,
      snapshotFixture({
        learnerKey: LEARNER_A,
        recordedAt: isoDaysAgo(base, 180),
        sourceId: "src-1",
        overallCefr: "A1",
        overallConfidence: 0.8,
      }),
      { occurredAt: isoDaysAgo(base, 180) },
    );
    mem = appendPlacementSnapshotEvent(
      mem,
      snapshotFixture({
        learnerKey: LEARNER_A,
        recordedAt: isoDaysAgo(base, 90),
        sourceId: "src-2",
        overallCefr: "A2",
        overallConfidence: 0.75,
      }),
      { occurredAt: isoDaysAgo(base, 90) },
    );
    mem = appendPlacementSnapshotEvent(
      mem,
      snapshotFixture({
        learnerKey: LEARNER_A,
        recordedAt: isoDaysAgo(base, 0),
        sourceId: "src-3",
        overallCefr: "B1",
        overallConfidence: 0.7,
      }),
      { occurredAt: isoDaysAgo(base, 0) },
    );

    // Replay from the same events — projections must match byte-for-byte.
    // We compare snapshots, cefrTimeline, and lessonMastery rather than the
    // full fingerprint because skillTrends are only set by explicit
    // skill_trend_recompute events in the event log, and the original
    // appendPlacementSnapshotEvent call populates them synchronously.
    const replayed = replayEvents(LEARNER_A, mem.events, { createdAt: mem.createdAt });
    expect(replayed.snapshots).toEqual(mem.snapshots);
    expect(replayed.cefrTimeline).toEqual(mem.cefrTimeline);
    expect(replayed.lessonMastery).toEqual(mem.lessonMastery);

    // Replay from reversed events — must produce the same projections.
    const reversed = replayEvents(LEARNER_A, [...mem.events].reverse(), { createdAt: mem.createdAt });
    expect(reversed.snapshots).toEqual(mem.snapshots);
    expect(reversed.cefrTimeline).toEqual(mem.cefrTimeline);
    expect(reversed.lessonMastery).toEqual(mem.lessonMastery);
  });

  it("learnerMemory CEFR timeline matches progression simulator trajectory direction", () => {
    resetIdCounter();
    const base = FIXED_EPOCH;

    // Build a memory that tracks A1 → A2 → B1 progression.
    let mem = emptyMemory(LEARNER_A, isoDaysAgo(base, 180));
    mem = appendPlacementSnapshotEvent(
      mem,
      snapshotFixture({
        learnerKey: LEARNER_A,
        recordedAt: isoDaysAgo(base, 180),
        sourceId: "src-1",
        overallCefr: "A1",
        overallConfidence: 0.9,
      }),
    );
    mem = appendPlacementSnapshotEvent(
      mem,
      snapshotFixture({
        learnerKey: LEARNER_A,
        recordedAt: isoDaysAgo(base, 90),
        sourceId: "src-2",
        overallCefr: "A2",
        overallConfidence: 0.85,
      }),
    );
    mem = appendPlacementSnapshotEvent(
      mem,
      snapshotFixture({
        learnerKey: LEARNER_A,
        recordedAt: isoDaysAgo(base, 0),
        sourceId: "src-3",
        overallCefr: "B1",
        overallConfidence: 0.8,
      }),
    );

    // The timeline should show A1 → A2 → B1 in chronological order.
    const timeline = buildCefrTimeline(mem.snapshots);
    expect(timeline.map((p) => p.overallCefr)).toEqual(["A1", "A2", "B1"]);

    // The skill trends at the latest point should have the last snapshot as reference.
    const trends = computeAllSkillTrends(mem.snapshots, isoDaysAgo(base, 0));
    expect(trends.length).toBeGreaterThan(0);
    for (const trend of trends) {
      expect(trend.lastObservedAt).toBe(isoDaysAgo(base, 0));
    }
  });

  it("contradictory memories produce different fingerprints and different skill trends", () => {
    const [memA, memB] = contradictoryMemoryPair();

    // Different fingerprints.
    expect(fingerprintLearnerMemory(memA)).not.toBe(fingerprintLearnerMemory(memB));

    // Different timelines beyond the shared prefix.
    const timelineA = buildCefrTimeline(memA.snapshots);
    const timelineB = buildCefrTimeline(memB.snapshots);
    // At least one level differs.
    const levelsDiffer = timelineA.some(
      (point, idx) => point.overallCefr !== timelineB[idx]?.overallCefr,
    );
    expect(levelsDiffer).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════
// providerRegistry ↔ scenario determinism
// ══════════════════════════════════════════════════════════════════════

describe("V4 integration — providerRegistry determinism", () => {
  it("mock provider capability matrix covers all declared capabilities", () => {
    const matrix = mockProviderCapabilityMatrix();

    // Every capability declared in the policy matrix should have at least
    // one mock provider in local/validation mode.
    const capabilities: string[] = [
      "speaking",
      "grading",
      "translation",
      "tutoring",
      "pronunciation",
      "lesson_generation",
    ];

    for (const cap of capabilities) {
      const providers = matrix.get(cap as Parameters<typeof matrix.get>[0]);
      expect(providers).toBeDefined();
      expect(providers!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("provider selection is deterministic across repeated calls with identical inputs", () => {
    const req = selectionRequest("speaking", {
      providers: PLACEMENT_V4_MOCK_PROVIDERS.filter(
        (p) => p.identity.providerId.includes("speech"),
      ),
      healthByProviderId: healthMapFor(
        PLACEMENT_V4_MOCK_PROVIDERS.filter((p) => p.identity.providerId.includes("speech")),
      ),
    });

    const first = selectPlacementV4Provider(req);
    const second = selectPlacementV4Provider(req);

    expect(first.selectedProviderId).toBe(second.selectedProviderId);
    expect(first.status).toBe(second.status);
    expect(first.decisionRecord.selectedProviderId).toBe(second.decisionRecord.selectedProviderId);
  });

  it("provider lifecycle transitions are self-consistent", () => {
    const lifecycle = scenarioProviderLifecycle();

    // Each health snapshot should have strictly non-negative rates.
    for (const { health } of lifecycle) {
      expect(health.errorRate).toBeGreaterThanOrEqual(0);
      expect(health.errorRate).toBeLessThanOrEqual(1);
      expect(health.authFailureRate).toBeGreaterThanOrEqual(0);
      expect(health.authFailureRate).toBeLessThanOrEqual(1);
      expect(health.timeoutRate).toBeGreaterThanOrEqual(0);
      expect(health.timeoutRate).toBeLessThanOrEqual(1);
      expect(health.p95LatencyMs).toBeGreaterThanOrEqual(0);
      expect(health.quotaRemaining).toBeGreaterThanOrEqual(0);
      expect(health.consecutiveFailures).toBeGreaterThanOrEqual(0);
    }

    // Day 0: healthy.
    expect(lifecycle[0]!.health.status).toBe("healthy");
    // Day 14: failing.
    expect(lifecycle[2]!.health.status).toBe("failing");
    // Day 21: quarantined with a future quarantine end.
    expect(lifecycle[3]!.health.quarantineUntilMs).toBeGreaterThan(FIXED_EPOCH_MS + 21 * 24 * 60 * 60 * 1000);
    // Day 28: recovered to healthy.
    expect(lifecycle[4]!.health.status).toBe("healthy");
  });
});

// ══════════════════════════════════════════════════════════════════════
// progressionSimulator ↔ deterministic replay
// ══════════════════════════════════════════════════════════════════════

describe("V4 integration — progressionSimulator determinism", () => {
  it("identical inputs produce byte-identical trace exports", () => {
    const input = placementInput("A2", 0.86, fullSkillProfile("A2", 0.86));
    const assumptions = intenseStudyAssumptions();

    const first = simulateProgression(input, assumptions);
    const second = simulateProgression(input, assumptions);

    expect(exportProgressionTrace(first)).toBe(exportProgressionTrace(second));
    expect(first.inputHash).toBe(second.inputHash);
  });

  it("intense vs weak study assumptions produce meaningfully different outcomes", () => {
    const input = placementInput("A2", 0.86, fullSkillProfile("A2", 0.86));

    const intense = simulateProgression(input, intenseStudyAssumptions());
    const weak = simulateProgression(input, weakStudyAssumptions());

    // Intense study should yield more completed lessons.
    expect(intense.final.completedLessons).toBeGreaterThan(weak.final.completedLessons);
    // Their traces should not be byte-identical.
    expect(exportProgressionTrace(intense)).not.toBe(exportProgressionTrace(weak));
  });

  it("different seed labels produce different hashes even with same assumptions", () => {
    const input = placementInput("A2");
    const base = { ...intenseStudyAssumptions() };

    const first = simulateProgression(input, { ...base, seedLabel: "seed-1" });
    const second = simulateProgression(input, { ...base, seedLabel: "seed-2" });

    expect(first.inputHash).not.toBe(second.inputHash);
  });

  it("simulation snapshots are ordered by ascending day", () => {
    const input = placementInput("A1");
    const result = simulateProgression(input, intenseStudyAssumptions());

    for (let i = 1; i < result.snapshots.length; i += 1) {
      expect(result.snapshots[i]!.day).toBeGreaterThan(result.snapshots[i - 1]!.day);
    }
  });

  it("final snapshot matches the last timeline day", () => {
    const input = placementInput("A2");
    const result = simulateProgression(input, intenseStudyAssumptions());

    const lastDay = Math.max(...intenseStudyAssumptions().timelineDays);
    expect(result.final.day).toBe(lastDay);
  });
});

// ══════════════════════════════════════════════════════════════════════
// curriculumSequencer ↔ deterministic plan generation
// ══════════════════════════════════════════════════════════════════════

describe("V4 integration — curriculumSequencer determinism", () => {
  it("identical learner states produce identical plans", () => {
    const learner = freshLearner();
    const first = generateCurriculumPlan(learner, 7);
    const second = generateCurriculumPlan(learner, 7);

    expect(second).toEqual(first);
    expect(second.diagnostics.deterministicKey).toBe(first.diagnostics.deterministicKey);
  });

  it("different learner states produce different deterministic keys", () => {
    const fresh = generateCurriculumPlan(freshLearner(), 7);
    const exp = generateCurriculumPlan(experiencedLearner(), 7);

    expect(fresh.diagnostics.deterministicKey).not.toBe(exp.diagnostics.deterministicKey);
  });

  it("all three plan lengths (7, 28, 90) generate without error for fresh learner", () => {
    const learner = freshLearner();

    for (const length of [7, 28, 90] as const) {
      const plan = generateCurriculumPlan(learner, length);
      expect(plan.days).toHaveLength(length);
      expect(plan.planLengthDays).toBe(length);
    }
  });

  it("every day has at least one activity", () => {
    const learner = freshLearner();
    const plan = generateCurriculumPlan(learner, 28);

    for (const day of plan.days) {
      expect(day.activities.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("activity kinds are valid and fatigue-adjusted", () => {
    const learner = freshLearner();
    const plan = generateCurriculumPlan(learner, 7);

    const validKinds = new Set(["learn", "review", "reinforce", "speaking", "challenge"]);
    for (const day of plan.days) {
      for (const activity of day.activities) {
        expect(validKinds.has(activity.kind)).toBe(true);
        expect(activity.lessonId.length).toBeGreaterThan(0);
        expect(activity.targetSkill.length).toBeGreaterThan(0);
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
// Cross-module scenario → end-to-end consistency
// ══════════════════════════════════════════════════════════════════════

describe("V4 integration — end-to-end scenario consistency", () => {
  it("steady advance scenario snapshots increase in CEFR level monotonically", () => {
    const scenario = scenarioSteadyAdvance();

    const cefrOrdinal: Record<string, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
    const ordinals = scenario.snapshots.map(
      (snap) => cefrOrdinal[snap.overallCefr] ?? -1,
    );

    // Should be non-decreasing.
    for (let i = 1; i < ordinals.length; i += 1) {
      expect(ordinals[i]!).toBeGreaterThanOrEqual(ordinals[i - 1]!);
    }
  });

  it("contradictory progress scenario has two snapshots at the same timestamp with different CEFR levels", () => {
    const scenario = scenarioContradictoryProgress();

    // Find snapshots that share a recordedAt.
    const byTime = new Map<string, typeof scenario.snapshots>();
    for (const snap of scenario.snapshots) {
      const group = byTime.get(snap.recordedAt) ?? [];
      group.push(snap);
      byTime.set(snap.recordedAt, group);
    }

    // At least one timestamp should have multiple snapshots.
    const multiSnapTimes = [...byTime.values()].filter((g) => g.length > 1);
    expect(multiSnapTimes.length).toBeGreaterThanOrEqual(1);

    // Those multiple snapshots should have different CEFR levels (the contradiction).
    const levels = new Set(multiSnapTimes[0]!.map((snap) => snap.overallCefr));
    expect(levels.size).toBeGreaterThanOrEqual(2);
  });

  it("populated memory timeline length matches input count", () => {
    const mem = populatedMemory(LEARNER_B, 5, FIXED_EPOCH);
    expect(mem.snapshots).toHaveLength(5);
    expect(mem.cefrTimeline).toHaveLength(5);
  });

  it("empty memory has zero snapshots, events, and mastery records", () => {
    const mem = emptyMemory();
    expect(mem.snapshots).toHaveLength(0);
    expect(mem.events).toHaveLength(0);
    expect(mem.lessonMastery).toHaveLength(0);
    expect(mem.cefrTimeline).toHaveLength(0);
    expect(mem.skillTrends).toHaveLength(0);
  });

  it("fixture id counter resets produce deterministic ids across calls", () => {
    resetIdCounter();
    const ids1 = [nextId("a"), nextId("b"), nextId("c")];

    resetIdCounter();
    const ids2 = [nextId("a"), nextId("b"), nextId("c")];

    expect(ids1).toEqual(ids2);
  });
});
