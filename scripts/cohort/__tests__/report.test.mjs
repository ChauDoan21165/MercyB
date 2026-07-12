import { describe, expect, it } from "vitest";
import {
  extractPhonemeScores,
  isCopulaDetectorMatch,
  normalizeUserIds,
  parseArgs,
  summarizeWindow,
} from "../report.mjs";

describe("cohort report helpers", () => {
  it("excludes the synthetic account prefix by construction", () => {
    expect(normalizeUserIds([
      "63e289e1-aaaa-bbbb-cccc-123456789012",
      "11111111-1111-1111-1111-111111111111",
      "11111111-1111-1111-1111-111111111111",
    ])).toEqual(["11111111-1111-1111-1111-111111111111"]);
  });

  it("extracts nested Azure phoneme scores for VN-confusable sounds", () => {
    const scores = [
      { word: "think", phonemes: [{ phoneme: "θ", score: 81 }, { phoneme: "ɪ", score: 90 }] },
      { word: "very", phonemes: [{ phoneme: "v", score: 63 }] },
    ];

    expect(extractPhonemeScores(scores, ["θ", "v"])).toEqual([
      { phoneme: "θ", score: 81 },
      { phoneme: "v", score: 63 },
    ]);
  });

  it("detects copula provenance across known row shapes", () => {
    expect(isCopulaDetectorMatch({ rule_or_detector_id: "vi_l1_missing_be" })).toBe(true);
    expect(isCopulaDetectorMatch({ error_details: { detectorTag: "vi_l1_missing_be" } })).toBe(true);
    expect(isCopulaDetectorMatch({ payload: { tag: "vi_l1_plural_s" } })).toBe(false);
  });

  it("summarizes entry metrics with sample sizes", () => {
    const userId = "11111111-1111-1111-1111-111111111111";
    const summary = summarizeWindow({
      userIds: [userId],
      windowName: "entry",
      windowRange: { start: "2026-07-01", end: "2026-07-08" },
      phonemes: ["θ", "v"],
      conversations: [{ id: "c1", user_id: userId, turn_count: 10 }],
      conversationEvents: [
        { conversation_id: "c1", turn_number: 1, event_type: "turn_completed" },
        { conversation_id: "c1", turn_number: 2, event_type: "error_detected", error_details: { tag: "vi_l1_missing_be" } },
      ],
      learningEvents: [{ user_id: userId, rule_or_detector_id: "vi_l1_missing_be" }],
      speechAttempts: [{
        user_id: userId,
        provider: "cloud",
        overall_score: 72,
        phoneme_scores: [{ word: "think", phonemes: [{ phoneme: "θ", score: 70 }] }],
      }],
    });

    expect(summary.aggregate.utterance_denominator).toBe(10);
    expect(summary.aggregate.copula_events).toBe(2);
    expect(summary.aggregate.copula_per_100_utterances).toBe(20);
    expect(summary.aggregate.phoneme_samples).toBe(1);
  });

  it("parses a complete CLI shape", () => {
    const parsed = parseArgs([
      "--users", "11111111-1111-1111-1111-111111111111",
      "--entry-start", "2026-07-01",
      "--entry-end", "2026-07-08",
      "--week3-start", "2026-07-22",
      "--week3-end", "2026-07-29",
    ]);

    expect(parsed.users).toEqual(["11111111-1111-1111-1111-111111111111"]);
    expect(parsed.outJson).toBe("reports/cohort/cohort-report.json");
  });
});
