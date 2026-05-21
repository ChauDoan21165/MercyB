import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  buildCohortDriftReport,
  cohortKey,
} from "../index";
import type { CohortAssignment } from "../index";
import { scenarioCommon, tDay } from "./fixtures";

const HORIZON = tDay(10);

function makeAssignments(): CohortAssignment[] {
  const cohortA = {
    key: cohortKey({
      cefrBand: "A2",
      nativeLang: "vi",
      targetLang: "en",
      ageBucket: "adult",
    }),
    cefrBand: "A2" as const,
    nativeLang: "vi",
    targetLang: "en",
    ageBucket: "adult" as const,
  };
  const cohortB = {
    key: cohortKey({
      cefrBand: "B1",
      nativeLang: "vi",
      targetLang: "en",
      ageBucket: "adult",
    }),
    cefrBand: "B1" as const,
    nativeLang: "vi",
    targetLang: "en",
    ageBucket: "adult" as const,
  };
  return [
    {
      userIdHash: "uhash_user_one_aaaaaaaaaaaaaaaa",
      cohort: cohortA,
    },
    {
      userIdHash: "uhash_user_two_bbbbbbbbbbbbbbbb",
      cohort: cohortA,
    },
    {
      userIdHash: "uhash_user_three_ccccccccccccccc",
      cohort: cohortB,
    },
  ];
}

describe("cohort — drift report", () => {
  it("drops cohorts below the k-anonymity threshold", () => {
    const summary = aggregateEvents(scenarioCommon());
    const assignments = makeAssignments();
    const report = buildCohortDriftReport(summary, assignments, {
      horizonMs: HORIZON,
      kAnonThreshold: 3,
    });
    // Cohort B has only 1 user → must be suppressed.
    expect(report.rows.find((r) => r.cohortKey.startsWith("B1"))).toBeUndefined();
  });

  it("includes cohorts at or above the threshold", () => {
    const summary = aggregateEvents(scenarioCommon());
    const report = buildCohortDriftReport(summary, makeAssignments(), {
      horizonMs: HORIZON,
      kAnonThreshold: 1,
    });
    const keys = report.rows.map((r) => r.cohortKey);
    expect(keys.length).toBeGreaterThanOrEqual(1);
  });

  it("rejects invalid kAnonThreshold", () => {
    const summary = aggregateEvents(scenarioCommon());
    expect(() =>
      buildCohortDriftReport(summary, makeAssignments(), {
        horizonMs: HORIZON,
        kAnonThreshold: 0,
      }),
    ).toThrow();
  });

  it("emits cohort rows in sorted key order (deterministic)", () => {
    const summary = aggregateEvents(scenarioCommon());
    const report = buildCohortDriftReport(summary, makeAssignments(), {
      horizonMs: HORIZON,
      kAnonThreshold: 1,
    });
    const keys = report.rows.map((r) => r.cohortKey);
    expect([...keys].sort()).toEqual(keys);
  });

  it("notable gaps are deterministically sorted by (metric, a, b)", () => {
    const summary = aggregateEvents(scenarioCommon());
    const report = buildCohortDriftReport(summary, makeAssignments(), {
      horizonMs: HORIZON,
      kAnonThreshold: 1,
    });
    for (let i = 1; i < report.notableGaps.length; i++) {
      const prev = report.notableGaps[i - 1];
      const curr = report.notableGaps[i];
      const key = (g: typeof prev) => `${g.metric}|${g.a}|${g.b}`;
      expect(key(prev) <= key(curr)).toBe(true);
    }
  });

  it("output identical under reordered assignments (cohort drift stability)", () => {
    const summary = aggregateEvents(scenarioCommon());
    const a = makeAssignments();
    const b = [...a].reverse();
    const reportA = buildCohortDriftReport(summary, a, {
      horizonMs: HORIZON,
      kAnonThreshold: 1,
    });
    const reportB = buildCohortDriftReport(summary, b, {
      horizonMs: HORIZON,
      kAnonThreshold: 1,
    });
    expect(reportA).toEqual(reportB);
  });

  it("ignores users without cohort assignments (privacy: caller controls scope)", () => {
    const summary = aggregateEvents(scenarioCommon());
    const partial = makeAssignments().slice(0, 1);
    const report = buildCohortDriftReport(summary, partial, {
      horizonMs: HORIZON,
      kAnonThreshold: 1,
    });
    expect(report.rows[0]?.userN ?? 0).toBe(1);
  });
});
