import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_REGRESSION_CHECK_TYPES,
  PUNJABI_FINAL_REGRESSION_FOCI,
  PUNJABI_REMEDIATION_FINAL_REGRESSION_SAMPLES_NOTICE,
  punjabiRemediationFinalRegressionSamples,
  type PunjabiRemediationFinalRegressionSample,
} from "@/languages/punjabi/remediationFinalRegressionSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationFinalRegressionSamples - size and identity", () => {
  it("keeps a compact useful final-regression set", () => {
    expect(punjabiRemediationFinalRegressionSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationFinalRegressionSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique final-regression ids", () => {
    const ids = punjabiRemediationFinalRegressionSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^regression-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationFinalRegressionSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationFinalRegressionSample)[] = [
    "sourceRouteId",
    "sample_pa",
    "sample_en",
    "regressionRisk_vi",
    "regressionRisk_en",
    "expectedRepair_vi",
    "expectedRepair_en",
    "finalRegressionCheck",
    "sanityCheck",
    "commonTrap",
  ];

  it("fills every required final-regression field", () => {
    for (const item of punjabiRemediationFinalRegressionSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary samples with romanization only as support", () => {
    for (const item of punjabiRemediationFinalRegressionSamples) {
      expect(GURMUKHI_SCRIPT.test(item.sample_pa), `${item.id}.sample_pa`).toBe(true);
      expect(item.sample_pa).not.toBe(item.sample_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationFinalRegressionSamples) {
      expect(item.regressionRisk_vi).not.toBe(item.regressionRisk_en);
      expect(item.expectedRepair_vi).not.toBe(item.expectedRepair_en);
      expect(
        VIETNAMESE_MARKS.test(item.regressionRisk_vi) || VIETNAMESE_MARKS.test(item.expectedRepair_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationFinalRegressionSamples - coverage and final checks", () => {
  it("covers every requested final-regression focus", () => {
    const present = new Set<PunjabiRemediationFinalRegressionSample["focus"]>();
    for (const item of punjabiRemediationFinalRegressionSamples) {
      expect(PUNJABI_FINAL_REGRESSION_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_FINAL_REGRESSION_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationFinalRegressionSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationFinalRegressionSample["audience"]>();
    for (const item of punjabiRemediationFinalRegressionSamples) {
      expect(PUNJABI_FINAL_REGRESSION_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.sourceRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_FINAL_REGRESSION_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to final-regression and sanity checks", () => {
    for (const item of punjabiRemediationFinalRegressionSamples) {
      expect(item.regressionRisk_vi.length).toBeGreaterThan(8);
      expect(item.regressionRisk_en.length).toBeGreaterThan(8);
      expect(item.expectedRepair_vi.length).toBeGreaterThan(8);
      expect(item.expectedRepair_en.length).toBeGreaterThan(8);
      expect(item.finalRegressionCheck.toLowerCase()).toContain("confirm");
      expect(item.sanityCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical final-regression recovery samples", () => {
    const canadaItems = punjabiRemediationFinalRegressionSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationFinalRegressionSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_FINAL_REGRESSION_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationFinalRegressionSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_FINAL_REGRESSION_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 31 final-regression samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
