import { describe, expect, it } from "vitest";

import { learnerProofPackC1, learnerProofPackScriptAwarenessC1 } from "../learnerProofPackC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "professional_correspondence",
  "executive_summary",
  "presentation_response",
] as const;

describe("Punjabi C1 learner proof pack - app data contract", () => {
  it("contains a compact proof pack with stable ids", () => {
    expect(learnerProofPackC1.length).toBeGreaterThanOrEqual(7);
    expect(learnerProofPackC1.length).toBeLessThanOrEqual(12);

    const ids = learnerProofPackC1.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_proof_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(learnerProofPackC1.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 22 proof areas", () => {
    const present = new Set(learnerProofPackC1.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes proof-pack, final-owner-review, and final-QA modes", () => {
    const modes = new Set(learnerProofPackC1.map((card) => card.mode));
    expect(modes.has("proof_pack")).toBe(true);
    expect(modes.has("final_owner_review")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
  });
});

describe("Punjabi C1 learner proof pack - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and proof lines with romanization, Vietnamese, and English", () => {
    for (const card of learnerProofPackC1) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.proof_goal_vi.trim().length).toBeGreaterThan(0);
      expect(card.proof_goal_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.proof_line.pa)).toBe(true);
      expect(card.proof_line.rom.trim().length).toBeGreaterThan(0);
      expect(card.proof_line.vi.trim().length).toBeGreaterThan(0);
      expect(card.proof_line.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes final owner review and final QA checks", () => {
    for (const card of learnerProofPackC1) {
      expect(card.final_owner_review_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.final_owner_review_en.length).toBeGreaterThanOrEqual(3);
      expect(card.final_qa_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.final_qa_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const card of learnerProofPackC1) {
      expect(card.canada_example.context_vi).toContain("Canada");
      expect(card.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(card.canada_example.pa)).toBe(true);
      expect(card.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(card.canada_example.vi).toContain("Canada");
      expect(card.canada_example.en).toMatch(/Canada|Canadian/);
      expect(card.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(card.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 learner proof pack - script scope", () => {
  it("mentions Shahmukhi only as awareness, not proof-pack content", () => {
    expect(learnerProofPackScriptAwarenessC1.vi).toContain("Gurmukhi");
    expect(learnerProofPackScriptAwarenessC1.en).toContain("Gurmukhi");
    expect(learnerProofPackScriptAwarenessC1.vi).toContain("Shahmukhi");
    expect(learnerProofPackScriptAwarenessC1.en).toContain("Shahmukhi");

    const learnerPunjabi = learnerProofPackC1.flatMap((card) => [
      card.title_pa,
      card.proof_line.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
