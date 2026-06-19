// Thai placement test (A1→C2) — structural, coverage, and answer-key guards.
//
// These tests pin the SHAPE of the placement bank, not its linguistic
// correctness (native review is deferred). They guard: count, level coverage,
// question-type coverage, A1/A2 romanization, bilingual explanations, a valid
// in-range answer key, and the level-mapping helper's monotonic behaviour.

import { describe, it, expect } from "vitest";

import {
  questions,
  answerKey,
  recommendLevel,
  LEVEL_ORDER,
  PLACEMENT_DISCLAIMER,
  type ThaiCefrLevel,
  type PlacementQuestionType,
} from "@/languages/thai/placement";

const THAI_RANGE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RANGE.test(s);

const ALL_LEVELS: ThaiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ALL_TYPES: PlacementQuestionType[] = [
  "meaning",
  "grammar_particle",
  "classifier",
  "word_order",
  "reading_comprehension",
  "register_politeness",
  "tone_awareness",
];

describe("Thai placement — bank size & level coverage", () => {
  it("contains 60–120 questions", () => {
    expect(questions.length).toBeGreaterThanOrEqual(60);
    expect(questions.length).toBeLessThanOrEqual(120);
  });

  it("covers every CEFR level A1–C2", () => {
    const seen = new Set(questions.map((q) => q.level));
    for (const lvl of ALL_LEVELS) {
      expect(seen.has(lvl), `missing level: ${lvl}`).toBe(true);
    }
  });

  it("covers every required question type", () => {
    const seen = new Set(questions.map((q) => q.type));
    for (const t of ALL_TYPES) {
      expect(seen.has(t), `missing type: ${t}`).toBe(true);
    }
  });

  it("LEVEL_ORDER matches the canonical A1→C2 sequence", () => {
    expect(LEVEL_ORDER).toEqual(ALL_LEVELS);
  });
});

describe("Thai placement — per-question integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = questions.map((q) => q.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each question has ≥3 options and a VI+EN prompt", () => {
    for (const q of questions) {
      expect(q.options.length, `${q.id} options`).toBeGreaterThanOrEqual(3);
      expect(q.prompt_vi.length, `${q.id} prompt_vi`).toBeGreaterThan(0);
      expect(q.prompt_en.length, `${q.id} prompt_en`).toBeGreaterThan(0);
    }
  });

  it("each question has VI+EN explanations", () => {
    for (const q of questions) {
      expect(q.explanation_vi.length, `${q.id} explanation_vi`).toBeGreaterThan(0);
      expect(q.explanation_en.length, `${q.id} explanation_en`).toBeGreaterThan(0);
    }
  });

  it("every option carries at least one of thai / vi / en text", () => {
    for (const q of questions) {
      for (const [i, o] of q.options.entries()) {
        const filled = Boolean(o.thai || o.vi || o.en);
        expect(filled, `${q.id} option ${i} is empty`).toBe(true);
      }
    }
  });

  it("A1/A2 stems and Thai options carry romanization", () => {
    for (const q of questions.filter((x) => x.level === "A1" || x.level === "A2")) {
      if (q.stem_thai && hasThai(q.stem_thai)) {
        expect(q.stem_rtgs && q.stem_rtgs.length, `${q.id} stem_rtgs`).toBeTruthy();
      }
      for (const [i, o] of q.options.entries()) {
        if (o.thai && hasThai(o.thai)) {
          expect(o.rtgs && o.rtgs.length, `${q.id} option ${i} rtgs`).toBeTruthy();
        }
      }
    }
  });
});

describe("Thai placement — answer key", () => {
  it("answerKey has one entry per question, all in range", () => {
    expect(Object.keys(answerKey).length).toBe(questions.length);
    for (const q of questions) {
      const ans = answerKey[q.id];
      expect(ans, `${q.id} answer present`).toBe(q.answer_index);
      expect(ans).toBeGreaterThanOrEqual(0);
      expect(ans).toBeLessThan(q.options.length);
    }
  });
});

describe("Thai placement — level mapping", () => {
  it("floors at A1 when nothing is passed", () => {
    expect(recommendLevel({})).toBe("A1");
  });

  it("returns the highest contiguously-passed level", () => {
    const full: Record<ThaiCefrLevel, number> = {
      A1: 1,
      A2: 1,
      B1: 1,
      B2: 1,
      C1: 1,
      C2: 1,
    };
    expect(recommendLevel(full)).toBe("C2");

    expect(
      recommendLevel({ A1: 0.9, A2: 0.8, B1: 0.7, B2: 0.3, C1: 0.9, C2: 0.9 }),
    ).toBe("B1");
  });

  it("stops at the first level that fails the bar", () => {
    expect(recommendLevel({ A1: 0.9, A2: 0.2 })).toBe("A1");
  });

  it("is monotonic across rising uniform ratios", () => {
    const at = (r: number) =>
      recommendLevel(
        Object.fromEntries(LEVEL_ORDER.map((l) => [l, r])) as Record<
          ThaiCefrLevel,
          number
        >,
      );
    const order = LEVEL_ORDER;
    const idxLow = order.indexOf(at(0.5)); // below 0.6 bar → floor A1
    const idxHigh = order.indexOf(at(0.95));
    expect(idxHigh).toBeGreaterThanOrEqual(idxLow);
  });
});

describe("Thai placement — study-support framing", () => {
  it("exposes a bilingual non-certification disclaimer", () => {
    expect(PLACEMENT_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(PLACEMENT_DISCLAIMER.en.length).toBeGreaterThan(0);
    expect(PLACEMENT_DISCLAIMER.en.toLowerCase()).toContain("not");
    expect(PLACEMENT_DISCLAIMER.en.toLowerCase()).toContain("certification");
    expect(PLACEMENT_DISCLAIMER.en.toLowerCase()).toContain("deferred");
  });

  it("makes no official-certification claim in question text", () => {
    const blob = JSON.stringify(questions).toLowerCase();
    expect(blob).not.toContain("officially certified");
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("accredited");
  });
});
