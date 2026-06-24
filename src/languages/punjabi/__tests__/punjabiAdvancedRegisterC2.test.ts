// Punjabi C2 advanced register pack guards. These validate structure and
// scope, not native-level linguistic authority.

import { describe, expect, it } from "vitest";

import {
  ADVANCED_REGISTER_C2_DISCLAIMER,
  advancedRegisterC2ByFocus,
  advancedRegisterC2Entries,
  type PunjabiAdvancedRegisterEntry,
  type PunjabiAdvancedRegisterFocus,
} from "@/languages/punjabi/advancedRegisterC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiAdvancedRegisterFocus[] = [
  "warmth",
  "distance",
  "deference",
  "indirectness",
  "disagreement",
  "community_speech",
  "professional_tone",
  "sensitive_topic_framing",
];

describe("Punjabi C2 advanced register — coverage", () => {
  it("ships a compact app-consumable register pack", () => {
    expect(advancedRegisterC2Entries.length).toBeGreaterThanOrEqual(8);
    expect(advancedRegisterC2Entries.length).toBeLessThanOrEqual(14);
  });

  it("covers every required advanced-register focus", () => {
    const seen = new Set(advancedRegisterC2Entries.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = advancedRegisterC2Entries.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("advancedRegisterC2ByFocus returns only matching entries", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = advancedRegisterC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 advanced register — bilingual integrity", () => {
  it("each entry has VI+EN title, goal, and usage guidance", () => {
    for (const entry of advancedRegisterC2Entries) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.register_goal_vi.length, `${entry.id} goal_vi`).toBeGreaterThan(0);
      expect(entry.register_goal_en.length, `${entry.id} goal_en`).toBeGreaterThan(0);
      expect(entry.when_to_use_vi.length, `${entry.id} use_vi`).toBeGreaterThan(0);
      expect(entry.when_to_use_en.length, `${entry.id} use_en`).toBeGreaterThan(0);
    }
  });

  it("each entry has Gurmukhi model text, romanization, and VI+EN rendering", () => {
    for (const entry of advancedRegisterC2Entries) {
      expect(hasGurmukhi(entry.better_gurmukhi), `${entry.id} better_gurmukhi`).toBe(true);
      expect(entry.better_romanization.length, `${entry.id} better_romanization`).toBeGreaterThan(0);
      expect(entry.better_vi.length, `${entry.id} better_vi`).toBeGreaterThan(0);
      expect(entry.better_en.length, `${entry.id} better_en`).toBeGreaterThan(0);
    }
  });

  it("each phrase block uses Gurmukhi primary with romanization and bilingual meanings", () => {
    for (const entry of advancedRegisterC2Entries) {
      expect(entry.phrases.length, `${entry.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of entry.phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${entry.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${entry.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${entry.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${entry.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes common learner traps where useful", () => {
    const withTrap = advancedRegisterC2Entries.filter((entry) => entry.learner_trap).length;
    expect(withTrap).toBeGreaterThanOrEqual(5);
  });

  it("includes too-plain contrasts for register tuning", () => {
    const withPlainContrast = advancedRegisterC2Entries.filter((entry) => entry.too_plain).length;
    expect(withPlainContrast).toBeGreaterThanOrEqual(5);
  });

  it("includes Canada-practical examples", () => {
    const canadaEntries = advancedRegisterC2Entries.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 advanced register — scope framing", () => {
  it("exposes deferred-review and Shahmukhi-awareness disclaimer", () => {
    expect(ADVANCED_REGISTER_C2_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(ADVANCED_REGISTER_C2_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${ADVANCED_REGISTER_C2_DISCLAIMER.vi} ${ADVANCED_REGISTER_C2_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review or certification in entry text", () => {
    const blob = JSON.stringify(advancedRegisterC2Entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiAdvancedRegisterEntry[] = advancedRegisterC2Entries;
void _typecheck;
