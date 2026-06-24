import { describe, expect, it } from "vitest";

import punjabiA1ListeningByTextScripts, {
  listeningByTextScriptAwareness,
  punjabiA1ListeningByTextScripts as namedListeningScripts,
  type PunjabiListeningByTextTopic,
} from "@/languages/punjabi/listeningByTextA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 listening-by-text scripts", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ListeningByTextScripts).toBe(namedListeningScripts);
    expect(Array.isArray(punjabiA1ListeningByTextScripts)).toBe(true);
  });

  it("is compact and covers required listening topics", () => {
    expect(punjabiA1ListeningByTextScripts.length).toBeGreaterThanOrEqual(9);
    expect(punjabiA1ListeningByTextScripts.length).toBeLessThanOrEqual(16);

    const requiredTopics: PunjabiListeningByTextTopic[] = [
      "greetings",
      "names",
      "numbers",
      "prices",
      "directions",
      "food_orders",
      "clinic_reception",
      "school_office",
      "service_counter",
    ];
    const topics = new Set(punjabiA1ListeningByTextScripts.map((script) => script.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("uses Gurmukhi primary lines with romanization and bilingual meaning", () => {
    for (const script of punjabiA1ListeningByTextScripts) {
      expect(script.id).toMatch(/^pa_a1_listen_text_/);
      expect(script.title_vi.trim().length).toBeGreaterThan(0);
      expect(script.title_en.trim().length).toBeGreaterThan(0);
      expect(script.setting_vi.trim().length).toBeGreaterThan(0);
      expect(script.setting_en.trim().length).toBeGreaterThan(0);
      expect(script.lines.length).toBeGreaterThanOrEqual(2);

      for (const line of script.lines) {
        expect(line.speaker.trim().length).toBeGreaterThan(0);
        expect(line.pa).toMatch(GURMUKHI_SCRIPT);
        expect(line.romanization).toMatch(LATIN);
        expect(line.vi.trim().length).toBeGreaterThan(0);
        expect(line.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes listen-for cues and comprehension checks", () => {
    for (const script of punjabiA1ListeningByTextScripts) {
      expect(script.listen_for.vi.trim().length).toBeGreaterThan(0);
      expect(script.listen_for.en.trim().length).toBeGreaterThan(0);
      expect(script.listen_for.items_pa.length).toBeGreaterThanOrEqual(2);
      for (const item of script.listen_for.items_pa) {
        expect(item).toMatch(GURMUKHI_SCRIPT);
      }

      expect(script.comprehension_checks.length).toBeGreaterThanOrEqual(1);
      for (const check of script.comprehension_checks) {
        expect(check.prompt_vi.trim().length).toBeGreaterThan(0);
        expect(check.prompt_en.trim().length).toBeGreaterThan(0);
        expect(check.answer_vi.trim().length).toBeGreaterThan(0);
        expect(check.answer_en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical scripts", () => {
    const traps = punjabiA1ListeningByTextScripts.flatMap((script) => script.learner_trap ? [script.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaScripts = punjabiA1ListeningByTextScripts.filter((script) => script.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(5);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaScripts.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(canadaScripts)).toMatch(/ਬੱਸ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਫਾਰਮ|ਪਛਾਣ|ਟਿਕਟ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or audio", () => {
    const allText = `${listeningByTextScriptAwareness} ${JSON.stringify(punjabiA1ListeningByTextScripts)}`;

    expect(listeningByTextScriptAwareness).toContain("Shahmukhi");
    expect(listeningByTextScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure/i);
  });
});
