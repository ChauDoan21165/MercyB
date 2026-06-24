import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_FREEZE_CHECK_TYPES,
  PUNJABI_FINAL_FREEZE_FOCI,
  PUNJABI_REMEDIATION_FINAL_FREEZE_SAMPLES_NOTICE,
  punjabiRemediationFinalFreezeSamples,
  type PunjabiRemediationFinalFreezeSample,
} from "@/languages/punjabi/remediationFinalFreezeSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationFinalFreezeSamples - size and identity", () => {
  it("keeps a compact useful final-freeze set", () => {
    expect(punjabiRemediationFinalFreezeSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationFinalFreezeSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique final-freeze ids", () => {
    const ids = punjabiRemediationFinalFreezeSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^freeze-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationFinalFreezeSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationFinalFreezeSample)[] = [
    "finalFreezeRouteId",
    "prompt_pa",
    "prompt_en",
    "frozenRepair_pa",
    "frozenRepair_en",
    "finalFreezeCriteria_vi",
    "finalFreezeCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "finalFreezeCheck",
    "commonTrap",
  ];

  it("fills every required final-freeze field", () => {
    for (const item of punjabiRemediationFinalFreezeSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationFinalFreezeSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.frozenRepair_pa), `${item.id}.frozenRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.frozenRepair_pa).not.toBe(item.frozenRepair_roman);
    }
  });

  it("keeps Vietnamese and English final-freeze guidance distinct", () => {
    for (const item of punjabiRemediationFinalFreezeSamples) {
      expect(item.finalFreezeCriteria_vi).not.toBe(item.finalFreezeCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.finalFreezeCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationFinalFreezeSamples - coverage and final-freeze readiness", () => {
  it("covers every requested final-freeze focus", () => {
    const present = new Set<PunjabiRemediationFinalFreezeSample["focus"]>();
    for (const item of punjabiRemediationFinalFreezeSamples) {
      expect(PUNJABI_FINAL_FREEZE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_FINAL_FREEZE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationFinalFreezeSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationFinalFreezeSample["audience"]>();
    for (const item of punjabiRemediationFinalFreezeSamples) {
      expect(PUNJABI_FINAL_FREEZE_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.finalFreezeRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_FINAL_FREEZE_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical final-freeze repair readiness", () => {
    const canadaItems = punjabiRemediationFinalFreezeSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.frozenRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.frozenRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.frozenRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.finalFreezeCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationFinalFreezeSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_FINAL_FREEZE_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationFinalFreezeSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_FINAL_FREEZE_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 43 final-freeze samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
