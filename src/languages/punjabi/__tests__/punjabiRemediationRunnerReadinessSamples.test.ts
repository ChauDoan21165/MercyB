import { describe, expect, it } from "vitest";

import {
  PUNJABI_RUNNER_READINESS_CHECK_TYPES,
  PUNJABI_RUNNER_READINESS_FOCI,
  PUNJABI_REMEDIATION_RUNNER_READINESS_SAMPLES_NOTICE,
  punjabiRemediationRunnerReadinessSamples,
  type PunjabiRemediationRunnerReadinessSample,
} from "@/languages/punjabi/remediationRunnerReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựởữỳýỵỷỹ]/i;

describe("punjabiRemediationRunnerReadinessSamples - size and identity", () => {
  it("keeps a compact useful runner-readiness set", () => {
    expect(punjabiRemediationRunnerReadinessSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationRunnerReadinessSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique runner-readiness ids", () => {
    const ids = punjabiRemediationRunnerReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^runner-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationRunnerReadinessSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationRunnerReadinessSample)[] = [
    "runnerReadinessRouteId",
    "prompt_pa",
    "prompt_en",
    "runnerReadyRepair_pa",
    "runnerReadyRepair_en",
    "runnerReadinessCriteria_vi",
    "runnerReadinessCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "runnerReadinessCheck",
    "commonTrap",
  ];

  it("fills every required runner-readiness field", () => {
    for (const item of punjabiRemediationRunnerReadinessSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationRunnerReadinessSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.runnerReadyRepair_pa), `${item.id}.runnerReadyRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.runnerReadyRepair_pa).not.toBe(item.runnerReadyRepair_roman);
    }
  });

  it("keeps Vietnamese and English runner-readiness guidance distinct", () => {
    for (const item of punjabiRemediationRunnerReadinessSamples) {
      expect(item.runnerReadinessCriteria_vi).not.toBe(item.runnerReadinessCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.runnerReadinessCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationRunnerReadinessSamples - coverage and runner-readiness readiness", () => {
  it("covers every requested runner-readiness focus", () => {
    const present = new Set<PunjabiRemediationRunnerReadinessSample["focus"]>();
    for (const item of punjabiRemediationRunnerReadinessSamples) {
      expect(PUNJABI_RUNNER_READINESS_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_RUNNER_READINESS_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationRunnerReadinessSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationRunnerReadinessSample["audience"]>();
    for (const item of punjabiRemediationRunnerReadinessSamples) {
      expect(PUNJABI_RUNNER_READINESS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.runnerReadinessRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_RUNNER_READINESS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical runner-readiness repair readiness", () => {
    const canadaItems = punjabiRemediationRunnerReadinessSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.runnerReadyRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.runnerReadyRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.runnerReadyRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.runnerReadinessCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationRunnerReadinessSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_RUNNER_READINESS_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationRunnerReadinessSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_RUNNER_READINESS_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 47 runner-readiness samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
