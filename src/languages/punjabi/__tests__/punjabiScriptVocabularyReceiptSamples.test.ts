// src/languages/punjabi/__tests__/punjabiScriptVocabularyReceiptSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary receipt samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SCOPE,
  type PunjabiReceiptFocus,
} from "@/languages/punjabi/scriptVocabularyReceiptSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiReceiptFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "receipt_closure",
];

describe("Punjabi script vocabulary receipt samples", () => {
  it("is compact app-consumable TypeScript receipt data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SCOPE.receiptDataOnly).toBe(true);
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.length).toBeGreaterThanOrEqual(15);
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.length).toBeLessThanOrEqual(30);
  });

  it("covers all WAVE56 receipt focus areas and stages", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.map((item) => item.focus));
    for (const required of REQUIRED_FOCUS) expect(focus.has(required), `missing ${required}`).toBe(true);
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.map((item) => item.stage));
    expect(stages).toEqual(new Set(["pre_a11_receipt", "ledger", "archive", "pre_integration", "regression"]));
  });

  it("uses Gurmukhi primary with Vietnamese and English guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.receipt_vi.trim().length).toBeGreaterThan(25);
      expect(item.receipt_en.trim().length).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length).toBeGreaterThan(25);
      expect(item.expected_en.trim().length).toBeGreaterThan(25);
    }
  });

  it("includes romanization, traps, Canada examples, and receipt flags", () => {
    expect(new Set(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.map((item) => item.id)).size).toBe(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.length);
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.filter((item) => item.romanization).length).toBeGreaterThanOrEqual(14);
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.filter((item) => item.learnerTrap).length).toBeGreaterThanOrEqual(4);
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(7);
    expect(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.filter((item) => item.receiptReady).length).toBeGreaterThanOrEqual(5);
  });

  it("covers receipt vocabulary, script marks, verbs, and collocations", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ ਰਸੀਦ|ਦੁੱਧ|ਤਿ \/ ਤੀ|ਸੱਚ ਬੋਲਣਾ/);
    expect(blob).toMatch(/ਬੰਦ|ਖੁੱਲ੍ਹਾ|ਰਸੀਦ ਚਾਹੀਦੀ ਹੈ|ਭੁਗਤਾਨ ਮਸ਼ੀਨ/);
    expect(blob).toMatch(/ਮੈਂ ਖਰੀਦਦਾ ਹਾਂ|ਮੈਂ ਦਿਖਾਉਂਦਾ ਹਾਂ|ਪੈਸੇ ਦੇਣਾ|ਦਸਤਖ਼ਤ ਕਰਨਾ/);
    expect(blob).toMatch(/ਰਸੀਦ ਜਾਂਚ|ਅੰਤਿਮ ਰਸੀਦ/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SCOPE.vi, PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SCOPE.en, JSON.stringify(shahmukhi)].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/does not create a full shahmukhi module|không tạo module shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|ci config/);
  });
});
