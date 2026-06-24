import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_COMPLETION_RECORD_FOCI,
  PUNJABI_REMEDIATION_COMPLETION_RECORD_NOTICE,
  PUNJABI_REMEDIATION_COMPLETION_RECORD_STAGES,
  punjabiRemediationCompletionRecordSamples,
  punjabiRemediationCompletionRecordSamplesByAudience,
  punjabiRemediationCompletionRecordSamplesByFocus,
  punjabiRemediationCompletionRecordSamplesByStage,
  type PunjabiRemediationCompletionRecordSample,
} from "@/languages/punjabi/remediationCompletionRecordSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCompletionRecordSamples - identity", () => {
  it("keeps a compact useful completion record set", () => {
    expect(punjabiRemediationCompletionRecordSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationCompletionRecordSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique completion record ids", () => {
    const ids = punjabiRemediationCompletionRecordSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^completion-record-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCompletionRecordSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCompletionRecordSample)[] = [
    "completionRecordId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "completionRecordRepair_pa",
    "completionRecordRepair_en",
    "explanation_vi",
    "explanation_en",
    "completionRecordCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required completion record field", () => {
    for (const item of punjabiRemediationCompletionRecordSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationCompletionRecordSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.completionRecordRepair_pa), `${item.id}.completionRecordRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.completionRecordRepair_pa).not.toBe(item.completionRecordRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationCompletionRecordSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCompletionRecordSamples - coverage", () => {
  it("covers every requested completion record focus", () => {
    const present = new Set<PunjabiRemediationCompletionRecordSample["focus"]>();
    for (const item of punjabiRemediationCompletionRecordSamples) {
      expect(PUNJABI_REMEDIATION_COMPLETION_RECORD_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_COMPLETION_RECORD_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all completion record stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationCompletionRecordSample["stage"]>();
    const audiences = new Set<PunjabiRemediationCompletionRecordSample["audience"]>();
    for (const item of punjabiRemediationCompletionRecordSamples) {
      expect(PUNJABI_REMEDIATION_COMPLETION_RECORD_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.completionRecordId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_COMPLETION_RECORD_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery completion records", () => {
    const canadaItems = punjabiRemediationCompletionRecordSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.completionRecordRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.completionRecordRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.completionRecordRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.completionRecordRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.completionRecordCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationCompletionRecordSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationCompletionRecordSamplesByStage("pre-a11-completion-record").length).toBeGreaterThan(0);
    expect(punjabiRemediationCompletionRecordSamplesByStage("inventory-seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationCompletionRecordSamplesByStage("catalog").length).toBeGreaterThan(0);
    expect(punjabiRemediationCompletionRecordSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationCompletionRecordSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationCompletionRecordSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationCompletionRecordSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationCompletionRecordSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_COMPLETION_RECORD_NOTICE} ${JSON.stringify(
      punjabiRemediationCompletionRecordSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_COMPLETION_RECORD_NOTICE.toLowerCase();
    expect(notice).toContain("wave 60 remediation completion record samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationCompletionRecordSample[] = punjabiRemediationCompletionRecordSamples;
void _typecheck;
