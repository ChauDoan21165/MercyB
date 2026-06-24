import { describe, expect, it } from "vitest";

import {
  PUNJABI_PRE_MERGE_CHECK_TYPES,
  PUNJABI_PRE_MERGE_FOCI,
  PUNJABI_REMEDIATION_PRE_MERGE_SAMPLES_NOTICE,
  punjabiRemediationPreMergeSamples,
  punjabiRemediationPreMergeSamplesByContext,
  punjabiRemediationPreMergeSamplesByFocus,
  type PunjabiRemediationPreMergeSample,
} from "@/languages/punjabi/remediationPreMergeSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationPreMergeSamples - size and identity", () => {
  it("keeps a compact useful pre-merge set", () => {
    expect(punjabiRemediationPreMergeSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationPreMergeSamples.length).toBeLessThanOrEqual(16);
  });

  it("has unique pre-merge ids", () => {
    const ids = punjabiRemediationPreMergeSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^premerge-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationPreMergeSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationPreMergeSample)[] = [
    "preMergeRouteId",
    "prompt_pa",
    "prompt_en",
    "stableRepair_pa",
    "stableRepair_en",
    "learnerExplanation_vi",
    "learnerExplanation_en",
    "preMergeCheck",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "commonTrap",
  ];

  it("fills every required pre-merge field", () => {
    for (const item of punjabiRemediationPreMergeSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompts and repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationPreMergeSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.stableRepair_pa), `${item.id}.stableRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.stableRepair_pa).not.toBe(item.stableRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationPreMergeSamples) {
      expect(item.learnerExplanation_vi).not.toBe(item.learnerExplanation_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.learnerExplanation_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationPreMergeSamples - coverage and readiness", () => {
  it("covers every requested pre-merge focus", () => {
    const present = new Set<PunjabiRemediationPreMergeSample["focus"]>();
    for (const item of punjabiRemediationPreMergeSamples) {
      expect(PUNJABI_PRE_MERGE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_PRE_MERGE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationPreMergeSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationPreMergeSample["audience"]>();
    for (const item of punjabiRemediationPreMergeSamples) {
      expect(PUNJABI_PRE_MERGE_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.preMergeRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_PRE_MERGE_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical recovery and service phrase samples", () => {
    const canadaItems = punjabiRemediationPreMergeSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਕਲੀਨਿਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.preMergeCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus and audience helpers for app consumption", () => {
    expect(punjabiRemediationPreMergeSamplesByFocus("script-confusion").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationPreMergeSamplesByContext("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationPreMergeSamplesByContext("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationPreMergeSamplesByContext("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationPreMergeSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_PRE_MERGE_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationPreMergeSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_PRE_MERGE_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 49 pre-merge samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationPreMergeSample[] = punjabiRemediationPreMergeSamples;
void _typecheck;
