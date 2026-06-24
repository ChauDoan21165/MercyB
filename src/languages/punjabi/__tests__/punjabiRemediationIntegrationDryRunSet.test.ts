import { describe, expect, it } from "vitest";

import {
  PUNJABI_DRY_RUN_FOCI,
  PUNJABI_DRY_RUN_SELECTORS,
  PUNJABI_REMEDIATION_INTEGRATION_DRY_RUN_NOTICE,
  punjabiRemediationIntegrationDryRunSet,
  type PunjabiRemediationDryRunItem,
} from "@/languages/punjabi/remediationIntegrationDryRunSet";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationIntegrationDryRunSet - size and identity", () => {
  it("keeps a compact useful dry-run set", () => {
    expect(punjabiRemediationIntegrationDryRunSet.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationIntegrationDryRunSet.length).toBeLessThanOrEqual(45);
  });

  it("has unique dry-run ids", () => {
    const ids = punjabiRemediationIntegrationDryRunSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^dryrun-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationIntegrationDryRunSet - app fields", () => {
  const requiredText: (keyof PunjabiRemediationDryRunItem)[] = [
    "errorPatternId",
    "diagnosticPromptId",
    "routingRuleId",
    "remediationBankId",
    "coverageChecklistId",
    "regressionGuardId",
    "consistencyReviewId",
    "sample_pa",
    "sample_en",
    "why_vi",
    "why_en",
    "repair_vi",
    "repair_en",
    "dryRunCheck",
    "commonTrap",
  ];

  it("fills every required dry-run field", () => {
    for (const item of punjabiRemediationIntegrationDryRunSet) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary sample lines with romanization only as support", () => {
    for (const item of punjabiRemediationIntegrationDryRunSet) {
      expect(GURMUKHI_SCRIPT.test(item.sample_pa), `${item.id}.sample_pa`).toBe(true);
      expect(item.sample_pa).not.toBe(item.sample_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationIntegrationDryRunSet) {
      expect(item.why_vi).not.toBe(item.why_en);
      expect(item.repair_vi).not.toBe(item.repair_en);
      expect(
        VIETNAMESE_MARKS.test(item.why_vi) || VIETNAMESE_MARKS.test(item.repair_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationIntegrationDryRunSet - coverage and dry-run routing", () => {
  it("covers every requested dry-run focus", () => {
    const present = new Set<PunjabiRemediationDryRunItem["focus"]>();
    for (const item of punjabiRemediationIntegrationDryRunSet) {
      expect(PUNJABI_DRY_RUN_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_DRY_RUN_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all selector types and learner audiences", () => {
    const selectors = new Set<PunjabiRemediationDryRunItem["selector"]>();
    const audiences = new Set<PunjabiRemediationDryRunItem["audience"]>();
    for (const item of punjabiRemediationIntegrationDryRunSet) {
      expect(PUNJABI_DRY_RUN_SELECTORS).toContain(item.selector);
      selectors.add(item.selector);
      audiences.add(item.audience);
      expect(item.errorPatternId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.diagnosticPromptId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.routingRuleId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.remediationBankId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.coverageChecklistId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.regressionGuardId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.consistencyReviewId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    for (const selector of PUNJABI_DRY_RUN_SELECTORS) {
      expect(selectors.has(selector), `missing selector ${selector}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to pre-integration dry-run checks", () => {
    for (const item of punjabiRemediationIntegrationDryRunSet) {
      expect(item.why_vi.length).toBeGreaterThan(8);
      expect(item.why_en.length).toBeGreaterThan(8);
      expect(item.repair_vi.length).toBeGreaterThan(8);
      expect(item.repair_en.length).toBeGreaterThan(8);
      expect(item.dryRunCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical dry-run routes for real learner gaps", () => {
    const canadaItems = punjabiRemediationIntegrationDryRunSet.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.sample_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationIntegrationDryRunSet - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_INTEGRATION_DRY_RUN_NOTICE} ${JSON.stringify(
      punjabiRemediationIntegrationDryRunSet,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_INTEGRATION_DRY_RUN_NOTICE.toLowerCase();
    expect(notice).toContain("wave 29 integration dry-run selector set only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
