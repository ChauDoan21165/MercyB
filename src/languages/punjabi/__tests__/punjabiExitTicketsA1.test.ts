import { describe, expect, it } from "vitest";

import punjabiA1ExitTickets, {
  exitTicketsScriptAwareness,
  punjabiA1ExitTickets as namedExitTickets,
  type PunjabiExitTicketDomain,
  type PunjabiExitTicketKind,
} from "@/languages/punjabi/exitTicketsA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 exit tickets", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ExitTickets).toBe(namedExitTickets);
    expect(Array.isArray(punjabiA1ExitTickets)).toBe(true);
  });

  it("is compact and covers required exit-ticket domains", () => {
    expect(punjabiA1ExitTickets.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1ExitTickets.length).toBeLessThanOrEqual(18);

    const requiredDomains: PunjabiExitTicketDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "polite_service",
      "gurmukhi_recognition",
      "canada_survival",
    ];
    const domains = new Set(punjabiA1ExitTickets.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes exit-ticket, final-proof, and final-QA styles", () => {
    const requiredKinds: PunjabiExitTicketKind[] = ["exit_ticket", "final_proof", "final_qa"];
    const kinds = new Set(punjabiA1ExitTickets.map((item) => item.kind));

    for (const kind of requiredKinds) {
      expect(kinds, `missing kind ${kind}`).toContain(kind);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual proof support", () => {
    for (const item of punjabiA1ExitTickets) {
      expect(item.id).toMatch(/^pa_a1_exit_/);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.proof_vi.trim().length).toBeGreaterThan(0);
      expect(item.proof_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.review_if_missed.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_if_missed) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical exit checks", () => {
    const traps = punjabiA1ExitTickets.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ExitTickets.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ/);
  });

  it("checks quick proof across A1 language and Canada survival use", () => {
    const allText = JSON.stringify(punjabiA1ExitTickets);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ|ਸੱਜੇ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ|ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${exitTicketsScriptAwareness} ${JSON.stringify(punjabiA1ExitTickets)}`;

    expect(exitTicketsScriptAwareness).toContain("Shahmukhi");
    expect(exitTicketsScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
