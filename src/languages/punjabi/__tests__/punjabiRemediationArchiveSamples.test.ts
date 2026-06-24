import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_ARCHIVE_FOCI,
  PUNJABI_REMEDIATION_ARCHIVE_NOTICE,
  PUNJABI_REMEDIATION_ARCHIVE_STAGES,
  punjabiRemediationArchiveSamples,
  punjabiRemediationArchiveSamplesByAudience,
  punjabiRemediationArchiveSamplesByFocus,
  punjabiRemediationArchiveSamplesByStage,
  type PunjabiRemediationArchiveSample,
} from "@/languages/punjabi/remediationArchiveSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationArchiveSamples - identity", () => {
  it("keeps a compact useful archive set", () => {
    expect(punjabiRemediationArchiveSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationArchiveSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique archive ids", () => {
    const ids = punjabiRemediationArchiveSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^archive-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationArchiveSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationArchiveSample)[] = [
    "archiveId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "archivedRepair_pa",
    "archivedRepair_en",
    "explanation_vi",
    "explanation_en",
    "archiveCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required archive field", () => {
    for (const item of punjabiRemediationArchiveSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationArchiveSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.archivedRepair_pa), `${item.id}.archivedRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.archivedRepair_pa).not.toBe(item.archivedRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationArchiveSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationArchiveSamples - coverage", () => {
  it("covers every requested archive focus", () => {
    const present = new Set<PunjabiRemediationArchiveSample["focus"]>();
    for (const item of punjabiRemediationArchiveSamples) {
      expect(PUNJABI_REMEDIATION_ARCHIVE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_ARCHIVE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all archive stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationArchiveSample["stage"]>();
    const audiences = new Set<PunjabiRemediationArchiveSample["audience"]>();
    for (const item of punjabiRemediationArchiveSamples) {
      expect(PUNJABI_REMEDIATION_ARCHIVE_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.archiveId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_ARCHIVE_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery archives", () => {
    const canadaItems = punjabiRemediationArchiveSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.archivedRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.archivedRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.archivedRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.archivedRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.archiveCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationArchiveSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationArchiveSamplesByStage("pre-a11-archive").length).toBeGreaterThan(0);
    expect(punjabiRemediationArchiveSamplesByStage("signoff").length).toBeGreaterThan(0);
    expect(punjabiRemediationArchiveSamplesByStage("seal").length).toBeGreaterThan(0);
    expect(punjabiRemediationArchiveSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationArchiveSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationArchiveSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationArchiveSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationArchiveSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_ARCHIVE_NOTICE} ${JSON.stringify(
      punjabiRemediationArchiveSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_ARCHIVE_NOTICE.toLowerCase();
    expect(notice).toContain("wave 54 remediation archive samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationArchiveSample[] = punjabiRemediationArchiveSamples;
void _typecheck;
