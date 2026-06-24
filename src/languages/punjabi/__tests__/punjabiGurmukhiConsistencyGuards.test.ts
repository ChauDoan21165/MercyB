// src/languages/punjabi/__tests__/punjabiGurmukhiConsistencyGuards.test.ts
//
// Structural guards for Punjabi Gurmukhi consistency guard data.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS,
  PUNJABI_GURMUKHI_CONSISTENCY_GUARDS,
  PUNJABI_GURMUKHI_CONSISTENCY_GUARDS_SCOPE,
  type PunjabiConsistencyFocus,
} from "@/languages/punjabi/gurmukhiConsistencyGuards";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiConsistencyFocus> = [
  "primary_script",
  "romanization_bridge_limits",
  "vowel_sign_awareness",
  "addak_tippi_bindi_awareness",
  "survival_signage",
  "service_vocabulary",
  "shahmukhi_awareness",
  "quality_regression",
];

describe("Punjabi Gurmukhi consistency guards", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_GURMUKHI_CONSISTENCY_GUARDS.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_GURMUKHI_CONSISTENCY_GUARDS) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.purpose_vi.trim().length).toBeGreaterThan(35);
      expect(section.purpose_en.trim().length).toBeGreaterThan(35);
      expect(section.guards.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 25 consistency guard focus areas", () => {
    const focus = new Set(PUNJABI_GURMUKHI_CONSISTENCY_GUARDS.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact guard entries to be useful", () => {
    expect(PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.length).toBeLessThanOrEqual(45);
  });

  it("uses Gurmukhi primary with Vietnamese and English guard text", () => {
    for (const item of PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.guard_vi.trim().length, `guard vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.guard_en.trim().length, `guard en for ${item.id}`).toBeGreaterThan(25);
      expect(item.pass_vi.trim().length, `pass vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.pass_en.trim().length, `pass en for ${item.id}`).toBeGreaterThan(25);
      expect(item.fix_vi.trim().length, `fix vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.fix_en.trim().length, `fix en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_GURMUKHI_CONSISTENCY_GUARDS) {
      for (const guard of section.guards) {
        expect(ids.has(guard.id), `duplicate id: ${guard.id}`).toBe(false);
        expect(guard.focus).toBe(section.focus);
        ids.add(guard.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, export readiness, and regression guards", () => {
    const romanized = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.filter((item) => item.canadaPractical);
    const exportReady = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.filter((item) => item.exportReady);
    const regression = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.filter((item) => item.regression);
    expect(romanized.length).toBeGreaterThanOrEqual(18);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canada.length).toBeGreaterThanOrEqual(7);
    expect(exportReady.length).toBeGreaterThanOrEqual(9);
    expect(regression.length).toBeGreaterThanOrEqual(7);
  });

  it("covers script, bridge limits, signs, services, Shahmukhi scope, and final quality", () => {
    const blob = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS
      .map((item) => `${item.focus} ${item.severity} ${item.gurmukhi} ${item.romanization ?? ""} ${item.guard_vi} ${item.guard_en} ${item.pass_vi} ${item.pass_en}`)
      .join(" ");
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਪੰਜਾਬੀ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਅੰਤਿਮ ਜਾਂਚ|ਹੱਦਾਂ/);
  });

  it("uses blocker, warning, review, and export severities", () => {
    const severities = new Set(PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.map((item) => item.severity));
    expect(severities.has("blocker")).toBe(true);
    expect(severities.has("warning")).toBe(true);
    expect(severities.has("review")).toBe(true);
    expect(severities.has("export")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_GURMUKHI_CONSISTENCY_GUARDS_SCOPE.vi,
      PUNJABI_GURMUKHI_CONSISTENCY_GUARDS_SCOPE.en,
      ...shahmukhi.map((item) => `${item.guard_vi} ${item.guard_en} ${item.pass_vi} ${item.pass_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full course|không phải khóa đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into app data", () => {
    expect(PUNJABI_GURMUKHI_CONSISTENCY_GUARDS_SCOPE.integrationFree).toBe(true);
    const blob = JSON.stringify(PUNJABI_GURMUKHI_CONSISTENCY_GUARDS).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
