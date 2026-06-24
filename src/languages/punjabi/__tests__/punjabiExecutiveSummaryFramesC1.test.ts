import { describe, expect, it } from "vitest";

import {
  executiveSummaryFramesC1,
  executiveSummaryScriptAwareness,
} from "../executiveSummaryFramesC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_FOCUSES = [
  "summarize_issue",
  "key_finding",
  "implication",
  "limitation",
  "recommendation",
  "next_step",
  "professional_context",
  "public_service_context",
] as const;

describe("Punjabi C1 executive summary frames - app data contract", () => {
  it("contains a compact useful pack with stable ids", () => {
    expect(executiveSummaryFramesC1.length).toBeGreaterThanOrEqual(8);
    expect(executiveSummaryFramesC1.length).toBeLessThanOrEqual(12);

    const ids = executiveSummaryFramesC1.map((entry) => entry.id);
    expect(ids.every((id) => id.startsWith("pa_c1_exec_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(executiveSummaryFramesC1.every((entry) => entry.level === "C1")).toBe(true);
  });

  it("covers all Wave 17 executive-summary focuses", () => {
    const present = new Set(executiveSummaryFramesC1.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(present.has(focus)).toBe(true);
    }
  });

  it("includes review, remediation, readiness, and final-quality modes", () => {
    const modes = new Set(executiveSummaryFramesC1.map((entry) => entry.mode));
    expect(modes.has("review")).toBe(true);
    expect(modes.has("remediation")).toBe(true);
    expect(modes.has("readiness")).toBe(true);
    expect(modes.has("final_quality")).toBe(true);
  });
});

describe("Punjabi C1 executive summary frames - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and frames with romanization, Vietnamese, and English", () => {
    for (const entry of executiveSummaryFramesC1) {
      expect(GURMUKHI.test(entry.title_pa)).toBe(true);
      expect(entry.title_rom.trim().length).toBeGreaterThan(0);
      expect(entry.title_vi.trim().length).toBeGreaterThan(0);
      expect(entry.title_en.trim().length).toBeGreaterThan(0);

      expect(entry.summary_goal_vi.trim().length).toBeGreaterThan(0);
      expect(entry.summary_goal_en.trim().length).toBeGreaterThan(0);
      expect(entry.register_note_vi.trim().length).toBeGreaterThan(0);
      expect(entry.register_note_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(entry.frame.pa)).toBe(true);
      expect(entry.frame.rom.trim().length).toBeGreaterThan(0);
      expect(entry.frame.vi.trim().length).toBeGreaterThan(0);
      expect(entry.frame.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes reusable expansion moves and final-quality checks", () => {
    for (const entry of executiveSummaryFramesC1) {
      expect(entry.expansion_moves.length).toBeGreaterThanOrEqual(3);
      expect(entry.final_quality_check_vi.length).toBeGreaterThanOrEqual(3);
      expect(entry.final_quality_check_en.length).toBeGreaterThanOrEqual(3);

      for (const move of entry.expansion_moves) {
        expect(GURMUKHI.test(move.pa)).toBe(true);
        expect(move.rom.trim().length).toBeGreaterThan(0);
        expect(move.vi.trim().length).toBeGreaterThan(0);
        expect(move.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const entry of executiveSummaryFramesC1) {
      expect(entry.canada_example.context_vi).toContain("Canada");
      expect(entry.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(entry.canada_example.pa)).toBe(true);
      expect(entry.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(entry.canada_example.vi).toContain("Canada");
      expect(entry.canada_example.en).toMatch(/Canada|Canadian/);

      expect(entry.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(entry.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 executive summary frames - script scope", () => {
  it("mentions Shahmukhi only as awareness, not executive-summary content", () => {
    expect(executiveSummaryScriptAwareness.vi).toContain("Gurmukhi");
    expect(executiveSummaryScriptAwareness.en).toContain("Gurmukhi");
    expect(executiveSummaryScriptAwareness.vi).toContain("Shahmukhi");
    expect(executiveSummaryScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = executiveSummaryFramesC1.flatMap((entry) => [
      entry.title_pa,
      entry.frame.pa,
      entry.canada_example.pa,
      ...entry.expansion_moves.map((move) => move.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
