import { describe, expect, it } from "vitest";

import punjabiA1CanDoStatements, {
  canDoStatementsScriptAwareness,
  punjabiA1CanDoStatements as namedCanDoStatements,
  type PunjabiCanDoCheckpointType,
  type PunjabiCanDoDomain,
  type PunjabiCanDoReadiness,
} from "@/languages/punjabi/canDoStatementsA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 can-do statements", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1CanDoStatements).toBe(namedCanDoStatements);
    expect(Array.isArray(punjabiA1CanDoStatements)).toBe(true);
  });

  it("is compact and covers required A1 can-do domains", () => {
    expect(punjabiA1CanDoStatements.length).toBeGreaterThanOrEqual(14);
    expect(punjabiA1CanDoStatements.length).toBeLessThanOrEqual(24);

    const requiredDomains: PunjabiCanDoDomain[] = [
      "greetings",
      "identity",
      "simple_needs",
      "gurmukhi_reading",
      "prices",
      "directions",
      "help_requests",
      "canada_services",
    ];
    const domains = new Set(punjabiA1CanDoStatements.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes checkpoint and readiness styles", () => {
    const requiredCheckpointTypes: PunjabiCanDoCheckpointType[] = [
      "self_assess",
      "recognize",
      "produce",
      "choose",
      "mini_roleplay",
    ];
    const checkpointTypes = new Set(punjabiA1CanDoStatements.map((item) => item.checkpoint_type));

    for (const checkpointType of requiredCheckpointTypes) {
      expect(checkpointTypes, `missing checkpoint type ${checkpointType}`).toContain(checkpointType);
    }

    const requiredReadiness: PunjabiCanDoReadiness[] = ["ready", "review", "supported"];
    const readinessLevels = new Set(punjabiA1CanDoStatements.map((item) => item.readiness));

    for (const readiness of requiredReadiness) {
      expect(readinessLevels, `missing readiness ${readiness}`).toContain(readiness);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual learner support", () => {
    for (const item of punjabiA1CanDoStatements) {
      expect(item.id).toMatch(/^pa_a1_cando_/);
      expect(item.example_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.can_do_vi.trim().length).toBeGreaterThan(0);
      expect(item.can_do_en.trim().length).toBeGreaterThan(0);
      expect(item.example_vi.trim().length).toBeGreaterThan(0);
      expect(item.example_en.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.success_criteria_vi.trim().length).toBeGreaterThan(0);
      expect(item.success_criteria_en.trim().length).toBeGreaterThan(0);
      expect(item.review_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.review_hint_en.trim().length).toBeGreaterThan(0);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical examples", () => {
    const traps = punjabiA1CanDoStatements.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1CanDoStatements.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ/);
  });

  it("targets greet, introduce, needs, Gurmukhi words, prices, directions, help, and services", () => {
    const allText = JSON.stringify(punjabiA1CanDoStatements);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ|ਮੈਨੂੰ ਫਾਰਮ/);
    expect(allText).toMatch(/ਪਾਣੀ|ਮਦਦ|ਬੱਸ/);
    expect(allText).toMatch(/ਕਿੰਨੇ ਦਾ|ਡਾਲਰ/);
    expect(allText).toMatch(/ਕਿੱਥੇ|ਸੱਜੇ|ਖੱਬੇ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${canDoStatementsScriptAwareness} ${JSON.stringify(punjabiA1CanDoStatements)}`;

    expect(canDoStatementsScriptAwareness).toContain("Shahmukhi");
    expect(canDoStatementsScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
