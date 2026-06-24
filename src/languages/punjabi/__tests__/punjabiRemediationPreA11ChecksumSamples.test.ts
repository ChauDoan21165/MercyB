// Punjabi remediation pre-A11-checksum sample guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_PRE_A11_CHECKSUM_CHECK_TYPES,
  PUNJABI_PRE_A11_CHECKSUM_FOCI,
  PUNJABI_REMEDIATION_PRE_A11_CHECKSUM_SAMPLES_NOTICE,
  punjabiRemediationPreA11ChecksumSamples,
  punjabiRemediationPreA11ChecksumSamplesByContext,
  punjabiRemediationPreA11ChecksumSamplesByFocus,
  type PunjabiRemediationPreA11ChecksumSample,
} from "@/languages/punjabi/remediationPreA11ChecksumSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationPreA11ChecksumSamples - size and identity", () => {
  it("keeps a compact useful checksum set", () => {
    expect(punjabiRemediationPreA11ChecksumSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationPreA11ChecksumSamples.length).toBeLessThanOrEqual(16);
  });

  it("has unique checksum ids", () => {
    const ids = punjabiRemediationPreA11ChecksumSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^checksum-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationPreA11ChecksumSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationPreA11ChecksumSample)[] = [
    "checksumRouteId",
    "prompt_pa",
    "prompt_en",
    "checksumRepair_pa",
    "checksumRepair_en",
    "checksumCriteria_vi",
    "checksumCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "checksumCheck",
    "commonTrap",
  ];

  it("fills every required checksum field", () => {
    for (const item of punjabiRemediationPreA11ChecksumSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationPreA11ChecksumSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.checksumRepair_pa), `${item.id}.checksumRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.checksumRepair_pa).not.toBe(item.checksumRepair_roman);
    }
  });

  it("keeps Vietnamese and English checksum guidance distinct", () => {
    for (const item of punjabiRemediationPreA11ChecksumSamples) {
      expect(item.checksumCriteria_vi).not.toBe(item.checksumCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.checksumCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationPreA11ChecksumSamples - coverage and readiness", () => {
  it("covers every requested checksum focus", () => {
    const present = new Set<PunjabiRemediationPreA11ChecksumSample["focus"]>();
    for (const item of punjabiRemediationPreA11ChecksumSamples) {
      expect(PUNJABI_PRE_A11_CHECKSUM_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_PRE_A11_CHECKSUM_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationPreA11ChecksumSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationPreA11ChecksumSample["audience"]>();
    for (const item of punjabiRemediationPreA11ChecksumSamples) {
      expect(PUNJABI_PRE_A11_CHECKSUM_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.checksumRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_PRE_A11_CHECKSUM_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical checksum recovery", () => {
    const canadaItems = punjabiRemediationPreA11ChecksumSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.checksumRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.checksumRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.checksumRepair_pa.includes("ਕਲੀਨਿਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.checksumCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationPreA11ChecksumSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_PRE_A11_CHECKSUM_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationPreA11ChecksumSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_PRE_A11_CHECKSUM_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 48 pre-a11-checksum samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationPreA11ChecksumSample[] = punjabiRemediationPreA11ChecksumSamples;
void _typecheck;
