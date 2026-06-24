import { describe, expect, it } from "vitest";

import {
  PUNJABI_ACCEPTANCE_CHECK_TYPES,
  PUNJABI_ACCEPTANCE_FOCI,
  PUNJABI_REMEDIATION_ACCEPTANCE_SAMPLES_NOTICE,
  punjabiRemediationAcceptanceSamples,
  type PunjabiRemediationAcceptanceSample,
} from "@/languages/punjabi/remediationAcceptanceSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationAcceptanceSamples - size and identity", () => {
  it("keeps a compact useful acceptance set", () => {
    expect(punjabiRemediationAcceptanceSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationAcceptanceSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique acceptance ids", () => {
    const ids = punjabiRemediationAcceptanceSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^accept-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationAcceptanceSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationAcceptanceSample)[] = [
    "acceptanceRouteId",
    "prompt_pa",
    "prompt_en",
    "acceptedRepair_pa",
    "acceptedRepair_en",
    "acceptanceCriteria_vi",
    "acceptanceCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "acceptanceCheck",
    "commonTrap",
  ];

  it("fills every required acceptance field", () => {
    for (const item of punjabiRemediationAcceptanceSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationAcceptanceSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.acceptedRepair_pa), `${item.id}.acceptedRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.acceptedRepair_pa).not.toBe(item.acceptedRepair_roman);
    }
  });

  it("keeps Vietnamese and English acceptance guidance distinct", () => {
    for (const item of punjabiRemediationAcceptanceSamples) {
      expect(item.acceptanceCriteria_vi).not.toBe(item.acceptanceCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.acceptanceCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationAcceptanceSamples - coverage and acceptance readiness", () => {
  it("covers every requested acceptance focus", () => {
    const present = new Set<PunjabiRemediationAcceptanceSample["focus"]>();
    for (const item of punjabiRemediationAcceptanceSamples) {
      expect(PUNJABI_ACCEPTANCE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_ACCEPTANCE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationAcceptanceSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationAcceptanceSample["audience"]>();
    for (const item of punjabiRemediationAcceptanceSamples) {
      expect(PUNJABI_ACCEPTANCE_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.acceptanceRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_ACCEPTANCE_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical acceptance repair readiness", () => {
    const canadaItems = punjabiRemediationAcceptanceSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.acceptedRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.acceptedRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.acceptedRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.acceptanceCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationAcceptanceSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_ACCEPTANCE_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationAcceptanceSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_ACCEPTANCE_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 40 acceptance samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
