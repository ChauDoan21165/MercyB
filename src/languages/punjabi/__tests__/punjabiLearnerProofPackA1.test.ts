import { describe, expect, it } from "vitest";

import punjabiA1LearnerProofPack, {
  learnerProofPackScriptAwareness,
  punjabiA1LearnerProofPack as namedLearnerProofPack,
  type PunjabiLearnerProofDomain,
  type PunjabiLearnerProofStyle,
} from "@/languages/punjabi/learnerProofPackA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 learner proof pack", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1LearnerProofPack).toBe(namedLearnerProofPack);
    expect(Array.isArray(punjabiA1LearnerProofPack)).toBe(true);
  });

  it("is compact and covers the required proof domains", () => {
    expect(punjabiA1LearnerProofPack.length).toBeGreaterThanOrEqual(9);
    expect(punjabiA1LearnerProofPack.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiLearnerProofDomain[] = [
      "greetings",
      "self_introduction",
      "numbers_prices",
      "help_repair",
      "polite_service",
      "gurmukhi_recognition",
      "canada_practical",
    ];
    const domains = new Set(punjabiA1LearnerProofPack.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes proof-pack, final-owner-review, and final-QA styles", () => {
    const requiredStyles: PunjabiLearnerProofStyle[] = ["proof_pack", "final_owner_review", "final_qa"];
    const styles = new Set(punjabiA1LearnerProofPack.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual learner proof support", () => {
    for (const item of punjabiA1LearnerProofPack) {
      expect(item.id).toMatch(/^pa_a1_proof_/);
      expect(item.evidence_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.learner_can_do_vi.trim().length).toBeGreaterThan(0);
      expect(item.learner_can_do_en.trim().length).toBeGreaterThan(0);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.pass_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.pass_check_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes common learner traps and Canada-practical proof items", () => {
    const traps = punjabiA1LearnerProofPack.flatMap((item) => item.common_trap ? [item.common_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1LearnerProofPack.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਟਿਕਟਾਂ|ਡਾਲਰ|ਮਦਦ|ਦੁਬਾਰਾ/);
  });

  it("proves key A1 learner abilities", () => {
    const allText = JSON.stringify(punjabiA1LearnerProofPack);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ|ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims/systems", () => {
    const allText = `${learnerProofPackScriptAwareness} ${JSON.stringify(punjabiA1LearnerProofPack)}`;

    expect(learnerProofPackScriptAwareness).toContain("Shahmukhi");
    expect(learnerProofPackScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
