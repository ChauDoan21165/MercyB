import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_FOCI,
  PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_NOTICE,
  PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_STAGES,
  punjabiRemediationEvidenceReceiptSamples,
  punjabiRemediationEvidenceReceiptSamplesByAudience,
  punjabiRemediationEvidenceReceiptSamplesByFocus,
  punjabiRemediationEvidenceReceiptSamplesByStage,
  type PunjabiRemediationEvidenceReceiptSample,
} from "@/languages/punjabi/remediationEvidenceReceiptSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationEvidenceReceiptSamples - identity", () => {
  it("keeps a compact useful evidence receipt set", () => {
    expect(punjabiRemediationEvidenceReceiptSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationEvidenceReceiptSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique evidence receipt ids", () => {
    const ids = punjabiRemediationEvidenceReceiptSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^evidence-receipt-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationEvidenceReceiptSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationEvidenceReceiptSample)[] = [
    "evidenceReceiptId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "evidenceReceiptRepair_pa",
    "evidenceReceiptRepair_en",
    "explanation_vi",
    "explanation_en",
    "evidenceReceiptCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required evidence receipt field", () => {
    for (const item of punjabiRemediationEvidenceReceiptSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationEvidenceReceiptSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.evidenceReceiptRepair_pa), `${item.id}.evidenceReceiptRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.evidenceReceiptRepair_pa).not.toBe(item.evidenceReceiptRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationEvidenceReceiptSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationEvidenceReceiptSamples - coverage", () => {
  it("covers every requested evidence receipt focus", () => {
    const present = new Set<PunjabiRemediationEvidenceReceiptSample["focus"]>();
    for (const item of punjabiRemediationEvidenceReceiptSamples) {
      expect(PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence receipt stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationEvidenceReceiptSample["stage"]>();
    const audiences = new Set<PunjabiRemediationEvidenceReceiptSample["audience"]>();
    for (const item of punjabiRemediationEvidenceReceiptSamples) {
      expect(PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.evidenceReceiptId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery evidence receipts", () => {
    const canadaItems = punjabiRemediationEvidenceReceiptSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.evidenceReceiptRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.evidenceReceiptRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.evidenceReceiptRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.evidenceReceiptRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.evidenceReceiptCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationEvidenceReceiptSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationEvidenceReceiptSamplesByStage("pre-a11-evidence-receipt").length).toBeGreaterThan(0);
    expect(punjabiRemediationEvidenceReceiptSamplesByStage("inventory-seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationEvidenceReceiptSamplesByStage("catalog").length).toBeGreaterThan(0);
    expect(punjabiRemediationEvidenceReceiptSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationEvidenceReceiptSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationEvidenceReceiptSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationEvidenceReceiptSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationEvidenceReceiptSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_NOTICE} ${JSON.stringify(
      punjabiRemediationEvidenceReceiptSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_EVIDENCE_RECEIPT_NOTICE.toLowerCase();
    expect(notice).toContain("wave 61 remediation evidence receipt samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationEvidenceReceiptSample[] = punjabiRemediationEvidenceReceiptSamples;
void _typecheck;
