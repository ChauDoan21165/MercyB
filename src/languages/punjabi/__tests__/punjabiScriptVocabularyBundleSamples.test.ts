// src/languages/punjabi/__tests__/punjabiScriptVocabularyBundleSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary bundle samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SCOPE,
  type PunjabiBundleFocus,
} from "@/languages/punjabi/scriptVocabularyBundleSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiBundleFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "bundle_closure",
];

describe("Punjabi script vocabulary bundle samples", () => {
  it("is compact app-consumable TypeScript bundle data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SCOPE.bundleDataOnly).toBe(true);
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.length).toBeGreaterThanOrEqual(15);
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.length).toBeLessThanOrEqual(30);
  });

  it("covers all WAVE57 bundle focus areas and stages", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.map((item) => item.focus));
    for (const required of REQUIRED_FOCUS) expect(focus.has(required), `missing ${required}`).toBe(true);
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.map((item) => item.stage));
    expect(stages).toEqual(new Set(["pre_a11_bundle", "receipt", "ledger", "pre_integration", "regression"]));
  });

  it("uses Gurmukhi primary with Vietnamese and English guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.bundle_vi.trim().length).toBeGreaterThan(25);
      expect(item.bundle_en.trim().length).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length).toBeGreaterThan(25);
      expect(item.expected_en.trim().length).toBeGreaterThan(25);
    }
  });

  it("includes romanization, traps, Canada examples, and bundle flags", () => {
    expect(new Set(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.map((item) => item.id)).size).toBe(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.length);
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.filter((item) => item.romanization).length).toBeGreaterThanOrEqual(14);
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.filter((item) => item.learnerTrap).length).toBeGreaterThanOrEqual(4);
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(6);
    expect(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.filter((item) => item.bundleReady).length).toBeGreaterThanOrEqual(5);
  });

  it("covers bundle vocabulary, script marks, verbs, and collocations", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ ਪੈਕੇਟ|ਲੂਣ|ਬੇ \/ ਬੈ|ਮਿੱਠਾ ਪਾਣੀ/);
    expect(blob).toMatch(/ਰੁਕੋ|ਇੱਥੇ ਉਡੀਕ ਕਰੋ|ਸਰਕਾਰੀ ਦਫ਼ਤਰ|ਫੀਸ ਭਰਨੀ/);
    expect(blob).toMatch(/ਮੈਂ ਭੇਜਦਾ ਹਾਂ|ਉਹ ਲੱਭਦਾ ਹੈ|ਕੰਮ ਲੱਭਣਾ|ਮਦਦ ਮੰਗਣਾ/);
    expect(blob).toMatch(/ਪੈਕੇਟ ਜਾਂਚ|ਅੰਤਿਮ ਪੈਕੇਟ/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SCOPE.vi, PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SCOPE.en, JSON.stringify(shahmukhi)].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/does not create a full shahmukhi bundle|không tạo bundle shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|ci config/);
  });
});
