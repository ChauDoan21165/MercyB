// src/languages/thai/__tests__/thaiEmergencyCards.test.ts
//
// Structure guard for the Thai emergency "show this phrase" cards (Wave 3).
//
// Pins the task requirements:
//   • 30–60 compact emergency cards
//   • Thai script + romanization on every card
//   • Vietnamese + English meaning on every card
//   • a "show this phrase" Thai line (show_text) on every card
//   • all 12 required crisis topics present
//
// All assertions derive from the data at runtime, so the suite stays green
// as content is refined and fails only on a structural regression.

import { describe, it, expect } from "vitest";

import thaiEmergencyCards, {
  thaiEmergencyCards as namedExport,
  THAI_EMERGENCY_TOPICS,
  type ThaiEmergencyTopic,
} from "@/languages/thai/emergencyCards";

const THAI_BLOCK = /[฀-๿]/;

const REQUIRED_TOPICS: ThaiEmergencyTopic[] = [
  "medical_emergency",
  "allergy",
  "lost_passport",
  "police_help",
  "accident",
  "lost_child",
  "domestic_danger",
  "cannot_speak_thai",
  "need_interpreter",
  "call_embassy",
  "address_taxi",
  "urgent_pharmacy",
];

describe("Thai emergency cards — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(thaiEmergencyCards)).toBe(true);
    expect(namedExport).toBe(thaiEmergencyCards);
  });
});

describe("Thai emergency cards — size and ids", () => {
  it("has 30–60 cards", () => {
    expect(thaiEmergencyCards.length).toBeGreaterThanOrEqual(30);
    expect(thaiEmergencyCards.length).toBeLessThanOrEqual(60);
  });

  it("every id is unique and non-empty", () => {
    const ids = thaiEmergencyCards.map((c) => c.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai emergency cards — required topic coverage", () => {
  it("covers all 12 required crisis topics", () => {
    const present = new Set(thaiEmergencyCards.map((c) => c.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(present.has(t), `missing topic: ${t}`).toBe(true);
    }
  });

  it("THAI_EMERGENCY_TOPICS matches the required set", () => {
    expect([...THAI_EMERGENCY_TOPICS].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });
});

describe("Thai emergency cards — per-card invariants", () => {
  it("every card has Thai script (th), romanization, VI + EN meaning", () => {
    for (const c of thaiEmergencyCards) {
      expect(c.th, `${c.id} missing Thai`).toMatch(THAI_BLOCK);
      expect(c.rtgs.length, `${c.id} missing romanization`).toBeGreaterThan(0);
      expect(c.vi.length, `${c.id} missing VI`).toBeGreaterThan(0);
      expect(c.en.length, `${c.id} missing EN`).toBeGreaterThan(0);
    }
  });

  it("every card has a 'show this phrase' Thai-script show_text", () => {
    for (const c of thaiEmergencyCards) {
      expect(c.show_text, `${c.id} missing show_text`).toMatch(THAI_BLOCK);
      expect(c.show_text.length).toBeGreaterThan(0);
    }
  });

  it("optional notes, when present, are non-empty strings", () => {
    for (const c of thaiEmergencyCards) {
      if (c.note_vi !== undefined) expect(c.note_vi.length).toBeGreaterThan(0);
      if (c.note_en !== undefined) expect(c.note_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai emergency cards — breadth sanity", () => {
  it("every required topic has at least 3 cards", () => {
    for (const t of REQUIRED_TOPICS) {
      const n = thaiEmergencyCards.filter((c) => c.topic === t).length;
      expect(n, `too few cards for ${t}`).toBeGreaterThanOrEqual(3);
    }
  });
});
