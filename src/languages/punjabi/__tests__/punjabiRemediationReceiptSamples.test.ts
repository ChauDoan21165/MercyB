import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_RECEIPT_FOCI,
  PUNJABI_REMEDIATION_RECEIPT_NOTICE,
  PUNJABI_REMEDIATION_RECEIPT_STAGES,
  punjabiRemediationReceiptSamples,
  punjabiRemediationReceiptSamplesByAudience,
  punjabiRemediationReceiptSamplesByFocus,
  punjabiRemediationReceiptSamplesByStage,
  type PunjabiRemediationReceiptSample,
} from "@/languages/punjabi/remediationReceiptSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationReceiptSamples - identity", () => {
  it("keeps a compact useful receipt set", () => {
    expect(punjabiRemediationReceiptSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationReceiptSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique receipt ids", () => {
    const ids = punjabiRemediationReceiptSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^receipt-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationReceiptSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationReceiptSample)[] = [
    "receiptId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "receiptRepair_pa",
    "receiptRepair_en",
    "explanation_vi",
    "explanation_en",
    "receiptCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required receipt field", () => {
    for (const item of punjabiRemediationReceiptSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationReceiptSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.receiptRepair_pa), `${item.id}.receiptRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.receiptRepair_pa).not.toBe(item.receiptRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationReceiptSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationReceiptSamples - coverage", () => {
  it("covers every requested receipt focus", () => {
    const present = new Set<PunjabiRemediationReceiptSample["focus"]>();
    for (const item of punjabiRemediationReceiptSamples) {
      expect(PUNJABI_REMEDIATION_RECEIPT_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_RECEIPT_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all receipt stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationReceiptSample["stage"]>();
    const audiences = new Set<PunjabiRemediationReceiptSample["audience"]>();
    for (const item of punjabiRemediationReceiptSamples) {
      expect(PUNJABI_REMEDIATION_RECEIPT_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.receiptId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_RECEIPT_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery receipts", () => {
    const canadaItems = punjabiRemediationReceiptSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.receiptRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.receiptRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.receiptRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.receiptRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.receiptCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationReceiptSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationReceiptSamplesByStage("pre-a11-receipt").length).toBeGreaterThan(0);
    expect(punjabiRemediationReceiptSamplesByStage("ledger").length).toBeGreaterThan(0);
    expect(punjabiRemediationReceiptSamplesByStage("archive").length).toBeGreaterThan(0);
    expect(punjabiRemediationReceiptSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationReceiptSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationReceiptSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationReceiptSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationReceiptSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_RECEIPT_NOTICE} ${JSON.stringify(
      punjabiRemediationReceiptSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_RECEIPT_NOTICE.toLowerCase();
    expect(notice).toContain("wave 56 remediation receipt samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationReceiptSample[] = punjabiRemediationReceiptSamples;
void _typecheck;
