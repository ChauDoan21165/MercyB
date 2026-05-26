import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  canonicalJSON,
  composeInterventionPlan,
  computeAdaptiveSignals,
  ingestProgressionSnapshot,
  recommendInterventions,
} from "../index";
import type {
  InterventionRecommendation,
  LearnerMemorySummaryLike,
  ProgressionSnapshotLike,
} from "../index";
import {
  U1,
  day,
  dayOrdinal,
  ineffective,
  makeDay,
  makeLesson,
  makePlan,
  makeSnapshot,
} from "./adapterFixtures";

function snapshotWithOverload(): ProgressionSnapshotLike {
  return makeSnapshot({
    plan: makePlan({
      days: [
        makeDay({
          day: 1,
          lessons: [
            makeLesson({ lessonId: "x", skill: "reading", estimatedMinutes: 35 }),
            makeLesson({ lessonId: "y", skill: "writing", estimatedMinutes: 25 }),
            makeLesson({ lessonId: "z", skill: "speaking", estimatedMinutes: 25 }),
          ],
        }),
        makeDay({
          day: 2,
          lessons: [
            makeLesson({ lessonId: "a", skill: "reading", estimatedMinutes: 35 }),
            makeLesson({ lessonId: "b", skill: "writing", estimatedMinutes: 30 }),
            makeLesson({ lessonId: "c", skill: "speaking", estimatedMinutes: 20 }),
          ],
        }),
        makeDay({
          day: 3,
          lessons: [
            makeLesson({ lessonId: "d", skill: "reading", estimatedMinutes: 30 }),
            makeLesson({ lessonId: "e", skill: "writing", estimatedMinutes: 30 }),
            makeLesson({ lessonId: "f", skill: "speaking", estimatedMinutes: 25 }),
          ],
        }),
      ],
    }),
    currentDay: 3,
  });
}

function buildAggregation(snapshot: ProgressionSnapshotLike) {
  const events = ingestProgressionSnapshot({
    snapshot,
    eventIdPrefix: "intervention-fx",
  });
  return aggregateEvents(events);
}

describe("interventionEngine — determinism", () => {
  it("produces identical plans for identical inputs", () => {
    const snap = makeSnapshot();
    const agg = buildAggregation(snap);
    const a = recommendInterventions({ snapshot: snap, aggregation: agg });
    const b = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
  });

  it("intervention ids are stable across runs", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const a = composeInterventionPlan({
      snapshot: snap,
      signals: computeAdaptiveSignals({ snapshot: snap, aggregation: agg }),
    });
    const b = composeInterventionPlan({
      snapshot: snap,
      signals: computeAdaptiveSignals({ snapshot: snap, aggregation: agg }),
    });
    expect(a.recommendations.map((r) => r.id)).toEqual(
      b.recommendations.map((r) => r.id),
    );
    expect(a.inputFingerprint).toBe(b.inputFingerprint);
  });

  it("orders recommendations by priority descending then id ascending", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const plan = composeInterventionPlan({
      snapshot: snap,
      signals: computeAdaptiveSignals({ snapshot: snap, aggregation: agg }),
    });
    const ranks = { low: 0, medium: 1, high: 2, urgent: 3 } as const;
    for (let i = 1; i < plan.recommendations.length; i++) {
      const prev = plan.recommendations[i - 1];
      const curr = plan.recommendations[i];
      expect(ranks[prev.priority]).toBeGreaterThanOrEqual(ranks[curr.priority]);
      if (ranks[prev.priority] === ranks[curr.priority]) {
        expect(prev.id <= curr.id).toBe(true);
      }
    }
  });
});

describe("interventionEngine — burnout", () => {
  it("fires reduce_daily_load when daily minutes exceed the threshold", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "reduce_daily_load"),
    ).toBe(true);
  });

  it("does NOT fire reduce_daily_load on a balanced day", () => {
    const snap = makeSnapshot();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "reduce_daily_load"),
    ).toBe(false);
  });
});

describe("interventionEngine — churn", () => {
  it("fires streak recovery when long inactive gap is detected", () => {
    // Snapshot far in the future relative to the aggregation's lastSeenMs.
    const snap = makeSnapshot({
      snapshotMs: day(40),
      streakDays: 0,
    });
    const agg = buildAggregation(makeSnapshot()); // history from day 3
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "recommend_streak_recovery"),
    ).toBe(true);
  });

  it("does not fire churn when learner is fresh-active", () => {
    const snap = makeSnapshot({ streakDays: 7, snapshotMs: day(3) });
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "recommend_streak_recovery"),
    ).toBe(false);
  });
});

describe("interventionEngine — speaking avoidance", () => {
  it("fires when consecutive_speaking_skips crosses the threshold via memory", () => {
    const snap = makeSnapshot();
    const agg = buildAggregation(snap);
    const memory: LearnerMemorySummaryLike = {
      userIdHash: U1,
      sessionIds: ["s"],
      recent: [
        { timestampMs: day(0), kind: "lesson_skipped", reference: "speaking_a" },
        { timestampMs: day(1), kind: "lesson_skipped", reference: "speaking_b" },
        { timestampMs: day(2), kind: "lesson_skipped", reference: "speaking_c" },
        { timestampMs: day(3), kind: "lesson_skipped", reference: "speaking_d" },
      ],
    };
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg, memory });
    expect(
      plan.recommendations.some(
        (r: InterventionRecommendation) => r.kind === "inject_speaking_confidence_lesson",
      ),
    ).toBe(true);
  });

  it("does NOT fire when memory shows completions interspersed", () => {
    const snap = makeSnapshot();
    const agg = buildAggregation(snap);
    const memory: LearnerMemorySummaryLike = {
      userIdHash: U1,
      sessionIds: ["s"],
      recent: [
        { timestampMs: day(0), kind: "lesson_skipped", reference: "speaking_a" },
        { timestampMs: day(1), kind: "lesson_completed", reference: "speaking_b" },
        { timestampMs: day(2), kind: "lesson_skipped", reference: "speaking_c" },
      ],
    };
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg, memory });
    expect(
      plan.recommendations.some(
        (r) => r.kind === "inject_speaking_confidence_lesson",
      ),
    ).toBe(false);
  });
});

describe("interventionEngine — review overload", () => {
  it("fires when review debt crosses threshold", () => {
    const snap = makeSnapshot({ reviewDebtCount: 8 });
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "schedule_recovery_review_day"),
    ).toBe(true);
  });

  it("does not fire when review debt is under threshold", () => {
    const snap = makeSnapshot({ reviewDebtCount: 2 });
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    // Acceleration may fire if no other risks; review-overload should NOT.
    const reviewRecs = plan.recommendations.filter(
      (r) => r.kind === "schedule_recovery_review_day",
    );
    expect(reviewRecs).toHaveLength(0);
  });
});

describe("interventionEngine — l1 persistence", () => {
  it("fires inject_l1_drill when the same pattern persists despite drilling", () => {
    const snap = makeSnapshot({
      activeL1Patterns: ["voicing_final_consonants"],
    });
    const agg = buildAggregation(snap);
    const memory: LearnerMemorySummaryLike = {
      userIdHash: U1,
      sessionIds: ["s"],
      recent: [
        { timestampMs: day(0), kind: "lesson_completed", reference: "l1_voicing_final_consonants_a" },
        { timestampMs: day(1), kind: "lesson_completed", reference: "l1_voicing_final_consonants_b" },
        { timestampMs: day(2), kind: "lesson_completed", reference: "l1_voicing_final_consonants_c" },
        { timestampMs: day(3), kind: "lesson_skipped", reference: "voicing_final_consonants_failure" },
      ],
    };
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg, memory });
    expect(plan.recommendations.some((r) => r.kind === "inject_l1_drill")).toBe(true);
  });
});

describe("interventionEngine — ineffective clusters", () => {
  it("fires swap_ineffective_cluster when clusters are supplied", () => {
    const snap = makeSnapshot();
    const agg = buildAggregation(snap);
    const clusters = [ineffective("cluster::weak", ["l1", "l2"], 0.3, 12)];
    const { plan } = recommendInterventions({
      snapshot: snap,
      aggregation: agg,
      ineffectiveClusters: clusters,
    });
    expect(
      plan.recommendations.some((r) => r.kind === "swap_ineffective_cluster"),
    ).toBe(true);
  });

  it("does NOT fire swap_ineffective_cluster when none are supplied", () => {
    const snap = makeSnapshot();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "swap_ineffective_cluster"),
    ).toBe(false);
  });
});

describe("interventionEngine — acceleration safety", () => {
  it("does NOT accelerate while burnout/churn/stagnation signals are present", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "accelerate_challenge"),
    ).toBe(false);
  });

  it("accelerates only when ALL risk signals are quiet AND mastery is high", () => {
    const snap = makeSnapshot({
      skills: {
        reading: { mastery: 0.9, attempts: 12, lastPracticedDayOrdinal: dayOrdinal(3) },
        writing: { mastery: 0.88, attempts: 10, lastPracticedDayOrdinal: dayOrdinal(3) },
        speaking: { mastery: 0.86, attempts: 11, lastPracticedDayOrdinal: dayOrdinal(3) },
      },
      reviewDebtCount: 0,
      streakDays: 8,
      activeL1Patterns: [],
    });
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(
      plan.recommendations.some((r) => r.kind === "accelerate_challenge"),
    ).toBe(true);
  });
});

describe("interventionEngine — contradictions guard", () => {
  it("does not emit both accelerate AND reduce_daily_load on the same input", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    const hasAccelerate = plan.recommendations.some(
      (r) => r.kind === "accelerate_challenge",
    );
    const hasReduce = plan.recommendations.some(
      (r) => r.kind === "reduce_daily_load",
    );
    expect(hasAccelerate && hasReduce).toBe(false);
  });

  it("intervention rebuild is idempotent — running twice yields no new recommendations", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const first = recommendInterventions({ snapshot: snap, aggregation: agg });
    const second = recommendInterventions({ snapshot: snap, aggregation: agg });
    expect(second.plan.recommendations.length).toBe(first.plan.recommendations.length);
  });
});

describe("interventionEngine — bilingual + evidence", () => {
  it("every recommendation has VI and EN strings", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    for (const r of plan.recommendations) {
      expect(r.headline.vi.length).toBeGreaterThan(0);
      expect(r.headline.en.length).toBeGreaterThan(0);
      expect(r.body.vi.length).toBeGreaterThan(0);
      expect(r.body.en.length).toBeGreaterThan(0);
    }
  });

  it("every recommendation carries at least one evidence entry", () => {
    const snap = snapshotWithOverload();
    const agg = buildAggregation(snap);
    const { plan } = recommendInterventions({ snapshot: snap, aggregation: agg });
    for (const r of plan.recommendations) {
      expect(r.evidence.length).toBeGreaterThan(0);
    }
  });
});
