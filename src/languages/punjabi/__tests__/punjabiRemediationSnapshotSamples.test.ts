import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_SNAPSHOT_FOCI,
  PUNJABI_REMEDIATION_SNAPSHOT_NOTICE,
  PUNJABI_REMEDIATION_SNAPSHOT_STAGES,
  punjabiRemediationSnapshotSamples,
  punjabiRemediationSnapshotSamplesByAudience,
  punjabiRemediationSnapshotSamplesByFocus,
  punjabiRemediationSnapshotSamplesByStage,
  type PunjabiRemediationSnapshotSample,
} from "@/languages/punjabi/remediationSnapshotSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationSnapshotSamples - identity", () => {
  it("keeps a compact useful snapshot set", () => {
    expect(punjabiRemediationSnapshotSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationSnapshotSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique snapshot ids", () => {
    const ids = punjabiRemediationSnapshotSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^snapshot-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationSnapshotSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationSnapshotSample)[] = [
    "snapshotId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "stableRepair_pa",
    "stableRepair_en",
    "explanation_vi",
    "explanation_en",
    "snapshotCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required snapshot field", () => {
    for (const item of punjabiRemediationSnapshotSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationSnapshotSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.stableRepair_pa), `${item.id}.stableRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.stableRepair_pa).not.toBe(item.stableRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationSnapshotSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationSnapshotSamples - coverage", () => {
  it("covers every requested snapshot focus", () => {
    const present = new Set<PunjabiRemediationSnapshotSample["focus"]>();
    for (const item of punjabiRemediationSnapshotSamples) {
      expect(PUNJABI_REMEDIATION_SNAPSHOT_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_SNAPSHOT_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all snapshot stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationSnapshotSample["stage"]>();
    const audiences = new Set<PunjabiRemediationSnapshotSample["audience"]>();
    for (const item of punjabiRemediationSnapshotSamples) {
      expect(PUNJABI_REMEDIATION_SNAPSHOT_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.snapshotId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_SNAPSHOT_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery snapshots", () => {
    const canadaItems = punjabiRemediationSnapshotSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.stableRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.snapshotCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationSnapshotSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationSnapshotSamplesByStage("pre-a11-snapshot").length).toBeGreaterThan(0);
    expect(punjabiRemediationSnapshotSamplesByStage("closure-packet").length).toBeGreaterThan(0);
    expect(punjabiRemediationSnapshotSamplesByStage("pre-merge").length).toBeGreaterThan(0);
    expect(punjabiRemediationSnapshotSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationSnapshotSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationSnapshotSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationSnapshotSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationSnapshotSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_SNAPSHOT_NOTICE} ${JSON.stringify(
      punjabiRemediationSnapshotSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_SNAPSHOT_NOTICE.toLowerCase();
    expect(notice).toContain("wave 51 remediation snapshot samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationSnapshotSample[] = punjabiRemediationSnapshotSamples;
void _typecheck;
