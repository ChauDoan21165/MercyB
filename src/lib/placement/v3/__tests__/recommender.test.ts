import { describe, expect, it } from "vitest";
import type { CEFRAssessment } from "@/types/placement-v3";
import { recommendLessons } from "../recommender";

function assessment(input: CEFRAssessment): CEFRAssessment {
  return input;
}

describe("placement v3 recommender", () => {
  it("returns mostly A1-A2 daily or room lessons for an A1 learner without L1 flags", () => {
    const recs = recommendLessons({
      assessment: assessment({ overallCefr: "A1", gaps: [], l1InterferenceFlags: [] }),
    });

    expect(recs.length).toBeGreaterThanOrEqual(6);
    expect(recs.length).toBeLessThanOrEqual(12);
    expect(recs.slice(0, 8).filter((rec) => ["A1", "A2"].includes(rec.cefrLevel)).length).toBeGreaterThanOrEqual(6);
    expect(recs.slice(0, 8).filter((rec) => rec.lessonId.startsWith("daily:") || rec.lessonId.startsWith("room:")).length).toBeGreaterThanOrEqual(4);
  });

  it("returns advanced grammar lessons for a C1 learner with a subjunctive mood gap", () => {
    const recs = recommendLessons({
      assessment: assessment({
        overallCefr: "C1",
        skillCefr: { grammar: "C1" },
        gaps: ["subjunctive mood"],
        l1InterferenceFlags: [],
      }),
    });

    expect(recs[0].category).toBe("grammar");
    expect(["B2", "C1", "C2"].includes(recs[0].cefrLevel)).toBe(true);
    expect(recs[0].matchedDiagnostics.gapMatch).toContain("subjunctive mood");
  });

  it("ranks article-focused lessons first for a B2 learner with severe missing-articles L1 flag", () => {
    const recs = recommendLessons({
      assessment: assessment({
        overallCefr: "B2",
        gaps: [],
        l1InterferenceFlags: [{ id: "missing-articles", severity: "severe" }],
      }),
    });

    expect(recs[0].matchedDiagnostics.l1Match).toContain("vi_l1_missing_article");
    expect([recs[0].lessonTitle, recs[0].reason].join(" ").toLowerCase()).toContain("article");
  });

  it("excludes lessons from recent history", () => {
    const firstPass = recommendLessons({
      assessment: assessment({ overallCefr: "B1", gaps: ["interview answers"], l1InterferenceFlags: [] }),
    });
    const blocked = firstPass[0].lessonId;

    const secondPass = recommendLessons({
      assessment: assessment({ overallCefr: "B1", gaps: ["interview answers"], l1InterferenceFlags: [] }),
      recentLessonHistory: [blocked],
    });

    expect(secondPass.map((rec) => rec.lessonId)).not.toContain(blocked);
  });

  it("boosts pronunciation lessons when focusOnPronunciation is true", () => {
    const plain = recommendLessons({
      assessment: assessment({ overallCefr: "B1", gaps: [], l1InterferenceFlags: [] }),
    });
    const focused = recommendLessons({
      assessment: assessment({ overallCefr: "B1", gaps: [], l1InterferenceFlags: [] }),
      userPreferences: { focusOnPronunciation: true },
    });

    const plainTop = plain.slice(0, 6).filter((rec) => rec.category === "pronunciation").length;
    const focusedTop = focused.slice(0, 6).filter((rec) => rec.category === "pronunciation").length;
    expect(focusedTop).toBeGreaterThanOrEqual(plainTop);
    expect(focused.slice(0, 3).some((rec) => rec.category === "pronunciation")).toBe(true);
  });

  it("spans multiple categories for an A2 learner with several gaps and L1 flags", () => {
    const recs = recommendLessons({
      assessment: assessment({
        overallCefr: "A2",
        skillCefr: { grammar: "A2", pronunciation: "A2", listening: "A2" },
        gaps: ["articles", "final consonants", "listening cafe"],
        l1InterferenceFlags: [
          { id: "missing-articles", severity: "high" },
          { id: "final-consonants", severity: "medium" },
        ],
      }),
    });

    expect(new Set(recs.slice(0, 8).map((rec) => rec.category)).size).toBeGreaterThanOrEqual(3);
  });

  it("falls back to CEFR-alignment ranking when gaps are empty", () => {
    const recs = recommendLessons({
      assessment: assessment({ overallCefr: "B1", gaps: [], l1InterferenceFlags: [] }),
    });

    expect(recs.length).toBeGreaterThanOrEqual(6);
    expect(recs[0].matchedDiagnostics.gapMatch).toEqual([]);
    expect(recs[0].matchedDiagnostics.cefrAlignment).toBeGreaterThanOrEqual(0.8);
  });

  it("returns C1/C2 lessons for a C2 learner instead of A1 lessons", () => {
    const recs = recommendLessons({
      assessment: assessment({ overallCefr: "C2", gaps: [], l1InterferenceFlags: [] }),
    });

    expect(recs.slice(0, 6).every((rec) => ["C1", "C2"].includes(rec.cefrLevel))).toBe(true);
    expect(recs.slice(0, 6).some((rec) => rec.cefrLevel === "A1")).toBe(false);
  });
});

