// Punjabi C2 mediation language guards. These validate app-consumable
// structure and scope, not legal/HR advice, certification, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_MEDIATION_LANGUAGE_DISCLAIMER,
  mediationLanguageC2,
  mediationLanguageC2ByFocus,
  type PunjabiC2MediationEntry,
  type PunjabiC2MediationFocus,
} from "@/languages/punjabi/mediationLanguageC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2MediationFocus[] = [
  "summarize_both_sides",
  "reduce_tension",
  "reframe_blame",
  "shared_goal",
  "invite_compromise",
  "preserve_respect",
  "workplace_conflict",
  "community_conflict",
  "public_service_conflict",
];

describe("Punjabi C2 mediation language — coverage", () => {
  it("ships a compact app-consumable mediation pack", () => {
    expect(mediationLanguageC2.length).toBeGreaterThanOrEqual(9);
    expect(mediationLanguageC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required mediation focus", () => {
    const seen = new Set(mediationLanguageC2.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = mediationLanguageC2.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mediationLanguageC2ByFocus returns only matching entries", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = mediationLanguageC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 mediation language — bilingual integrity", () => {
  it("each entry has VI+EN conflict context and mediation goal", () => {
    for (const entry of mediationLanguageC2) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.conflict_context_vi.length, `${entry.id} context_vi`).toBeGreaterThan(0);
      expect(entry.conflict_context_en.length, `${entry.id} context_en`).toBeGreaterThan(0);
      expect(entry.mediation_goal_vi.length, `${entry.id} goal_vi`).toBeGreaterThan(0);
      expect(entry.mediation_goal_en.length, `${entry.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const entry of mediationLanguageC2) {
      expect(hasGurmukhi(entry.model_gurmukhi), `${entry.id} model_gurmukhi`).toBe(true);
      expect(entry.model_romanization.length, `${entry.id} model_romanization`).toBeGreaterThan(0);
      expect(entry.model_vi.length, `${entry.id} model_vi`).toBeGreaterThan(0);
      expect(entry.model_en.length, `${entry.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const entry of mediationLanguageC2) {
      expect(entry.phrases.length, `${entry.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of entry.phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${entry.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${entry.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${entry.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${entry.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes final-quality, review, remediation, and readiness style items", () => {
    const modes = new Set(mediationLanguageC2.map((entry) => entry.mode));
    expect(modes.has("final_quality")).toBe(true);
    expect(modes.has("review")).toBe(true);
    expect(modes.has("remediation")).toBe(true);
    expect(modes.has("readiness")).toBe(true);
    for (const entry of mediationLanguageC2) {
      expect(entry.checkpoints.length, `${entry.id} checkpoints`).toBeGreaterThanOrEqual(1);
      expect(entry.remediation.next_review_vi.length, `${entry.id} remediation vi`).toBeGreaterThan(0);
      expect(entry.remediation.next_review_en.length, `${entry.id} remediation en`).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(mediationLanguageC2.filter((entry) => entry.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaEntries = mediationLanguageC2.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 mediation language — scope framing", () => {
  it("exposes study-support, no-advice, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_MEDIATION_LANGUAGE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_MEDIATION_LANGUAGE_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_MEDIATION_LANGUAGE_DISCLAIMER.vi} ${C2_MEDIATION_LANGUAGE_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not legal");
    expect(disclaimer).toContain("not");
    expect(disclaimer).toContain("advice");
    expect(disclaimer).toContain("not");
    expect(disclaimer).toContain("certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in entries", () => {
    const blob = JSON.stringify(mediationLanguageC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2MediationEntry[] = mediationLanguageC2;
void _typecheck;
