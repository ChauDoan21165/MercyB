// src/languages/thai/__tests__/thaiMedicalPharmacy.test.ts
//
// Structure guard for the Thai medical / pharmacy language pack (Wave 5).
//
// Pins the task requirements:
//   • 50–100 compact items
//   • Thai script + romanization on every item
//   • Vietnamese + English meaning on every item
//   • all 12 required topics present
//
// All assertions derive from the data at runtime, so the suite stays green
// as content is refined and fails only on a structural regression.

import { describe, it, expect } from "vitest";

import thaiMedicalPharmacy, {
  thaiMedicalPharmacy as namedExport,
  THAI_MEDICAL_TOPICS,
  type ThaiMedicalTopic,
} from "@/languages/thai/medicalPharmacy";

const THAI_BLOCK = /[฀-๿]/;

const REQUIRED_TOPICS: ThaiMedicalTopic[] = [
  "symptoms",
  "pain",
  "allergy",
  "medicine",
  "dosage",
  "emergency",
  "appointment",
  "insurance",
  "hospital_desk",
  "pharmacy",
  "cannot_understand",
  "need_interpreter",
];

describe("Thai medical/pharmacy pack — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(thaiMedicalPharmacy)).toBe(true);
    expect(namedExport).toBe(thaiMedicalPharmacy);
  });
});

describe("Thai medical/pharmacy pack — size and ids", () => {
  it("has 50–100 items", () => {
    expect(thaiMedicalPharmacy.length).toBeGreaterThanOrEqual(50);
    expect(thaiMedicalPharmacy.length).toBeLessThanOrEqual(100);
  });

  it("every id is unique and non-empty", () => {
    const ids = thaiMedicalPharmacy.map((i) => i.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai medical/pharmacy pack — topic coverage", () => {
  it("covers all 12 required topics", () => {
    const present = new Set(thaiMedicalPharmacy.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(present.has(t), `missing topic: ${t}`).toBe(true);
    }
  });

  it("THAI_MEDICAL_TOPICS matches the required set", () => {
    expect([...THAI_MEDICAL_TOPICS].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });
});

describe("Thai medical/pharmacy pack — per-item invariants", () => {
  it("every item has Thai script, romanization, VI + EN meaning", () => {
    for (const i of thaiMedicalPharmacy) {
      expect(i.th, `${i.id} missing Thai`).toMatch(THAI_BLOCK);
      expect(i.rtgs.length, `${i.id} missing romanization`).toBeGreaterThan(0);
      expect(i.vi.length, `${i.id} missing VI`).toBeGreaterThan(0);
      expect(i.en.length, `${i.id} missing EN`).toBeGreaterThan(0);
    }
  });

  it("optional notes, when present, are non-empty strings", () => {
    for (const i of thaiMedicalPharmacy) {
      if (i.note_vi !== undefined) expect(i.note_vi.length).toBeGreaterThan(0);
      if (i.note_en !== undefined) expect(i.note_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai medical/pharmacy pack — breadth sanity", () => {
  it("every required topic has at least 3 items", () => {
    for (const t of REQUIRED_TOPICS) {
      const n = thaiMedicalPharmacy.filter((i) => i.topic === t).length;
      expect(n, `too few items for ${t}`).toBeGreaterThanOrEqual(3);
    }
  });
});
