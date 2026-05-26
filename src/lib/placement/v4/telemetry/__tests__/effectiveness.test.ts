import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  clusterWeakLessons,
  scoreAllLessons,
} from "../index";
import { scenarioCommon } from "./fixtures";

describe("effectiveness — scoring", () => {
  it("ranks the clean lesson highest", () => {
    const summary = aggregateEvents(scenarioCommon());
    const scores = scoreAllLessons(summary);
    const byId = new Map(scores.map((s) => [s.lessonId, s] as const));
    const l1 = byId.get("lesson-1")!;
    const l3 = byId.get("lesson-3")!;
    expect(l3.composite).toBeGreaterThan(l1.composite);
  });

  it("clamps composite into [0, 1]", () => {
    const summary = aggregateEvents(scenarioCommon());
    for (const s of scoreAllLessons(summary)) {
      expect(s.composite).toBeGreaterThanOrEqual(0);
      expect(s.composite).toBeLessThanOrEqual(1);
    }
  });

  it("returns scores sorted by lessonId", () => {
    const summary = aggregateEvents(scenarioCommon());
    const ids = scoreAllLessons(summary).map((s) => s.lessonId);
    expect([...ids].sort()).toEqual(ids);
  });

  it("completionRate matches completions / starts exactly", () => {
    const summary = aggregateEvents(scenarioCommon());
    const scores = scoreAllLessons(summary);
    for (const score of scores) {
      const lesson = summary.lessons.find(
        (l) => l.lessonId === score.lessonId,
      )!;
      const expected =
        lesson.starts > 0 ? lesson.completions / lesson.starts : 0;
      expect(score.completionRate).toBeCloseTo(expected, 10);
    }
  });
});

describe("effectiveness — clustering", () => {
  it("clusters lesson-1 (weak signature) but excludes lesson-3 (above threshold)", () => {
    const summary = aggregateEvents(scenarioCommon());
    const clusters = clusterWeakLessons(summary, {
      minUsersPerLesson: 1,
      // Threshold chosen so lesson-1 (weak: ~0.65 composite) is captured
      // while lesson-3 (clean: > 0.85 composite) is excluded.
      weakThreshold: 0.7,
    });
    const allLessons = clusters.flatMap((c) => c.lessonIds);
    expect(allLessons).toContain("lesson-1");
    expect(allLessons).not.toContain("lesson-3");
  });

  it("respects minUsersPerLesson", () => {
    const summary = aggregateEvents(scenarioCommon());
    const clusters = clusterWeakLessons(summary, {
      minUsersPerLesson: 99,
      weakThreshold: 0.9,
    });
    expect(clusters).toEqual([]);
  });

  it("rejects invalid granularity", () => {
    const summary = aggregateEvents(scenarioCommon());
    expect(() =>
      clusterWeakLessons(summary, { signatureGranularity: 0 }),
    ).toThrow();
    expect(() =>
      clusterWeakLessons(summary, { signatureGranularity: 1.5 }),
    ).toThrow();
  });

  it("emits clusters in stable order across re-runs", () => {
    const summary = aggregateEvents(scenarioCommon());
    const a = clusterWeakLessons(summary, {
      minUsersPerLesson: 1,
      weakThreshold: 0.9,
    });
    const b = clusterWeakLessons(summary, {
      minUsersPerLesson: 1,
      weakThreshold: 0.9,
    });
    expect(a).toEqual(b);
  });
});
