import { describe, expect, it } from "vitest";

import punjabiA1ScenarioRecallDeck, {
  punjabiA1ScenarioRecallDeck as namedScenarioRecallDeck,
  scenarioRecallScriptAwareness,
  type PunjabiScenarioRecallDomain,
  type PunjabiScenarioRecallMode,
} from "@/languages/punjabi/scenarioRecallDeckA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 scenario recall deck", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ScenarioRecallDeck).toBe(namedScenarioRecallDeck);
    expect(Array.isArray(punjabiA1ScenarioRecallDeck)).toBe(true);
  });

  it("is compact and covers required scenario recall domains", () => {
    expect(punjabiA1ScenarioRecallDeck.length).toBeGreaterThanOrEqual(16);
    expect(punjabiA1ScenarioRecallDeck.length).toBeLessThanOrEqual(28);

    const requiredDomains: PunjabiScenarioRecallDomain[] = [
      "greetings",
      "identity",
      "numbers",
      "directions",
      "food",
      "help_requests",
      "service_counters",
      "gurmukhi_recognition",
    ];
    const domains = new Set(punjabiA1ScenarioRecallDeck.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes recall, review routing, and readiness-style modes", () => {
    const requiredModes: PunjabiScenarioRecallMode[] = [
      "recall",
      "choose",
      "route_review",
      "integration_ready",
      "mini_scenario",
    ];
    const modes = new Set(punjabiA1ScenarioRecallDeck.map((item) => item.mode));

    for (const mode of requiredModes) {
      expect(modes, `missing mode ${mode}`).toContain(mode);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1ScenarioRecallDeck) {
      expect(item.id).toMatch(/^pa_a1_recall_/);
      expect(JSON.stringify(item.expected_pa)).toMatch(GURMUKHI_SCRIPT);
      expect(item.scenario_vi.trim().length).toBeGreaterThan(0);
      expect(item.scenario_en.trim().length).toBeGreaterThan(0);
      expect(item.recall_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.recall_prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.route_if_missed_vi.trim().length).toBeGreaterThan(0);
      expect(item.route_if_missed_en.trim().length).toBeGreaterThan(0);
      expect(item.review_targets.length).toBeGreaterThanOrEqual(2);

      if (item.options_pa) {
        expect(item.options_pa.length).toBeGreaterThanOrEqual(3);
        expect(JSON.stringify(item.options_pa)).toMatch(GURMUKHI_SCRIPT);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical scenarios", () => {
    const traps = punjabiA1ScenarioRecallDeck.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ScenarioRecallDeck.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ/);
  });

  it("recalls key A1 phrases across greetings, identity, numbers, directions, food, help, services, and Gurmukhi", () => {
    const allText = JSON.stringify(punjabiA1ScenarioRecallDeck);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ|ਸੱਜੇ|ਖੱਬੇ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ|ਸ਼ਾਕਾਹਾਰੀ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
    expect(allText).toMatch(/ਪਾਣੀ|ਫਾਰਮ|ਪਛਾਣ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${scenarioRecallScriptAwareness} ${JSON.stringify(punjabiA1ScenarioRecallDeck)}`;

    expect(scenarioRecallScriptAwareness).toContain("Shahmukhi");
    expect(scenarioRecallScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
