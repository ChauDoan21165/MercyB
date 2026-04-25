// src/data/__tests__/bilingual-sentences.test.ts
//
// Invariants for the Round-5 bilingual sentence library. Enforces:
//   - Exactly 200 sentences.
//   - Topic counts: travel 40, medical 40, immigration 35, school 35,
//     news 30, relationships 20.
//   - CEFR counts: A2 40, B1 60, B2 80, C1 20.
//   - ALL immigration + medical sentences carry `needs_review: true`
//     (Chau personally verifies these before merge per the content
//     brief — high-stakes domains).
//   - Every id is unique and matches the expected pattern.
//   - Every l1_rule_ids entry is a catalog tag (prevents typos and
//     drift from CC3's rule-id rounds).
//   - Content rules (no Vietnam-politics tripwire terms, no adult
//     content markers) — string-level sanity check.

import { describe, expect, it } from "vitest";

import {
  BILINGUAL_SENTENCES,
  BILINGUAL_TOPICS,
  BILINGUAL_CEFR_LEVELS,
  type BilingualTopic,
  type BilingualCefr,
} from "../bilingualSentencesSchema";
import { ALL_WEAKNESS_TAGS } from "@/lib/weakness/weakness-catalog";

const EXPECTED_TOPIC_COUNTS: Record<BilingualTopic, number> = {
  travel: 40,
  medical: 40,
  immigration: 35,
  school: 35,
  news: 30,
  relationships: 20,
};

const EXPECTED_CEFR_COUNTS: Record<BilingualCefr, number> = {
  A2: 40,
  B1: 60,
  B2: 80,
  C1: 20,
};

describe("bilingual-sentences count + distribution", () => {
  it("contains exactly 200 sentences", () => {
    expect(BILINGUAL_SENTENCES.length).toBe(200);
  });

  it("matches the agreed topic distribution exactly", () => {
    const counts = Object.fromEntries(
      BILINGUAL_TOPICS.map((t) => [t, 0]),
    ) as Record<BilingualTopic, number>;
    for (const s of BILINGUAL_SENTENCES) counts[s.topic] += 1;
    expect(counts).toEqual(EXPECTED_TOPIC_COUNTS);
  });

  it("matches the agreed CEFR distribution exactly", () => {
    const counts = Object.fromEntries(
      BILINGUAL_CEFR_LEVELS.map((c) => [c, 0]),
    ) as Record<BilingualCefr, number>;
    for (const s of BILINGUAL_SENTENCES) counts[s.cefr_level] += 1;
    expect(counts).toEqual(EXPECTED_CEFR_COUNTS);
  });
});

describe("bilingual-sentences identifiers", () => {
  it("every id is unique", () => {
    const ids = BILINGUAL_SENTENCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids are sequential bs_001..bs_200", () => {
    const sorted = [...BILINGUAL_SENTENCES.map((s) => s.id)].sort();
    const expected = Array.from(
      { length: 200 },
      (_, i) => `bs_${String(i + 1).padStart(3, "0")}`,
    );
    expect(sorted).toEqual(expected);
  });
});

describe("bilingual-sentences needs_review policy", () => {
  it("every medical sentence carries needs_review: true", () => {
    const medical = BILINGUAL_SENTENCES.filter((s) => s.topic === "medical");
    expect(medical.length).toBe(40);
    for (const s of medical) {
      expect(s.needs_review, `medical ${s.id} should be needs_review: true`).toBe(true);
    }
  });

  it("every immigration sentence carries needs_review: true", () => {
    const immigration = BILINGUAL_SENTENCES.filter((s) => s.topic === "immigration");
    expect(immigration.length).toBe(35);
    for (const s of immigration) {
      expect(s.needs_review, `immigration ${s.id} should be needs_review: true`).toBe(true);
    }
  });
});

describe("bilingual-sentences l1_rule_ids", () => {
  it("every tagged rule id exists in WEAKNESS_CATALOG", () => {
    const known = new Set<string>(ALL_WEAKNESS_TAGS);
    for (const s of BILINGUAL_SENTENCES) {
      for (const rule of s.l1_rule_ids) {
        expect(
          known.has(rule),
          `${s.id} references unknown rule ${rule}`,
        ).toBe(true);
      }
    }
  });
});

describe("bilingual-sentences content rules", () => {
  // HARD RULE (content brief): no sentences about Vietnam's government,
  // CCP, Chinese government, named political figures, territorial
  // disputes, protests, or dissidents. Short block-list tripwire.
  const FORBIDDEN_VN_POLITICAL = [
    /\bcommunist\s+party\b/i,
    /\bCCP\b/,
    /\bXi\s+Jinping\b/i,
    /\bTrung\s+C(ộ|o)ng\b/i,
    /\bHoàng\s+Sa\b/i,
    /\bTrường\s+Sa\b/i,
    /\bdissident\b/i,
    /\bprotest(?:er|ers|s)?\b/i,
    /\bĐ(ả|a)ng\s+C(ộ|o)ng\s+s(ả|a)n\b/i,
  ];

  it("no sentence contains Vietnam-politics tripwire terms in EN or VN", () => {
    for (const s of BILINGUAL_SENTENCES) {
      for (const pattern of FORBIDDEN_VN_POLITICAL) {
        expect(pattern.test(s.text_en), `${s.id} EN matches ${pattern}`).toBe(false);
        expect(pattern.test(s.vn_translation), `${s.id} VN matches ${pattern}`).toBe(false);
      }
    }
  });

  it("no sentence contains adult-intimate content markers (relationships capped at small-talk)", () => {
    const FORBIDDEN_ADULT = [
      /\bsex(?:ual|y|ually)?\b/i,
      /\bnude\b/i,
      /\bnaked\b/i,
      /\bintimate\b/i,
    ];
    for (const s of BILINGUAL_SENTENCES) {
      for (const pattern of FORBIDDEN_ADULT) {
        expect(pattern.test(s.text_en), `${s.id} EN matches ${pattern}`).toBe(false);
        expect(pattern.test(s.vn_translation), `${s.id} VN matches ${pattern}`).toBe(false);
      }
    }
  });

  it("every sentence has non-trivial EN + VN text (min 5 chars each)", () => {
    for (const s of BILINGUAL_SENTENCES) {
      expect(s.text_en.trim().length).toBeGreaterThan(5);
      expect(s.vn_translation.trim().length).toBeGreaterThan(5);
    }
  });
});
