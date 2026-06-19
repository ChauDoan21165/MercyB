// src/languages/thai/__tests__/thaiFoodAllergyDining.test.ts
//
// Structure guard for the Thai food-allergy / dining-safety pack (Wave 6).
//
// Pins the task requirements:
//   • 50–100 compact items
//   • Thai script + romanization on every item
//   • Vietnamese + English meaning on every item
//   • all 10 required topics present
//
// All assertions derive from the data at runtime, so the suite stays green
// as content is refined and fails only on a structural regression.

import { describe, it, expect } from "vitest";

import thaiFoodAllergyDining, {
  thaiFoodAllergyDining as namedExport,
  THAI_DINING_TOPICS,
  type ThaiDiningTopic,
} from "@/languages/thai/foodAllergyDining";

const THAI_BLOCK = /[฀-๿]/;

const REQUIRED_TOPICS: ThaiDiningTopic[] = [
  "allergy",
  "vegetarian",
  "halal_style",
  "no_pork",
  "no_seafood",
  "spicy_level",
  "ingredients",
  "contamination_warning",
  "emergency_phrase",
  "restaurant_clarification",
];

describe("Thai dining pack — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(thaiFoodAllergyDining)).toBe(true);
    expect(namedExport).toBe(thaiFoodAllergyDining);
  });
});

describe("Thai dining pack — size and ids", () => {
  it("has 50–100 items", () => {
    expect(thaiFoodAllergyDining.length).toBeGreaterThanOrEqual(50);
    expect(thaiFoodAllergyDining.length).toBeLessThanOrEqual(100);
  });

  it("every id is unique and non-empty", () => {
    const ids = thaiFoodAllergyDining.map((i) => i.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai dining pack — topic coverage", () => {
  it("covers all 10 required topics", () => {
    const present = new Set(thaiFoodAllergyDining.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(present.has(t), `missing topic: ${t}`).toBe(true);
    }
  });

  it("THAI_DINING_TOPICS matches the required set", () => {
    expect([...THAI_DINING_TOPICS].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });
});

describe("Thai dining pack — per-item invariants", () => {
  it("every item has Thai script, romanization, VI + EN meaning", () => {
    for (const i of thaiFoodAllergyDining) {
      expect(i.th, `${i.id} missing Thai`).toMatch(THAI_BLOCK);
      expect(i.rtgs.length, `${i.id} missing romanization`).toBeGreaterThan(0);
      expect(i.vi.length, `${i.id} missing VI`).toBeGreaterThan(0);
      expect(i.en.length, `${i.id} missing EN`).toBeGreaterThan(0);
    }
  });

  it("optional notes, when present, are non-empty strings", () => {
    for (const i of thaiFoodAllergyDining) {
      if (i.note_vi !== undefined) expect(i.note_vi.length).toBeGreaterThan(0);
      if (i.note_en !== undefined) expect(i.note_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai dining pack — breadth sanity", () => {
  it("every required topic has at least 3 items", () => {
    for (const t of REQUIRED_TOPICS) {
      const n = thaiFoodAllergyDining.filter((i) => i.topic === t).length;
      expect(n, `too few items for ${t}`).toBeGreaterThanOrEqual(3);
    }
  });
});
