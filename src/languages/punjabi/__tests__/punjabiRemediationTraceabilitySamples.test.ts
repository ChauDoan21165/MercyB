import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_TRACEABILITY_FOCI,
  PUNJABI_REMEDIATION_TRACEABILITY_NOTICE,
  PUNJABI_REMEDIATION_TRACEABILITY_STAGES,
  punjabiRemediationTraceabilitySamples,
  punjabiRemediationTraceabilitySamplesByAudience,
  punjabiRemediationTraceabilitySamplesByFocus,
  punjabiRemediationTraceabilitySamplesByStage,
  type PunjabiRemediationTraceabilitySample,
} from "@/languages/punjabi/remediationTraceabilitySamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationTraceabilitySamples - identity", () => {
  it("keeps a compact useful traceability set", () => {
    expect(punjabiRemediationTraceabilitySamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationTraceabilitySamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique traceability ids", () => {
    const ids = punjabiRemediationTraceabilitySamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^traceability-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationTraceabilitySamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationTraceabilitySample)[] = [
    "traceabilityId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "traceabilityRepair_pa",
    "traceabilityRepair_en",
    "explanation_vi",
    "explanation_en",
    "traceabilityCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required traceability field", () => {
    for (const item of punjabiRemediationTraceabilitySamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationTraceabilitySamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.traceabilityRepair_pa), `${item.id}.traceabilityRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.traceabilityRepair_pa).not.toBe(item.traceabilityRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationTraceabilitySamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationTraceabilitySamples - coverage", () => {
  it("covers every requested traceability focus", () => {
    const present = new Set<PunjabiRemediationTraceabilitySample["focus"]>();
    for (const item of punjabiRemediationTraceabilitySamples) {
      expect(PUNJABI_REMEDIATION_TRACEABILITY_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_TRACEABILITY_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all traceability stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationTraceabilitySample["stage"]>();
    const audiences = new Set<PunjabiRemediationTraceabilitySample["audience"]>();
    for (const item of punjabiRemediationTraceabilitySamples) {
      expect(PUNJABI_REMEDIATION_TRACEABILITY_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.traceabilityId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_TRACEABILITY_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery traceability items", () => {
    const canadaItems = punjabiRemediationTraceabilitySamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.traceabilityRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.traceabilityRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.traceabilityRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.traceabilityRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.traceabilityCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationTraceabilitySamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationTraceabilitySamplesByStage("pre-a11-traceability").length).toBeGreaterThan(0);
    expect(punjabiRemediationTraceabilitySamplesByStage("inventory-seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationTraceabilitySamplesByStage("catalog").length).toBeGreaterThan(0);
    expect(punjabiRemediationTraceabilitySamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationTraceabilitySamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationTraceabilitySamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationTraceabilitySamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationTraceabilitySamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_TRACEABILITY_NOTICE} ${JSON.stringify(
      punjabiRemediationTraceabilitySamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_TRACEABILITY_NOTICE.toLowerCase();
    expect(notice).toContain("wave 62 remediation traceability samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationTraceabilitySample[] = punjabiRemediationTraceabilitySamples;
void _typecheck;
