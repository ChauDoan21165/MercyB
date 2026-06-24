// src/languages/punjabi/__tests__/punjabiScriptVocabularyCanDoStatements.test.ts
//
// Structural guards for Punjabi script and vocabulary can-do statements.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_CAN_DO_SCOPE,
  PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS,
  type PunjabiCanDoArea,
} from "@/languages/punjabi/scriptVocabularyCanDoStatements";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiCanDoArea> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "thematic_vocabulary",
  "verbs",
  "collocations",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi script and vocabulary can-do statements", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS.length).toBe(REQUIRED_AREAS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.summary_vi.trim().length).toBeGreaterThan(25);
      expect(section.summary_en.trim().length).toBeGreaterThan(25);
      expect(section.statements.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 12 can-do areas", () => {
    const areas = new Set(PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS.map((section) => section.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("has enough compact can-do entries to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with bilingual can-do, evidence, and next steps", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhiAnchor), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.canDo_vi.trim().length, `canDo vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.canDo_en.trim().length, `canDo en for ${item.id}`).toBeGreaterThan(25);
      expect(item.evidence_vi.trim().length, `evidence vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.evidence_en.trim().length, `evidence en for ${item.id}`).toBeGreaterThan(20);
      expect(item.nextStep_vi.trim().length, `next vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.nextStep_en.trim().length, `next en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and statement areas aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS) {
      for (const statement of section.statements) {
        expect(ids.has(statement.id), `duplicate id: ${statement.id}`).toBe(false);
        expect(statement.area).toBe(section.area);
        ids.add(statement.id);
      }
    }
  });

  it("includes romanization, learner traps, Canada examples, checkpoints, and readiness", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.filter((item) => item.canadaPractical);
    const checkpoints = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.filter((item) => item.checkpoint);
    const readiness = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.filter((item) => item.readiness);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(checkpoints.length).toBeGreaterThanOrEqual(6);
    expect(readiness.length).toBeGreaterThanOrEqual(3);
  });

  it("covers marks, signage, themes, verbs, collocations, and romanization bridge", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS
      .map((item) => `${item.area} ${item.gurmukhiAnchor} ${item.romanization ?? ""} ${item.canDo_vi} ${item.canDo_en} ${item.evidence_vi} ${item.evidence_en}`)
      .join(" ");
    expect(blob).toMatch(/addak|ੱ|tippi|ੰ|bindi|ਂ/i);
    expect(blob).toMatch(/ਐਮਰਜੈਂਸੀ|ਨਿਕਾਸ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਪਰਿਵਾਰ|ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝਣਾ/);
    expect(blob).toMatch(/ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS.filter((item) => item.area === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_CAN_DO_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_CAN_DO_SCOPE.en,
      ...shahmukhi.map((item) => `${item.evidence_vi} ${item.evidence_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CAN_DO_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
