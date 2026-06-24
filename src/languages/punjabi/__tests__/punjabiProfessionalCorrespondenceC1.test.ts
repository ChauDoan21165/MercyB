import { describe, expect, it } from "vitest";

import {
  professionalCorrespondenceC1,
  professionalCorrespondenceScriptAwareness,
} from "../professionalCorrespondenceC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_TYPES = [
  "formal_request",
  "follow_up",
  "complaint",
  "clarification",
  "summary",
  "recommendation",
  "respectful_disagreement",
  "public_service_frame",
  "professional_service_frame",
] as const;

describe("Punjabi C1 professional correspondence - app data contract", () => {
  it("contains a compact useful pack with stable ids", () => {
    expect(professionalCorrespondenceC1.length).toBeGreaterThanOrEqual(9);
    expect(professionalCorrespondenceC1.length).toBeLessThanOrEqual(14);

    const ids = professionalCorrespondenceC1.map((entry) => entry.id);
    expect(ids.every((id) => id.startsWith("pa_c1_corr_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(professionalCorrespondenceC1.every((entry) => entry.level === "C1")).toBe(true);
  });

  it("covers all Wave 16 correspondence types", () => {
    const present = new Set(professionalCorrespondenceC1.map((entry) => entry.type));
    for (const type of REQUIRED_TYPES) {
      expect(present.has(type)).toBe(true);
    }
  });

  it("includes navigation, readiness, and remediation data", () => {
    for (const entry of professionalCorrespondenceC1) {
      expect(entry.navigation_note_vi.trim().length).toBeGreaterThan(0);
      expect(entry.navigation_note_en.trim().length).toBeGreaterThan(0);
      expect(["review", "remediation", "readiness"]).toContain(entry.route);
    }
  });
});

describe("Punjabi C1 professional correspondence - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English support", () => {
    for (const entry of professionalCorrespondenceC1) {
      expect(GURMUKHI.test(entry.title_pa)).toBe(true);
      expect(entry.title_rom.trim().length).toBeGreaterThan(0);
      expect(entry.title_vi.trim().length).toBeGreaterThan(0);
      expect(entry.title_en.trim().length).toBeGreaterThan(0);
      expect(entry.writing_goal_vi.trim().length).toBeGreaterThan(0);
      expect(entry.writing_goal_en.trim().length).toBeGreaterThan(0);
      expect(entry.register_note_vi.trim().length).toBeGreaterThan(0);
      expect(entry.register_note_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes reusable professional writing frames", () => {
    for (const entry of professionalCorrespondenceC1) {
      expect(entry.frames.length).toBeGreaterThanOrEqual(3);
      for (const frame of entry.frames) {
        expect(GURMUKHI.test(frame.pa)).toBe(true);
        expect(frame.rom.trim().length).toBeGreaterThan(0);
        expect(frame.vi.trim().length).toBeGreaterThan(0);
        expect(frame.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const entry of professionalCorrespondenceC1) {
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

describe("Punjabi C1 professional correspondence - script scope", () => {
  it("mentions Shahmukhi only as awareness, not correspondence content", () => {
    expect(professionalCorrespondenceScriptAwareness.vi).toContain("Gurmukhi");
    expect(professionalCorrespondenceScriptAwareness.en).toContain("Gurmukhi");
    expect(professionalCorrespondenceScriptAwareness.vi).toContain("Shahmukhi");
    expect(professionalCorrespondenceScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = professionalCorrespondenceC1.flatMap((entry) => [
      entry.title_pa,
      entry.canada_example.pa,
      ...entry.frames.map((frame) => frame.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
