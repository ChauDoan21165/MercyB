import { describe, expect, it } from "vitest";

import { TELEMETRY_SCHEMA_VERSION, validateEvents } from "../index";

const validBase = {
  v: TELEMETRY_SCHEMA_VERSION,
  eventId: "ev-1",
  userIdHash: "uhash_abcdef",
  sessionId: "sess-1",
  timestampMs: 1_700_000_000_000,
} as const;

describe("schema — accepts well-formed events", () => {
  it("admits one of each event type", () => {
    const input = [
      {
        ...validBase,
        eventId: "ev-1",
        type: "lesson_start",
        lessonId: "lesson-1",
        cefrTarget: "A2",
        modality: "reading",
      },
      {
        ...validBase,
        eventId: "ev-2",
        type: "lesson_complete",
        lessonId: "lesson-1",
        durationMs: 60_000,
        scoreRatio: 0.8,
        retries: 0,
      },
      {
        ...validBase,
        eventId: "ev-3",
        type: "lesson_retry",
        lessonId: "lesson-1",
        attemptOrdinal: 2,
        reason: "incorrect",
      },
      {
        ...validBase,
        eventId: "ev-4",
        type: "lesson_dropoff",
        lessonId: "lesson-1",
        progressRatio: 0.4,
        dwellMs: 30_000,
      },
      {
        ...validBase,
        eventId: "ev-5",
        type: "speaking_retry",
        lessonId: "lesson-1",
        promptId: "p-1",
        attemptOrdinal: 1,
        pronunciationScore: 0.55,
      },
      {
        ...validBase,
        eventId: "ev-6",
        type: "hesitation_loop",
        lessonId: "lesson-1",
        loopDurationMs: 8_000,
        silenceCount: 2,
      },
      {
        ...validBase,
        eventId: "ev-7",
        type: "study_streak",
        streakDays: 3,
        streakState: "active",
      },
      {
        ...validBase,
        eventId: "ev-8",
        type: "cefr_checkpoint",
        modality: "overall",
        fromLevel: "A2",
        toLevel: "B1",
        confidence: 0.8,
      },
    ];
    const result = validateEvents(input);
    expect(result.rejected).toHaveLength(0);
    expect(result.valid).toHaveLength(8);
  });
});

describe("schema — rejects malformed events", () => {
  it("rejects an unknown event type with a stable reason", () => {
    const result = validateEvents([
      { ...validBase, type: "unknown_event" },
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].index).toBe(0);
    expect(result.rejected[0].reason).toMatch(/type/);
  });

  it("rejects extra unknown fields (strict mode)", () => {
    const result = validateEvents([
      {
        ...validBase,
        type: "lesson_start",
        lessonId: "lesson-1",
        cefrTarget: "A2",
        modality: "reading",
        attackerInjected: "<script>alert(1)</script>",
      },
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.rejected[0].reason).toMatch(/attackerInjected/);
  });

  it("rejects events with non-integer timestamps", () => {
    const result = validateEvents([
      {
        ...validBase,
        timestampMs: 1.5,
        type: "lesson_start",
        lessonId: "lesson-1",
        cefrTarget: "A2",
        modality: "reading",
      },
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.rejected[0].reason).toMatch(/timestampMs/);
  });

  it("rejects scoreRatio outside 0..1", () => {
    const cases = [-0.1, 1.1, Number.NaN, Number.POSITIVE_INFINITY];
    for (const scoreRatio of cases) {
      const result = validateEvents([
        {
          ...validBase,
          type: "lesson_complete",
          lessonId: "lesson-1",
          durationMs: 1000,
          retries: 0,
          scoreRatio,
        },
      ]);
      expect(result.valid).toHaveLength(0);
      expect(result.rejected).toHaveLength(1);
    }
  });

  it("rejects negative durations", () => {
    const result = validateEvents([
      {
        ...validBase,
        type: "lesson_complete",
        lessonId: "lesson-1",
        durationMs: -1,
        scoreRatio: 0.8,
        retries: 0,
      },
    ]);
    expect(result.valid).toHaveLength(0);
  });

  it("rejects unknown CEFR levels", () => {
    const result = validateEvents([
      {
        ...validBase,
        type: "lesson_start",
        lessonId: "lesson-1",
        cefrTarget: "D1",
        modality: "reading",
      },
    ]);
    expect(result.valid).toHaveLength(0);
  });

  it("rejects unknown streak states", () => {
    const result = validateEvents([
      {
        ...validBase,
        type: "study_streak",
        streakDays: 3,
        streakState: "paused",
      },
    ]);
    expect(result.valid).toHaveLength(0);
  });

  it("rejects empty string identifiers", () => {
    const result = validateEvents([
      {
        ...validBase,
        eventId: "",
        type: "lesson_start",
        lessonId: "lesson-1",
        cefrTarget: "A2",
        modality: "reading",
      },
    ]);
    expect(result.valid).toHaveLength(0);
  });

  it("preserves input order for the valid list and captures rejected index", () => {
    const valid = {
      ...validBase,
      type: "lesson_start",
      lessonId: "lesson-1",
      cefrTarget: "A2",
      modality: "reading",
    };
    const bad = { ...validBase, type: "garbage" };
    const result = validateEvents([valid, bad, valid, bad]);
    expect(result.valid).toHaveLength(2);
    expect(result.rejected.map((r) => r.index)).toEqual([1, 3]);
  });

  it("handles non-object inputs gracefully (null/undefined/primitives)", () => {
    const result = validateEvents([
      null,
      undefined,
      42,
      "lesson_start",
      [],
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.rejected).toHaveLength(5);
  });

  it("rejects an older schema version explicitly", () => {
    const result = validateEvents([
      {
        ...validBase,
        v: 0,
        type: "lesson_start",
        lessonId: "lesson-1",
        cefrTarget: "A2",
        modality: "reading",
      },
    ]);
    expect(result.valid).toHaveLength(0);
    expect(result.rejected[0].reason).toMatch(/v/);
  });
});
