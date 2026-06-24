import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_CATALOG_FOCI,
  PUNJABI_REMEDIATION_CATALOG_NOTICE,
  PUNJABI_REMEDIATION_CATALOG_STAGES,
  punjabiRemediationCatalogSamples,
  punjabiRemediationCatalogSamplesByAudience,
  punjabiRemediationCatalogSamplesByFocus,
  punjabiRemediationCatalogSamplesByStage,
  type PunjabiRemediationCatalogSample,
} from "@/languages/punjabi/remediationCatalogSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCatalogSamples - identity", () => {
  it("keeps a compact useful catalog set", () => {
    expect(punjabiRemediationCatalogSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationCatalogSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique catalog ids", () => {
    const ids = punjabiRemediationCatalogSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^catalog-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCatalogSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCatalogSample)[] = [
    "catalogId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "catalogRepair_pa",
    "catalogRepair_en",
    "explanation_vi",
    "explanation_en",
    "catalogCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required catalog field", () => {
    for (const item of punjabiRemediationCatalogSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationCatalogSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.catalogRepair_pa), `${item.id}.catalogRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.catalogRepair_pa).not.toBe(item.catalogRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationCatalogSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCatalogSamples - coverage", () => {
  it("covers every requested catalog focus", () => {
    const present = new Set<PunjabiRemediationCatalogSample["focus"]>();
    for (const item of punjabiRemediationCatalogSamples) {
      expect(PUNJABI_REMEDIATION_CATALOG_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_CATALOG_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all catalog stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationCatalogSample["stage"]>();
    const audiences = new Set<PunjabiRemediationCatalogSample["audience"]>();
    for (const item of punjabiRemediationCatalogSamples) {
      expect(PUNJABI_REMEDIATION_CATALOG_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.catalogId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_CATALOG_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery catalogs", () => {
    const canadaItems = punjabiRemediationCatalogSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.catalogRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.catalogRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.catalogRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.catalogRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.catalogCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationCatalogSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationCatalogSamplesByStage("pre-a11-catalog").length).toBeGreaterThan(0);
    expect(punjabiRemediationCatalogSamplesByStage("bundle").length).toBeGreaterThan(0);
    expect(punjabiRemediationCatalogSamplesByStage("receipt").length).toBeGreaterThan(0);
    expect(punjabiRemediationCatalogSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationCatalogSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationCatalogSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationCatalogSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationCatalogSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CATALOG_NOTICE} ${JSON.stringify(
      punjabiRemediationCatalogSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_CATALOG_NOTICE.toLowerCase();
    expect(notice).toContain("wave 58 remediation catalog samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationCatalogSample[] = punjabiRemediationCatalogSamples;
void _typecheck;
