import { describe, expect, it } from "vitest";

import {
  PUNJABI_CLOSURE_PACKET_CHECK_TYPES,
  PUNJABI_CLOSURE_PACKET_FOCI,
  PUNJABI_REMEDIATION_CLOSURE_PACKET_NOTICE,
  punjabiRemediationClosurePacketSamples,
  punjabiRemediationClosurePacketSamplesByAudience,
  punjabiRemediationClosurePacketSamplesByFocus,
  type PunjabiRemediationClosurePacketSample,
} from "@/languages/punjabi/remediationClosurePacketSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationClosurePacketSamples - identity", () => {
  it("keeps a compact useful closure packet set", () => {
    expect(punjabiRemediationClosurePacketSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationClosurePacketSamples.length).toBeLessThanOrEqual(16);
  });

  it("has unique closure packet ids", () => {
    const ids = punjabiRemediationClosurePacketSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^closure-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationClosurePacketSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationClosurePacketSample)[] = [
    "closurePacketId",
    "prompt_pa",
    "prompt_en",
    "closureRepair_pa",
    "closureRepair_en",
    "learnerExplanation_vi",
    "learnerExplanation_en",
    "closureCheck",
    "rejectIf_vi",
    "rejectIf_en",
    "commonTrap",
  ];

  it("fills every required closure field", () => {
    for (const item of punjabiRemediationClosurePacketSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.evidenceArtifactIds.length, `${item.id}.evidenceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationClosurePacketSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.closureRepair_pa), `${item.id}.closureRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.closureRepair_pa).not.toBe(item.closureRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationClosurePacketSamples) {
      expect(item.learnerExplanation_vi).not.toBe(item.learnerExplanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.learnerExplanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationClosurePacketSamples - coverage", () => {
  it("covers every requested closure packet focus", () => {
    const present = new Set<PunjabiRemediationClosurePacketSample["focus"]>();
    for (const item of punjabiRemediationClosurePacketSamples) {
      expect(PUNJABI_CLOSURE_PACKET_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_CLOSURE_PACKET_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationClosurePacketSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationClosurePacketSample["audience"]>();
    for (const item of punjabiRemediationClosurePacketSamples) {
      expect(PUNJABI_CLOSURE_PACKET_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.closurePacketId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.evidenceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_CLOSURE_PACKET_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical closure and service phrase samples", () => {
    const canadaItems = punjabiRemediationClosurePacketSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    expect(canadaItems.some((item) => item.closureRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.closureRepair_pa.includes("ਕਲੀਨਿਕ"))).toBe(true);
    expect(canadaItems.some((item) => item.closureRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.closureRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.closureCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus and audience helpers for app consumption", () => {
    expect(punjabiRemediationClosurePacketSamplesByFocus("script-confusion").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationClosurePacketSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationClosurePacketSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationClosurePacketSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationClosurePacketSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CLOSURE_PACKET_NOTICE} ${JSON.stringify(
      punjabiRemediationClosurePacketSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_CLOSURE_PACKET_NOTICE.toLowerCase();
    expect(notice).toContain("wave 50 closure packet samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationClosurePacketSample[] = punjabiRemediationClosurePacketSamples;
void _typecheck;
