import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_REGRESSION_GUARDS_NOTICE,
  PUNJABI_REGRESSION_GUARD_EVIDENCE_TYPES,
  PUNJABI_REGRESSION_GUARD_FOCI,
  punjabiRemediationRegressionGuards,
  type PunjabiRemediationRegressionGuardItem,
} from "@/languages/punjabi/remediationRegressionGuards";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationRegressionGuards - size and identity", () => {
  it("keeps a compact useful regression-guard set", () => {
    expect(punjabiRemediationRegressionGuards.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationRegressionGuards.length).toBeLessThanOrEqual(45);
  });

  it("has unique regression-guard ids", () => {
    const ids = punjabiRemediationRegressionGuards.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^guard-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationRegressionGuards - app fields", () => {
  const requiredText: (keyof PunjabiRemediationRegressionGuardItem)[] = [
    "remediationRouteId",
    "guard_pa",
    "guard_en",
    "risk_vi",
    "risk_en",
    "regressionSignal",
    "hardeningCheck",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required regression-guard field", () => {
    for (const item of punjabiRemediationRegressionGuards) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary guard lines with romanization only as support", () => {
    for (const item of punjabiRemediationRegressionGuards) {
      expect(GURMUKHI_SCRIPT.test(item.guard_pa), `${item.id}.guard_pa`).toBe(true);
      expect(item.guard_pa).not.toBe(item.guard_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationRegressionGuards) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationRegressionGuards - coverage and final QA", () => {
  it("covers every requested regression-guard focus", () => {
    const present = new Set<PunjabiRemediationRegressionGuardItem["focus"]>();
    for (const item of punjabiRemediationRegressionGuards) {
      expect(PUNJABI_REGRESSION_GUARD_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REGRESSION_GUARD_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationRegressionGuardItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationRegressionGuardItem["audience"]>();
    for (const item of punjabiRemediationRegressionGuards) {
      expect(PUNJABI_REGRESSION_GUARD_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_REGRESSION_GUARD_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, regression signals, hardening, and final QA", () => {
    for (const item of punjabiRemediationRegressionGuards) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.regressionSignal.length).toBeGreaterThan(8);
      expect(item.hardeningCheck.length).toBeGreaterThan(8);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical regression guards for real learner gaps", () => {
    const canadaItems = punjabiRemediationRegressionGuards.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.guard_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.guard_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.guard_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationRegressionGuards - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_REGRESSION_GUARDS_NOTICE} ${JSON.stringify(
      punjabiRemediationRegressionGuards,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_REGRESSION_GUARDS_NOTICE.toLowerCase();
    expect(notice).toContain("wave 24 regression guards only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
