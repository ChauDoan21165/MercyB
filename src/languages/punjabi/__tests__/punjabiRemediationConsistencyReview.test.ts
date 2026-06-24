import { describe, expect, it } from "vitest";

import {
  PUNJABI_CONSISTENCY_REVIEW_EVIDENCE_TYPES,
  PUNJABI_CONSISTENCY_REVIEW_FOCI,
  PUNJABI_REMEDIATION_CONSISTENCY_REVIEW_NOTICE,
  punjabiRemediationConsistencyReview,
  type PunjabiRemediationConsistencyReviewItem,
} from "@/languages/punjabi/remediationConsistencyReview";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationConsistencyReview - size and identity", () => {
  it("keeps a compact useful consistency-review set", () => {
    expect(punjabiRemediationConsistencyReview.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationConsistencyReview.length).toBeLessThanOrEqual(45);
  });

  it("has unique consistency-review ids", () => {
    const ids = punjabiRemediationConsistencyReview.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^review-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationConsistencyReview - app fields", () => {
  const requiredText: (keyof PunjabiRemediationConsistencyReviewItem)[] = [
    "remediationRouteId",
    "review_pa",
    "review_en",
    "risk_vi",
    "risk_en",
    "consistencyCheck",
    "guardrailCheck",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required consistency-review field", () => {
    for (const item of punjabiRemediationConsistencyReview) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary review lines with romanization only as support", () => {
    for (const item of punjabiRemediationConsistencyReview) {
      expect(GURMUKHI_SCRIPT.test(item.review_pa), `${item.id}.review_pa`).toBe(true);
      expect(item.review_pa).not.toBe(item.review_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationConsistencyReview) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationConsistencyReview - coverage and final QA", () => {
  it("covers every requested consistency-review focus", () => {
    const present = new Set<PunjabiRemediationConsistencyReviewItem["focus"]>();
    for (const item of punjabiRemediationConsistencyReview) {
      expect(PUNJABI_CONSISTENCY_REVIEW_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_CONSISTENCY_REVIEW_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationConsistencyReviewItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationConsistencyReviewItem["audience"]>();
    for (const item of punjabiRemediationConsistencyReview) {
      expect(PUNJABI_CONSISTENCY_REVIEW_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_CONSISTENCY_REVIEW_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, consistency checks, guardrails, and final QA", () => {
    for (const item of punjabiRemediationConsistencyReview) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.consistencyCheck.length).toBeGreaterThan(8);
      expect(item.guardrailCheck.length).toBeGreaterThan(8);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical consistency-review items for real learner gaps", () => {
    const canadaItems = punjabiRemediationConsistencyReview.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.review_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.review_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.review_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationConsistencyReview - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CONSISTENCY_REVIEW_NOTICE} ${JSON.stringify(
      punjabiRemediationConsistencyReview,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_CONSISTENCY_REVIEW_NOTICE.toLowerCase();
    expect(notice).toContain("wave 27 consistency review only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
