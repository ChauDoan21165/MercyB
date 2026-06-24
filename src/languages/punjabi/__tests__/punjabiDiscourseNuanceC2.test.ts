// Punjabi C2 discourse nuance practice guards. These validate app-consumable
// structure and scope, not native-level linguistic authority.

import { describe, expect, it } from "vitest";

import {
  C2_DISCOURSE_NUANCE_DISCLAIMER,
  discourseNuanceByFocus,
  discourseNuanceC2Entries,
  type PunjabiC2NuanceEntry,
  type PunjabiC2NuanceFocus,
} from "@/languages/punjabi/discourseNuanceC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2NuanceFocus[] = [
  "hedging",
  "diplomatic_disagreement",
  "misunderstanding_repair",
  "sensitive_topics",
  "formal_warm_tone",
  "storytelling_transitions",
  "persuasive_sequence",
  "public_community_register",
];

describe("Punjabi C2 discourse nuance — coverage", () => {
  it("ships a compact app-consumable entry set", () => {
    expect(discourseNuanceC2Entries.length).toBeGreaterThanOrEqual(8);
    expect(discourseNuanceC2Entries.length).toBeLessThanOrEqual(14);
  });

  it("covers every required C2 nuance focus", () => {
    const seen = new Set(discourseNuanceC2Entries.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = discourseNuanceC2Entries.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("discourseNuanceByFocus returns only matching entries", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = discourseNuanceByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 discourse nuance — bilingual data integrity", () => {
  it("each entry has VI+EN titles, context, and discourse move", () => {
    for (const entry of discourseNuanceC2Entries) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.context_vi.length, `${entry.id} context_vi`).toBeGreaterThan(0);
      expect(entry.context_en.length, `${entry.id} context_en`).toBeGreaterThan(0);
      expect(entry.discourse_move_vi.length, `${entry.id} move_vi`).toBeGreaterThan(0);
      expect(entry.discourse_move_en.length, `${entry.id} move_en`).toBeGreaterThan(0);
    }
  });

  it("each entry has Gurmukhi model text, romanization, and VI+EN translations", () => {
    for (const entry of discourseNuanceC2Entries) {
      expect(hasGurmukhi(entry.model_gurmukhi), `${entry.id} model_gurmukhi`).toBe(true);
      expect(entry.model_romanization.length, `${entry.id} model_romanization`).toBeGreaterThan(0);
      expect(entry.model_vi.length, `${entry.id} model_vi`).toBeGreaterThan(0);
      expect(entry.model_en.length, `${entry.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each entry includes useful phrase blocks with Gurmukhi, romanization, VI, and EN", () => {
    for (const entry of discourseNuanceC2Entries) {
      expect(entry.phrases.length, `${entry.id} phrase count`).toBeGreaterThanOrEqual(2);
      for (const phrase of entry.phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${entry.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${entry.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${entry.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${entry.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes common learner traps where useful", () => {
    const withTrap = discourseNuanceC2Entries.filter((entry) => entry.learner_trap).length;
    expect(withTrap).toBeGreaterThanOrEqual(5);
  });

  it("includes Canada-practical examples", () => {
    const canadaEntries = discourseNuanceC2Entries.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 discourse nuance — scope framing", () => {
  it("exposes Gurmukhi-primary, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_DISCOURSE_NUANCE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_DISCOURSE_NUANCE_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer = `${C2_DISCOURSE_NUANCE_DISCLAIMER.vi} ${C2_DISCOURSE_NUANCE_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review or certification in entry text", () => {
    const blob = JSON.stringify(discourseNuanceC2Entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiC2NuanceEntry[] = discourseNuanceC2Entries;
void _typecheck;
