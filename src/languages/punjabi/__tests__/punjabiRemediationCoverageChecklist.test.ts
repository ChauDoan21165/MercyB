import { describe, expect, it } from "vitest";

import {
  PUNJABI_COVERAGE_CHECKLIST_EVIDENCE_TYPES,
  PUNJABI_COVERAGE_CHECKLIST_FOCI,
  PUNJABI_REMEDIATION_COVERAGE_CHECKLIST_NOTICE,
  punjabiRemediationCoverageChecklist,
  type PunjabiRemediationCoverageChecklistItem,
} from "@/languages/punjabi/remediationCoverageChecklist";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCoverageChecklist - size and identity", () => {
  it("keeps a compact useful coverage checklist", () => {
    expect(punjabiRemediationCoverageChecklist.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationCoverageChecklist.length).toBeLessThanOrEqual(45);
  });

  it("has unique checklist ids", () => {
    const ids = punjabiRemediationCoverageChecklist.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^checklist-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCoverageChecklist - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCoverageChecklistItem)[] = [
    "remediationRouteId",
    "checklist_pa",
    "checklist_en",
    "risk_vi",
    "risk_en",
    "stabilityCheck",
    "boundaryCheck",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required checklist field", () => {
    for (const item of punjabiRemediationCoverageChecklist) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary checklist lines with romanization only as support", () => {
    for (const item of punjabiRemediationCoverageChecklist) {
      expect(GURMUKHI_SCRIPT.test(item.checklist_pa), `${item.id}.checklist_pa`).toBe(true);
      expect(item.checklist_pa).not.toBe(item.checklist_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationCoverageChecklist) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCoverageChecklist - coverage and final QA", () => {
  it("covers every requested checklist focus", () => {
    const present = new Set<PunjabiRemediationCoverageChecklistItem["focus"]>();
    for (const item of punjabiRemediationCoverageChecklist) {
      expect(PUNJABI_COVERAGE_CHECKLIST_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_COVERAGE_CHECKLIST_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationCoverageChecklistItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationCoverageChecklistItem["audience"]>();
    for (const item of punjabiRemediationCoverageChecklist) {
      expect(PUNJABI_COVERAGE_CHECKLIST_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_COVERAGE_CHECKLIST_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, stability checks, boundary checks, and final QA", () => {
    for (const item of punjabiRemediationCoverageChecklist) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.stabilityCheck.length).toBeGreaterThan(8);
      expect(item.boundaryCheck.length).toBeGreaterThan(8);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical checklist items for real learner gaps", () => {
    const canadaItems = punjabiRemediationCoverageChecklist.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.checklist_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.checklist_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.checklist_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationCoverageChecklist - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_COVERAGE_CHECKLIST_NOTICE} ${JSON.stringify(
      punjabiRemediationCoverageChecklist,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_COVERAGE_CHECKLIST_NOTICE.toLowerCase();
    expect(notice).toContain("wave 26 coverage checklist only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
