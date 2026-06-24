import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_SIGNOFF_FOCI,
  PUNJABI_REMEDIATION_SIGNOFF_NOTICE,
  PUNJABI_REMEDIATION_SIGNOFF_STAGES,
  punjabiRemediationSignoffSamples,
  punjabiRemediationSignoffSamplesByAudience,
  punjabiRemediationSignoffSamplesByFocus,
  punjabiRemediationSignoffSamplesByStage,
  type PunjabiRemediationSignoffSample,
} from "@/languages/punjabi/remediationSignoffSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationSignoffSamples - identity", () => {
  it("keeps a compact useful signoff set", () => {
    expect(punjabiRemediationSignoffSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationSignoffSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique signoff ids", () => {
    const ids = punjabiRemediationSignoffSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^signoff-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationSignoffSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationSignoffSample)[] = [
    "signoffId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "signedRepair_pa",
    "signedRepair_en",
    "explanation_vi",
    "explanation_en",
    "signoffCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required signoff field", () => {
    for (const item of punjabiRemediationSignoffSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationSignoffSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.signedRepair_pa), `${item.id}.signedRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.signedRepair_pa).not.toBe(item.signedRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationSignoffSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationSignoffSamples - coverage", () => {
  it("covers every requested signoff focus", () => {
    const present = new Set<PunjabiRemediationSignoffSample["focus"]>();
    for (const item of punjabiRemediationSignoffSamples) {
      expect(PUNJABI_REMEDIATION_SIGNOFF_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_SIGNOFF_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all signoff stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationSignoffSample["stage"]>();
    const audiences = new Set<PunjabiRemediationSignoffSample["audience"]>();
    for (const item of punjabiRemediationSignoffSamples) {
      expect(PUNJABI_REMEDIATION_SIGNOFF_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.signoffId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_SIGNOFF_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery signoffs", () => {
    const canadaItems = punjabiRemediationSignoffSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.signedRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.signedRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.signedRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.signedRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.signoffCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationSignoffSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationSignoffSamplesByStage("pre-a11-signoff").length).toBeGreaterThan(0);
    expect(punjabiRemediationSignoffSamplesByStage("seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationSignoffSamplesByStage("snapshot").length).toBeGreaterThan(0);
    expect(punjabiRemediationSignoffSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationSignoffSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationSignoffSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationSignoffSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationSignoffSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_SIGNOFF_NOTICE} ${JSON.stringify(
      punjabiRemediationSignoffSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_SIGNOFF_NOTICE.toLowerCase();
    expect(notice).toContain("wave 53 remediation signoff samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationSignoffSample[] = punjabiRemediationSignoffSamples;
void _typecheck;
