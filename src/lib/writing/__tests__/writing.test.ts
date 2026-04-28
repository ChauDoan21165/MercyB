// src/lib/writing/__tests__/writing.test.ts
//
// Coverage for the real-life writing practice surface:
//   1. Static prompt dataset — 40 entries, distribution, schema.
//   2. draftStorage — localStorage round-trip, word counter.
//   3. feedbackClient.parseFeedback — strict-but-forgiving JSON parser.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WRITING_PROMPTS,
  getWritingPromptById,
  listPromptsByCategory,
} from "@/data/writing-prompts/prompts";
import {
  ALL_CATEGORIES,
  ALL_DIFFICULTIES,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/writing/types";
import {
  clearDraft,
  countWords,
  loadDraft,
  saveDraft,
} from "@/lib/writing/draftStorage";
import {
  parseFeedback,
  WritingFeedbackError,
} from "@/lib/writing/feedbackClient";

// ─── Section 1: dataset ──────────────────────────────────────────────

describe("writing prompts dataset", () => {
  it("ships exactly 40 prompts", () => {
    expect(WRITING_PROMPTS.length).toBe(40);
  });

  it("matches the brief's per-category distribution", () => {
    const counts: Record<string, number> = {};
    for (const p of WRITING_PROMPTS) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    expect(counts).toEqual({
      workplace_email: 5,
      customer_service: 5,
      social_media: 5,
      personal_message: 5,
      dating_profile: 3,
      job_application: 5,
      daily_life: 6,
      creative: 6,
    });
  });

  it("uses unique ids and sane word ranges for every prompt", () => {
    const seen = new Set<string>();
    for (const p of WRITING_PROMPTS) {
      expect(seen.has(p.id)).toBe(false);
      seen.add(p.id);
      expect(p.target_words_min).toBeGreaterThanOrEqual(10);
      expect(p.target_words_max).toBeLessThanOrEqual(2000);
      expect(p.target_words_max).toBeGreaterThanOrEqual(p.target_words_min);
      expect(p.title_vi.length).toBeGreaterThan(0);
      expect(p.title_en.length).toBeGreaterThan(0);
      expect(p.scenario_vi.length).toBeGreaterThanOrEqual(20);
      expect(p.scenario_en.length).toBeGreaterThanOrEqual(20);
    }
  });

  it("uses only valid category and difficulty enum values", () => {
    const cats = new Set<string>(ALL_CATEGORIES);
    const diffs = new Set<string>(ALL_DIFFICULTIES);
    for (const p of WRITING_PROMPTS) {
      expect(cats.has(p.category)).toBe(true);
      expect(diffs.has(p.difficulty)).toBe(true);
    }
  });

  it("getWritingPromptById round-trips known ids and returns null for unknown", () => {
    const sample = WRITING_PROMPTS[0];
    expect(getWritingPromptById(sample.id)).toEqual(sample);
    expect(getWritingPromptById("nope_does_not_exist")).toBeNull();
  });

  it("listPromptsByCategory returns the expected counts", () => {
    expect(listPromptsByCategory("dating_profile").length).toBe(3);
    expect(listPromptsByCategory("daily_life").length).toBe(6);
  });

  it("CATEGORY_LABELS and DIFFICULTY_LABELS cover every enum value", () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_LABELS[cat].vi.length).toBeGreaterThan(0);
      expect(CATEGORY_LABELS[cat].en.length).toBeGreaterThan(0);
    }
    for (const d of ALL_DIFFICULTIES) {
      expect(DIFFICULTY_LABELS[d].vi.length).toBeGreaterThan(0);
      expect(DIFFICULTY_LABELS[d].en.length).toBeGreaterThan(0);
    }
  });
});

// ─── Section 2: draft storage ────────────────────────────────────────

describe("draftStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no draft exists", () => {
    expect(loadDraft("we_sick_leave")).toBeNull();
  });

  it("round-trips a draft through saveDraft / loadDraft", () => {
    const draft = {
      text: "Dear manager, I have a fever today.",
      updatedAt: 123_456,
      timeSpentSeconds: 42,
    };
    saveDraft("we_sick_leave", draft);
    const loaded = loadDraft("we_sick_leave");
    expect(loaded).toEqual(draft);
  });

  it("clears the draft scoped to that prompt id", () => {
    saveDraft("a", { text: "A", updatedAt: 1, timeSpentSeconds: 0 });
    saveDraft("b", { text: "B", updatedAt: 2, timeSpentSeconds: 0 });
    clearDraft("a");
    expect(loadDraft("a")).toBeNull();
    expect(loadDraft("b")?.text).toBe("B");
  });

  it("countWords splits on whitespace and ignores empty input", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("hello world")).toBe(2);
    expect(countWords("  one   two   three  ")).toBe(3);
    expect(countWords("a\nb\tc")).toBe(3);
  });
});

// ─── Section 3: feedback parser ──────────────────────────────────────

describe("parseFeedback", () => {
  it("returns a fully-shaped feedback object on a valid payload", () => {
    const raw = {
      score: 87,
      summary_vi: "Khá tốt.",
      summary_en: "Pretty good.",
      corrections: [
        {
          original: "I am writing for asking",
          suggested: "I am writing to ask",
          reason_vi: "Sau 'writing' dùng 'to + verb'.",
          reason_en: "After 'writing' use to-infinitive.",
        },
      ],
      vocabulary: [
        {
          user_word: "good",
          better: "effective",
          context_vi: "Trong văn bản công việc.",
          context_en: "In a workplace context.",
        },
      ],
      grammar: [
        {
          snippet: "I have went",
          rule_vi: "Quá khứ phân từ của 'go' là 'gone'.",
          rule_en: "Past participle of 'go' is 'gone'.",
          corrected: "I have gone",
        },
      ],
      cultural_notes_vi: ["Người Mỹ thường trực tiếp hơn trong tình huống này."],
      cultural_notes_en: ["Americans tend to be more direct here."],
    };
    const out = parseFeedback(raw);
    expect(out.score).toBe(87);
    expect(out.summary_vi).toBe("Khá tốt.");
    expect(out.corrections).toHaveLength(1);
    expect(out.vocabulary).toHaveLength(1);
    expect(out.grammar).toHaveLength(1);
    expect(out.cultural_notes_vi).toHaveLength(1);
  });

  it("clamps the score into 0..100 and rounds floats", () => {
    expect(parseFeedback({ score: 150, summary_vi: "x" }).score).toBe(100);
    expect(parseFeedback({ score: -5, summary_vi: "x" }).score).toBe(0);
    expect(parseFeedback({ score: 87.6, summary_vi: "x" }).score).toBe(88);
  });

  it("defaults missing arrays to empty arrays without throwing", () => {
    const out = parseFeedback({
      score: 70,
      summary_vi: "Tạm được.",
      summary_en: "Okay.",
    });
    expect(out.corrections).toEqual([]);
    expect(out.vocabulary).toEqual([]);
    expect(out.grammar).toEqual([]);
    expect(out.cultural_notes_vi).toEqual([]);
    expect(out.cultural_notes_en).toEqual([]);
  });

  it("drops malformed correction / vocab / grammar entries silently", () => {
    const out = parseFeedback({
      score: 50,
      summary_vi: "OK",
      corrections: [
        { original: "x", suggested: "y" }, // good
        { original: "" }, // bad — no suggested
        "not an object",
      ],
      vocabulary: [
        { user_word: "old", better: "new" },
        { user_word: "old" }, // missing better
      ],
      grammar: [
        { snippet: "s", corrected: "c" },
        { snippet: "" }, // missing
      ],
    });
    expect(out.corrections).toHaveLength(1);
    expect(out.vocabulary).toHaveLength(1);
    expect(out.grammar).toHaveLength(1);
  });

  it("throws bad_response when the payload is null or has no summary", () => {
    expect(() => parseFeedback(null)).toThrow(WritingFeedbackError);
    expect(() => parseFeedback({ score: 50 })).toThrow(WritingFeedbackError);
  });

  it("non-string cultural notes are filtered out", () => {
    const out = parseFeedback({
      score: 70,
      summary_vi: "x",
      cultural_notes_vi: ["valid", 42, null, "also valid"],
      cultural_notes_en: [{ bad: 1 }, "english only"],
    });
    expect(out.cultural_notes_vi).toEqual(["valid", "also valid"]);
    expect(out.cultural_notes_en).toEqual(["english only"]);
  });
});
