import { describe, expect, it } from "vitest";

import {
  PUNJABI_MERGE_READINESS_CHECK_TYPES,
  PUNJABI_MERGE_READINESS_FOCI,
  PUNJABI_REMEDIATION_MERGE_READINESS_SAMPLES_NOTICE,
  punjabiRemediationMergeReadinessSamples,
  type PunjabiRemediationMergeReadinessSample,
} from "@/languages/punjabi/remediationMergeReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationMergeReadinessSamples - size and identity", () => {
  it("keeps a compact useful merge-readiness set", () => {
    expect(punjabiRemediationMergeReadinessSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationMergeReadinessSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique merge-readiness ids", () => {
    const ids = punjabiRemediationMergeReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^merge-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationMergeReadinessSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationMergeReadinessSample)[] = [
    "mergeRouteId",
    "sample_pa",
    "sample_en",
    "mergeRisk_vi",
    "mergeRisk_en",
    "readinessRepair_vi",
    "readinessRepair_en",
    "mergeReadinessCheck",
    "preIntegrationCheck",
    "commonTrap",
  ];

  it("fills every required merge-readiness field", () => {
    for (const item of punjabiRemediationMergeReadinessSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary samples with romanization only as support", () => {
    for (const item of punjabiRemediationMergeReadinessSamples) {
      expect(GURMUKHI_SCRIPT.test(item.sample_pa), `${item.id}.sample_pa`).toBe(true);
      expect(item.sample_pa).not.toBe(item.sample_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationMergeReadinessSamples) {
      expect(item.mergeRisk_vi).not.toBe(item.mergeRisk_en);
      expect(item.readinessRepair_vi).not.toBe(item.readinessRepair_en);
      expect(
        VIETNAMESE_MARKS.test(item.mergeRisk_vi) || VIETNAMESE_MARKS.test(item.readinessRepair_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationMergeReadinessSamples - coverage and readiness", () => {
  it("covers every requested merge-readiness focus", () => {
    const present = new Set<PunjabiRemediationMergeReadinessSample["focus"]>();
    for (const item of punjabiRemediationMergeReadinessSamples) {
      expect(PUNJABI_MERGE_READINESS_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_MERGE_READINESS_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationMergeReadinessSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationMergeReadinessSample["audience"]>();
    for (const item of punjabiRemediationMergeReadinessSamples) {
      expect(PUNJABI_MERGE_READINESS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.mergeRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_MERGE_READINESS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to merge-readiness and pre-integration checks", () => {
    for (const item of punjabiRemediationMergeReadinessSamples) {
      expect(item.mergeRisk_vi.length).toBeGreaterThan(8);
      expect(item.mergeRisk_en.length).toBeGreaterThan(8);
      expect(item.readinessRepair_vi.length).toBeGreaterThan(8);
      expect(item.readinessRepair_en.length).toBeGreaterThan(8);
      expect(item.mergeReadinessCheck.toLowerCase()).toContain("confirm");
      expect(item.preIntegrationCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical merge-readiness recovery samples", () => {
    const canadaItems = punjabiRemediationMergeReadinessSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationMergeReadinessSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_MERGE_READINESS_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationMergeReadinessSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_MERGE_READINESS_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 32 merge-readiness samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
