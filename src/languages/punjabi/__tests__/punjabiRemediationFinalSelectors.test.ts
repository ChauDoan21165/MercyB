import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_SELECTOR_EVIDENCE_TYPES,
  PUNJABI_FINAL_SELECTOR_FOCI,
  PUNJABI_REMEDIATION_FINAL_SELECTORS_NOTICE,
  punjabiRemediationFinalSelectors,
  type PunjabiRemediationFinalSelectorItem,
} from "@/languages/punjabi/remediationFinalSelectors";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationFinalSelectors - size and identity", () => {
  it("keeps a compact useful final-selector set", () => {
    expect(punjabiRemediationFinalSelectors.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationFinalSelectors.length).toBeLessThanOrEqual(45);
  });

  it("has unique final-selector ids", () => {
    const ids = punjabiRemediationFinalSelectors.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^selector-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationFinalSelectors - app fields", () => {
  const requiredText: (keyof PunjabiRemediationFinalSelectorItem)[] = [
    "remediationRouteId",
    "selector_pa",
    "selector_en",
    "risk_vi",
    "risk_en",
    "selectorCheck",
    "readinessCheck",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required final-selector field", () => {
    for (const item of punjabiRemediationFinalSelectors) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary selector lines with romanization only as support", () => {
    for (const item of punjabiRemediationFinalSelectors) {
      expect(GURMUKHI_SCRIPT.test(item.selector_pa), `${item.id}.selector_pa`).toBe(true);
      expect(item.selector_pa).not.toBe(item.selector_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationFinalSelectors) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationFinalSelectors - coverage and final QA", () => {
  it("covers every requested final-selector focus", () => {
    const present = new Set<PunjabiRemediationFinalSelectorItem["focus"]>();
    for (const item of punjabiRemediationFinalSelectors) {
      expect(PUNJABI_FINAL_SELECTOR_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_FINAL_SELECTOR_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationFinalSelectorItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationFinalSelectorItem["audience"]>();
    for (const item of punjabiRemediationFinalSelectors) {
      expect(PUNJABI_FINAL_SELECTOR_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_FINAL_SELECTOR_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, selector checks, readiness checks, and final QA", () => {
    for (const item of punjabiRemediationFinalSelectors) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.selectorCheck.length).toBeGreaterThan(8);
      expect(item.readinessCheck.length).toBeGreaterThan(8);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical final selectors for real learner gaps", () => {
    const canadaItems = punjabiRemediationFinalSelectors.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.selector_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.selector_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.selector_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationFinalSelectors - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_FINAL_SELECTORS_NOTICE} ${JSON.stringify(
      punjabiRemediationFinalSelectors,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_FINAL_SELECTORS_NOTICE.toLowerCase();
    expect(notice).toContain("wave 28 final selectors only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
