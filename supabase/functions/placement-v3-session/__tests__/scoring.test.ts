import { describe, expect, it } from "vitest";
import { aggregateProfile, recommendLessonsStub } from "../scoring.ts";
import type { PlacementV3Response } from "../types.ts";
import { assessment } from "./fixtures/mock-grader-responses.ts";

function response(
  modality: PlacementV3Response["modality"],
  taskIndex: number,
  level = "B1" as const,
  confidence = 0.8,
  flags = [],
): PlacementV3Response {
  return {
    session_id: "session-1",
    task_index: taskIndex,
    modality,
    prompt_id: `p-${taskIndex}`,
    prompt_text: "Prompt",
    user_response_text: "Answer",
    audio_storage_path: null,
    response_duration_ms: 1000,
    ai_assessment: assessment(level, confidence, {
      l1InterferenceFlags: flags,
    }),
    ai_assessment_version: "test",
    graded_at: "2026-05-20T12:00:00.000Z",
    created_at: "2026-05-20T12:00:00.000Z",
  };
}

describe("placement v3 scoring", () => {
  it("single modality single response produces a valid profile", () => {
    const profile = aggregateProfile({
      userId: "user-1",
      sessionId: "session-1",
      responses: [response("writing", 0, "A2", 0.9)],
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(profile.cefr_overall).toBe("A2");
    expect(profile.cefr_per_skill.writing?.confidence).toBe(0.9);
  });

  it("all modalities produce a multi-skill profile", () => {
    const profile = aggregateProfile({
      userId: "user-1",
      sessionId: "session-1",
      responses: [
        response("writing", 0, "A2", 0.8),
        response("speaking", 1, "B1", 0.8),
        response("reading", 2, "B2", 0.8),
        response("listening", 3, "B1", 0.8),
        response("conversation", 4, "B1", 0.8),
      ],
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(Object.keys(profile.cefr_per_skill)).toHaveLength(5);
    expect(profile.cefr_overall).toBe("B1");
  });

  it("mixed confidence propagates into overall confidence", () => {
    const profile = aggregateProfile({
      userId: "user-1",
      sessionId: "session-1",
      responses: [
        response("writing", 0, "C1", 0.2),
        response("speaking", 1, "A2", 0.9),
      ],
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(profile.cefr_overall_confidence).toBe(0.55);
    expect(profile.cefr_overall).toBe("B1");
  });

  it("empty L1 flags stay empty", () => {
    const profile = aggregateProfile({
      userId: "user-1",
      sessionId: "session-1",
      responses: [response("writing", 0)],
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(profile.l1_interference_flags).toEqual([]);
  });

  it("deduplicates L1 flags and keeps highest severity", () => {
    const profile = aggregateProfile({
      userId: "user-1",
      sessionId: "session-1",
      responses: [
        response("writing", 0, "A2", 0.8, [
          { patternId: "article_omission", severity: "low" as const },
        ]),
        response("speaking", 1, "A2", 0.8, [
          { patternId: "article_omission", severity: "high" as const },
        ]),
      ],
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(profile.l1_interference_flags).toEqual([
      { patternId: "article_omission", severity: "high" },
    ]);
  });

  it("stub recommender returns three ordered lessons", () => {
    const profile = aggregateProfile({
      userId: "user-1",
      sessionId: "session-1",
      responses: [response("writing", 0, "B1", 0.8)],
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(recommendLessonsStub(profile).map((r) => r.priority)).toEqual([1, 2, 3]);
  });
});

