// Punjabi script vocabulary proof pack guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import proofPack, {
  PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK,
  PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK_SCOPE,
  type PunjabiScriptVocabularyProofArea,
} from "@/languages/punjabi/scriptVocabularyProofPack";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiScriptVocabularyProofArea> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_words",
  "thematic_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge_reduction",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary proof pack", () => {
  it("is app-consumable TypeScript data", () => {
    expect(proofPack).toBe(PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK);
    expect(Array.isArray(proofPack)).toBe(true);
    expect(PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK_SCOPE.name).toContain("Proof Pack");
  });

  it("covers all required proof areas compactly", () => {
    expect(proofPack.length).toBeGreaterThanOrEqual(REQUIRED_AREAS.length);
    expect(proofPack.length).toBeLessThanOrEqual(12);

    const present = new Set(proofPack.map((item) => item.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("uses stable ids and proof styles", () => {
    const ids = proofPack.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(proofPack.some((item) => item.use === "proof_pack")).toBe(true);
    expect(proofPack.some((item) => item.use === "final_owner_review")).toBe(true);
    expect(proofPack.some((item) => item.use === "final_qa")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of proofPack) {
      expect(item.gurmukhi).toMatch(GURMUKHI_RANGE);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(12);
      expect(item.prompt_en.trim().length).toBeGreaterThan(12);
      expect(item.answer_vi.trim().length).toBeGreaterThan(10);
      expect(item.answer_en.trim().length).toBeGreaterThan(10);
      expect(item.proof_vi.trim().length).toBeGreaterThan(10);
      expect(item.proof_en.trim().length).toBeGreaterThan(10);
      if (item.romanization) {
        expect(item.romanization.trim().length).toBeGreaterThan(2);
      }
    }
  });

  it("includes learner traps and Canada-practical coverage", () => {
    const traps = proofPack.filter((item) => item.learnerTrap);
    const canada = proofPack.filter((item) => item.canadaPractical);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canada.length).toBeGreaterThanOrEqual(7);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const blob = JSON.stringify({
      scope: PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK_SCOPE,
      proofPack,
    }).toLowerCase();
    expect(blob).toContain("shahmukhi");
    expect(blob).toContain("native review is deferred");
    expect(blob).not.toContain("native reviewed");
    expect(blob).not.toContain("full shahmukhi course");
  });

  it("keeps forbidden scoring, audio, and integration claims out", () => {
    const blob = JSON.stringify(proofPack).toLowerCase();
    expect(blob).not.toContain("pronunciation scoring");
    expect(blob).not.toContain("audio");
    expect(blob).not.toContain("azure");
    expect(blob).not.toContain("supabase");
    expect(blob).not.toContain("billing");
    expect(blob).not.toContain("ci config");
  });
});
