import { describe, expect, it } from "vitest";
import { recommendNextLesson } from "@/lib/tutor/nextLessonRecommender";
import {
  FIXTURE_VN_LEARNER_B1_12_SESSIONS,
  FIXTURE_VN_LEARNER_NEW,
  FIXTURE_VN_LEARNER_TENSE_ONLY,
} from "@/lib/tutor/tests/fixtures/learnerHistoryProfile.fixture";

describe("recommendNextLesson", () => {
  it("fires missing-article rule on the real B1 learner fixture", () => {
    const rec = recommendNextLesson(FIXTURE_VN_LEARNER_B1_12_SESSIONS);

    expect(rec.ruleFired).toBe("viet-interference:missing-article");
    expect(rec.targetSkill).toBe("missing-article");
    expect(rec.suggestedMode).toBe("grammar");
    expect(rec.lessonTitle).toContain("article");
    // Reason should quote the observed count (5 in the fixture).
    expect(rec.reason).toContain("5 times");
  });

  it("fires tense-omission rule when article count is below threshold", () => {
    const rec = recommendNextLesson(FIXTURE_VN_LEARNER_TENSE_ONLY);

    expect(rec.ruleFired).toBe("viet-interference:tense-omission");
    expect(rec.targetSkill).toBe("tense-omission");
    expect(rec.suggestedMode).toBe("grammar");
    expect(rec.reason).toContain("4 sentences");
  });

  it("fires fallback starter rule when learner has no signal", () => {
    const rec = recommendNextLesson(FIXTURE_VN_LEARNER_NEW);

    expect(rec.ruleFired).toBe("fallback:starter");
    expect(rec.targetSkill).toBe("starter-sentence");
    expect(rec.suggestedMode).toBe("grammar");
  });

  it("fires lowest-mastery rule when interference is below threshold but mastery is weak", () => {
    const profile = {
      ...FIXTURE_VN_LEARNER_NEW,
      topicMastery: { "past-tense": 28, "daily-life": 80 },
      interferencePatterns: [
        { tag: "missing-article" as const, observedCount: 1, lastSeenAt: 0 },
      ],
    };
    const rec = recommendNextLesson(profile);

    expect(rec.ruleFired).toBe("mastery:lowest-topic-review");
    expect(rec.targetSkill).toBe("past-tense");
  });

  it("returns a recommendation with all required fields on every fixture", () => {
    const fixtures = [
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      FIXTURE_VN_LEARNER_NEW,
      FIXTURE_VN_LEARNER_TENSE_ONLY,
    ];

    for (const fixture of fixtures) {
      const rec = recommendNextLesson(fixture);
      expect(rec.lessonTitle).toBeTruthy();
      expect(rec.targetSkill).toBeTruthy();
      expect(rec.reason).toBeTruthy();
      expect(["journey", "grammar", "speak", "logic"]).toContain(rec.suggestedMode);
      expect(rec.ruleFired).toBeTruthy();
    }
  });
});
