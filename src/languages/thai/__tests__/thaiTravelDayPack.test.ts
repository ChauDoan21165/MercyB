// src/languages/thai/__tests__/thaiTravelDayPack.test.ts
//
// Structure guard for the Thai travel-day pack (Wave 4).
//
// Pins the task requirements:
//   • 60–120 compact items
//   • Thai script + romanization on phrase AND backup
//   • Vietnamese + English meaning on phrase AND backup
//   • scenario (VI + EN), show-this-card Thai text, common mistake (VI + EN)
//   • all 12 travel-day categories present
//
// Everything is derived from the data at runtime, so the suite stays green
// as content is refined and fails only on a structural regression.

import { describe, it, expect } from "vitest";

import thaiTravelDayPack, {
  thaiTravelDayPack as namedExport,
  THAI_TRAVEL_CATEGORIES,
  type ThaiTravelCategory,
} from "@/languages/thai/travelDayPack";

const THAI_BLOCK = /[฀-๿]/;

const REQUIRED_CATEGORIES: ThaiTravelCategory[] = [
  "airport",
  "immigration",
  "taxi",
  "hotel",
  "food",
  "shopping",
  "transport",
  "money",
  "emergency",
  "directions",
  "sim_phone",
  "small_talk",
];

describe("Thai travel-day pack — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(thaiTravelDayPack)).toBe(true);
    expect(namedExport).toBe(thaiTravelDayPack);
  });
});

describe("Thai travel-day pack — size and ids", () => {
  it("has 60–120 items", () => {
    expect(thaiTravelDayPack.length).toBeGreaterThanOrEqual(60);
    expect(thaiTravelDayPack.length).toBeLessThanOrEqual(120);
  });

  it("every id is unique and non-empty", () => {
    const ids = thaiTravelDayPack.map((i) => i.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai travel-day pack — category coverage", () => {
  it("covers all 12 required categories", () => {
    const present = new Set(thaiTravelDayPack.map((i) => i.category));
    for (const c of REQUIRED_CATEGORIES) {
      expect(present.has(c), `missing category: ${c}`).toBe(true);
    }
  });

  it("THAI_TRAVEL_CATEGORIES matches the required set", () => {
    expect([...THAI_TRAVEL_CATEGORIES].sort()).toEqual(
      [...REQUIRED_CATEGORIES].sort(),
    );
  });
});

describe("Thai travel-day pack — per-item invariants", () => {
  it("phrase has Thai script + romanization + VI + EN", () => {
    for (const i of thaiTravelDayPack) {
      expect(i.th, `${i.id} phrase missing Thai`).toMatch(THAI_BLOCK);
      expect(i.rtgs.length, `${i.id} phrase missing romanization`).toBeGreaterThan(0);
      expect(i.vi.length, `${i.id} phrase missing VI`).toBeGreaterThan(0);
      expect(i.en.length, `${i.id} phrase missing EN`).toBeGreaterThan(0);
    }
  });

  it("backup phrase has Thai script + romanization + VI + EN", () => {
    for (const i of thaiTravelDayPack) {
      expect(i.backup_th, `${i.id} backup missing Thai`).toMatch(THAI_BLOCK);
      expect(i.backup_rtgs.length, `${i.id} backup missing romanization`).toBeGreaterThan(0);
      expect(i.backup_vi.length, `${i.id} backup missing VI`).toBeGreaterThan(0);
      expect(i.backup_en.length, `${i.id} backup missing EN`).toBeGreaterThan(0);
    }
  });

  it("has scenario (VI + EN), a Thai show-this-card text, and a common mistake (VI + EN)", () => {
    for (const i of thaiTravelDayPack) {
      expect(i.scenario_vi.length, `${i.id} missing scenario_vi`).toBeGreaterThan(0);
      expect(i.scenario_en.length, `${i.id} missing scenario_en`).toBeGreaterThan(0);
      expect(i.show_card_th, `${i.id} show_card not Thai`).toMatch(THAI_BLOCK);
      expect(i.mistake_vi.length, `${i.id} missing mistake_vi`).toBeGreaterThan(0);
      expect(i.mistake_en.length, `${i.id} missing mistake_en`).toBeGreaterThan(0);
    }
  });
});

describe("Thai travel-day pack — breadth sanity", () => {
  it("every required category has at least 3 items", () => {
    for (const c of REQUIRED_CATEGORIES) {
      const n = thaiTravelDayPack.filter((i) => i.category === c).length;
      expect(n, `too few items in ${c}`).toBeGreaterThanOrEqual(3);
    }
  });
});
