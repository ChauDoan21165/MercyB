// src/languages/punjabi/__tests__/punjabiScriptVocabularyArchiveSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary archive samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SCOPE,
  type PunjabiArchiveFocus,
} from "@/languages/punjabi/scriptVocabularyArchiveSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiArchiveFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "archive_closure",
];

describe("Punjabi script vocabulary archive samples", () => {
  it("is compact app-consumable TypeScript archive data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.length).toBeGreaterThanOrEqual(18);
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.length).toBeLessThanOrEqual(32);
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SCOPE.archiveDataOnly).toBe(true);
  });

  it("covers all WAVE54 archive focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.map((item) => item.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("uses Gurmukhi primary with Vietnamese and English archive guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.archive_vi.trim().length, `archive vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.archive_en.trim().length, `archive en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and includes useful metadata", () => {
    const ids = new Set(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.map((item) => item.id));
    expect(ids.size).toBe(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.length);
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.filter((item) => item.romanization).length).toBeGreaterThanOrEqual(18);
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.filter((item) => item.learnerTrap).length).toBeGreaterThanOrEqual(6);
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(7);
    expect(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.filter((item) => item.archived).length).toBeGreaterThanOrEqual(6);
  });

  it("uses pre-A11-archive, signoff, seal, pre-integration, and regression stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.map((item) => item.stage));
    expect(stages.has("pre_a11_archive")).toBe(true);
    expect(stages.has("signoff")).toBe(true);
    expect(stages.has("seal")).toBe(true);
    expect(stages.has("pre_integration")).toBe(true);
    expect(stages.has("regression")).toBe(true);
  });

  it("covers core vocabulary and script traps", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES);
    expect(blob).toMatch(/ਪੰਜਾਬੀ ਲਿਖੋ|ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ/);
    expect(blob).toMatch(/ਖਾਣਾ|ਵਕਤ/);
    expect(blob).toMatch(/ਪੁ \/ ਪੂ|ਮੇਰਾ \/ ਮੈਰਾ/);
    expect(blob).toMatch(/ਦਿੱਲੀ|ਕੰਮ ਵਿੱਚ/);
    expect(blob).toMatch(/ਸਾਵਧਾਨ|ਮਦਦ/);
    expect(blob).toMatch(/ਪਤਾ ਬਦਲਣਾ|ਇੰਸ਼ੋਰੈਂਸ ਨੰਬਰ/);
    expect(blob).toMatch(/ਮੈਂ ਭਰਦਾ ਹਾਂ|ਉਹ ਆਉਂਦਾ ਹੈ/);
    expect(blob).toMatch(/ਸਵਾਲ ਪੁੱਛਣਾ|ਜਵਾਬ ਦੇਣਾ/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SCOPE.vi, PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SCOPE.en, JSON.stringify(shahmukhi)].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/does not open a full shahmukhi course|không mở khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|ci config/);
  });
});
