import { describe, expect, it } from "vitest";

import {
  PUNJABI_RELEASE_CANDIDATE_CHECK_TYPES,
  PUNJABI_RELEASE_CANDIDATE_FOCI,
  PUNJABI_REMEDIATION_RELEASE_CANDIDATE_SAMPLES_NOTICE,
  punjabiRemediationReleaseCandidateSamples,
  type PunjabiRemediationReleaseCandidateSample,
} from "@/languages/punjabi/remediationReleaseCandidateSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationReleaseCandidateSamples - size and identity", () => {
  it("keeps a compact useful release-candidate set", () => {
    expect(punjabiRemediationReleaseCandidateSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationReleaseCandidateSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique release-candidate ids", () => {
    const ids = punjabiRemediationReleaseCandidateSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^release-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationReleaseCandidateSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationReleaseCandidateSample)[] = [
    "releaseRouteId",
    "candidate_pa",
    "candidate_en",
    "recovery_pa",
    "recovery_en",
    "readiness_vi",
    "readiness_en",
    "releaseRisk_vi",
    "releaseRisk_en",
    "releaseCandidateCheck",
    "commonTrap",
  ];

  it("fills every required release-candidate field", () => {
    for (const item of punjabiRemediationReleaseCandidateSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary candidate and recovery lines with romanization only as support", () => {
    for (const item of punjabiRemediationReleaseCandidateSamples) {
      expect(GURMUKHI_SCRIPT.test(item.candidate_pa), `${item.id}.candidate_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.recovery_pa), `${item.id}.recovery_pa`).toBe(true);
      expect(item.candidate_pa).not.toBe(item.candidate_roman);
      expect(item.recovery_pa).not.toBe(item.recovery_roman);
    }
  });

  it("keeps Vietnamese and English readiness guidance distinct", () => {
    for (const item of punjabiRemediationReleaseCandidateSamples) {
      expect(item.readiness_vi).not.toBe(item.readiness_en);
      expect(item.releaseRisk_vi).not.toBe(item.releaseRisk_en);
      expect(
        VIETNAMESE_MARKS.test(item.readiness_vi) || VIETNAMESE_MARKS.test(item.releaseRisk_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationReleaseCandidateSamples - coverage and release readiness", () => {
  it("covers every requested release-candidate focus", () => {
    const present = new Set<PunjabiRemediationReleaseCandidateSample["focus"]>();
    for (const item of punjabiRemediationReleaseCandidateSamples) {
      expect(PUNJABI_RELEASE_CANDIDATE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_RELEASE_CANDIDATE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationReleaseCandidateSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationReleaseCandidateSample["audience"]>();
    for (const item of punjabiRemediationReleaseCandidateSamples) {
      expect(PUNJABI_RELEASE_CANDIDATE_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.releaseRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_RELEASE_CANDIDATE_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical release candidates for repair readiness", () => {
    const canadaItems = punjabiRemediationReleaseCandidateSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.releaseCandidateCheck.toLowerCase()).toContain("confirm");
      expect(item.recovery_pa.length).toBeGreaterThanOrEqual(item.candidate_pa.length);
    }
  });
});

describe("punjabiRemediationReleaseCandidateSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_RELEASE_CANDIDATE_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationReleaseCandidateSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_RELEASE_CANDIDATE_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 37 release-candidate samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
