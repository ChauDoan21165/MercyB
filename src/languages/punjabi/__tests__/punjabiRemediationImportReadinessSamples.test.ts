import { describe, expect, it } from "vitest";

import {
  PUNJABI_IMPORT_READINESS_CHECK_TYPES,
  PUNJABI_IMPORT_READINESS_FOCI,
  PUNJABI_REMEDIATION_IMPORT_READINESS_SAMPLES_NOTICE,
  punjabiRemediationImportReadinessSamples,
  type PunjabiRemediationImportReadinessSample,
} from "@/languages/punjabi/remediationImportReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationImportReadinessSamples - size and identity", () => {
  it("keeps a compact useful import-readiness set", () => {
    expect(punjabiRemediationImportReadinessSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationImportReadinessSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique import-readiness ids", () => {
    const ids = punjabiRemediationImportReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^import-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationImportReadinessSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationImportReadinessSample)[] = [
    "importRouteId",
    "sample_pa",
    "sample_en",
    "importRisk_vi",
    "importRisk_en",
    "expectedImportRepair_vi",
    "expectedImportRepair_en",
    "importReadinessCheck",
    "preIntegrationCheck",
    "commonTrap",
  ];

  it("fills every required import-readiness field", () => {
    for (const item of punjabiRemediationImportReadinessSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary samples with romanization only as support", () => {
    for (const item of punjabiRemediationImportReadinessSamples) {
      expect(GURMUKHI_SCRIPT.test(item.sample_pa), `${item.id}.sample_pa`).toBe(true);
      expect(item.sample_pa).not.toBe(item.sample_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationImportReadinessSamples) {
      expect(item.importRisk_vi).not.toBe(item.importRisk_en);
      expect(item.expectedImportRepair_vi).not.toBe(item.expectedImportRepair_en);
      expect(
        VIETNAMESE_MARKS.test(item.importRisk_vi) || VIETNAMESE_MARKS.test(item.expectedImportRepair_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationImportReadinessSamples - coverage and readiness", () => {
  it("covers every requested import-readiness focus", () => {
    const present = new Set<PunjabiRemediationImportReadinessSample["focus"]>();
    for (const item of punjabiRemediationImportReadinessSamples) {
      expect(PUNJABI_IMPORT_READINESS_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_IMPORT_READINESS_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationImportReadinessSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationImportReadinessSample["audience"]>();
    for (const item of punjabiRemediationImportReadinessSamples) {
      expect(PUNJABI_IMPORT_READINESS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.importRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_IMPORT_READINESS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to import-readiness and pre-integration checks", () => {
    for (const item of punjabiRemediationImportReadinessSamples) {
      expect(item.importRisk_vi.length).toBeGreaterThan(8);
      expect(item.importRisk_en.length).toBeGreaterThan(8);
      expect(item.expectedImportRepair_vi.length).toBeGreaterThan(8);
      expect(item.expectedImportRepair_en.length).toBeGreaterThan(8);
      expect(item.importReadinessCheck.toLowerCase()).toContain("confirm");
      expect(item.preIntegrationCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical import-readiness recovery samples", () => {
    const canadaItems = punjabiRemediationImportReadinessSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationImportReadinessSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_IMPORT_READINESS_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationImportReadinessSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_IMPORT_READINESS_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 33 import-readiness samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
