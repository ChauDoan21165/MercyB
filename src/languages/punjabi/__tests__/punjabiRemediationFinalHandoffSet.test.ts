import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_HANDOFF_EVIDENCE_TYPES,
  PUNJABI_FINAL_HANDOFF_FOCI,
  PUNJABI_REMEDIATION_FINAL_HANDOFF_SET_NOTICE,
  punjabiRemediationFinalHandoffSet,
  type PunjabiRemediationFinalHandoffItem,
} from "@/languages/punjabi/remediationFinalHandoffSet";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationFinalHandoffSet - size and identity", () => {
  it("keeps a compact useful final-handoff set", () => {
    expect(punjabiRemediationFinalHandoffSet.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationFinalHandoffSet.length).toBeLessThanOrEqual(45);
  });

  it("has unique final-handoff ids", () => {
    const ids = punjabiRemediationFinalHandoffSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^handoff-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationFinalHandoffSet - app fields", () => {
  const requiredText: (keyof PunjabiRemediationFinalHandoffItem)[] = [
    "routeId",
    "handoff_pa",
    "handoff_en",
    "risk_vi",
    "risk_en",
    "diagnosticPrompt_vi",
    "diagnosticPrompt_en",
    "routingRule_vi",
    "routingRule_en",
    "remediationBankId",
    "coverageChecklistId",
    "regressionGuard_vi",
    "regressionGuard_en",
    "consistencyReview_vi",
    "consistencyReview_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required handoff field", () => {
    for (const item of punjabiRemediationFinalHandoffSet) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary handoff lines with romanization only as support", () => {
    for (const item of punjabiRemediationFinalHandoffSet) {
      expect(GURMUKHI_SCRIPT.test(item.handoff_pa), `${item.id}.handoff_pa`).toBe(true);
      expect(item.handoff_pa).not.toBe(item.handoff_roman);
    }
  });

  it("keeps Vietnamese and English handoff guidance distinct", () => {
    for (const item of punjabiRemediationFinalHandoffSet) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.diagnosticPrompt_vi).not.toBe(item.diagnosticPrompt_en);
      expect(item.routingRule_vi).not.toBe(item.routingRule_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.diagnosticPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationFinalHandoffSet - coverage and final QA", () => {
  it("covers every requested final-handoff focus", () => {
    const present = new Set<PunjabiRemediationFinalHandoffItem["focus"]>();
    for (const item of punjabiRemediationFinalHandoffSet) {
      expect(PUNJABI_FINAL_HANDOFF_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_FINAL_HANDOFF_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationFinalHandoffItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationFinalHandoffItem["audience"]>();
    for (const item of punjabiRemediationFinalHandoffSet) {
      expect(PUNJABI_FINAL_HANDOFF_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
      expect(item.routeId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.remediationBankId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.coverageChecklistId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const evidenceType of PUNJABI_FINAL_HANDOFF_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to diagnostic prompts, routing rules, remediation banks, coverage checklists, regression guards, consistency review, and final QA", () => {
    for (const item of punjabiRemediationFinalHandoffSet) {
      expect(item.diagnosticPrompt_vi.length).toBeGreaterThan(8);
      expect(item.diagnosticPrompt_en.length).toBeGreaterThan(8);
      expect(item.routingRule_vi.length).toBeGreaterThan(8);
      expect(item.routingRule_en.length).toBeGreaterThan(8);
      expect(item.regressionGuard_vi.length).toBeGreaterThan(8);
      expect(item.regressionGuard_en.length).toBeGreaterThan(8);
      expect(item.consistencyReview_vi.length).toBeGreaterThan(8);
      expect(item.consistencyReview_en.length).toBeGreaterThan(8);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical final handoff routes for real learner gaps", () => {
    const canadaItems = punjabiRemediationFinalHandoffSet.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.handoff_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.handoff_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.handoff_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationFinalHandoffSet - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_FINAL_HANDOFF_SET_NOTICE} ${JSON.stringify(
      punjabiRemediationFinalHandoffSet,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_FINAL_HANDOFF_SET_NOTICE.toLowerCase();
    expect(notice).toContain("wave 30 final handoff set only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
