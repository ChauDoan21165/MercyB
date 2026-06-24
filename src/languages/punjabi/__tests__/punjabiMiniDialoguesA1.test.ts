import { describe, expect, it } from "vitest";

import punjabiA1MiniDialogues, {
  miniDialogueScriptAwareness,
  punjabiA1MiniDialogues as namedMiniDialogues,
  type PunjabiMiniDialogueTopic,
} from "@/languages/punjabi/miniDialoguesA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 mini-dialogues", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1MiniDialogues).toBe(namedMiniDialogues);
    expect(Array.isArray(punjabiA1MiniDialogues)).toBe(true);
  });

  it("is compact and covers required A1 mini-dialogue topics", () => {
    expect(punjabiA1MiniDialogues.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1MiniDialogues.length).toBeLessThanOrEqual(16);

    const requiredTopics: PunjabiMiniDialogueTopic[] = [
      "greeting",
      "name",
      "family",
      "food_order",
      "price",
      "directions",
      "asking_for_help",
      "clinic_reception",
      "school_office",
      "workplace_greeting",
    ];
    const topics = new Set(punjabiA1MiniDialogues.map((dialogue) => dialogue.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("uses Gurmukhi primary lines with romanization and bilingual meaning", () => {
    for (const dialogue of punjabiA1MiniDialogues) {
      expect(dialogue.id).toMatch(/^pa_a1_dialogue_/);
      expect(dialogue.title_vi.trim().length).toBeGreaterThan(0);
      expect(dialogue.title_en.trim().length).toBeGreaterThan(0);
      expect(dialogue.setting_vi.trim().length).toBeGreaterThan(0);
      expect(dialogue.setting_en.trim().length).toBeGreaterThan(0);
      expect(dialogue.lines.length).toBeGreaterThanOrEqual(2);

      for (const line of dialogue.lines) {
        expect(line.speaker.trim().length).toBeGreaterThan(0);
        expect(line.pa).toMatch(GURMUKHI_SCRIPT);
        expect(line.romanization).toMatch(LATIN);
        expect(line.vi.trim().length).toBeGreaterThan(0);
        expect(line.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes a key phrase and practice prompt for each dialogue", () => {
    for (const dialogue of punjabiA1MiniDialogues) {
      expect(dialogue.key_phrase.pa).toMatch(GURMUKHI_SCRIPT);
      expect(dialogue.key_phrase.romanization).toMatch(LATIN);
      expect(dialogue.key_phrase.vi.trim().length).toBeGreaterThan(0);
      expect(dialogue.key_phrase.en.trim().length).toBeGreaterThan(0);
      expect(dialogue.practice_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(dialogue.practice_prompt_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and Canada-practical examples", () => {
    const traps = punjabiA1MiniDialogues.flatMap((dialogue) => dialogue.learner_trap ? [dialogue.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaDialogues = punjabiA1MiniDialogues.filter((dialogue) => dialogue.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(6);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaDialogues.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(canadaDialogues)).toMatch(/ਬੱਸ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਫਾਰਮ|ਡਾਲਰ|ਕੰਮ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or audio", () => {
    const allText = `${miniDialogueScriptAwareness} ${JSON.stringify(punjabiA1MiniDialogues)}`;

    expect(miniDialogueScriptAwareness).toContain("Shahmukhi");
    expect(miniDialogueScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure/i);
  });
});
