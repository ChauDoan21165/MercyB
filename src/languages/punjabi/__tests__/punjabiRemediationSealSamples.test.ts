import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_SEAL_FOCI,
  PUNJABI_REMEDIATION_SEAL_NOTICE,
  PUNJABI_REMEDIATION_SEAL_STAGES,
  punjabiRemediationSealSamples,
  punjabiRemediationSealSamplesByAudience,
  punjabiRemediationSealSamplesByFocus,
  punjabiRemediationSealSamplesByStage,
  type PunjabiRemediationSealSample,
} from "@/languages/punjabi/remediationSealSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationSealSamples - identity", () => {
  it("keeps a compact useful seal set", () => {
    expect(punjabiRemediationSealSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationSealSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique seal ids", () => {
    const ids = punjabiRemediationSealSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^seal-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationSealSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationSealSample)[] = [
    "sealId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "sealedRepair_pa",
    "sealedRepair_en",
    "explanation_vi",
    "explanation_en",
    "sealCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required seal field", () => {
    for (const item of punjabiRemediationSealSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationSealSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.sealedRepair_pa), `${item.id}.sealedRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.sealedRepair_pa).not.toBe(item.sealedRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationSealSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationSealSamples - coverage", () => {
  it("covers every requested seal focus", () => {
    const present = new Set<PunjabiRemediationSealSample["focus"]>();
    for (const item of punjabiRemediationSealSamples) {
      expect(PUNJABI_REMEDIATION_SEAL_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_SEAL_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all seal stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationSealSample["stage"]>();
    const audiences = new Set<PunjabiRemediationSealSample["audience"]>();
    for (const item of punjabiRemediationSealSamples) {
      expect(PUNJABI_REMEDIATION_SEAL_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.sealId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_SEAL_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery seals", () => {
    const canadaItems = punjabiRemediationSealSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.sealedRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.sealedRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sealedRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sealedRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.sealCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationSealSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationSealSamplesByStage("pre-a11-seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationSealSamplesByStage("snapshot").length).toBeGreaterThan(0);
    expect(punjabiRemediationSealSamplesByStage("closure-packet").length).toBeGreaterThan(0);
    expect(punjabiRemediationSealSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationSealSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationSealSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationSealSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationSealSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_SEAL_NOTICE} ${JSON.stringify(
      punjabiRemediationSealSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_SEAL_NOTICE.toLowerCase();
    expect(notice).toContain("wave 52 remediation seal samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationSealSample[] = punjabiRemediationSealSamples;
void _typecheck;
