// src/lib/interview/__tests__/interviewSession.test.ts
//
// Unit tests for the rubric → EssayScore adapter and the session-level
// aggregation helpers. Database paths are not unit-tested here —
// they're integration concerns and require a live Supabase project.
// The pure pieces are the only logic worth pinning at this layer.

import { describe, expect, it, vi } from "vitest";

// `interviewSession` imports the supabase singleton at module load,
// which in a worktree without VITE_SUPABASE_URL would throw before the
// pure helpers are reachable. We don't exercise any DB paths in this
// suite, so a no-op stub is enough.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
      select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn() })) })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
      })),
    })),
  },
}));

import {
  aggregateRubric,
  microLessonsForTags,
  rubricToEssayScore,
  topIssuesAcross,
  type InterviewAnswer,
} from "../interviewSession";
import { scoreEssay } from "@/lib/writing-feedback/scoreEssay";
import { emptyRubric } from "@/lib/writing-feedback/rubric";
import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";

// Helper — build an answer using the real scoreEssay so we exercise the
// full pipe (text → rubric → EssayScore) instead of stubbing rubrics.
function answerFor(text: string, questionIndex: number): InterviewAnswer {
  const rubric = scoreEssay(text);
  return {
    questionIndex,
    text,
    submittedAt: new Date().toISOString(),
    score: rubricToEssayScore(text, rubric),
  };
}

describe("rubricToEssayScore", () => {
  it("returns zeroes and a coaching message for an empty answer", () => {
    const out = rubricToEssayScore("", emptyRubric());
    expect(out.overall).toBe(0);
    expect(out.feedback_vi.length).toBeGreaterThan(0);
    expect(out.feedback_en.length).toBeGreaterThan(0);
  });

  it("never throws on whitespace-only input", () => {
    expect(() => rubricToEssayScore("   ", emptyRubric())).not.toThrow();
    const out = rubricToEssayScore("   ", emptyRubric());
    expect(out.overall).toBe(0);
  });

  it("clamps every numeric output to [0, 1]", () => {
    const out = rubricToEssayScore(
      "I worked at a small cafe for two years.",
      scoreEssay("I worked at a small cafe for two years."),
    );
    expect(out.overall).toBeGreaterThanOrEqual(0);
    expect(out.overall).toBeLessThanOrEqual(1);
    expect(out.grammar).toBeGreaterThanOrEqual(0);
    expect(out.grammar).toBeLessThanOrEqual(1);
    expect(out.clarity).toBeGreaterThanOrEqual(0);
    expect(out.clarity).toBeLessThanOrEqual(1);
    expect(out.relevance).toBeGreaterThanOrEqual(0);
    expect(out.relevance).toBeLessThanOrEqual(1);
  });

  it("attaches the source rubric so the UI can show dimension breakdowns", () => {
    const text = "I worked at a small cafe for two years.";
    const rubric = scoreEssay(text);
    const out = rubricToEssayScore(text, rubric);
    expect(out.rubric).toBe(rubric);
  });

  it("surfaces the first grammar issue as l1WeaknessTag", () => {
    // Trigger 3rd-person -s detector with a long enough answer.
    const text =
      "She go to school every day and learns English with her friend. She want to be a nurse.";
    const rubric = scoreEssay(text);
    const out = rubricToEssayScore(text, rubric);
    expect(rubric.grammar.issues[0]).toBe("vi_l1_3rd_person_s");
    expect(out.l1WeaknessTag).toBe("vi_l1_3rd_person_s");
  });

  it("applies spoken-style structure leniency: short clean answer doesn't tank overall", () => {
    // No paragraphs, no "in conclusion", but grammar/spelling are clean —
    // a typical interview reply. Rubric structure score will be low; the
    // adapter should still produce a respectable overall.
    const text =
      "I have worked in customer support for two years, mostly through email and chat. I am comfortable with ticketing tools like Jira.";
    const rubric = scoreEssay(text);
    const out = rubricToEssayScore(text, rubric);
    // Sanity: rubric structure is not a 5 (no intro/conclusion paragraphs).
    expect(rubric.structure.score).toBeLessThan(5);
    // But the adapter blends a leniency floor in, so overall stays > 0.5.
    expect(out.overall).toBeGreaterThan(0.5);
  });

  it("hands learner a reply for a strong answer", () => {
    const text =
      "I have worked in customer support for two years, mostly through email and chat. I am comfortable with ticketing tools like Jira and basic networking. I enjoy figuring out what a user really needs, even when they describe the problem in non-technical words.";
    const rubric = scoreEssay(text);
    const out = rubricToEssayScore(text, rubric);
    expect(out.overall).toBeGreaterThan(0.4);
    expect(out.feedback_vi.length).toBeGreaterThan(0);
  });
});

describe("aggregateRubric", () => {
  it("returns emptyRubric() for an empty answer list", () => {
    const agg = aggregateRubric([]);
    expect(agg).toEqual(emptyRubric());
  });

  it("returns emptyRubric() when no answers carry a rubric (legacy rows)", () => {
    const legacy: InterviewAnswer = {
      questionIndex: 0,
      text: "old row",
      submittedAt: new Date().toISOString(),
      score: {
        overall: 0.5,
        grammar: 0.5,
        clarity: 0.5,
        relevance: 0.5,
        l1WeaknessTag: null,
        feedback_vi: "",
        feedback_en: "",
        // no rubric field
      },
    };
    const agg = aggregateRubric([legacy]);
    expect(agg).toEqual(emptyRubric());
  });

  it("averages dimension scores across answers", () => {
    const a = answerFor(
      "I have two years experience and I love helping customers solve problems.",
      0,
    );
    const b = answerFor(
      "She go to work and she like the team. She want to learn more.",
      1,
    );
    const agg = aggregateRubric([a, b]);
    // Each dimension must be a clamped 0..5 integer.
    for (const dim of [
      agg.grammar.score,
      agg.vocabulary.score,
      agg.structure.score,
      agg.spelling_punctuation.score,
      agg.coherence.score,
    ]) {
      expect(dim).toBeGreaterThanOrEqual(0);
      expect(dim).toBeLessThanOrEqual(5);
      expect(Number.isInteger(dim)).toBe(true);
    }
  });

  it("dedupes grammar issues and spelling errors across answers", () => {
    const text = "She go to school. She like English.";
    const a = answerFor(text, 0);
    const b = answerFor(text, 1);
    const agg = aggregateRubric([a, b]);
    // Each issue appears at most once in the aggregated array.
    const set = new Set(agg.grammar.issues);
    expect(set.size).toBe(agg.grammar.issues.length);
  });

  it("uses the lowest CEFR estimate across answers (weakest answer caps)", () => {
    const strong = answerFor(
      "I'm a senior engineer with deep experience in distributed systems, observability, and incident response. I led a migration from a legacy monolith to a service-oriented architecture last year.",
      0,
    );
    const weak = answerFor("I work hard and I happy.", 1);
    const agg = aggregateRubric([strong, weak]);
    // The weak answer's vocab estimate should pull the aggregate down.
    expect(["A1", "A2"]).toContain(agg.vocabulary.level_estimate);
  });
});

describe("topIssuesAcross", () => {
  it("returns an empty array when no answers have issues", () => {
    const a = answerFor(
      "She works hard. The team is friendly. We solve problems together.",
      0,
    );
    expect(topIssuesAcross([a], 3)).toEqual([]);
  });

  it("ranks by frequency, then by first appearance", () => {
    // Q0 hits 3rd_person_s; Q1 hits past_ed AND 3rd_person_s.
    const q0 = answerFor("She go to school. He like English very much always.", 0);
    const q1 = answerFor("Yesterday I go to work. She want a coffee at the office.", 1);
    const tags = topIssuesAcross([q0, q1], 3);
    // 3rd_person_s appears in both → should be first.
    expect(tags[0]).toBe("vi_l1_3rd_person_s");
    // past_ed appears only in q1 — should be after.
    expect(tags).toContain("vi_l1_past_ed");
  });

  it("respects the limit", () => {
    const q0 = answerFor(
      "She go yesterday. He work. I want apple. Two book on the table.",
      0,
    );
    const tags = topIssuesAcross([q0], 2);
    expect(tags.length).toBeLessThanOrEqual(2);
  });
});

describe("microLessonsForTags", () => {
  it("returns empty when no tags match a known micro-lesson", () => {
    // `a_vs_an_vowel` is in the L1WeaknessTag union but has no
    // MICRO_LESSONS entry — perfect for exercising the skip path.
    const fake: L1WeaknessTag[] = ["vi_l1_a_vs_an_vowel"];
    expect(microLessonsForTags(fake)).toEqual([]);
  });

  it("returns at most `limit` suggestions", () => {
    const tags: L1WeaknessTag[] = [
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
      "vi_l1_plural_s",
    ];
    const suggestions = microLessonsForTags(tags, 2);
    expect(suggestions.length).toBe(2);
  });

  it("includes bilingual titles for matched tags", () => {
    const suggestions = microLessonsForTags(["vi_l1_3rd_person_s"]);
    expect(suggestions[0]?.title_vi.length).toBeGreaterThan(0);
    expect(suggestions[0]?.title_en.length).toBeGreaterThan(0);
    expect(suggestions[0]?.tag).toBe("vi_l1_3rd_person_s");
  });
});
