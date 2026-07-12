import { describe, expect, it } from "vitest";
import { evaluatePreflight, parseArgs, renderMarkdown } from "../preflight.mjs";

const USER_ID = "11111111-1111-4111-8111-111111111111";

describe("cohort capture preflight", () => {
  it("passes when each cohort metric has row-level evidence", () => {
    const report = evaluatePreflight({
      userId: USER_ID,
      start: "2026-07-12T00:00:00Z",
      end: "2026-07-12T01:00:00Z",
      cohortTag: "cohort_preflight",
      rows: {
        conversations: [{ id: "c1", user_id: USER_ID, turn_count: 2, started_at: "2026-07-12T00:10:00Z" }],
        conversationEvents: [{ id: "e1", conversation_id: "c1", event_type: "turn_completed", turn_number: 1 }],
        learningEvents: [{ id: "l1", event_type: "feedback_shown", rule_or_detector_id: "vi_l1_missing_be" }],
        speechAttempts: [{
          id: "s1",
          provider: "cloud",
          phoneme_scores: [{ word: "think", phonemes: [{ phoneme: "θ", score: 82 }] }],
        }],
        featureFlags: [{ flag_key: "cohort_preflight", is_enabled: false, enabled_user_ids: [USER_ID] }],
        profiles: [{ id: USER_ID, is_synthetic: false }],
      },
    });

    expect(report.overall_status).toBe("PASS");
    expect(report.checks.map((check) => check.status)).toEqual(["PASS", "PASS", "PASS", "PASS", "PASS"]);
    expect(renderMarkdown(report)).toContain("Expected PASS Output");
  });

  it("fails with actionable owner-gated guidance when evidence is missing", () => {
    const report = evaluatePreflight({
      userId: USER_ID,
      start: "2026-07-12T00:00:00Z",
      end: "2026-07-12T01:00:00Z",
      rows: {
        conversations: [],
        conversationEvents: [],
        learningEvents: [{ id: "l1", event_type: "feedback_shown", rule_or_detector_id: null }],
        speechAttempts: [{ id: "s1", provider: "local", phoneme_scores: null }],
        featureFlags: [{ flag_key: "other", is_enabled: true, enabled_user_ids: [] }],
        profiles: [{ id: USER_ID, is_synthetic: false }],
      },
    });

    expect(report.overall_status).toBe("FAIL");
    expect(report.checks.find((check) => check.id === "detector_provenance_events")?.fail_guidance[0].flag)
      .toBe("VITE_TUTOR_PREDICTION_CAPTURE_ENABLED");
    expect(report.checks.find((check) => check.id === "synthetic_exclusion_verified")?.status).toBe("PASS");
  });

  it("honors synthetic prefix exclusion", () => {
    const report = evaluatePreflight({
      userId: "63e289e1-0000-4000-8000-000000000000",
      start: "2026-07-12T00:00:00Z",
      end: "2026-07-12T01:00:00Z",
      rows: {
        conversations: [{ id: "c1", turn_count: 1 }],
        conversationEvents: [],
        learningEvents: [{ event_type: "correction_accepted", rule_or_detector_id: "vi_l1_missing_be" }],
        speechAttempts: [{ phoneme_scores: [{ phoneme: "θ", score: 90 }] }],
        featureFlags: [{ flag_key: "cohort", enabled_user_ids: ["63e289e1-0000-4000-8000-000000000000"] }],
        profiles: [{ id: "63e289e1-0000-4000-8000-000000000000", is_synthetic: false }],
      },
    });

    expect(report.checks.find((check) => check.id === "synthetic_exclusion_verified")?.status).toBe("FAIL");
  });

  it("parses required cli options", () => {
    expect(parseArgs([
      "--user-id", USER_ID,
      "--start", "2026-07-12T00:00:00Z",
      "--end", "2026-07-12T01:00:00Z",
      "--cohort-tag", "cohort_preflight",
    ])).toMatchObject({
      userId: USER_ID,
      start: "2026-07-12T00:00:00Z",
      end: "2026-07-12T01:00:00Z",
      cohortTag: "cohort_preflight",
    });
  });
});
