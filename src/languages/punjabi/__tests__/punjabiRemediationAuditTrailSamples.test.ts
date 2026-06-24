import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_AUDIT_TRAIL_FOCI,
  PUNJABI_REMEDIATION_AUDIT_TRAIL_NOTICE,
  PUNJABI_REMEDIATION_AUDIT_TRAIL_STAGES,
  punjabiRemediationAuditTrailSamples,
  punjabiRemediationAuditTrailSamplesByAudience,
  punjabiRemediationAuditTrailSamplesByFocus,
  punjabiRemediationAuditTrailSamplesByStage,
  type PunjabiRemediationAuditTrailSample,
} from "@/languages/punjabi/remediationAuditTrailSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationAuditTrailSamples - identity", () => {
  it("keeps a compact useful audit-trail set", () => {
    expect(punjabiRemediationAuditTrailSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationAuditTrailSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique audit-trail ids", () => {
    const ids = punjabiRemediationAuditTrailSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^audit-trail-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationAuditTrailSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationAuditTrailSample)[] = [
    "auditTrailId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "auditTrailRepair_pa",
    "auditTrailRepair_en",
    "explanation_vi",
    "explanation_en",
    "auditTrailCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required audit-trail field", () => {
    for (const item of punjabiRemediationAuditTrailSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationAuditTrailSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.auditTrailRepair_pa), `${item.id}.auditTrailRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.auditTrailRepair_pa).not.toBe(item.auditTrailRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationAuditTrailSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationAuditTrailSamples - coverage", () => {
  it("covers every requested audit-trail focus", () => {
    const present = new Set<PunjabiRemediationAuditTrailSample["focus"]>();
    for (const item of punjabiRemediationAuditTrailSamples) {
      expect(PUNJABI_REMEDIATION_AUDIT_TRAIL_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_AUDIT_TRAIL_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all audit-trail stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationAuditTrailSample["stage"]>();
    const audiences = new Set<PunjabiRemediationAuditTrailSample["audience"]>();
    for (const item of punjabiRemediationAuditTrailSamples) {
      expect(PUNJABI_REMEDIATION_AUDIT_TRAIL_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.auditTrailId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_AUDIT_TRAIL_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery audit-trail items", () => {
    const canadaItems = punjabiRemediationAuditTrailSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.auditTrailRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.auditTrailRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.auditTrailRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.auditTrailRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.auditTrailCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationAuditTrailSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationAuditTrailSamplesByStage("pre-a11-audit-trail").length).toBeGreaterThan(0);
    expect(punjabiRemediationAuditTrailSamplesByStage("inventory-seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationAuditTrailSamplesByStage("catalog").length).toBeGreaterThan(0);
    expect(punjabiRemediationAuditTrailSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationAuditTrailSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationAuditTrailSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationAuditTrailSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationAuditTrailSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_AUDIT_TRAIL_NOTICE} ${JSON.stringify(
      punjabiRemediationAuditTrailSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_AUDIT_TRAIL_NOTICE.toLowerCase();
    expect(notice).toContain("wave 63 remediation audit-trail samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationAuditTrailSample[] = punjabiRemediationAuditTrailSamples;
void _typecheck;
