import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  canonicalJSON,
  ingestAdaptiveRecalculation,
  ingestBurnoutIndicator,
  ingestLessonCompletion,
  ingestLessonRetry,
  ingestLessonSkip,
  ingestLessonStart,
  ingestProgressionCheckpoint,
  ingestProgressionSnapshot,
  ingestReviewDebtAccumulation,
  ingestSpeakingRetry,
  ingestStudyPlanGenerated,
  validateEvents,
} from "../index";
import {
  SESSION,
  U1,
  ctx,
  day,
  makePlan,
  makeSnapshot,
} from "./adapterFixtures";

describe("studyPlanTelemetry — plan generation", () => {
  it("emits one lesson_start per day-1 lesson", () => {
    const events = ingestStudyPlanGenerated(makePlan(), ctx());
    expect(events).toHaveLength(2);
    expect(events.every((e) => e.type === "lesson_start")).toBe(true);
  });

  it("returns empty array when the plan has no day 1", () => {
    const plan = makePlan({ days: [] });
    expect(ingestStudyPlanGenerated(plan, ctx())).toEqual([]);
  });

  it("infers a CEFR target when none is declared", () => {
    const events = ingestStudyPlanGenerated(makePlan(), ctx());
    for (const ev of events) {
      if (ev.type === "lesson_start") {
        expect(["A1", "A2", "B1", "B2", "C1", "C2"]).toContain(ev.cefrTarget);
      }
    }
  });

  it("produces events that pass validation", () => {
    const events = ingestStudyPlanGenerated(makePlan(), ctx());
    const result = validateEvents(events);
    expect(result.rejected).toHaveLength(0);
    expect(result.valid).toHaveLength(events.length);
  });
});

describe("studyPlanTelemetry — lesson flow", () => {
  it("ingestLessonStart yields a valid lesson_start event", () => {
    const ev = ingestLessonStart(
      { lessonId: "lesson-x", skill: "reading" },
      ctx(),
    );
    expect(ev.type).toBe("lesson_start");
    expect(ev.lessonId).toBe("lesson-x");
  });

  it("ingestLessonCompletion rejects malformed inputs", () => {
    expect(() =>
      ingestLessonCompletion(
        { lessonId: "lx", durationMs: -1, scoreRatio: 0.5, retries: 0 },
        ctx(),
      ),
    ).toThrow();
    expect(() =>
      ingestLessonCompletion(
        { lessonId: "lx", durationMs: 1, scoreRatio: 1.2, retries: 0 },
        ctx(),
      ),
    ).toThrow();
    expect(() =>
      ingestLessonCompletion(
        { lessonId: "lx", durationMs: 1, scoreRatio: 0.5, retries: -1 },
        ctx(),
      ),
    ).toThrow();
  });

  it("ingestLessonSkip emits a dropoff event", () => {
    const ev = ingestLessonSkip(
      { lessonId: "lx", progressRatio: 0.5, dwellMs: 1000 },
      ctx(),
    );
    expect(ev.type).toBe("lesson_dropoff");
    expect(ev.progressRatio).toBe(0.5);
  });

  it("ingestLessonRetry rejects attemptOrdinal < 1", () => {
    expect(() =>
      ingestLessonRetry(
        { lessonId: "lx", attemptOrdinal: 0, reason: "incorrect" },
        ctx(),
      ),
    ).toThrow();
  });

  it("ingestSpeakingRetry rejects out-of-range pronunciation score", () => {
    expect(() =>
      ingestSpeakingRetry(
        {
          lessonId: "lx",
          promptId: "p1",
          attemptOrdinal: 1,
          pronunciationScore: 1.5,
        },
        ctx(),
      ),
    ).toThrow();
  });

  it("ingestProgressionCheckpoint rejects confidence > 1", () => {
    expect(() =>
      ingestProgressionCheckpoint(
        { modality: "overall", fromLevel: "A2", toLevel: "B1", confidence: 1.5 },
        ctx(),
      ),
    ).toThrow();
  });
});

describe("studyPlanTelemetry — context guard", () => {
  it("rejects missing userIdHash", () => {
    expect(() =>
      ingestLessonStart(
        { lessonId: "lx", skill: "reading" },
        ctx({ userIdHash: "" }),
      ),
    ).toThrow();
  });

  it("rejects fractional nowMs", () => {
    expect(() =>
      ingestLessonStart(
        { lessonId: "lx", skill: "reading" },
        ctx({ nowMs: 1.5 }),
      ),
    ).toThrow();
  });

  it("rejects missing eventIdPrefix", () => {
    expect(() =>
      ingestLessonStart(
        { lessonId: "lx", skill: "reading" },
        ctx({ eventIdPrefix: "" }),
      ),
    ).toThrow();
  });
});

describe("studyPlanTelemetry — adaptive recalculation", () => {
  it("emits day-1 starts + a study_streak marker event", () => {
    const newPlan = makePlan({ planVersion: "v4.test.002" });
    const events = ingestAdaptiveRecalculation(
      {
        newPlan,
        previousPlanVersion: "v4.test.001",
        reasonCode: "burnout_detected",
      },
      ctx(),
    );
    expect(events.some((e) => e.type === "study_streak")).toBe(true);
    expect(events.some((e) => e.type === "lesson_start")).toBe(true);
  });

  it("rejects unchanged plan version", () => {
    expect(() =>
      ingestAdaptiveRecalculation(
        {
          newPlan: makePlan(),
          previousPlanVersion: "v4.test.001",
          reasonCode: "user_request",
        },
        ctx(),
      ),
    ).toThrow();
  });

  it("threads the reasonCode into event ids for downstream introspection", () => {
    const events = ingestAdaptiveRecalculation(
      {
        newPlan: makePlan({ planVersion: "v4.test.002" }),
        previousPlanVersion: "v4.test.001",
        reasonCode: "forecast_miss",
      },
      ctx(),
    );
    expect(events.every((e) => e.eventId.includes("forecast_miss"))).toBe(true);
  });
});

describe("studyPlanTelemetry — burnout + review debt", () => {
  it("burnout indicator emits hesitation + dropoff when abandoned", () => {
    const events = ingestBurnoutIndicator(
      {
        lessonId: "lx",
        hesitationDurationMs: 8000,
        silenceCount: 2,
        abandoned: true,
        progressRatio: 0.3,
        dwellMs: 5000,
      },
      ctx(),
    );
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe("hesitation_loop");
    expect(events[1].type).toBe("lesson_dropoff");
  });

  it("burnout indicator emits only hesitation when not abandoned", () => {
    const events = ingestBurnoutIndicator(
      {
        lessonId: "lx",
        hesitationDurationMs: 8000,
        silenceCount: 2,
        abandoned: false,
        progressRatio: 0.3,
        dwellMs: 5000,
      },
      ctx(),
    );
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("hesitation_loop");
  });

  it("review debt above 5 with skipped reviews → broken streak event", () => {
    const ev = ingestReviewDebtAccumulation(
      {
        reviewDebtCount: 7,
        reviewSkippedRecently: true,
        streakDays: 2,
      },
      ctx(),
    );
    expect(ev.streakState).toBe("broken");
  });

  it("review debt rejects fractional counts", () => {
    expect(() =>
      ingestReviewDebtAccumulation(
        {
          reviewDebtCount: 1.5,
          reviewSkippedRecently: false,
          streakDays: 2,
        },
        ctx(),
      ),
    ).toThrow();
  });
});

describe("studyPlanTelemetry — replay determinism", () => {
  it("snapshot ingestion produces byte-identical canonical JSON across runs", () => {
    const snap = makeSnapshot();
    const a = ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "fx" });
    const b = ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "fx" });
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
  });

  it("aggregation over re-emitted events is stable", () => {
    const snap = makeSnapshot();
    const events = ingestProgressionSnapshot({
      snapshot: snap,
      eventIdPrefix: "fx",
    });
    const agg1 = aggregateEvents(events);
    const agg2 = aggregateEvents([...events].reverse());
    expect(canonicalJSON(agg1)).toBe(canonicalJSON(agg2));
  });

  it("session id and user id hash propagate to every event", () => {
    const snap = makeSnapshot({
      userIdHash: U1,
      sessionId: SESSION,
      snapshotMs: day(4),
    });
    const events = ingestProgressionSnapshot({
      snapshot: snap,
      eventIdPrefix: "fx",
    });
    for (const ev of events) {
      expect(ev.userIdHash).toBe(U1);
      expect(ev.sessionId).toBe(SESSION);
    }
  });
});
