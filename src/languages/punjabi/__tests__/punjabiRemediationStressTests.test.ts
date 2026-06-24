import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_STRESS_TESTS_NOTICE,
  PUNJABI_STRESS_TEST_EVIDENCE_TYPES,
  PUNJABI_STRESS_TEST_FOCI,
  punjabiRemediationStressTests,
  type PunjabiRemediationStressTestItem,
} from "@/languages/punjabi/remediationStressTests";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationStressTests - size and identity", () => {
  it("keeps a compact useful stress-test set", () => {
    expect(punjabiRemediationStressTests.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationStressTests.length).toBeLessThanOrEqual(45);
  });

  it("has unique stress-test ids", () => {
    const ids = punjabiRemediationStressTests.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^stress-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationStressTests - app fields", () => {
  const requiredText: (keyof PunjabiRemediationStressTestItem)[] = [
    "remediationRouteId",
    "stress_pa",
    "stress_en",
    "risk_vi",
    "risk_en",
    "failureTrigger",
    "recoverySignal",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required stress-test field", () => {
    for (const item of punjabiRemediationStressTests) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary stress lines with romanization only as support", () => {
    for (const item of punjabiRemediationStressTests) {
      expect(GURMUKHI_SCRIPT.test(item.stress_pa), `${item.id}.stress_pa`).toBe(true);
      expect(item.stress_pa).not.toBe(item.stress_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationStressTests) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationStressTests - coverage and final QA", () => {
  it("covers every requested stress-test focus", () => {
    const present = new Set<PunjabiRemediationStressTestItem["focus"]>();
    for (const item of punjabiRemediationStressTests) {
      expect(PUNJABI_STRESS_TEST_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_STRESS_TEST_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationStressTestItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationStressTestItem["audience"]>();
    for (const item of punjabiRemediationStressTests) {
      expect(PUNJABI_STRESS_TEST_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_STRESS_TEST_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, failure triggers, and final QA", () => {
    for (const item of punjabiRemediationStressTests) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.failureTrigger.length).toBeGreaterThan(8);
      expect(item.recoverySignal.length).toBeGreaterThan(8);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical stress tests for real learner gaps", () => {
    const canadaItems = punjabiRemediationStressTests.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.stress_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.stress_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.stress_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationStressTests - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_STRESS_TESTS_NOTICE} ${JSON.stringify(
      punjabiRemediationStressTests,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_STRESS_TESTS_NOTICE.toLowerCase();
    expect(notice).toContain("wave 23 stress tests only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
