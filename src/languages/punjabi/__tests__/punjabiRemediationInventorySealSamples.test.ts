import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_INVENTORY_SEAL_FOCI,
  PUNJABI_REMEDIATION_INVENTORY_SEAL_NOTICE,
  PUNJABI_REMEDIATION_INVENTORY_SEAL_STAGES,
  punjabiRemediationInventorySealSamples,
  punjabiRemediationInventorySealSamplesByAudience,
  punjabiRemediationInventorySealSamplesByFocus,
  punjabiRemediationInventorySealSamplesByStage,
  type PunjabiRemediationInventorySealSample,
} from "@/languages/punjabi/remediationInventorySealSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationInventorySealSamples - identity", () => {
  it("keeps a compact useful inventory seal set", () => {
    expect(punjabiRemediationInventorySealSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationInventorySealSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique inventory seal ids", () => {
    const ids = punjabiRemediationInventorySealSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^inventory-seal-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationInventorySealSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationInventorySealSample)[] = [
    "inventorySealId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "inventorySealRepair_pa",
    "inventorySealRepair_en",
    "explanation_vi",
    "explanation_en",
    "inventorySealCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required inventory seal field", () => {
    for (const item of punjabiRemediationInventorySealSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationInventorySealSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.inventorySealRepair_pa), `${item.id}.inventorySealRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.inventorySealRepair_pa).not.toBe(item.inventorySealRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationInventorySealSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationInventorySealSamples - coverage", () => {
  it("covers every requested inventory seal focus", () => {
    const present = new Set<PunjabiRemediationInventorySealSample["focus"]>();
    for (const item of punjabiRemediationInventorySealSamples) {
      expect(PUNJABI_REMEDIATION_INVENTORY_SEAL_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_INVENTORY_SEAL_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all inventory seal stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationInventorySealSample["stage"]>();
    const audiences = new Set<PunjabiRemediationInventorySealSample["audience"]>();
    for (const item of punjabiRemediationInventorySealSamples) {
      expect(PUNJABI_REMEDIATION_INVENTORY_SEAL_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.inventorySealId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_INVENTORY_SEAL_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery inventory seals", () => {
    const canadaItems = punjabiRemediationInventorySealSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.inventorySealRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.inventorySealRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.inventorySealRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.inventorySealRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.inventorySealCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationInventorySealSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationInventorySealSamplesByStage("pre-a11-inventory-seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationInventorySealSamplesByStage("bundle").length).toBeGreaterThan(0);
    expect(punjabiRemediationInventorySealSamplesByStage("catalog").length).toBeGreaterThan(0);
    expect(punjabiRemediationInventorySealSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationInventorySealSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationInventorySealSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationInventorySealSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationInventorySealSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_INVENTORY_SEAL_NOTICE} ${JSON.stringify(
      punjabiRemediationInventorySealSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_INVENTORY_SEAL_NOTICE.toLowerCase();
    expect(notice).toContain("wave 59 remediation inventory seal samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationInventorySealSample[] = punjabiRemediationInventorySealSamples;
void _typecheck;
