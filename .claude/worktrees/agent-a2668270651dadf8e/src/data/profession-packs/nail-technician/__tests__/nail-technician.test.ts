// src/data/profession-packs/nail-technician/__tests__/nail-technician.test.ts

import { describe, expect, it } from "vitest";

import NAIL_PACK, {
  type Phrase,
  type Scenario,
  type Vocabulary,
} from "../index";

const VALID_POS = ["noun", "verb", "adjective", "phrase"];
const VALID_REGISTERS = [
  "greeting",
  "service",
  "upsell",
  "complaint",
  "closing",
  "tip",
];

describe("NAIL_TECHNICIAN_PACK — top-level shape", () => {
  it("has the expected slug + title fields", () => {
    expect(NAIL_PACK.slug).toBe("nail-tech");
    expect(NAIL_PACK.title_vi.trim().length).toBeGreaterThan(0);
    expect(NAIL_PACK.title_en.trim().length).toBeGreaterThan(0);
    expect(NAIL_PACK.intro_vi.trim().length).toBeGreaterThan(0);
  });
});

describe("NAIL_TECHNICIAN_PACK — counts within brief", () => {
  it("vocabulary is 30–100 entries", () => {
    expect(NAIL_PACK.vocabulary.length).toBeGreaterThanOrEqual(30);
    expect(NAIL_PACK.vocabulary.length).toBeLessThanOrEqual(100);
  });

  it("phrases are 20–30 entries", () => {
    expect(NAIL_PACK.phrases.length).toBeGreaterThanOrEqual(20);
    expect(NAIL_PACK.phrases.length).toBeLessThanOrEqual(30);
  });

  it("scenarios are 5–8 mini-dialogues", () => {
    expect(NAIL_PACK.scenarios.length).toBeGreaterThanOrEqual(5);
    expect(NAIL_PACK.scenarios.length).toBeLessThanOrEqual(8);
  });

  it("at least 10 pronunciation traps", () => {
    expect(NAIL_PACK.pronunciation.length).toBeGreaterThanOrEqual(10);
  });

  it("at least 5 L1 overrides", () => {
    expect(NAIL_PACK.l1_overrides.length).toBeGreaterThanOrEqual(5);
  });
});

describe("NAIL_TECHNICIAN_PACK — vocabulary entries", () => {
  it.each(NAIL_PACK.vocabulary)(
    "$en is bilingual + valid POS",
    (entry: Vocabulary) => {
      expect(entry.en.trim().length).toBeGreaterThan(0);
      expect(entry.vi.trim().length).toBeGreaterThan(0);
      expect(VALID_POS).toContain(entry.pos);
    },
  );

  it("vocabulary slugs are unique on the English term", () => {
    const seen = new Set<string>();
    for (const v of NAIL_PACK.vocabulary) {
      expect(seen.has(v.en)).toBe(false);
      seen.add(v.en);
    }
  });
});

describe("NAIL_TECHNICIAN_PACK — phrase entries", () => {
  it.each(NAIL_PACK.phrases)(
    "$register phrase is bilingual + has when_to_use",
    (phrase: Phrase) => {
      expect(phrase.en.trim().length).toBeGreaterThan(0);
      expect(phrase.vi.trim().length).toBeGreaterThan(0);
      expect(VALID_REGISTERS).toContain(phrase.register);
      expect(phrase.when_to_use_vi.trim().length).toBeGreaterThan(0);
    },
  );

  it("includes at least one phrase from each functional register", () => {
    const registers = new Set(NAIL_PACK.phrases.map((p) => p.register));
    expect(registers.has("greeting")).toBe(true);
    expect(registers.has("service")).toBe(true);
    expect(registers.has("upsell")).toBe(true);
    expect(registers.has("complaint")).toBe(true);
    expect(registers.has("closing")).toBe(true);
    expect(registers.has("tip")).toBe(true);
  });
});

describe("NAIL_TECHNICIAN_PACK — scenarios", () => {
  it.each(NAIL_PACK.scenarios)(
    "$slug has 4+ alternating turns + bilingual lines",
    (scenario: Scenario) => {
      expect(scenario.turns.length).toBeGreaterThanOrEqual(4);
      for (const turn of scenario.turns) {
        expect(["tech", "customer"]).toContain(turn.speaker);
        expect(turn.en.trim().length).toBeGreaterThan(0);
        expect(turn.vi.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it("scenario slugs are URL-safe + unique", () => {
    const slugs = new Set<string>();
    for (const s of NAIL_PACK.scenarios) {
      expect(s.slug).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(slugs.has(s.slug)).toBe(false);
      slugs.add(s.slug);
    }
  });

  it("includes the canonical scenarios named in the brief", () => {
    const slugs = NAIL_PACK.scenarios.map((s) => s.slug);
    // Must include greeting, complaint, payment/tip — the rest are
    // hand-crafted picks by the author.
    expect(slugs).toContain("greeting-and-allergy-check");
    expect(slugs).toContain("handling-complaint");
    expect(slugs).toContain("payment-and-tip-respectful");
  });
});

describe("NAIL_TECHNICIAN_PACK — pronunciation + L1", () => {
  it("each pronunciation trap has an IPA hint and VN explanation", () => {
    for (const p of NAIL_PACK.pronunciation) {
      expect(p.word.trim().length).toBeGreaterThan(0);
      expect(p.ipa_hint.trim().length).toBeGreaterThan(0);
      expect(p.vn_trap_vi.trim().length).toBeGreaterThan(0);
    }
  });

  it("each L1 override has wrong + right examples in English", () => {
    for (const o of NAIL_PACK.l1_overrides) {
      expect(o.tag).toMatch(/^vi_nail_/);
      expect(o.name_vi.trim().length).toBeGreaterThan(0);
      expect(o.why_vi.trim().length).toBeGreaterThan(0);
      expect(o.example_wrong.trim().length).toBeGreaterThan(0);
      expect(o.example_right.trim().length).toBeGreaterThan(0);
      expect(o.example_wrong).not.toBe(o.example_right);
    }
  });
});
