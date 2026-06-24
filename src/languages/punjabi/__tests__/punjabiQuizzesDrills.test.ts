import { describe, expect, it } from "vitest";

import punjabiDrills, { punjabiDrills as namedDrills } from "@/languages/punjabi/drills";
import punjabiQuizzes, { punjabiQuizzes as namedQuizzes } from "@/languages/punjabi/quizzes";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi quizzes and drills - exports", () => {
  it("exports default and named quiz/drill arrays", () => {
    expect(punjabiQuizzes).toBe(namedQuizzes);
    expect(punjabiDrills).toBe(namedDrills);
    expect(Array.isArray(punjabiQuizzes)).toBe(true);
    expect(Array.isArray(punjabiDrills)).toBe(true);
  });
});

describe("Punjabi quizzes", () => {
  it("covers required item types and topics", () => {
    const types = new Set(punjabiQuizzes.map((item) => item.type));
    expect(types).toEqual(new Set(["multiple_choice", "fill_blank", "matching", "reorder"]));

    const topics = new Set(punjabiQuizzes.map((item) => item.topic));
    for (const topic of ["greetings", "numbers", "family", "food", "shopping", "directions", "time", "simple_verbs"]) {
      expect(topics, `missing quiz topic ${topic}`).toContain(topic);
    }
  });

  it("uses Gurmukhi primary with romanization, Vietnamese, and English support", () => {
    for (const item of punjabiQuizzes) {
      expect(item.id).toMatch(/^pa_quiz_/);
      expect(["A1", "A2"]).toContain(item.level);
      expect(item.prompt_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_romanization ?? "").toMatch(LATIN);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(JSON.stringify(item.answer).trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes common Vietnamese-speaker and English-speaker mistake support", () => {
    const audiences = new Set(punjabiQuizzes.map((item) => item.common_mistake.audience));
    expect(audiences.has("vi") || audiences.has("both")).toBe(true);
    expect(audiences.has("en") || audiences.has("both")).toBe(true);

    for (const item of punjabiQuizzes) {
      expect(item.common_mistake.note_vi.trim().length).toBeGreaterThan(0);
      expect(item.common_mistake.note_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi drills", () => {
  it("covers translation awareness and active practice types", () => {
    const types = new Set(punjabiDrills.map((item) => item.type));
    for (const type of ["translation_awareness", "substitution", "transformation", "micro_dialogue"]) {
      expect(types, `missing drill type ${type}`).toContain(type);
    }
  });

  it("covers required drill topics", () => {
    const topics = new Set(punjabiDrills.map((item) => item.topic));
    for (const topic of ["greetings", "numbers", "family", "food", "shopping", "directions", "time", "simple_verbs"]) {
      expect(topics, `missing drill topic ${topic}`).toContain(topic);
    }
  });

  it("uses Gurmukhi primary with bilingual explanations and model answers", () => {
    for (const item of punjabiDrills) {
      expect(item.id).toMatch(/^pa_drill_/);
      expect(["A1", "A2"]).toContain(item.level);
      expect(item.prompt_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.romanization ?? "").toMatch(LATIN);
      expect(item.title_vi.trim().length).toBeGreaterThan(0);
      expect(item.title_en.trim().length).toBeGreaterThan(0);
      expect(item.task_vi.trim().length).toBeGreaterThan(0);
      expect(item.task_en.trim().length).toBeGreaterThan(0);
      expect(item.model_answer.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes common Vietnamese-speaker and English-speaker mistake support", () => {
    const audiences = new Set(punjabiDrills.map((item) => item.common_mistake.audience));
    expect(audiences.has("vi") || audiences.has("both")).toBe(true);
    expect(audiences.has("en") || audiences.has("both")).toBe(true);

    for (const item of punjabiDrills) {
      expect(item.common_mistake.note_vi.trim().length).toBeGreaterThan(0);
      expect(item.common_mistake.note_en.trim().length).toBeGreaterThan(0);
    }
  });
});
