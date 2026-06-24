import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_BUNDLE_FOCI,
  PUNJABI_REMEDIATION_BUNDLE_NOTICE,
  PUNJABI_REMEDIATION_BUNDLE_STAGES,
  punjabiRemediationBundleSamples,
  punjabiRemediationBundleSamplesByAudience,
  punjabiRemediationBundleSamplesByFocus,
  punjabiRemediationBundleSamplesByStage,
  type PunjabiRemediationBundleSample,
} from "@/languages/punjabi/remediationBundleSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationBundleSamples - identity", () => {
  it("keeps a compact useful bundle set", () => {
    expect(punjabiRemediationBundleSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationBundleSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique bundle ids", () => {
    const ids = punjabiRemediationBundleSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^bundle-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationBundleSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationBundleSample)[] = [
    "bundleId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "bundleRepair_pa",
    "bundleRepair_en",
    "explanation_vi",
    "explanation_en",
    "bundleCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required bundle field", () => {
    for (const item of punjabiRemediationBundleSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationBundleSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.bundleRepair_pa), `${item.id}.bundleRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.bundleRepair_pa).not.toBe(item.bundleRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationBundleSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationBundleSamples - coverage", () => {
  it("covers every requested bundle focus", () => {
    const present = new Set<PunjabiRemediationBundleSample["focus"]>();
    for (const item of punjabiRemediationBundleSamples) {
      expect(PUNJABI_REMEDIATION_BUNDLE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_BUNDLE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all bundle stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationBundleSample["stage"]>();
    const audiences = new Set<PunjabiRemediationBundleSample["audience"]>();
    for (const item of punjabiRemediationBundleSamples) {
      expect(PUNJABI_REMEDIATION_BUNDLE_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.bundleId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_BUNDLE_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery bundles", () => {
    const canadaItems = punjabiRemediationBundleSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.bundleRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.bundleRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.bundleRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.bundleRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.bundleCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationBundleSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationBundleSamplesByStage("pre-a11-bundle").length).toBeGreaterThan(0);
    expect(punjabiRemediationBundleSamplesByStage("receipt").length).toBeGreaterThan(0);
    expect(punjabiRemediationBundleSamplesByStage("ledger").length).toBeGreaterThan(0);
    expect(punjabiRemediationBundleSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationBundleSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationBundleSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationBundleSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationBundleSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_BUNDLE_NOTICE} ${JSON.stringify(
      punjabiRemediationBundleSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_BUNDLE_NOTICE.toLowerCase();
    expect(notice).toContain("wave 57 remediation bundle samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationBundleSample[] = punjabiRemediationBundleSamples;
void _typecheck;
