import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_SAFETY_GUARDS_NOTICE,
  PUNJABI_SAFETY_GUARD_EVIDENCE_TYPES,
  PUNJABI_SAFETY_GUARD_FOCI,
  punjabiRemediationSafetyGuards,
  type PunjabiRemediationSafetyGuardItem,
} from "@/languages/punjabi/remediationSafetyGuards";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationSafetyGuards - size and identity", () => {
  it("keeps a compact useful safety-guard set", () => {
    expect(punjabiRemediationSafetyGuards.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationSafetyGuards.length).toBeLessThanOrEqual(45);
  });

  it("has unique safety-guard ids", () => {
    const ids = punjabiRemediationSafetyGuards.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^safety-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationSafetyGuards - app fields", () => {
  const requiredText: (keyof PunjabiRemediationSafetyGuardItem)[] = [
    "remediationRouteId",
    "safety_pa",
    "safety_en",
    "risk_vi",
    "risk_en",
    "safetySignal",
    "qualityCheck",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required safety-guard field", () => {
    for (const item of punjabiRemediationSafetyGuards) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary guard lines with romanization only as support", () => {
    for (const item of punjabiRemediationSafetyGuards) {
      expect(GURMUKHI_SCRIPT.test(item.safety_pa), `${item.id}.safety_pa`).toBe(true);
      expect(item.safety_pa).not.toBe(item.safety_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationSafetyGuards) {
      expect(item.risk_vi).not.toBe(item.risk_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.risk_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationSafetyGuards - coverage and final QA", () => {
  it("covers every requested safety-guard focus", () => {
    const present = new Set<PunjabiRemediationSafetyGuardItem["focus"]>();
    for (const item of punjabiRemediationSafetyGuards) {
      expect(PUNJABI_SAFETY_GUARD_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_SAFETY_GUARD_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationSafetyGuardItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationSafetyGuardItem["audience"]>();
    for (const item of punjabiRemediationSafetyGuards) {
      expect(PUNJABI_SAFETY_GUARD_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_SAFETY_GUARD_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, safety signals, quality checks, and final QA", () => {
    for (const item of punjabiRemediationSafetyGuards) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.safetySignal.length).toBeGreaterThan(8);
      expect(item.qualityCheck.length).toBeGreaterThan(8);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical safety guards for real learner gaps", () => {
    const canadaItems = punjabiRemediationSafetyGuards.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.safety_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.safety_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.safety_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationSafetyGuards - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_SAFETY_GUARDS_NOTICE} ${JSON.stringify(
      punjabiRemediationSafetyGuards,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_SAFETY_GUARDS_NOTICE.toLowerCase();
    expect(notice).toContain("wave 25 safety guards only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
