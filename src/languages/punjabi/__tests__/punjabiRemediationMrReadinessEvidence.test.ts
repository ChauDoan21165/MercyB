import { describe, expect, it } from "vitest";

import {
  PUNJABI_MR_READINESS_CHECK_TYPES,
  PUNJABI_MR_READINESS_FOCI,
  PUNJABI_REMEDIATION_MR_READINESS_SAMPLES_NOTICE,
  punjabiRemediationMrReadinessEvidence,
  type PunjabiRemediationMrReadinessSample,
} from "@/languages/punjabi/remediationMrReadinessEvidence";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationMrReadinessEvidence - size and identity", () => {
  it("keeps a compact useful mr-readiness set", () => {
    expect(punjabiRemediationMrReadinessEvidence.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationMrReadinessEvidence.length).toBeLessThanOrEqual(45);
  });

  it("has unique mr-readiness ids", () => {
    const ids = punjabiRemediationMrReadinessEvidence.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^freeze-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationMrReadinessEvidence - app fields", () => {
  const requiredText: (keyof PunjabiRemediationMrReadinessSample)[] = [
    "mrReadinessRouteId",
    "prompt_pa",
    "prompt_en",
    "mrReadyRepair_pa",
    "mrReadyRepair_en",
    "mrReadinessCriteria_vi",
    "mrReadinessCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "mrReadinessCheck",
    "commonTrap",
  ];

  it("fills every required mr-readiness field", () => {
    for (const item of punjabiRemediationMrReadinessEvidence) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationMrReadinessEvidence) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.mrReadyRepair_pa), `${item.id}.mrReadyRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.mrReadyRepair_pa).not.toBe(item.mrReadyRepair_roman);
    }
  });

  it("keeps Vietnamese and English mr-readiness guidance distinct", () => {
    for (const item of punjabiRemediationMrReadinessEvidence) {
      expect(item.mrReadinessCriteria_vi).not.toBe(item.mrReadinessCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.mrReadinessCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationMrReadinessEvidence - coverage and mr-readiness readiness", () => {
  it("covers every requested mr-readiness focus", () => {
    const present = new Set<PunjabiRemediationMrReadinessSample["focus"]>();
    for (const item of punjabiRemediationMrReadinessEvidence) {
      expect(PUNJABI_MR_READINESS_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_MR_READINESS_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationMrReadinessSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationMrReadinessSample["audience"]>();
    for (const item of punjabiRemediationMrReadinessEvidence) {
      expect(PUNJABI_MR_READINESS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.mrReadinessRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_MR_READINESS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical mr-readiness repair readiness", () => {
    const canadaItems = punjabiRemediationMrReadinessEvidence.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.mrReadyRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.mrReadyRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.mrReadyRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.mrReadinessCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationMrReadinessEvidence - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_MR_READINESS_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationMrReadinessEvidence,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_MR_READINESS_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 44 mr-readiness samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
