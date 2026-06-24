// src/languages/punjabi/__tests__/punjabiScriptRomanizationBoundaryChecks.test.ts
//
// Structural tests for Punjabi script/romanization boundary checks.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS,
  PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS,
  PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_SCOPE,
  type PunjabiBoundaryFocus,
} from "@/languages/punjabi/scriptRomanizationBoundaryChecks";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiBoundaryFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_sign_boundary",
  "small_mark_boundary",
  "survival_signage",
  "service_vocabulary",
  "shahmukhi_awareness",
  "stability_regression",
];

describe("Punjabi script romanization boundary checks", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.goal_vi.trim().length).toBeGreaterThan(35);
      expect(section.goal_en.trim().length).toBeGreaterThan(35);
      expect(section.checks.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 26 boundary focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact boundary entries to be useful", () => {
    expect(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.length).toBeLessThanOrEqual(45);
  });

  it("uses Gurmukhi primary with Vietnamese and English boundary guidance", () => {
    for (const item of PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.boundary_vi.trim().length, `boundary vi for ${item.id}`).toBeGreaterThan(30);
      expect(item.boundary_en.trim().length, `boundary en for ${item.id}`).toBeGreaterThan(30);
      expect(item.acceptable_vi.trim().length, `acceptable vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.acceptable_en.trim().length, `acceptable en for ${item.id}`).toBeGreaterThan(25);
      expect(item.repair_vi.trim().length, `repair vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.repair_en.trim().length, `repair en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS) {
      for (const check of section.checks) {
        expect(ids.has(check.id), `duplicate id: ${check.id}`).toBe(false);
        expect(check.focus).toBe(section.focus);
        ids.add(check.id);
      }
    }
  });

  it("includes romanization, learner traps, Canada examples, stability, and regression", () => {
    const romanized = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.filter((item) => item.canadaPractical);
    const stability = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.filter((item) => item.finalStability);
    const regression = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.filter((item) => item.regression);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canada.length).toBeGreaterThanOrEqual(7);
    expect(stability.length).toBeGreaterThanOrEqual(10);
    expect(regression.length).toBeGreaterThanOrEqual(8);
  });

  it("covers Gurmukhi, bridge limits, vowel signs, small marks, signs, and services", () => {
    const blob = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS
      .map((item) => `${item.focus} ${item.type} ${item.gurmukhi} ${item.romanization ?? ""} ${item.boundary_vi} ${item.boundary_en} ${item.acceptable_vi} ${item.acceptable_en}`)
      .join(" ");
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਪੰਜਾਬੀ|ਪੜ੍ਹੋ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ|ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਅੰਤਿਮ ਹੱਦ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses boundary, checklist, regression, and export check types", () => {
    const types = new Set(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.map((item) => item.type));
    expect(types.has("boundary")).toBe(true);
    expect(types.has("checklist")).toBe(true);
    expect(types.has("regression")).toBe(true);
    expect(types.has("export")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_SCOPE.vi,
      PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_SCOPE.en,
      ...shahmukhi.map((item) => `${item.boundary_vi} ${item.boundary_en} ${item.acceptable_vi} ${item.acceptable_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full course|không phải khóa đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into app data", () => {
    expect(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_SCOPE.noExternalIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
