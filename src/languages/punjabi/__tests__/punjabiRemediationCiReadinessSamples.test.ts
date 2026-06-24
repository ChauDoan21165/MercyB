import { describe, expect, it } from "vitest";

import {
  PUNJABI_CI_READINESS_CHECK_TYPES,
  PUNJABI_CI_READINESS_FOCI,
  PUNJABI_REMEDIATION_CI_READINESS_SAMPLES_NOTICE,
  punjabiRemediationCiReadinessSamples,
  type PunjabiRemediationCiReadinessSample,
} from "@/languages/punjabi/remediationCiReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCiReadinessSamples - size and identity", () => {
  it("keeps a compact useful ci-readiness set", () => {
    expect(punjabiRemediationCiReadinessSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationCiReadinessSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique ci-readiness ids", () => {
    const ids = punjabiRemediationCiReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^ci-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCiReadinessSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCiReadinessSample)[] = [
    "ciReadinessRouteId",
    "prompt_pa",
    "prompt_en",
    "ciReadyRepair_pa",
    "ciReadyRepair_en",
    "ciReadinessCriteria_vi",
    "ciReadinessCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "ciReadinessCheck",
    "commonTrap",
  ];

  it("fills every required ci-readiness field", () => {
    for (const item of punjabiRemediationCiReadinessSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationCiReadinessSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.ciReadyRepair_pa), `${item.id}.ciReadyRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.ciReadyRepair_pa).not.toBe(item.ciReadyRepair_roman);
    }
  });

  it("keeps Vietnamese and English ci-readiness guidance distinct", () => {
    for (const item of punjabiRemediationCiReadinessSamples) {
      expect(item.ciReadinessCriteria_vi).not.toBe(item.ciReadinessCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.ciReadinessCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCiReadinessSamples - coverage and ci-readiness readiness", () => {
  it("covers every requested ci-readiness focus", () => {
    const present = new Set<PunjabiRemediationCiReadinessSample["focus"]>();
    for (const item of punjabiRemediationCiReadinessSamples) {
      expect(PUNJABI_CI_READINESS_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_CI_READINESS_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationCiReadinessSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationCiReadinessSample["audience"]>();
    for (const item of punjabiRemediationCiReadinessSamples) {
      expect(PUNJABI_CI_READINESS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.ciReadinessRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_CI_READINESS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical ci-readiness repair readiness", () => {
    const canadaItems = punjabiRemediationCiReadinessSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.ciReadyRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.ciReadyRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.ciReadyRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.ciReadinessCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationCiReadinessSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CI_READINESS_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationCiReadinessSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_CI_READINESS_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 45 ci-readiness samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
