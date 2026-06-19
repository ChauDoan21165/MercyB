// Thai nuance & softener bank — structural, coverage, and safety guards.
//
// These tests pin the SHAPE and completeness of the softener bank, not its
// linguistic correctness (native review is deferred). They guard: count
// (50–100), topic coverage, the five required parts per entry (direct / softer
// / when-to-use / risk-note / example), Thai script on every direct, softer,
// and example phrase, bilingual fields, and the not-native-certified /
// no-stereotype framing.

import { describe, it, expect } from "vitest";

import {
  entries,
  entriesByTopic,
  TOPIC_ORDER,
  NUANCE_SOFTENERS_DISCLAIMER,
  type SoftenerTopic,
} from "@/languages/thai/nuanceSofteners";

const THAI_RANGE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RANGE.test(s);

const REQUIRED_TOPICS: SoftenerTopic[] = [
  "request",
  "refusal",
  "disagreement",
  "complaint",
  "apology",
  "suggestion",
  "reminder",
  "workplace_respect",
];

describe("Thai nuance/softeners — batch size & coverage", () => {
  it("contains 50–100 entries", () => {
    expect(entries.length).toBeGreaterThanOrEqual(50);
    expect(entries.length).toBeLessThanOrEqual(100);
  });

  it("covers every required topic at least once", () => {
    const seen = new Set(entries.map((e) => e.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(seen.has(t), `missing topic: ${t}`).toBe(true);
    }
  });

  it("TOPIC_ORDER lists exactly the required topics", () => {
    expect([...TOPIC_ORDER].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });

  it("entriesByTopic returns only matching entries", () => {
    for (const t of REQUIRED_TOPICS) {
      const subset = entriesByTopic(t);
      expect(subset.length).toBeGreaterThan(0);
      expect(subset.every((e) => e.topic === t)).toBe(true);
    }
  });
});

describe("Thai nuance/softeners — per-entry integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = entries.map((e) => e.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each entry has the five required parts, bilingual", () => {
    for (const e of entries) {
      // direct phrase
      expect(e.direct.vi.length, `${e.id} direct.vi`).toBeGreaterThan(0);
      expect(e.direct.en.length, `${e.id} direct.en`).toBeGreaterThan(0);
      // softer phrase
      expect(e.softer.vi.length, `${e.id} softer.vi`).toBeGreaterThan(0);
      expect(e.softer.en.length, `${e.id} softer.en`).toBeGreaterThan(0);
      // when to use
      expect(e.when_to_use_vi.length, `${e.id} when_to_use_vi`).toBeGreaterThan(0);
      expect(e.when_to_use_en.length, `${e.id} when_to_use_en`).toBeGreaterThan(0);
      // risk note
      expect(e.risk_note_vi.length, `${e.id} risk_note_vi`).toBeGreaterThan(0);
      expect(e.risk_note_en.length, `${e.id} risk_note_en`).toBeGreaterThan(0);
      // example
      expect(e.example.vi.length, `${e.id} example.vi`).toBeGreaterThan(0);
      expect(e.example.en.length, `${e.id} example.en`).toBeGreaterThan(0);
    }
  });

  it("every direct, softer, and example phrase carries Thai script + romanization", () => {
    for (const e of entries) {
      expect(hasThai(e.direct.thai), `${e.id} direct.thai`).toBe(true);
      expect(e.direct.rtgs.length, `${e.id} direct.rtgs`).toBeGreaterThan(0);
      expect(hasThai(e.softer.thai), `${e.id} softer.thai`).toBe(true);
      expect(e.softer.rtgs.length, `${e.id} softer.rtgs`).toBeGreaterThan(0);
      expect(hasThai(e.example.thai), `${e.id} example.thai`).toBe(true);
      expect(e.example.rtgs.length, `${e.id} example.rtgs`).toBeGreaterThan(0);
    }
  });

  it("softer phrase differs from the direct phrase", () => {
    for (const e of entries) {
      expect(e.softer.thai, `${e.id} softer == direct`).not.toBe(e.direct.thai);
    }
  });
});

describe("Thai nuance/softeners — safe framing", () => {
  it("exposes a bilingual not-native-certified, no-stereotype disclaimer", () => {
    expect(NUANCE_SOFTENERS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(NUANCE_SOFTENERS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const en = NUANCE_SOFTENERS_DISCLAIMER.en.toLowerCase();
    expect(en).toContain("not native-certified");
    expect(en).toContain("deferred");
    expect(en).toContain("stereotype");
  });

  it("makes no native-review claim in entry text", () => {
    const blob = JSON.stringify(entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});
