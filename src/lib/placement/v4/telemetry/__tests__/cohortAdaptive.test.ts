import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  analyzeInterventionEffectiveness,
  burnoutByCefrBand,
  churnByWeakSkill,
  comparePlanVersions,
  composeInterventionPlan,
  computeAdaptiveSignals,
  ingestProgressionSnapshot,
  l1ClusterEffectiveness,
  speakingConfidenceRetention,
} from "../index";
import type {
  AdaptiveSignalBundle,
  CefrBandAssignment,
  InterventionOutcome,
  PlanVersionAssignment,
} from "../index";
import {
  U1,
  U2,
  U3,
  makeSnapshot,
  noSignals,
} from "./adapterFixtures";

function snapshotForUser(userIdHash: string) {
  return makeSnapshot({ userIdHash, sessionId: `${userIdHash}-sess` });
}

function makeAggregationForUsers(): ReturnType<typeof aggregateEvents> {
  const events = [
    ...ingestProgressionSnapshot({
      snapshot: snapshotForUser(U1),
      eventIdPrefix: `${U1}-prefix`,
    }),
    ...ingestProgressionSnapshot({
      snapshot: snapshotForUser(U2),
      eventIdPrefix: `${U2}-prefix`,
    }),
    ...ingestProgressionSnapshot({
      snapshot: snapshotForUser(U3),
      eventIdPrefix: `${U3}-prefix`,
    }),
  ];
  return aggregateEvents(events);
}

describe("cohortAdaptive — plan version comparison", () => {
  it("k-anonymity drops cohorts below threshold", () => {
    const agg = makeAggregationForUsers();
    const assignments: PlanVersionAssignment[] = [
      { userIdHash: U1, planVersion: "v1" },
      { userIdHash: U2, planVersion: "v2" },
      { userIdHash: U3, planVersion: "v2" },
    ];
    const report = comparePlanVersions(agg, assignments, { kAnonThreshold: 2 });
    expect(report.rows.find((r) => r.planVersion === "v1")).toBeUndefined();
    expect(report.rows.find((r) => r.planVersion === "v2")).toBeDefined();
  });

  it("includes cohorts at threshold", () => {
    const agg = makeAggregationForUsers();
    const assignments: PlanVersionAssignment[] = [
      { userIdHash: U1, planVersion: "v1" },
      { userIdHash: U2, planVersion: "v1" },
    ];
    const report = comparePlanVersions(agg, assignments, { kAnonThreshold: 2 });
    expect(report.rows[0]?.planVersion).toBe("v1");
  });

  it("returns rows in sorted planVersion order", () => {
    const agg = makeAggregationForUsers();
    const assignments: PlanVersionAssignment[] = [
      { userIdHash: U1, planVersion: "v3" },
      { userIdHash: U2, planVersion: "v1" },
      { userIdHash: U3, planVersion: "v2" },
    ];
    const report = comparePlanVersions(agg, assignments, { kAnonThreshold: 1 });
    const versions = report.rows.map((r) => r.planVersion);
    expect([...versions].sort()).toEqual(versions);
  });

  it("rejects invalid kAnonThreshold", () => {
    const agg = makeAggregationForUsers();
    expect(() =>
      comparePlanVersions(agg, [], { kAnonThreshold: 0 }),
    ).toThrow();
  });
});

describe("cohortAdaptive — intervention effectiveness", () => {
  function buildOutcome(
    userIdHash: string,
    kind:
      | "reduce_daily_load"
      | "inject_speaking_confidence_lesson"
      | "inject_l1_drill"
      | "schedule_recovery_review_day"
      | "accelerate_challenge"
      | "recommend_streak_recovery"
      | "swap_ineffective_cluster",
    returned: boolean,
    improved: boolean,
  ): InterventionOutcome {
    return {
      userIdHash,
      intervention: {
        id: `${kind}::test`,
        kind,
        priority: "medium",
        headline: { vi: "h", en: "h" },
        body: { vi: "b", en: "b" },
        evidence: [],
      },
      returnedWithin7Days: returned,
      weakSkillImprovedWithin14Days: improved,
    };
  }

  it("k-anon drops kinds below threshold", () => {
    const rows = analyzeInterventionEffectiveness(
      [
        buildOutcome(U1, "reduce_daily_load", true, false),
        buildOutcome(U2, "reduce_daily_load", true, true),
        buildOutcome(U3, "inject_l1_drill", false, false),
      ],
      { kAnonThreshold: 2 },
    );
    expect(rows.find((r) => r.kind === "inject_l1_drill")).toBeUndefined();
    expect(rows.find((r) => r.kind === "reduce_daily_load")).toBeDefined();
  });

  it("rates aggregate correctly", () => {
    const rows = analyzeInterventionEffectiveness(
      [
        buildOutcome(U1, "reduce_daily_load", true, false),
        buildOutcome(U2, "reduce_daily_load", true, true),
      ],
      { kAnonThreshold: 1 },
    );
    const row = rows.find((r) => r.kind === "reduce_daily_load")!;
    expect(row.userN).toBe(2);
    expect(row.returnedRate).toBe(1);
    expect(row.weakSkillImprovedRate).toBe(0.5);
  });
});

describe("cohortAdaptive — burnout by CEFR band", () => {
  it("aggregates burnout scores by CEFR band with k-anon gating", () => {
    const highBurnout: AdaptiveSignalBundle = {
      ...noSignals(),
      burnout: {
        level: "high",
        score: 0.6,
        factors: [
          { code: "daily_load_excess", weight: 0.6, metricValue: 90 },
        ],
      },
    };
    const lowBurnout: AdaptiveSignalBundle = noSignals();
    const assignments: CefrBandAssignment[] = [
      { userIdHash: U1, cefrBand: "A2", signals: highBurnout },
      { userIdHash: U2, cefrBand: "A2", signals: lowBurnout },
      { userIdHash: U3, cefrBand: "B1", signals: highBurnout },
    ];
    const rows = burnoutByCefrBand(assignments, { kAnonThreshold: 2 });
    expect(rows.find((r) => r.cefrBand === "A2")?.userN).toBe(2);
    expect(rows.find((r) => r.cefrBand === "B1")).toBeUndefined();
  });

  it("emits CEFR-sorted output", () => {
    const lowBurnout: AdaptiveSignalBundle = noSignals();
    const assignments: CefrBandAssignment[] = [
      { userIdHash: U1, cefrBand: "B2", signals: lowBurnout },
      { userIdHash: U2, cefrBand: "A1", signals: lowBurnout },
      { userIdHash: U3, cefrBand: "A2", signals: lowBurnout },
    ];
    const rows = burnoutByCefrBand(assignments, { kAnonThreshold: 1 });
    const order = rows.map((r) => r.cefrBand);
    expect(order).toEqual(["A1", "A2", "B2"]);
  });
});

describe("cohortAdaptive — churn by weak skill", () => {
  it("attributes a learner's churn signal across each of their weak skills", () => {
    const highChurn: AdaptiveSignalBundle = {
      ...noSignals(),
      churn: {
        level: "high",
        score: 0.6,
        daysSinceLastActive: 14,
        activityDensity: 0.1,
        factors: [],
      },
    };
    const rows = churnByWeakSkill(
      [
        { userIdHash: U1, weakSkills: ["speaking", "writing"], signals: highChurn },
        { userIdHash: U2, weakSkills: ["speaking"], signals: highChurn },
      ],
      { kAnonThreshold: 2 },
    );
    expect(rows.find((r) => r.weakSkill === "speaking")?.userN).toBe(2);
    expect(rows.find((r) => r.weakSkill === "writing")).toBeUndefined();
  });
});

describe("cohortAdaptive — L1 cluster effectiveness", () => {
  it("computes cefrMovedRate and patternResolvedRate", () => {
    const rows = l1ClusterEffectiveness(
      [
        { userIdHash: U1, patternIds: ["p1"], cefrMovedRecently: true, patternsPersist: false },
        { userIdHash: U2, patternIds: ["p1"], cefrMovedRecently: false, patternsPersist: true },
      ],
      { kAnonThreshold: 2 },
    );
    const row = rows.find((r) => r.patternId === "p1")!;
    expect(row.userN).toBe(2);
    expect(row.cefrMovedRate).toBe(0.5);
    expect(row.patternResolvedRate).toBe(0.5);
  });
});

describe("cohortAdaptive — speaking-confidence retention", () => {
  it("compares accepted vs not_accepted cohorts", () => {
    const rows = speakingConfidenceRetention(
      [
        {
          userIdHash: U1,
          acceptedConfidenceIntervention: true,
          returnedToSpeakingWithin7Days: true,
          speakingMasteryGained: true,
        },
        {
          userIdHash: U2,
          acceptedConfidenceIntervention: true,
          returnedToSpeakingWithin7Days: false,
          speakingMasteryGained: false,
        },
        {
          userIdHash: U3,
          acceptedConfidenceIntervention: false,
          returnedToSpeakingWithin7Days: false,
          speakingMasteryGained: false,
        },
      ],
      { kAnonThreshold: 1 },
    );
    const accepted = rows.find((r) => r.cohort === "accepted")!;
    const declined = rows.find((r) => r.cohort === "not_accepted")!;
    expect(accepted.returnedRate).toBe(0.5);
    expect(declined.returnedRate).toBe(0);
  });
});
