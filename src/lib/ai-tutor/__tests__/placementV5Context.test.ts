import { describe, expect, it } from "vitest";
import { buildPlacementV5TutorContext } from "../placementV5Context";

describe("buildPlacementV5TutorContext", () => {
  it("returns empty context when no V5 summary is available", () => {
    expect(buildPlacementV5TutorContext(null)).toEqual({
      context: "",
      included: false,
    });
  });

  it("builds sanitized read-only context from V5 summaries", () => {
    const result = buildPlacementV5TutorContext({
      learnerMemory: {
        event_count: 12,
        updated_at: "2026-05-23T12:00:00Z",
        schema_version: "v5-test",
      },
      telemetry: [
        { event_type: "review.completed", event_count: 4 },
        { event_type: "plan.opened", event_count: 9 },
      ],
      curriculumPlan: {
        plan_length_days: 28,
        generated_at: "2026-05-22T12:00:00Z",
        superseded_at: null,
      },
    });

    expect(result.included).toBe(true);
    expect(result.context).toContain("read-only and sanitized");
    expect(result.context).toContain("activity count: 12");
    expect(result.context).toContain("current plan length: 28 days");
    expect(result.context).toContain("plan.opened");
  });

  it("does not leak raw identifiers, answers, scores, payloads, or writeback fields", () => {
    const unsafe = {
      learnerMemory: {
        event_count: 1,
        updated_at: "2026-05-23T12:00:00Z",
        schema_version: "v5-test",
        user_id: "raw-user-id",
        learner_key: "learner-key",
        payload: { rawAnswer: "I goed home", score: 42 },
      },
      telemetry: [
        { event_type: "answer.submitted", event_count: 1, payload: { answer: "raw user answer" } },
        { event_type: "bad event with spaces", event_count: 99 },
      ],
      curriculumPlan: {
        plan_length_days: 28,
        generated_at: "2026-05-22T12:00:00Z",
        superseded_at: null,
        score: 88,
        writeback: true,
      },
    };

    const result = buildPlacementV5TutorContext(unsafe);

    expect(result.context).not.toContain("raw-user-id");
    expect(result.context).not.toContain("learner-key");
    expect(result.context).not.toContain("I goed home");
    expect(result.context).not.toContain("raw user answer");
    expect(result.context).not.toContain("score: 42");
    expect(result.context).not.toContain("88");
    expect(result.context).not.toContain("writeback");
    expect(result.context).not.toContain("bad event with spaces");
  });
});
