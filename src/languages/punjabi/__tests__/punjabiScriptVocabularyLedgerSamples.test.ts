// src/languages/punjabi/__tests__/punjabiScriptVocabularyLedgerSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary ledger samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_LEDGER_SCOPE,
  type PunjabiLedgerFocus,
} from "@/languages/punjabi/scriptVocabularyLedgerSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiLedgerFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "ledger_closure",
];

describe("Punjabi script vocabulary ledger samples", () => {
  it("is compact app-consumable TypeScript ledger data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SCOPE.ledgerDataOnly).toBe(true);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.length).toBeGreaterThanOrEqual(15);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.length).toBeLessThanOrEqual(30);
  });

  it("covers all WAVE55 ledger focus areas and stages", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.map((item) => item.focus));
    for (const required of REQUIRED_FOCUS) expect(focus.has(required), `missing ${required}`).toBe(true);
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.map((item) => item.stage));
    expect(stages).toEqual(new Set(["pre_a11_ledger", "archive", "signoff", "pre_integration", "regression"]));
  });

  it("uses Gurmukhi primary with Vietnamese and English guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.ledger_vi.trim().length).toBeGreaterThan(25);
      expect(item.ledger_en.trim().length).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length).toBeGreaterThan(25);
      expect(item.expected_en.trim().length).toBeGreaterThan(25);
    }
  });

  it("includes romanization, traps, Canada examples, and ledger flags", () => {
    expect(new Set(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.map((item) => item.id)).size).toBe(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.length);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.filter((item) => item.romanization).length).toBeGreaterThanOrEqual(14);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.filter((item) => item.learnerTrap).length).toBeGreaterThanOrEqual(4);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(5);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.filter((item) => item.ledgerReady).length).toBeGreaterThanOrEqual(5);
  });

  it("covers script marks, service vocabulary, verbs, and collocations", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ ਰਿਕਾਰਡ|ਚਾਹ|ਕੁ \/ ਕੂ|ਪੱਕਾ ਕੰਮ/);
    expect(blob).toMatch(/ਅੱਗ|ਦਾਖਲਾ|ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ|ਪਤੇ ਦਾ ਸਬੂਤ/);
    expect(blob).toMatch(/ਮੈਂ ਲੈਂਦਾ ਹਾਂ|ਉਹ ਦਿੰਦਾ ਹੈ|ਫੈਸਲਾ ਕਰਨਾ|ਮੁਲਾਕਾਤ ਕਰਨੀ/);
    expect(blob).toMatch(/ਖਾਤਾ ਜਾਂਚ|ਅੰਤਿਮ ਖਾਤਾ/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [PUNJABI_SCRIPT_VOCABULARY_LEDGER_SCOPE.vi, PUNJABI_SCRIPT_VOCABULARY_LEDGER_SCOPE.en, JSON.stringify(shahmukhi)].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/does not create a full shahmukhi course|không tạo course shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|ci config/);
  });
});
