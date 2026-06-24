import { describe, expect, it } from "vitest";

import punjabiA1CapstoneReview, {
  capstoneReviewScriptAwareness,
  punjabiA1CapstoneReview as namedCapstoneReview,
  type PunjabiCapstoneTaskType,
  type PunjabiCapstoneTopic,
} from "@/languages/punjabi/capstoneReviewA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 capstone review", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1CapstoneReview).toBe(namedCapstoneReview);
    expect(Array.isArray(punjabiA1CapstoneReview)).toBe(true);
  });

  it("is compact and covers all required capstone topics", () => {
    expect(punjabiA1CapstoneReview.length).toBeGreaterThanOrEqual(18);
    expect(punjabiA1CapstoneReview.length).toBeLessThanOrEqual(32);

    const requiredTopics: PunjabiCapstoneTopic[] = [
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help_requests",
      "polite_basics",
      "gurmukhi_recognition",
      "canada_service",
    ];
    const topics = new Set(punjabiA1CapstoneReview.map((item) => item.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("includes checkpoint-style task types", () => {
    const requiredTypes: PunjabiCapstoneTaskType[] = [
      "checkpoint_choice",
      "fill_gap",
      "reorder",
      "match",
      "mini_roleplay",
      "self_check",
    ];
    const taskTypes = new Set(punjabiA1CapstoneReview.map((item) => item.task_type));

    for (const taskType of requiredTypes) {
      expect(taskTypes, `missing task type ${taskType}`).toContain(taskType);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1CapstoneReview) {
      expect(item.id).toMatch(/^pa_a1_capstone_/);
      expect(JSON.stringify(item.answer_pa)).toMatch(GURMUKHI_SCRIPT);
      expect(item.title_vi.trim().length).toBeGreaterThan(0);
      expect(item.title_en.trim().length).toBeGreaterThan(0);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.answer_vi.trim().length).toBeGreaterThan(0);
      expect(item.answer_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_note_vi.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_note_en.trim().length).toBeGreaterThan(0);

      if (item.cue_pa && GURMUKHI_SCRIPT.test(item.cue_pa)) {
        expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("provides options for choice, reorder, and match tasks", () => {
    for (const item of punjabiA1CapstoneReview) {
      if (["checkpoint_choice", "reorder", "match"].includes(item.task_type)) {
        expect(item.options?.length ?? 0, `${item.id} missing options`).toBeGreaterThanOrEqual(3);
        expect(JSON.stringify(item.options)).toMatch(GURMUKHI_SCRIPT);
      }
    }
  });

  it("includes learner traps and Canada-practical capstone items", () => {
    const traps = punjabiA1CapstoneReview.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1CapstoneReview.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਟਿਕਟ|ਕਲਿਨਿਕ|ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or audio", () => {
    const allText = `${capstoneReviewScriptAwareness} ${JSON.stringify(punjabiA1CapstoneReview)}`;

    expect(capstoneReviewScriptAwareness).toContain("Shahmukhi");
    expect(capstoneReviewScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure/i);
  });
});
