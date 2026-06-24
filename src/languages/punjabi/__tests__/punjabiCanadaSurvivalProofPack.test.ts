import { describe, expect, it } from "vitest";

import proofPack, {
  PUNJABI_CANADA_SURVIVAL_PROOF_PACK,
  PUNJABI_CANADA_SURVIVAL_PROOF_PACK_SCOPE,
  type PunjabiCanadaSurvivalProofDomain,
} from "@/languages/punjabi/canadaSurvivalProofPack";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalProofDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms_service_desk",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada survival proof pack", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(proofPack).toBe(PUNJABI_CANADA_SURVIVAL_PROOF_PACK);
    expect(Array.isArray(proofPack)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_PROOF_PACK_SCOPE.name).toContain("Proof Pack");
  });

  it("covers representative Canada survival domains compactly", () => {
    expect(proofPack.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(proofPack.length).toBeLessThanOrEqual(18);

    const present = new Set(proofPack.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and proof-pack review styles", () => {
    const ids = proofPack.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(proofPack.some((item) => item.use === "proof_pack")).toBe(true);
    expect(proofPack.some((item) => item.use === "final_owner_review")).toBe(true);
    expect(proofPack.some((item) => item.use === "final_qa")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of proofPack) {
      expect(item.proofLine_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.acceptableSupport_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.acceptableSupport_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.evidenceTarget_vi.length).toBeGreaterThan(20);
      expect(item.evidenceTarget_en.length).toBeGreaterThan(20);
      expect(item.learnerTask_vi.length).toBeGreaterThan(20);
      expect(item.learnerTask_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.ownerReviewCue_vi.length).toBeGreaterThan(20);
      expect(item.ownerReviewCue_en.length).toBeGreaterThan(20);
      expect(item.canadaPractical_vi).toMatch(/Canada|Ở Canada|Dùng|Hữu ích|Câu này/u);
      expect(item.canadaPractical_en).toMatch(/Canada|Use|Useful|This|In Canada/u);
    }
  });

  it("includes common learner traps for proof review", () => {
    const traps = proofPack.filter((item) => item.learnerTrap_vi && item.learnerTrap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_PROOF_PACK_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_PROOF_PACK_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_PROOF_PACK_SCOPE,
      proofPack,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|Shahmukhi course|full Shahmukhi/i);
  });

  it("keeps forbidden integration and scoring concepts out of proof items", () => {
    const allContent = JSON.stringify(proofPack);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
