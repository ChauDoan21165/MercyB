import { describe, expect, it } from "vitest";

import { exitTicketsC1, exitTicketsScriptAwarenessC1 } from "../exitTicketsC1";

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
  "public_professional_text_handling",
] as const;

describe("Punjabi C1 exit tickets - app data contract", () => {
  it("contains a compact exit-ticket pack with stable ids", () => {
    expect(exitTicketsC1.length).toBeGreaterThanOrEqual(8);
    expect(exitTicketsC1.length).toBeLessThanOrEqual(12);

    const ids = exitTicketsC1.map((ticket) => ticket.id);
    expect(ids.every((id) => id.startsWith("pa_c1_exit_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(exitTicketsC1.every((ticket) => ticket.level === "C1")).toBe(true);
  });

  it("covers all Wave 21 exit-ticket areas", () => {
    const present = new Set(exitTicketsC1.map((ticket) => ticket.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes exit-ticket, final-proof, and final-QA modes", () => {
    const modes = new Set(exitTicketsC1.map((ticket) => ticket.mode));
    expect(modes.has("exit_ticket")).toBe(true);
    expect(modes.has("final_proof")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
  });
});

describe("Punjabi C1 exit tickets - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and expected responses with romanization, Vietnamese, and English", () => {
    for (const ticket of exitTicketsC1) {
      expect(GURMUKHI.test(ticket.title_pa)).toBe(true);
      expect(ticket.title_rom.trim().length).toBeGreaterThan(0);
      expect(ticket.title_vi.trim().length).toBeGreaterThan(0);
      expect(ticket.title_en.trim().length).toBeGreaterThan(0);
      expect(ticket.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(ticket.prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(ticket.expected_response.pa)).toBe(true);
      expect(ticket.expected_response.rom.trim().length).toBeGreaterThan(0);
      expect(ticket.expected_response.vi.trim().length).toBeGreaterThan(0);
      expect(ticket.expected_response.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes pass criteria and final proof checks", () => {
    for (const ticket of exitTicketsC1) {
      expect(ticket.pass_criteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(ticket.pass_criteria_en.length).toBeGreaterThanOrEqual(3);
      expect(ticket.final_proof_vi.length).toBeGreaterThanOrEqual(3);
      expect(ticket.final_proof_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const ticket of exitTicketsC1) {
      expect(ticket.canada_example.context_vi).toContain("Canada");
      expect(ticket.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(ticket.canada_example.pa)).toBe(true);
      expect(ticket.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(ticket.canada_example.vi).toContain("Canada");
      expect(ticket.canada_example.en).toMatch(/Canada|Canadian/);
      expect(ticket.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(ticket.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 exit tickets - script scope", () => {
  it("mentions Shahmukhi only as awareness, not exit-ticket content", () => {
    expect(exitTicketsScriptAwarenessC1.vi).toContain("Gurmukhi");
    expect(exitTicketsScriptAwarenessC1.en).toContain("Gurmukhi");
    expect(exitTicketsScriptAwarenessC1.vi).toContain("Shahmukhi");
    expect(exitTicketsScriptAwarenessC1.en).toContain("Shahmukhi");

    const learnerPunjabi = exitTicketsC1.flatMap((ticket) => [
      ticket.title_pa,
      ticket.expected_response.pa,
      ticket.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
