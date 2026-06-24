import { describe, expect, it } from "vitest";

import {
  PUNJABI_CROSS_CHECK_FOCI,
  PUNJABI_CROSS_CHECK_TYPES,
  PUNJABI_REMEDIATION_CROSS_CHECK_SAMPLES_NOTICE,
  punjabiRemediationCrossCheckSamples,
  type PunjabiRemediationCrossCheckSample,
} from "@/languages/punjabi/remediationCrossCheckSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCrossCheckSamples - size and identity", () => {
  it("keeps a compact useful cross-check set", () => {
    expect(punjabiRemediationCrossCheckSamples.length).toBeGreaterThanOrEqual(12);
    expect(punjabiRemediationCrossCheckSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique cross-check ids", () => {
    const ids = punjabiRemediationCrossCheckSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^crosscheck-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCrossCheckSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCrossCheckSample)[] = [
    "routeId",
    "fix_pa",
    "fix_en",
    "recovery_pa",
    "recovery_en",
    "why_vi",
    "why_en",
    "crossCheck_vi",
    "crossCheck_en",
    "verificationCheck",
    "commonTrap",
  ];

  it("fills every required cross-check field", () => {
    for (const item of punjabiRemediationCrossCheckSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary fix and recovery lines with romanization only as support", () => {
    for (const item of punjabiRemediationCrossCheckSamples) {
      expect(GURMUKHI_SCRIPT.test(item.fix_pa), `${item.id}.fix_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.recovery_pa), `${item.id}.recovery_pa`).toBe(true);
      expect(item.fix_pa).not.toBe(item.fix_roman);
      expect(item.recovery_pa).not.toBe(item.recovery_roman);
    }
  });

  it("keeps Vietnamese and English guidance distinct", () => {
    for (const item of punjabiRemediationCrossCheckSamples) {
      expect(item.why_vi).not.toBe(item.why_en);
      expect(item.crossCheck_vi).not.toBe(item.crossCheck_en);
      expect(
        VIETNAMESE_MARKS.test(item.why_vi) || VIETNAMESE_MARKS.test(item.crossCheck_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCrossCheckSamples - coverage and coherence", () => {
  it("covers every requested cross-check focus", () => {
    const present = new Set<PunjabiRemediationCrossCheckSample["focus"]>();
    for (const item of punjabiRemediationCrossCheckSamples) {
      expect(PUNJABI_CROSS_CHECK_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_CROSS_CHECK_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationCrossCheckSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationCrossCheckSample["audience"]>();
    for (const item of punjabiRemediationCrossCheckSamples) {
      expect(PUNJABI_CROSS_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.routeId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_CROSS_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("connects fixes coherently to Canada-practical recovery phrases", () => {
    const canadaItems = punjabiRemediationCrossCheckSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.verificationCheck.toLowerCase()).toContain("confirm");
      expect(item.crossCheck_en.length).toBeGreaterThan(8);
    }
  });
});

describe("punjabiRemediationCrossCheckSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CROSS_CHECK_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationCrossCheckSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_CROSS_CHECK_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 34 cross-check samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
