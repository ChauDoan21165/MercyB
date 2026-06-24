import { describe, expect, it } from "vitest";

import punjabiEmergencyCards, {
  PUNJABI_EMERGENCY_TOPICS,
  punjabiEmergencyCards as namedExport,
  type PunjabiEmergencyTopic,
} from "@/languages/punjabi/emergencyCards";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_TOPICS: PunjabiEmergencyTopic[] = [
  "medical_emergency",
  "allergy",
  "lost_passport_id",
  "police_help",
  "accident",
  "lost_child",
  "domestic_danger",
  "cannot_speak_punjabi",
  "need_interpreter",
  "call_embassy_office",
  "address_taxi",
  "urgent_pharmacy",
];

describe("Punjabi emergency cards — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(punjabiEmergencyCards)).toBe(true);
    expect(namedExport).toBe(punjabiEmergencyCards);
  });
});

describe("Punjabi emergency cards — size and ids", () => {
  it("has 30-60 cards", () => {
    expect(punjabiEmergencyCards.length).toBeGreaterThanOrEqual(30);
    expect(punjabiEmergencyCards.length).toBeLessThanOrEqual(60);
  });

  it("has unique, non-empty ids", () => {
    const ids = punjabiEmergencyCards.map((card) => card.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Punjabi emergency cards — required topic coverage", () => {
  it("covers every required crisis topic", () => {
    const present = new Set(punjabiEmergencyCards.map((card) => card.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(present.has(topic), `missing topic: ${topic}`).toBe(true);
    }
  });

  it("PUNJABI_EMERGENCY_TOPICS matches the required set", () => {
    expect([...PUNJABI_EMERGENCY_TOPICS].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });
});

describe("Punjabi emergency cards — per-card invariants", () => {
  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const card of punjabiEmergencyCards) {
      expect(card.pa).toMatch(GURMUKHI_BLOCK);
      expect(card.roman.length).toBeGreaterThan(0);
      expect(card.vi.length).toBeGreaterThan(0);
      expect(card.en.length).toBeGreaterThan(0);
    }
  });

  it("has show_text lines in Gurmukhi for direct use", () => {
    for (const card of punjabiEmergencyCards) {
      expect(card.show_text).toMatch(GURMUKHI_BLOCK);
      expect(card.show_text.length).toBeGreaterThan(0);
    }
  });

  it("keeps optional notes non-empty when present", () => {
    for (const card of punjabiEmergencyCards) {
      if (card.note_vi !== undefined) expect(card.note_vi.length).toBeGreaterThan(0);
      if (card.note_en !== undefined) expect(card.note_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi emergency cards — breadth sanity", () => {
  it("gives each required topic at least 3 cards", () => {
    for (const topic of REQUIRED_TOPICS) {
      const count = punjabiEmergencyCards.filter((card) => card.topic === topic).length;
      expect(count, `too few cards for ${topic}`).toBeGreaterThanOrEqual(3);
    }
  });
});
