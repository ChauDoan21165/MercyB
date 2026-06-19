// src/languages/thai/__tests__/thaiQuizzesDrills.test.ts
//
// Structural + integrity guards for the Thai quiz bank and drill set.
// These pin the data contract an app layer renders/grades against — counts,
// level coverage (A1–C2, weighted toward A1–B2), required types, Thai script
// where expected, romanization presence, and bilingual VI + EN explanations —
// without hard-coding individual item content, so the banks can grow within
// the WAVE2 bounds and stay green.
//
// Native-speaker review is DEFERRED; these tests do NOT assert linguistic
// correctness, only well-formedness.

import { describe, it, expect } from "vitest";

import quizzes, {
  quizzes as namedQuizzes,
  type ThaiQuizItem,
  type ThaiQuizType,
  type ThaiCefrLevel,
} from "@/languages/thai/quizzes";
import drills, {
  drills as namedDrills,
  type ThaiDrill,
  type ThaiDrillType,
} from "@/languages/thai/drills";

// At least one character in the Thai Unicode block.
const THAI_SCRIPT = /[฀-๿]/;
// At least one Latin letter (romanization sanity check).
const LATIN = /[a-zA-Z]/;

const LEVELS: ThaiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

describe("Thai quizzes — bank shape", () => {
  it("exports the same array as default and named `quizzes`", () => {
    expect(quizzes).toBe(namedQuizzes);
    expect(Array.isArray(quizzes)).toBe(true);
  });

  it("contains 80–150 compact items", () => {
    expect(quizzes.length).toBeGreaterThanOrEqual(80);
    expect(quizzes.length).toBeLessThanOrEqual(150);
  });

  it("uses unique ids", () => {
    const ids = quizzes.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("spans A1–C2 and prioritizes A1–B2 (majority of items)", () => {
    const present = new Set(quizzes.map((q) => q.level));
    for (const lv of LEVELS) {
      expect(present, `missing level: ${lv}`).toContain(lv);
    }
    const lower = quizzes.filter((q) =>
      (["A1", "A2", "B1", "B2"] as ThaiCefrLevel[]).includes(q.level),
    ).length;
    expect(lower / quizzes.length).toBeGreaterThanOrEqual(0.6);
  });

  it("covers all required quiz types", () => {
    const required: ThaiQuizType[] = [
      "multiple_choice",
      "fill_blank",
      "reorder",
      "match_meaning",
      "polite_form",
    ];
    const present = new Set(quizzes.map((q) => q.type));
    for (const t of required) {
      expect(present, `missing quiz type: ${t}`).toContain(t);
    }
  });
});

describe("Thai quizzes — per-item integrity", () => {
  it.each(quizzes.map((q) => [q.id, q] as const))(
    "%s has bilingual prompts + explanations and a non-empty answer",
    (_id, q: ThaiQuizItem) => {
      expect(q.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(q.prompt_en.trim().length).toBeGreaterThan(0);
      expect(q.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(q.explanation_en.trim().length).toBeGreaterThan(0);
      expect(q.answer.trim().length).toBeGreaterThan(0);
      expect(LEVELS).toContain(q.level);
    },
  );

  it.each(quizzes.map((q) => [q.id, q] as const))(
    "%s is well-formed for its type",
    (_id, q: ThaiQuizItem) => {
      if (q.type === "multiple_choice" || q.type === "match_meaning") {
        expect(q.options, `${q.id} needs options`).toBeTruthy();
        expect(q.options!.length).toBeGreaterThanOrEqual(3);
        expect(q.options).toContain(q.answer);
      }
      if (q.type === "reorder") {
        expect(q.tokens, `${q.id} needs tokens`).toBeTruthy();
        expect(q.tokens!.length).toBeGreaterThanOrEqual(2);
        // The reordered answer is Thai script.
        expect(q.answer).toMatch(THAI_SCRIPT);
      }
    },
  );

  it("every Thai-script field that exists carries Thai characters", () => {
    for (const q of quizzes) {
      if (q.prompt_th) expect(q.prompt_th).toMatch(THAI_SCRIPT);
    }
  });
});

describe("Thai drills — set shape", () => {
  it("exports the same array as default and named `drills`", () => {
    expect(drills).toBe(namedDrills);
    expect(Array.isArray(drills)).toBe(true);
  });

  it("contains 40–80 compact drills", () => {
    expect(drills.length).toBeGreaterThanOrEqual(40);
    expect(drills.length).toBeLessThanOrEqual(80);
  });

  it("uses unique ids", () => {
    const ids = drills.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers the required drill types (classifier + tone_awareness)", () => {
    const required: ThaiDrillType[] = ["classifier", "tone_awareness"];
    const present = new Set(drills.map((d) => d.type));
    for (const t of required) {
      expect(present, `missing drill type: ${t}`).toContain(t);
    }
    // Each required type has a meaningful number of items.
    for (const t of required) {
      expect(drills.filter((d) => d.type === t).length).toBeGreaterThanOrEqual(10);
    }
  });
});

describe("Thai drills — per-item integrity", () => {
  it.each(drills.map((d) => [d.id, d] as const))(
    "%s has bilingual prompts + explanations and a non-empty answer",
    (_id, d: ThaiDrill) => {
      expect(d.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(d.prompt_en.trim().length).toBeGreaterThan(0);
      expect(d.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(d.explanation_en.trim().length).toBeGreaterThan(0);
      expect(d.answer.trim().length).toBeGreaterThan(0);
      expect(LEVELS).toContain(d.level);
    },
  );

  it.each(drills.map((d) => [d.id, d] as const))(
    "%s with options includes its answer among them",
    (_id, d: ThaiDrill) => {
      if (d.options) {
        expect(d.options.length).toBeGreaterThanOrEqual(3);
        expect(d.options).toContain(d.answer);
      }
    },
  );

  it("classifier drills reference Thai script (the noun/phrase or answer)", () => {
    for (const d of drills.filter((x) => x.type === "classifier")) {
      const hasThai =
        (d.prompt_th && THAI_SCRIPT.test(d.prompt_th)) ||
        THAI_SCRIPT.test(d.answer) ||
        (d.options ?? []).some((o) => THAI_SCRIPT.test(o));
      expect(hasThai, `${d.id} should reference Thai script`).toBe(true);
    }
  });

  it("tone_awareness drills carry romanization or Thai cues", () => {
    for (const d of drills.filter((x) => x.type === "tone_awareness")) {
      expect(d.romanization, `${d.id} needs a romanization field`).toBeTruthy();
    }
  });
});
