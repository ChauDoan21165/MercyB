import { describe, expect, it } from "vitest";

import { smokeDeckC1, smokeDeckScriptAwarenessC1 } from "../smokeDeckC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_SKILLS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "professional_correspondence",
  "executive_summary",
  "presentation_response",
  "public_professional_text_task",
] as const;

describe("Punjabi C1 smoke deck - app data contract", () => {
  it("contains a compact representative deck with stable ids", () => {
    expect(smokeDeckC1.length).toBeGreaterThanOrEqual(8);
    expect(smokeDeckC1.length).toBeLessThanOrEqual(12);

    const ids = smokeDeckC1.map((item) => item.id);
    expect(ids.every((id) => id.startsWith("pa_c1_smoke_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(smokeDeckC1.every((item) => item.level === "C1")).toBe(true);
  });

  it("covers all Wave 19 smoke-deck skills", () => {
    const present = new Set(smokeDeckC1.map((item) => item.skill));
    for (const skill of REQUIRED_SKILLS) {
      expect(present.has(skill)).toBe(true);
    }
  });

  it("includes smoke-check, final-QA, and integration-readiness modes", () => {
    const modes = new Set(smokeDeckC1.map((item) => item.mode));
    expect(modes.has("smoke_check")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
    expect(modes.has("integration_readiness")).toBe(true);
  });
});

describe("Punjabi C1 smoke deck - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and responses with romanization, Vietnamese, and English", () => {
    for (const item of smokeDeckC1) {
      expect(GURMUKHI.test(item.title_pa)).toBe(true);
      expect(item.title_rom.trim().length).toBeGreaterThan(0);
      expect(item.title_vi.trim().length).toBeGreaterThan(0);
      expect(item.title_en.trim().length).toBeGreaterThan(0);
      expect(item.task_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.task_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(item.smoke_response.pa)).toBe(true);
      expect(item.smoke_response.rom.trim().length).toBeGreaterThan(0);
      expect(item.smoke_response.vi.trim().length).toBeGreaterThan(0);
      expect(item.smoke_response.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes pass signals and final QA checks", () => {
    for (const item of smokeDeckC1) {
      expect(item.pass_signals_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.pass_signals_en.length).toBeGreaterThanOrEqual(3);
      expect(item.final_qa_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.final_qa_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical contexts and learner traps", () => {
    for (const item of smokeDeckC1) {
      expect(item.canada_context.context_vi).toContain("Canada");
      expect(item.canada_context.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(item.canada_context.pa)).toBe(true);
      expect(item.canada_context.rom.trim().length).toBeGreaterThan(0);
      expect(item.canada_context.vi).toContain("Canada");
      expect(item.canada_context.en).toMatch(/Canada|Canadian/);
      expect(item.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 smoke deck - script scope", () => {
  it("mentions Shahmukhi only as awareness, not smoke content", () => {
    expect(smokeDeckScriptAwarenessC1.vi).toContain("Gurmukhi");
    expect(smokeDeckScriptAwarenessC1.en).toContain("Gurmukhi");
    expect(smokeDeckScriptAwarenessC1.vi).toContain("Shahmukhi");
    expect(smokeDeckScriptAwarenessC1.en).toContain("Shahmukhi");

    const learnerPunjabi = smokeDeckC1.flatMap((item) => [
      item.title_pa,
      item.smoke_response.pa,
      item.canada_context.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
