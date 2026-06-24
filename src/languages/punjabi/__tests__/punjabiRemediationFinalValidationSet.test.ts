import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_VALIDATION_CHECK_TYPES,
  PUNJABI_FINAL_VALIDATION_FOCI,
  PUNJABI_REMEDIATION_FINAL_VALIDATION_SET_NOTICE,
  punjabiRemediationFinalValidationSet,
  type PunjabiRemediationFinalValidationItem,
} from "@/languages/punjabi/remediationFinalValidationSet";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationFinalValidationSet - size and identity", () => {
  it("keeps a compact useful final-validation set", () => {
    expect(punjabiRemediationFinalValidationSet.length).toBeGreaterThanOrEqual(12);
    expect(punjabiRemediationFinalValidationSet.length).toBeLessThanOrEqual(45);
  });

  it("has unique final-validation ids", () => {
    const ids = punjabiRemediationFinalValidationSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^validation-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationFinalValidationSet - app fields", () => {
  const requiredText: (keyof PunjabiRemediationFinalValidationItem)[] = [
    "routeId",
    "validatedFix_pa",
    "validatedFix_en",
    "recovery_pa",
    "recovery_en",
    "validation_vi",
    "validation_en",
    "learnerRisk_vi",
    "learnerRisk_en",
    "finalValidationCheck",
    "commonTrap",
  ];

  it("fills every required final-validation field", () => {
    for (const item of punjabiRemediationFinalValidationSet) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary validation and recovery lines with romanization only as support", () => {
    for (const item of punjabiRemediationFinalValidationSet) {
      expect(GURMUKHI_SCRIPT.test(item.validatedFix_pa), `${item.id}.validatedFix_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.recovery_pa), `${item.id}.recovery_pa`).toBe(true);
      expect(item.validatedFix_pa).not.toBe(item.validatedFix_roman);
      expect(item.recovery_pa).not.toBe(item.recovery_roman);
    }
  });

  it("keeps Vietnamese and English validation guidance distinct", () => {
    for (const item of punjabiRemediationFinalValidationSet) {
      expect(item.validation_vi).not.toBe(item.validation_en);
      expect(item.learnerRisk_vi).not.toBe(item.learnerRisk_en);
      expect(
        VIETNAMESE_MARKS.test(item.validation_vi) || VIETNAMESE_MARKS.test(item.learnerRisk_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationFinalValidationSet - coverage and validation", () => {
  it("covers every requested final-validation focus", () => {
    const present = new Set<PunjabiRemediationFinalValidationItem["focus"]>();
    for (const item of punjabiRemediationFinalValidationSet) {
      expect(PUNJABI_FINAL_VALIDATION_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_FINAL_VALIDATION_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationFinalValidationItem["checkType"]>();
    const audiences = new Set<PunjabiRemediationFinalValidationItem["audience"]>();
    for (const item of punjabiRemediationFinalValidationSet) {
      expect(PUNJABI_FINAL_VALIDATION_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.routeId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_FINAL_VALIDATION_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("connects validated fixes to Canada-practical recovery phrases", () => {
    const canadaItems = punjabiRemediationFinalValidationSet.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.finalValidationCheck.toLowerCase()).toContain("confirm");
      expect(item.recovery_pa.length).toBeGreaterThanOrEqual(item.validatedFix_pa.length);
    }
  });
});

describe("punjabiRemediationFinalValidationSet - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_FINAL_VALIDATION_SET_NOTICE} ${JSON.stringify(
      punjabiRemediationFinalValidationSet,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_FINAL_VALIDATION_SET_NOTICE.toLowerCase();
    expect(notice).toContain("wave 35 final-validation set only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
