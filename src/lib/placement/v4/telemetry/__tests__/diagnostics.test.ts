import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  buildLearnerDiagnostics,
  composeInterventionPlan,
  computeAdaptiveSignals,
  ingestProgressionSnapshot,
} from "../index";
import { dayOrdinal, makeDay, makeLesson, makePlan, makeSnapshot } from "./adapterFixtures";

function build(snap = makeSnapshot()) {
  const agg = aggregateEvents(
    ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "diag" }),
  );
  const signals = computeAdaptiveSignals({ snapshot: snap, aggregation: agg });
  const plan = composeInterventionPlan({ snapshot: snap, signals });
  return { snapshot: snap, signals, plan };
}

describe("diagnostics — base output", () => {
  it("always emits a focus-area-this-week diagnostic", () => {
    const diags = buildLearnerDiagnostics(build());
    expect(diags.some((d) => d.kind === "focus_area_this_week")).toBe(true);
  });

  it("emits bilingual non-empty strings", () => {
    const diags = buildLearnerDiagnostics(build());
    for (const d of diags) {
      expect(d.headline.vi.length).toBeGreaterThan(0);
      expect(d.headline.en.length).toBeGreaterThan(0);
      expect(d.body.vi.length).toBeGreaterThan(0);
      expect(d.body.en.length).toBeGreaterThan(0);
    }
  });

  it("renders diagnostics in stable kind order", () => {
    const diags = buildLearnerDiagnostics(build());
    const kinds = diags.map((d) => d.kind);
    expect([...kinds].sort()).toEqual(kinds);
  });
});

describe("diagnostics — conditional surfaces", () => {
  it("emits you_may_be_overloaded when burnout fires", () => {
    const snap = makeSnapshot({
      plan: makePlan({
        days: [
          makeDay({
            day: 1,
            lessons: [
              makeLesson({ lessonId: "x", skill: "reading", estimatedMinutes: 40 }),
              makeLesson({ lessonId: "y", skill: "writing", estimatedMinutes: 30 }),
              makeLesson({ lessonId: "z", skill: "speaking", estimatedMinutes: 20 }),
            ],
          }),
          makeDay({
            day: 2,
            lessons: [
              makeLesson({ lessonId: "a", skill: "reading", estimatedMinutes: 40 }),
              makeLesson({ lessonId: "b", skill: "writing", estimatedMinutes: 30 }),
              makeLesson({ lessonId: "c", skill: "speaking", estimatedMinutes: 25 }),
            ],
          }),
          makeDay({
            day: 3,
            lessons: [
              makeLesson({ lessonId: "d", skill: "reading", estimatedMinutes: 35 }),
              makeLesson({ lessonId: "e", skill: "writing", estimatedMinutes: 35 }),
              makeLesson({ lessonId: "f", skill: "speaking", estimatedMinutes: 25 }),
            ],
          }),
          makeDay({
            day: 4,
            lessons: [
              makeLesson({ lessonId: "g", skill: "reading", estimatedMinutes: 35 }),
              makeLesson({ lessonId: "h", skill: "writing", estimatedMinutes: 30 }),
              makeLesson({ lessonId: "i", skill: "listening", estimatedMinutes: 30 }),
            ],
          }),
          makeDay({
            day: 5,
            lessons: [
              makeLesson({ lessonId: "j", skill: "reading", estimatedMinutes: 35 }),
              makeLesson({ lessonId: "k", skill: "writing", estimatedMinutes: 30 }),
              makeLesson({ lessonId: "l", skill: "speaking", estimatedMinutes: 30 }),
            ],
          }),
        ],
      }),
      currentDay: 5,
    });
    const diags = buildLearnerDiagnostics(build(snap));
    expect(diags.some((d) => d.kind === "you_may_be_overloaded")).toBe(true);
  });

  it("emits review_debt_building when reviewDebtCount >= 5", () => {
    const snap = makeSnapshot({ reviewDebtCount: 8 });
    const diags = buildLearnerDiagnostics(build(snap));
    expect(diags.some((d) => d.kind === "review_debt_building")).toBe(true);
  });

  it("emits speaking_confidence_improving when speaking mastery is high", () => {
    const snap = makeSnapshot({
      skills: {
        speaking: { mastery: 0.8, lastPracticedDayOrdinal: dayOrdinal(3) },
        reading: { mastery: 0.6 },
      },
    });
    const diags = buildLearnerDiagnostics(build(snap));
    expect(
      diags.some(
        (d) =>
          d.kind === "speaking_confidence_improving" &&
          d.tone === "celebratory",
      ),
    ).toBe(true);
  });

  it("uses non-judgmental language (no 'failed', 'risk', 'churn')", () => {
    const snap = makeSnapshot({ reviewDebtCount: 10, streakDays: 0 });
    const diags = buildLearnerDiagnostics(build(snap));
    for (const d of diags) {
      for (const text of [d.headline.vi, d.headline.en, d.body.vi, d.body.en]) {
        expect(text.toLowerCase()).not.toMatch(/failed|risk score|churn/);
      }
    }
  });
});
