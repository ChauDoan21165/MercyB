// src/lib/interview/__tests__/realRubric.test.ts
//
// End-to-end check that an interview session round-trips through the
// real writing-feedback rubric: 5 sample answers → real scoreEssay
// scores → aggregated session feedback exposed by getSessionFeedback.
//
// Supabase is mocked so the test is hermetic. The shape of the row
// mirrors what `submitAnswer` would persist after running 5 real
// scoring passes — i.e. each `score` carries an attached rubric.

import { describe, expect, it, vi, beforeEach } from "vitest";

// Hold the row the mocked supabase will return so each test can
// override it without re-mocking the whole module.
let savedRow: Record<string, unknown> | null = null;

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({ data: savedRow, error: null })),
        })),
      })),
      // Insert/update aren't exercised in this suite.
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: null, error: null })),
          })),
        })),
      })),
    })),
  },
}));

import {
  getSessionFeedback,
  rubricToEssayScore,
  type InterviewAnswer,
} from "../interviewSession";
import { scoreEssay } from "@/lib/writing-feedback/scoreEssay";

beforeEach(() => {
  savedRow = null;
});

const SCENARIO_SLUG = "tech-support-helpdesk";

// Five answers chosen to span the rubric:
//   - strong: clean grammar, full length
//   - good but with -s missing on 3rd person
//   - past-tense -ed missing
//   - plural -s missing
//   - very short reply (length-floored, low score)
const SAMPLE_ANSWERS: ReadonlyArray<{ q: number; text: string }> = [
  {
    q: 0,
    text:
      "I'm Lan. I have worked in customer support for two years, mostly through email and chat. I'm comfortable with Windows, basic networking, and ticketing tools like Jira. I enjoy figuring out what a user really needs.",
  },
  {
    q: 1,
    text:
      "She go to school every day and learns English with her friend. He work at the same office and we meet on the weekend.",
  },
  {
    q: 2,
    text:
      "Yesterday I go to the helpdesk to talk to a customer. We solved the problem together but it take a long time and I learn a lot from the call.",
  },
  {
    q: 3,
    text:
      "I have two year experience and I work with many customer in the office. I want to learn more about ticketing tools and improve my English.",
  },
  {
    q: 4,
    text: "Yes I can",
  },
];

function buildAnswer(q: number, text: string): InterviewAnswer {
  const rubric = scoreEssay(text);
  return {
    questionIndex: q,
    text,
    submittedAt: new Date(2026, 3, 25, 10, q).toISOString(),
    score: rubricToEssayScore(text, rubric),
  };
}

function buildSessionRow(answers: InterviewAnswer[]) {
  const overall =
    answers.length === 0
      ? null
      : answers.reduce((s, a) => s + a.score.overall, 0) / answers.length;
  return {
    id: "session-1",
    user_id: "user-1",
    scenario_slug: SCENARIO_SLUG,
    started_at: new Date(2026, 3, 25, 9, 0).toISOString(),
    completed_at: null,
    answers,
    overall_score: overall,
  };
}

describe("getSessionFeedback — real rubric end-to-end", () => {
  it("returns null when the session row is missing", async () => {
    savedRow = null;
    const feedback = await getSessionFeedback("session-1");
    expect(feedback).toBeNull();
  });

  it("scores 5 sample answers with the real rubric and exposes per-question feedback", async () => {
    const answers = SAMPLE_ANSWERS.map(({ q, text }) => buildAnswer(q, text));
    savedRow = buildSessionRow(answers);

    const feedback = await getSessionFeedback("session-1");
    expect(feedback).not.toBeNull();
    if (!feedback) return;

    // Per-question array length matches the scenario, not the answer
    // count — unanswered slots come back with placeholder scores.
    expect(feedback.perQuestion.length).toBe(
      feedback.scenario.questions.length,
    );
    // Every answered slot kept a non-empty user answer.
    const answered = feedback.perQuestion.filter(
      (p) => p.userAnswer.trim().length > 0,
    );
    expect(answered.length).toBe(SAMPLE_ANSWERS.length);

    // Each answered slot has a real rubric attached (not the placeholder).
    for (const p of answered) {
      expect(p.score.rubric).toBeDefined();
      expect(p.score.feedback_vi.length).toBeGreaterThan(0);
    }
  });

  it("aggregates the rubric across answers (means, deduped issues)", async () => {
    const answers = SAMPLE_ANSWERS.map(({ q, text }) => buildAnswer(q, text));
    savedRow = buildSessionRow(answers);

    const feedback = await getSessionFeedback("session-1");
    if (!feedback) throw new Error("expected feedback");

    const agg = feedback.aggregatedRubric;
    // Dimension scores are 0..5 integers.
    for (const score of [
      agg.grammar.score,
      agg.vocabulary.score,
      agg.structure.score,
      agg.spelling_punctuation.score,
      agg.coherence.score,
    ]) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(5);
      expect(Number.isInteger(score)).toBe(true);
    }
    // Issue list is deduped.
    const set = new Set(agg.grammar.issues);
    expect(set.size).toBe(agg.grammar.issues.length);
  });

  it("surfaces top-3 L1 issues across the session, ranked by frequency", async () => {
    const answers = SAMPLE_ANSWERS.map(({ q, text }) => buildAnswer(q, text));
    savedRow = buildSessionRow(answers);

    const feedback = await getSessionFeedback("session-1");
    if (!feedback) throw new Error("expected feedback");

    expect(feedback.topIssues.length).toBeLessThanOrEqual(3);
    // Q1 has 3rd-person-s twice ("she go", "he work"), so we expect it
    // among the top issues.
    expect(feedback.topIssues).toContain("vi_l1_3rd_person_s");
  });

  it("suggests up to 2 micro-lessons whose tags exist in MICRO_LESSONS", async () => {
    const answers = SAMPLE_ANSWERS.map(({ q, text }) => buildAnswer(q, text));
    savedRow = buildSessionRow(answers);

    const feedback = await getSessionFeedback("session-1");
    if (!feedback) throw new Error("expected feedback");

    expect(feedback.microLessonSuggestions.length).toBeLessThanOrEqual(2);
    for (const s of feedback.microLessonSuggestions) {
      expect(s.title_vi.length).toBeGreaterThan(0);
      expect(s.title_en.length).toBeGreaterThan(0);
      expect(s.tag).toMatch(/^vi_l1_/);
    }
  });

  it("returns an empty rubric + no top issues when no answers exist", async () => {
    savedRow = buildSessionRow([]);

    const feedback = await getSessionFeedback("session-1");
    if (!feedback) throw new Error("expected feedback");

    expect(feedback.topIssues).toEqual([]);
    expect(feedback.microLessonSuggestions).toEqual([]);
    // All dimension scores zero.
    expect(feedback.aggregatedRubric.grammar.score).toBe(0);
    expect(feedback.aggregatedRubric.vocabulary.score).toBe(0);
  });

  it("spoken-style leniency: a clean short answer still earns > 0.5 overall", async () => {
    // 60-word reply, clean grammar — what we want to NOT punish.
    const text =
      "I have worked in customer support for two years, mostly through email and chat. I am comfortable with ticketing tools like Jira and basic networking. I enjoy figuring out what a user really needs even when they describe the problem in non-technical words.";
    const a = buildAnswer(0, text);
    savedRow = buildSessionRow([a]);

    const feedback = await getSessionFeedback("session-1");
    if (!feedback) throw new Error("expected feedback");

    const slot = feedback.perQuestion.find((p) => p.questionIndex === 0);
    expect(slot?.score.overall).toBeGreaterThan(0.5);
  });
});
