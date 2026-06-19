// src/languages/thai/__tests__/thaiConnectors.test.ts
//
// Structural + content guards for the Thai sentence-connector bank.
// Validates the WAVE4 brief: 60–120 entries, the required connector functions
// present, Thai script + romanization, Vietnamese + English usage notes,
// an example, and a common learner-mistake note on every entry.

import { describe, it, expect } from "vitest";
import {
  thaiConnectors,
  type ThaiConnectorCategory,
} from "../connectors";

const THAI_RE = /[฀-๿]/;
const LATIN_RE = /[a-z]/i;

// The functions the brief explicitly requires.
const REQUIRED_CATEGORIES: ThaiConnectorCategory[] = [
  "because",
  "so",
  "therefore",
  "but",
  "although",
  "if",
  "when",
  "before",
  "after",
  "however",
  "for_example",
  "in_my_opinion",
];

describe("Thai connectors — batch", () => {
  it("has 60–120 entries", () => {
    expect(thaiConnectors.length).toBeGreaterThanOrEqual(60);
    expect(thaiConnectors.length).toBeLessThanOrEqual(120);
  });

  it("has unique ids", () => {
    const ids = thaiConnectors.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required connector function", () => {
    const seen = new Set(thaiConnectors.map((c) => c.category));
    for (const cat of REQUIRED_CATEGORIES) {
      expect(seen.has(cat)).toBe(true);
    }
  });
});

describe("Thai connectors — per-entry content", () => {
  for (const c of thaiConnectors) {
    describe(c.id, () => {
      it("has Thai script + romanization + gloss", () => {
        expect(THAI_RE.test(c.th)).toBe(true);
        expect(LATIN_RE.test(c.rtgs)).toBe(true);
        expect(c.gloss_en.trim().length).toBeGreaterThan(0);
      });

      it("has Vietnamese + English usage notes", () => {
        expect(c.usage_en.trim().length).toBeGreaterThan(0);
        expect(c.usage_vi.trim().length).toBeGreaterThan(0);
      });

      it("has an example in Thai with romanization, vi + en", () => {
        expect(THAI_RE.test(c.example.th)).toBe(true);
        expect(LATIN_RE.test(c.example.rtgs)).toBe(true);
        expect(c.example.en.trim().length).toBeGreaterThan(0);
        expect(c.example.vi.trim().length).toBeGreaterThan(0);
      });

      it("has a common-mistake note in vi + en", () => {
        expect(c.mistake_en.trim().length).toBeGreaterThan(0);
        expect(c.mistake_vi.trim().length).toBeGreaterThan(0);
      });
    });
  }
});
