import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_LEDGER_FOCI,
  PUNJABI_REMEDIATION_LEDGER_NOTICE,
  PUNJABI_REMEDIATION_LEDGER_STAGES,
  punjabiRemediationLedgerSamples,
  punjabiRemediationLedgerSamplesByAudience,
  punjabiRemediationLedgerSamplesByFocus,
  punjabiRemediationLedgerSamplesByStage,
  type PunjabiRemediationLedgerSample,
} from "@/languages/punjabi/remediationLedgerSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationLedgerSamples - identity", () => {
  it("keeps a compact useful ledger set", () => {
    expect(punjabiRemediationLedgerSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRemediationLedgerSamples.length).toBeLessThanOrEqual(14);
  });

  it("has unique ledger ids", () => {
    const ids = punjabiRemediationLedgerSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^ledger-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationLedgerSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationLedgerSample)[] = [
    "ledgerId",
    "learnerPrompt_pa",
    "learnerPrompt_en",
    "ledgerRepair_pa",
    "ledgerRepair_en",
    "explanation_vi",
    "explanation_en",
    "ledgerCheck",
    "commonTrap",
    "rejectIf_vi",
    "rejectIf_en",
  ];

  it("fills every required ledger field", () => {
    for (const item of punjabiRemediationLedgerSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary content with romanization only as support", () => {
    for (const item of punjabiRemediationLedgerSamples) {
      expect(GURMUKHI_SCRIPT.test(item.learnerPrompt_pa), `${item.id}.learnerPrompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.ledgerRepair_pa), `${item.id}.ledgerRepair_pa`).toBe(true);
      expect(item.learnerPrompt_pa).not.toBe(item.learnerPrompt_roman);
      expect(item.ledgerRepair_pa).not.toBe(item.ledgerRepair_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const item of punjabiRemediationLedgerSamples) {
      expect(item.explanation_vi).not.toBe(item.explanation_en);
      expect(item.rejectIf_vi).not.toBe(item.rejectIf_en);
      expect(
        VIETNAMESE_MARKS.test(item.explanation_vi) || VIETNAMESE_MARKS.test(item.rejectIf_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationLedgerSamples - coverage", () => {
  it("covers every requested ledger focus", () => {
    const present = new Set<PunjabiRemediationLedgerSample["focus"]>();
    for (const item of punjabiRemediationLedgerSamples) {
      expect(PUNJABI_REMEDIATION_LEDGER_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_LEDGER_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all ledger stages and learner audiences", () => {
    const stages = new Set<PunjabiRemediationLedgerSample["stage"]>();
    const audiences = new Set<PunjabiRemediationLedgerSample["audience"]>();
    for (const item of punjabiRemediationLedgerSamples) {
      expect(PUNJABI_REMEDIATION_LEDGER_STAGES).toContain(item.stage);
      stages.add(item.stage);
      audiences.add(item.audience);
      expect(item.ledgerId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const stage of PUNJABI_REMEDIATION_LEDGER_STAGES) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical service recovery ledgers", () => {
    const canadaItems = punjabiRemediationLedgerSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(canadaItems.some((item) => item.ledgerRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.ledgerRepair_pa.includes("ਫਾਰਮੇਸੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.ledgerRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.ledgerRepair_pa.includes("ਬੈਂਕ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.ledgerCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectIf_en.toLowerCase()).toContain("reject");
    }
  });

  it("provides focus, stage, and audience helpers for app consumption", () => {
    expect(punjabiRemediationLedgerSamplesByFocus("romanization-dependence").length).toBeGreaterThanOrEqual(2);
    expect(punjabiRemediationLedgerSamplesByStage("pre-a11-ledger").length).toBeGreaterThan(0);
    expect(punjabiRemediationLedgerSamplesByStage("archive").length).toBeGreaterThan(0);
    expect(punjabiRemediationLedgerSamplesByStage("signoff").length).toBeGreaterThan(0);
    expect(punjabiRemediationLedgerSamplesByStage("pre-integration").length).toBeGreaterThan(0);
    expect(punjabiRemediationLedgerSamplesByAudience("vi").length).toBeGreaterThan(0);
    expect(punjabiRemediationLedgerSamplesByAudience("en").length).toBeGreaterThan(0);
    expect(punjabiRemediationLedgerSamplesByAudience("both").length).toBeGreaterThan(0);
  });
});

describe("punjabiRemediationLedgerSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_LEDGER_NOTICE} ${JSON.stringify(
      punjabiRemediationLedgerSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_LEDGER_NOTICE.toLowerCase();
    expect(notice).toContain("wave 55 remediation ledger samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});

const _typecheck: PunjabiRemediationLedgerSample[] = punjabiRemediationLedgerSamples;
void _typecheck;
