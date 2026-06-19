// Thai risky-phrase safety guide — structural, coverage, and safety guards.
//
// These tests pin the SHAPE and completeness of the guide, not its linguistic
// correctness (native review is deferred). They guard: count (40–80), topic
// coverage, the required four parts per entry (risky / why / safer / context),
// Thai script on every `safer` phrase, Thai script on utterance-based `risky`
// phrases, valid severity, and the not-native-certified / no-stereotype framing.

import { describe, it, expect } from "vitest";

import {
  entries,
  entriesByTopic,
  entriesBySeverity,
  TOPIC_ORDER,
  RISKY_PHRASES_DISCLAIMER,
  type RiskTopic,
  type RiskSeverity,
} from "@/languages/thai/riskyPhrases";

const THAI_RANGE = /[฀-๿]/;
const hasThai = (s?: string) => Boolean(s && THAI_RANGE.test(s));

const REQUIRED_TOPICS: RiskTopic[] = [
  "rude_pronouns",
  "too_direct_commands",
  "status_hierarchy",
  "apology",
  "refusal",
  "temple_formal",
  "workplace_respect",
];

const SEVERITIES: RiskSeverity[] = ["low", "medium", "high"];

describe("Thai risky phrases — batch size & coverage", () => {
  it("contains 40–80 entries", () => {
    expect(entries.length).toBeGreaterThanOrEqual(40);
    expect(entries.length).toBeLessThanOrEqual(80);
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

describe("Thai risky phrases — per-entry integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = entries.map((e) => e.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each entry has the four required parts: risky, why, safer, context", () => {
    for (const e of entries) {
      // risky (VI + EN description always present)
      expect(e.risky.vi.length, `${e.id} risky.vi`).toBeGreaterThan(0);
      expect(e.risky.en.length, `${e.id} risky.en`).toBeGreaterThan(0);
      // why risky (VI + EN)
      expect(e.why_risky_vi.length, `${e.id} why_risky_vi`).toBeGreaterThan(0);
      expect(e.why_risky_en.length, `${e.id} why_risky_en`).toBeGreaterThan(0);
      // safer alternative (VI + EN)
      expect(e.safer.vi.length, `${e.id} safer.vi`).toBeGreaterThan(0);
      expect(e.safer.en.length, `${e.id} safer.en`).toBeGreaterThan(0);
      // context note (VI + EN)
      expect(e.context_vi.length, `${e.id} context_vi`).toBeGreaterThan(0);
      expect(e.context_en.length, `${e.id} context_en`).toBeGreaterThan(0);
    }
  });

  it("every `safer` alternative carries Thai script", () => {
    for (const e of entries) {
      expect(hasThai(e.safer.thai), `${e.id} safer.thai: ${e.safer.thai}`).toBe(true);
    }
  });

  it("utterance-based `risky` phrases carry Thai script (when thai is set)", () => {
    for (const e of entries) {
      if (e.risky.thai !== undefined) {
        expect(hasThai(e.risky.thai), `${e.id} risky.thai: ${e.risky.thai}`).toBe(true);
      }
    }
  });

  it("most entries are utterance-based (majority have risky Thai script)", () => {
    const withThai = entries.filter((e) => hasThai(e.risky.thai)).length;
    expect(withThai).toBeGreaterThanOrEqual(Math.ceil(entries.length / 2));
  });

  it("every entry has a valid severity", () => {
    for (const e of entries) {
      expect(SEVERITIES.includes(e.severity), `${e.id} severity ${e.severity}`).toBe(true);
    }
  });

  it("entriesBySeverity partitions the set", () => {
    const total = SEVERITIES.reduce((n, s) => n + entriesBySeverity(s).length, 0);
    expect(total).toBe(entries.length);
  });
});

describe("Thai risky phrases — safe framing", () => {
  it("exposes a bilingual not-native-certified, no-stereotype disclaimer", () => {
    expect(RISKY_PHRASES_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(RISKY_PHRASES_DISCLAIMER.en.length).toBeGreaterThan(0);
    const en = RISKY_PHRASES_DISCLAIMER.en.toLowerCase();
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
