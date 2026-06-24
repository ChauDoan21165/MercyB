import { describe, expect, it } from "vitest";

import {
  PUNJABI_PIPELINE_READINESS_CHECK_TYPES,
  PUNJABI_PIPELINE_READINESS_FOCI,
  PUNJABI_REMEDIATION_PIPELINE_READINESS_SAMPLES_NOTICE,
  punjabiRemediationPipelineReadinessSamples,
  type PunjabiRemediationPipelineReadinessSample,
} from "@/languages/punjabi/remediationPipelineReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationPipelineReadinessSamples - size and identity", () => {
  it("keeps a compact useful pipeline-readiness set", () => {
    expect(punjabiRemediationPipelineReadinessSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationPipelineReadinessSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique pipeline-readiness ids", () => {
    const ids = punjabiRemediationPipelineReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^pipeline-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationPipelineReadinessSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationPipelineReadinessSample)[] = [
    "pipelineReadinessRouteId",
    "prompt_pa",
    "prompt_en",
    "pipelineReadyRepair_pa",
    "pipelineReadyRepair_en",
    "pipelineReadinessCriteria_vi",
    "pipelineReadinessCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "pipelineReadinessCheck",
    "commonTrap",
  ];

  it("fills every required pipeline-readiness field", () => {
    for (const item of punjabiRemediationPipelineReadinessSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationPipelineReadinessSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.pipelineReadyRepair_pa), `${item.id}.pipelineReadyRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.pipelineReadyRepair_pa).not.toBe(item.pipelineReadyRepair_roman);
    }
  });

  it("keeps Vietnamese and English pipeline-readiness guidance distinct", () => {
    for (const item of punjabiRemediationPipelineReadinessSamples) {
      expect(item.pipelineReadinessCriteria_vi).not.toBe(item.pipelineReadinessCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.pipelineReadinessCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationPipelineReadinessSamples - coverage and pipeline-readiness readiness", () => {
  it("covers every requested pipeline-readiness focus", () => {
    const present = new Set<PunjabiRemediationPipelineReadinessSample["focus"]>();
    for (const item of punjabiRemediationPipelineReadinessSamples) {
      expect(PUNJABI_PIPELINE_READINESS_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_PIPELINE_READINESS_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationPipelineReadinessSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationPipelineReadinessSample["audience"]>();
    for (const item of punjabiRemediationPipelineReadinessSamples) {
      expect(PUNJABI_PIPELINE_READINESS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.pipelineReadinessRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_PIPELINE_READINESS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical pipeline-readiness repair readiness", () => {
    const canadaItems = punjabiRemediationPipelineReadinessSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.pipelineReadyRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.pipelineReadyRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.pipelineReadyRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.pipelineReadinessCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationPipelineReadinessSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_PIPELINE_READINESS_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationPipelineReadinessSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_PIPELINE_READINESS_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 46 pipeline-readiness samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
