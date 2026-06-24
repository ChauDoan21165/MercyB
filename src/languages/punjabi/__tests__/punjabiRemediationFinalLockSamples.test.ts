import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_LOCK_CHECK_TYPES,
  PUNJABI_FINAL_LOCK_FOCI,
  PUNJABI_REMEDIATION_FINAL_LOCK_SAMPLES_NOTICE,
  punjabiRemediationFinalLockSamples,
  type PunjabiRemediationFinalLockSample,
} from "@/languages/punjabi/remediationFinalLockSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationFinalLockSamples - size and identity", () => {
  it("keeps a compact useful final-lock set", () => {
    expect(punjabiRemediationFinalLockSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationFinalLockSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique final-lock ids", () => {
    const ids = punjabiRemediationFinalLockSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^lock-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationFinalLockSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationFinalLockSample)[] = [
    "finalLockRouteId",
    "prompt_pa",
    "prompt_en",
    "lockedRepair_pa",
    "lockedRepair_en",
    "finalLockCriteria_vi",
    "finalLockCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "finalLockCheck",
    "commonTrap",
  ];

  it("fills every required final-lock field", () => {
    for (const item of punjabiRemediationFinalLockSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationFinalLockSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.lockedRepair_pa), `${item.id}.lockedRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.lockedRepair_pa).not.toBe(item.lockedRepair_roman);
    }
  });

  it("keeps Vietnamese and English final-lock guidance distinct", () => {
    for (const item of punjabiRemediationFinalLockSamples) {
      expect(item.finalLockCriteria_vi).not.toBe(item.finalLockCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.finalLockCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationFinalLockSamples - coverage and final-lock readiness", () => {
  it("covers every requested final-lock focus", () => {
    const present = new Set<PunjabiRemediationFinalLockSample["focus"]>();
    for (const item of punjabiRemediationFinalLockSamples) {
      expect(PUNJABI_FINAL_LOCK_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_FINAL_LOCK_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationFinalLockSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationFinalLockSample["audience"]>();
    for (const item of punjabiRemediationFinalLockSamples) {
      expect(PUNJABI_FINAL_LOCK_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.finalLockRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_FINAL_LOCK_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical final-lock repair readiness", () => {
    const canadaItems = punjabiRemediationFinalLockSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.lockedRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.lockedRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.lockedRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.finalLockCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationFinalLockSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_FINAL_LOCK_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationFinalLockSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_FINAL_LOCK_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 42 final-lock samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
