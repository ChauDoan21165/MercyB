import { describe, expect, it } from "vitest";

import {
  PUNJABI_CLOSURE_VALIDATION_CHECK_TYPES,
  PUNJABI_CLOSURE_VALIDATION_FOCI,
  PUNJABI_REMEDIATION_CLOSURE_VALIDATION_SAMPLES_NOTICE,
  punjabiRemediationClosureValidationSamples,
  type PunjabiRemediationClosureValidationSample,
} from "@/languages/punjabi/remediationClosureValidationSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationClosureValidationSamples - size and identity", () => {
  it("keeps a compact useful closure-validation set", () => {
    expect(punjabiRemediationClosureValidationSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationClosureValidationSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique closure-validation ids", () => {
    const ids = punjabiRemediationClosureValidationSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^closure-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationClosureValidationSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationClosureValidationSample)[] = [
    "closureRouteId",
    "repair_pa",
    "repair_en",
    "closurePrompt_pa",
    "closurePrompt_en",
    "closureReason_vi",
    "closureReason_en",
    "closureValidation_vi",
    "closureValidation_en",
    "closureValidationCheck",
    "commonTrap",
  ];

  it("fills every required closure-validation field", () => {
    for (const item of punjabiRemediationClosureValidationSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary repair and closure lines with romanization only as support", () => {
    for (const item of punjabiRemediationClosureValidationSamples) {
      expect(GURMUKHI_SCRIPT.test(item.repair_pa), `${item.id}.repair_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.closurePrompt_pa), `${item.id}.closurePrompt_pa`).toBe(true);
      expect(item.repair_pa).not.toBe(item.repair_roman);
      expect(item.closurePrompt_pa).not.toBe(item.closurePrompt_roman);
    }
  });

  it("keeps Vietnamese and English closure guidance distinct", () => {
    for (const item of punjabiRemediationClosureValidationSamples) {
      expect(item.closureReason_vi).not.toBe(item.closureReason_en);
      expect(item.closureValidation_vi).not.toBe(item.closureValidation_en);
      expect(
        VIETNAMESE_MARKS.test(item.closureReason_vi) || VIETNAMESE_MARKS.test(item.closureValidation_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationClosureValidationSamples - coverage and closure", () => {
  it("covers every requested closure-validation focus", () => {
    const present = new Set<PunjabiRemediationClosureValidationSample["focus"]>();
    for (const item of punjabiRemediationClosureValidationSamples) {
      expect(PUNJABI_CLOSURE_VALIDATION_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_CLOSURE_VALIDATION_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationClosureValidationSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationClosureValidationSample["audience"]>();
    for (const item of punjabiRemediationClosureValidationSamples) {
      expect(PUNJABI_CLOSURE_VALIDATION_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.closureRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_CLOSURE_VALIDATION_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical closure validation for repair flows", () => {
    const canadaItems = punjabiRemediationClosureValidationSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.closurePrompt_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.closurePrompt_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.closurePrompt_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.closureValidationCheck.toLowerCase()).toContain("confirm");
      expect(item.closurePrompt_pa.length).toBeGreaterThanOrEqual(item.repair_pa.length);
    }
  });
});

describe("punjabiRemediationClosureValidationSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CLOSURE_VALIDATION_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationClosureValidationSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_CLOSURE_VALIDATION_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 36 closure-validation samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
