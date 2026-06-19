// Tests for the Thai professional message templates batch (A6 Wave 4) — TEXT ONLY.
//
// Pins the structural contract of professionalTemplates.ts: count (40–80), full
// coverage of the ten functional categories, bilingual VN+EN fields, Thai script
// in the message, and the required formal + casual register notes. Native review
// is deferred.

import { describe, it, expect } from "vitest";

import { professionalTemplates } from "../professionalTemplates";

const THAI = /[฀-๿]/;
const CATEGORIES = [
  "request",
  "apology",
  "delay",
  "meeting",
  "follow_up",
  "handoff",
  "clarification",
  "polite_refusal",
  "escalation",
  "customer_response",
] as const;

describe("Thai professional templates — size & ids", () => {
  it("contains 40–80 templates", () => {
    expect(professionalTemplates.length).toBeGreaterThanOrEqual(40);
    expect(professionalTemplates.length).toBeLessThanOrEqual(80);
  });

  it("every id is unique and non-empty", () => {
    const ids = professionalTemplates.map((t) => t.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai professional templates — category coverage", () => {
  it("every category is one of the ten target functions", () => {
    const set = new Set<string>(CATEGORIES);
    expect(professionalTemplates.every((t) => set.has(t.category))).toBe(true);
  });

  it("covers all ten target functions", () => {
    const present = new Set(professionalTemplates.map((t) => t.category));
    for (const cat of CATEGORIES) expect(present.has(cat)).toBe(true);
  });
});

describe("Thai professional templates — bilingual + Thai-script + register contract", () => {
  it("every template has a VN and EN scenario", () => {
    for (const t of professionalTemplates) {
      expect(t.scenario_vi.trim().length).toBeGreaterThan(0);
      expect(t.scenario_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every template message has Thai script, romanization, VN and EN", () => {
    for (const t of professionalTemplates) {
      expect(THAI.test(t.th)).toBe(true);
      expect(t.rom.trim().length).toBeGreaterThan(0);
      expect(t.vi.trim().length).toBeGreaterThan(0);
      expect(t.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every template has BOTH formal and casual notes in VN and EN", () => {
    for (const t of professionalTemplates) {
      expect(t.formal_note_vi.trim().length).toBeGreaterThan(0);
      expect(t.formal_note_en.trim().length).toBeGreaterThan(0);
      expect(t.casual_note_vi.trim().length).toBeGreaterThan(0);
      expect(t.casual_note_en.trim().length).toBeGreaterThan(0);
    }
  });
});
