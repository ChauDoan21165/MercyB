import { describe, expect, it } from "vitest";

import seal, {
  PUNJABI_FINAL_PRE_A11_SEAL,
  PUNJABI_FINAL_PRE_A11_SEAL_AREAS,
  PUNJABI_FINAL_PRE_A11_SEAL_ITEMS,
  PUNJABI_FINAL_PRE_A11_SEAL_SCOPE,
  type PunjabiFinalPreA11SealArea,
} from "@/languages/punjabi/finalPreA11Seal";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: PunjabiFinalPreA11SealArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "a1_c2_coverage",
  "gurmukhi_script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "deferred_native_review",
  "forbidden_claims",
];

describe("Punjabi final pre-A11 seal", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(seal).toBe(PUNJABI_FINAL_PRE_A11_SEAL);
    expect(Array.isArray(seal)).toBe(true);
    expect(PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.wave).toBe("Wave 52");
    expect(PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares the required seal areas", () => {
    expect([...PUNJABI_FINAL_PRE_A11_SEAL_AREAS].sort()).toEqual([...REQUIRED_AREAS].sort());
    const areas = new Set(PUNJABI_FINAL_PRE_A11_SEAL.map((item) => item.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing area: ${area}`).toBe(true);
    }
  });

  it("keeps the seal compact but useful", () => {
    expect(PUNJABI_FINAL_PRE_A11_SEAL_ITEMS.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_PRE_A11_SEAL_ITEMS.length).toBeLessThanOrEqual(14);
  });

  it("uses Gurmukhi primary with bilingual questions, evidence, and samples", () => {
    for (const item of PUNJABI_FINAL_PRE_A11_SEAL_ITEMS) {
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.seal_question_vi.length).toBeGreaterThan(0);
      expect(item.seal_question_en.length).toBeGreaterThan(0);
      expect(item.expected_evidence_vi.length).toBeGreaterThan(0);
      expect(item.expected_evidence_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.modules_checked.length).toBeGreaterThan(0);
    }
  });

  it("covers A1-C2 and keeps ids unique", () => {
    const ids = new Set<string>();
    const levels = new Set<string>();
    for (const item of PUNJABI_FINAL_PRE_A11_SEAL_ITEMS) {
      expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
      ids.add(item.id);
      item.levels.forEach((level) => levels.add(level));
    }
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      expect(levels.has(level), `missing level: ${level}`).toBe(true);
    }
  });

  it("covers module-family, Canada-survival, remediation, and boundary concerns", () => {
    const text = PUNJABI_FINAL_PRE_A11_SEAL_ITEMS
      .map((item) => `${item.id} ${item.modules_checked.join(" ")} ${item.checkpoint_vi ?? ""} ${item.checkpoint_en ?? ""} ${item.learner_trap_vi ?? ""} ${item.learner_trap_en ?? ""} ${item.canada_practical ?? ""}`)
      .join(" ")
      .toLowerCase();

    expect(text).toMatch(/coursemap|learningpath|progressionmatrix|masterycheckpoints/);
    expect(text).toMatch(/finalcando|finalqainventory|finalcontentmanifest|finalnavigationmap|finalintegrationevidencemap/);
    expect(text).toMatch(/clinic|school|workplace|housing|public service|canada/);
    expect(text).toMatch(/murammat|remediation|repair|smikhia|review/);
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const blob = [
      PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.script_note_vi,
      PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.script_note_en,
      PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.native_review_vi,
      PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.native_review_en,
      ...PUNJABI_FINAL_PRE_A11_SEAL_ITEMS.map((item) => `${item.title_vi} ${item.title_en} ${item.seal_question_vi} ${item.seal_question_en}`),
    ]
      .join(" ")
      .toLowerCase();

    expect(blob).toMatch(/shahmukhi.*awareness|awareness-only/);
    expect(blob).toMatch(/native review.*deferred/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("excludes forbidden claims and infrastructure terms", () => {
    const blob = `${PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.excluded_vi} ${PUNJABI_FINAL_PRE_A11_SEAL_SCOPE.excluded_en}`.toLowerCase();
    expect(blob).toMatch(/no audio|ਕੋਈ audio|ਪ੍ਰਭਾਵੀ ਨਹੀਂ/);
    expect(blob).toMatch(/azure/);
    expect(blob).toMatch(/auth/);
    expect(blob).toMatch(/billing/);
    expect(blob).toMatch(/rls/);
    expect(blob).toMatch(/supabase/);
    expect(blob).toMatch(/ci/);
    expect(blob).toMatch(/push/);
    expect(blob).toMatch(/deploy/);
  });
});
