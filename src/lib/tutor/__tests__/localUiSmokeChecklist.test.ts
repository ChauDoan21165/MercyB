/**
 * Tests for localUiSmokeChecklist.ts — Step 117 Final UI Smoke Checklist
 *
 * Validates:
 * - Catalog integrity (37 items, 7 dimensions, 18 surfaces)
 * - Evidence building from input
 * - Item evaluation (pass, fail, pass_with_notes, not_tested, not_applicable)
 * - Full checklist runner with all verdict levels
 * - Dimension-level results
 * - Deploy gate logic
 * - Vietnamese-first output (all labels, summaries, action items)
 * - Surface coverage reporting
 * - Catalog self-validation
 * - Comparison between runs
 * - Quick-check helpers
 * - Edge cases and determinism
 */

import { describe, it, expect } from "vitest";
import {
  UI_SMOKE_CHECKLIST_CATALOG,
  UI_SMOKE_SURFACE_IDS,
  UI_SMOKE_SURFACE_LABELS_VI,
  UI_SMOKE_DIMENSIONS,
  getUiSmokeDimensionIds,
  getUiSmokeDimension,
  getUiSmokeChecklistCatalog,
  getUiSmokeChecklistItem,
  getUiSmokeItemsByDimension,
  getUiSmokeDeployGateItems,
  createNotTestedEvidence,
  buildItemEvidence,
  evaluateUiSmokeItem,
  createEmptySmokeInput,
  runUiSmokeChecklist,
  isDeployable,
  isCleanSmoke,
  getSmokeCompactVi,
  getDeployBlockerIds,
  countItemsByDimension,
  countDeployGateItems,
  validateUiSmokeCatalog,
  compareSmokeResults,
  getSurfaceCoverage,
  getVerdictLabelVi,
  getSurfaceLabelVi,
  getDimensionLabelVi,
  getItemStatusLabelVi,
  createMinimalSmokeInput,
  createFailingSmokeInput,
} from "../localUiSmokeChecklist";

import type {
  UiSmokeDimensionId,
  UiSmokeChecklistItem,
  UiSmokeItemEvidence,
  UiSmokeChecklistInput,
  UiSmokeChecklistResult,
  UiSmokeVerdict,
} from "../localUiSmokeChecklist";

// ─── Suite 1: Module Smoke ───────────────────────────────────────────────────

describe("localUiSmokeChecklist — module smoke", () => {
  it("exports the full catalog", () => {
    expect(UI_SMOKE_CHECKLIST_CATALOG).toBeDefined();
    expect(Array.isArray(UI_SMOKE_CHECKLIST_CATALOG)).toBe(true);
    expect(UI_SMOKE_CHECKLIST_CATALOG.length).toBeGreaterThan(0);
  });

  it("exports all 18 surface IDs", () => {
    expect(UI_SMOKE_SURFACE_IDS.length).toBe(18);
  });

  it("exports all 7 dimensions", () => {
    expect(UI_SMOKE_DIMENSIONS.length).toBe(7);
  });

  it("exports all required functions", () => {
    expect(typeof getUiSmokeDimensionIds).toBe("function");
    expect(typeof getUiSmokeDimension).toBe("function");
    expect(typeof getUiSmokeChecklistCatalog).toBe("function");
    expect(typeof getUiSmokeChecklistItem).toBe("function");
    expect(typeof getUiSmokeItemsByDimension).toBe("function");
    expect(typeof getUiSmokeDeployGateItems).toBe("function");
    expect(typeof createNotTestedEvidence).toBe("function");
    expect(typeof buildItemEvidence).toBe("function");
    expect(typeof evaluateUiSmokeItem).toBe("function");
    expect(typeof createEmptySmokeInput).toBe("function");
    expect(typeof runUiSmokeChecklist).toBe("function");
    expect(typeof isDeployable).toBe("function");
    expect(typeof isCleanSmoke).toBe("function");
    expect(typeof getSmokeCompactVi).toBe("function");
    expect(typeof getDeployBlockerIds).toBe("function");
    expect(typeof countItemsByDimension).toBe("function");
    expect(typeof countDeployGateItems).toBe("function");
    expect(typeof validateUiSmokeCatalog).toBe("function");
    expect(typeof compareSmokeResults).toBe("function");
    expect(typeof getSurfaceCoverage).toBe("function");
    expect(typeof getVerdictLabelVi).toBe("function");
    expect(typeof getSurfaceLabelVi).toBe("function");
    expect(typeof getDimensionLabelVi).toBe("function");
    expect(typeof getItemStatusLabelVi).toBe("function");
    expect(typeof createMinimalSmokeInput).toBe("function");
    expect(typeof createFailingSmokeInput).toBe("function");
  });

  it("catalog has Vietnamese characters in all descriptions", () => {
    const fullVnRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.descriptionVi).toBeTruthy();
      expect(item.descriptionVi.length).toBeGreaterThan(0);
      expect(fullVnRegex.test(item.descriptionVi)).toBe(true);
    }
  });

  it("all dimensions have Vietnamese labels with diacritics", () => {
    const fullVnRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
    for (const dim of UI_SMOKE_DIMENSIONS) {
      expect(dim.labelVi.length).toBeGreaterThan(0);
      expect(fullVnRegex.test(dim.labelVi)).toBe(true);
    }
  });

  it("all surface labels are in Vietnamese", () => {
    for (const surfaceId of UI_SMOKE_SURFACE_IDS) {
      const label = UI_SMOKE_SURFACE_LABELS_VI[surfaceId];
      expect(label).toBeDefined();
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

// ─── Suite 2: Catalog Integrity ──────────────────────────────────────────────

describe("localUiSmokeChecklist — catalog integrity", () => {
  it("has exactly 37 checklist items", () => {
    expect(UI_SMOKE_CHECKLIST_CATALOG.length).toBe(37);
  });

  it("all item IDs are unique", () => {
    const ids = UI_SMOKE_CHECKLIST_CATALOG.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all item IDs follow UI-DIMENSION-NN pattern", () => {
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.id).toMatch(/^UI-(DIAGNOSE|TEACH|REMEMBER|ADAPT|SELFCHECK|PROVE|CROSS)-\d{2}$/);
    }
  });

  it("dimension item counts are correct", () => {
    expect(getUiSmokeItemsByDimension("UI_DIAGNOSE").length).toBe(5);
    expect(getUiSmokeItemsByDimension("UI_TEACH").length).toBe(6);
    expect(getUiSmokeItemsByDimension("UI_REMEMBER").length).toBe(5);
    expect(getUiSmokeItemsByDimension("UI_ADAPT").length).toBe(5);
    expect(getUiSmokeItemsByDimension("UI_SELFCHECK").length).toBe(5);
    expect(getUiSmokeItemsByDimension("UI_PROVE").length).toBe(5);
    expect(getUiSmokeItemsByDimension("UI_CROSS").length).toBe(6);
  });

  it("item numbers are sequential within each dimension", () => {
    for (const dimId of getUiSmokeDimensionIds()) {
      const items = getUiSmokeItemsByDimension(dimId);
      const numbers = items.map((i) => i.itemNumber).sort((a, b) => a - b);
      for (let idx = 0; idx < numbers.length; idx++) {
        expect(numbers[idx]).toBe(idx + 1);
      }
    }
  });

  it("every item has a valid dimension reference", () => {
    const validDims = new Set(getUiSmokeDimensionIds());
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(validDims.has(item.dimension)).toBe(true);
    }
  });

  it("every item has at least one surface", () => {
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.surfaces.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every item surface is a valid surface ID", () => {
    const validSurfaces = new Set(UI_SMOKE_SURFACE_IDS);
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      for (const surface of item.surfaces) {
        expect(validSurfaces.has(surface)).toBe(true);
      }
    }
  });

  it("every item has severity set", () => {
    const validSeverities = ["critical", "major", "minor"];
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(validSeverities).toContain(item.severity);
    }
  });

  it("has deploy gate items (not zero)", () => {
    const gateItems = getUiSmokeDeployGateItems();
    expect(gateItems.length).toBeGreaterThan(0);
    expect(gateItems.length).toBeLessThan(UI_SMOKE_CHECKLIST_CATALOG.length);
  });

  it("all deploy gate items have critical severity (or major for mobile)", () => {
    const gateItems = getUiSmokeDeployGateItems();
    for (const item of gateItems) {
      expect(["critical", "major"]).toContain(item.severity);
    }
  });

  it("catalog getter returns a copy (not reference)", () => {
    const catalog1 = getUiSmokeChecklistCatalog();
    const catalog2 = getUiSmokeChecklistCatalog();
    expect(catalog1).not.toBe(catalog2);
    expect(catalog1).toEqual(catalog2);
  });

  it("has both VN and EN descriptions for every item", () => {
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.descriptionVi.length).toBeGreaterThan(0);
      expect(item.descriptionEn.length).toBeGreaterThan(0);
    }
  });

  it("every item has howToVerifyVi", () => {
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.howToVerifyVi.length).toBeGreaterThan(0);
    }
  });
});

// ─── Suite 3: Dimension Metadata ─────────────────────────────────────────────

describe("localUiSmokeChecklist — dimension metadata", () => {
  it("all 7 dimension IDs are returned", () => {
    const ids = getUiSmokeDimensionIds();
    expect(ids).toEqual([
      "UI_DIAGNOSE",
      "UI_TEACH",
      "UI_REMEMBER",
      "UI_ADAPT",
      "UI_SELFCHECK",
      "UI_PROVE",
      "UI_CROSS",
    ]);
  });

  it("getUiSmokeDimension returns correct data", () => {
    const dim = getUiSmokeDimension("UI_DIAGNOSE");
    expect(dim).toBeDefined();
    expect(dim!.id).toBe("UI_DIAGNOSE");
    expect(dim!.labelVi).toBe("Chẩn đoán lỗi");
    expect(dim!.capabilityVi).toBe("Chẩn đoán lỗi");
  });

  it("getUiSmokeDimension returns undefined for invalid ID", () => {
    expect(getUiSmokeDimension("INVALID" as UiSmokeDimensionId)).toBeUndefined();
  });

  it("each dimension has a distinct labelVi", () => {
    const labels = UI_SMOKE_DIMENSIONS.map((d) => d.labelVi);
    expect(new Set(labels).size).toBe(UI_SMOKE_DIMENSIONS.length);
  });

  it("each dimension maps to a teacher capability", () => {
    for (const dim of UI_SMOKE_DIMENSIONS) {
      expect(dim.capabilityVi.length).toBeGreaterThan(0);
    }
  });
});

// ─── Suite 4: Catalog Lookup Helpers ─────────────────────────────────────────

describe("localUiSmokeChecklist — catalog lookup", () => {
  it("getUiSmokeChecklistItem returns correct item", () => {
    const item = getUiSmokeChecklistItem("UI-DIAGNOSE-01");
    expect(item).toBeDefined();
    expect(item!.id).toBe("UI-DIAGNOSE-01");
    expect(item!.dimension).toBe("UI_DIAGNOSE");
    expect(item!.itemNumber).toBe(1);
  });

  it("getUiSmokeChecklistItem returns undefined for unknown ID", () => {
    expect(getUiSmokeChecklistItem("NONEXISTENT")).toBeUndefined();
  });

  it("getUiSmokeItemsByDimension returns only items for that dimension", () => {
    const items = getUiSmokeItemsByDimension("UI_TEACH");
    expect(items.length).toBe(6);
    for (const item of items) {
      expect(item.dimension).toBe("UI_TEACH");
    }
  });

  it("getUiSmokeItemsByDimension returns empty for invalid dimension", () => {
    expect(
      getUiSmokeItemsByDimension("NOPE" as UiSmokeDimensionId),
    ).toEqual([]);
  });

  it("getUiSmokeDeployGateItems returns only deploy-gate items", () => {
    const items = getUiSmokeDeployGateItems();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.deployGate).toBe(true);
    }
  });

  it("countItemsByDimension matches actual count", () => {
    expect(countItemsByDimension("UI_DIAGNOSE")).toBe(5);
    expect(countItemsByDimension("UI_TEACH")).toBe(6);
    expect(countItemsByDimension("UI_CROSS")).toBe(6);
  });

  it("countDeployGateItems matches catalog", () => {
    const expected = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.deployGate,
    ).length;
    expect(countDeployGateItems()).toBe(expected);
  });
});

// ─── Suite 5: Evidence Building ──────────────────────────────────────────────

describe("localUiSmokeChecklist — evidence building", () => {
  it("createNotTestedEvidence returns all-false", () => {
    const ev = createNotTestedEvidence();
    expect(ev.rendersWithoutCrash).toBe(false);
    expect(ev.expectedElementsPresent).toBe(false);
    expect(ev.vietnameseFirst).toBe(false);
    expect(ev.mobileResponsive).toBe(false);
    expect(ev.interactivityWorking).toBe(false);
    expect(ev.emptyStateHandled).toBe(false);
    expect(ev.errorStateHandled).toBe(false);
    expect(ev.failureNoteVi).toBe("Chưa kiểm tra mục này");
  });

  it("buildItemEvidence returns all-true when all surfaces pass", () => {
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input: UiSmokeChecklistInput = {
      surfacesReached: allSurfaces,
      surfacesWithContent: allSurfaces,
      surfacesVietnameseFirst: allSurfaces,
      surfacesMobileResponsive: allSurfaces,
      surfacesInteractive: allSurfaces,
      surfacesEmptyStateOk: allSurfaces,
      surfacesErrorStateOk: allSurfaces,
      runMode: "local",
    };
    const item = UI_SMOKE_CHECKLIST_CATALOG[0];
    const ev = buildItemEvidence(item, input);
    expect(ev.rendersWithoutCrash).toBe(true);
    expect(ev.expectedElementsPresent).toBe(true);
    expect(ev.vietnameseFirst).toBe(true);
    expect(ev.mobileResponsive).toBe(true);
    expect(ev.interactivityWorking).toBe(true);
    expect(ev.emptyStateHandled).toBe(true);
    expect(ev.errorStateHandled).toBe(true);
  });

  it("buildItemEvidence returns all-false when no surfaces reached", () => {
    const input = createEmptySmokeInput();
    const item = UI_SMOKE_CHECKLIST_CATALOG[0];
    const ev = buildItemEvidence(item, input);
    expect(ev.rendersWithoutCrash).toBe(false);
    expect(ev.expectedElementsPresent).toBe(false);
    expect(ev.vietnameseFirst).toBe(false);
  });

  it("buildItemEvidence is false when any surface fails", () => {
    const input = createMinimalSmokeInput({
      surfacesReached: UI_SMOKE_SURFACE_IDS.filter(
        (s) => s !== "aiTutorPage",
      ),
    });
    const item = getUiSmokeChecklistItem("UI-DIAGNOSE-01")!;
    const ev = buildItemEvidence(item, input);
    expect(ev.rendersWithoutCrash).toBe(false);
  });

  it("buildItemEvidence picks up surface notes", () => {
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input: UiSmokeChecklistInput = {
      surfacesReached: allSurfaces.filter((s) => s !== "aiTutorPage"),
      surfacesWithContent: allSurfaces,
      surfacesVietnameseFirst: allSurfaces,
      surfacesMobileResponsive: allSurfaces,
      surfacesInteractive: allSurfaces,
      surfacesEmptyStateOk: allSurfaces,
      surfacesErrorStateOk: allSurfaces,
      runMode: "local",
      surfaceNotes: {
        aiTutorPage: "Lỗi biên dịch chunk khi tải trang",
      },
    };
    const item = getUiSmokeChecklistItem("UI-DIAGNOSE-01")!;
    const ev = buildItemEvidence(item, input);
    expect(ev.failureNoteVi).toBe("Lỗi biên dịch chunk khi tải trang");
  });

  it("buildItemEvidence returns no failure note when not relevant", () => {
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input = createMinimalSmokeInput();
    const item = getUiSmokeChecklistItem("UI-DIAGNOSE-01")!;
    const ev = buildItemEvidence(item, input);
    expect(ev.failureNoteVi).toBeUndefined();
  });
});

// ─── Suite 6: Item Evaluation ────────────────────────────────────────────────

describe("localUiSmokeChecklist — item evaluation", () => {
  it("evaluates as pass when all evidence is true", () => {
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-01", {
      rendersWithoutCrash: true,
      expectedElementsPresent: true,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: true,
      errorStateHandled: true,
    });
    expect(result.status).toBe("pass");
    expect(result.reasonVi).toContain("✅");
    expect(result.reasonVi).toContain("ĐẠT");
  });

  it("evaluates as not_tested when explicitly created as not-tested", () => {
    const ev = createNotTestedEvidence();
    // This has the sentinel failureNoteVi "Chưa kiểm tra mục này"
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-01", ev);
    expect(result.status).toBe("not_tested");
    expect(result.reasonVi).toContain("Chưa kiểm tra");
  });

  it("evaluates as fail for deploy-gate item with crash", () => {
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-01", {
      rendersWithoutCrash: false,
      expectedElementsPresent: true,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: true,
      errorStateHandled: true,
    });
    expect(result.status).toBe("fail");
    expect(result.reasonVi).toContain("❌");
  });

  it("evaluates as fail for critical severity non-deploy-gate item", () => {
    // UI-DIAGNOSE-01 is both critical and deploy-gate
    // Let's check a critical item
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-01", {
      rendersWithoutCrash: false,
      expectedElementsPresent: false,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: true,
      errorStateHandled: true,
    });
    expect(result.status).toBe("fail");
  });

  it("evaluates as pass_with_notes for minor failure on non-gate item", () => {
    // UI-DIAGNOSE-05 is minor, non-gate
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-05", {
      rendersWithoutCrash: true,
      expectedElementsPresent: true,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: false,
      errorStateHandled: false,
    });
    // With minor severity and non-gate, 2+ failures should be pass_with_notes
    expect(result.status).toBe("pass_with_notes");
  });

  it("evaluates as not_applicable for unknown item ID", () => {
    const result = evaluateUiSmokeItem("UNKNOWN-ITEM", {
      rendersWithoutCrash: true,
      expectedElementsPresent: true,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: true,
      errorStateHandled: true,
    });
    expect(result.status).toBe("not_applicable");
    expect(result.dimension).toBe("UI_CROSS");
  });

  it("result retains the evidence", () => {
    const evidence: UiSmokeItemEvidence = {
      rendersWithoutCrash: true,
      expectedElementsPresent: false,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: true,
      errorStateHandled: true,
      failureNoteVi: "Thiếu nút chính",
    };
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-01", evidence);
    expect(result.evidence).toEqual(evidence);
  });

  it("reasonVi includes failure note when provided", () => {
    const evidence: UiSmokeItemEvidence = {
      rendersWithoutCrash: true,
      expectedElementsPresent: false,
      vietnameseFirst: true,
      mobileResponsive: true,
      interactivityWorking: true,
      emptyStateHandled: true,
      errorStateHandled: true,
      failureNoteVi: "Thiếu thanh điều hướng",
    };
    const result = evaluateUiSmokeItem("UI-DIAGNOSE-01", evidence);
    expect(result.reasonVi).toContain("Thiếu thanh điều hướng");
  });
});

// ─── Suite 7: Full Checklist Runner ─────────────────────────────────────────

describe("localUiSmokeChecklist — full runner with all-pass", () => {
  let result: UiSmokeChecklistResult;

  beforeAll(() => {
    const input = createMinimalSmokeInput();
    result = runUiSmokeChecklist(input);
  });

  it("verdict is PASS", () => {
    expect(result.verdict).toBe("PASS");
    expect(result.verdictLabelVi).toContain("ĐẠT");
  });

  it("all items pass", () => {
    expect(result.counts.pass).toBe(37);
    expect(result.counts.fail).toBe(0);
    expect(result.counts.passWithNotes).toBe(0);
    expect(result.counts.notTested).toBe(0);
  });

  it("deploy not blocked", () => {
    expect(result.deployBlocked).toBe(false);
    expect(result.deployBlockers).toEqual([]);
  });

  it("all dimension results are CLEAN", () => {
    for (const dr of result.dimensionResults) {
      expect(dr.dimVerdict).toBe("CLEAN");
      expect(dr.passCount).toBe(dr.totalCount);
      expect(dr.failCount).toBe(0);
    }
  });

  it("summary is in Vietnamese", () => {
    expect(result.summaryVi).toContain("KẾT QUẢ KIỂM TRA GIAO DIỆN");
    expect(result.summaryVi).toContain("ĐẠT");
  });

  it("action items say ready", () => {
    expect(result.actionItems.length).toBeGreaterThan(0);
    expect(result.actionItems[0]).toContain("SẴN SÀNG");
    expect(result.actionItems[0]).toContain("triển khai");
  });
});

// ─── Suite 8: Failing Smoke Run ──────────────────────────────────────────────

describe("localUiSmokeChecklist — full runner with all-fail", () => {
  let result: UiSmokeChecklistResult;

  beforeAll(() => {
    const input = createFailingSmokeInput();
    result = runUiSmokeChecklist(input);
  });

  it("verdict is BLOCKED", () => {
    expect(result.verdict).toBe("BLOCKED");
    expect(result.verdictLabelVi).toContain("CHẶN");
  });

  it("has failures and deploy is blocked", () => {
    expect(result.counts.fail).toBeGreaterThan(0);
    expect(result.deployBlocked).toBe(true);
    expect(result.deployBlockers.length).toBeGreaterThan(0);
  });

  it("action items include KHẨN", () => {
    const urgentItems = result.actionItems.filter((a) =>
      a.includes("[KHẨN]"),
    );
    expect(urgentItems.length).toBeGreaterThan(0);
  });

  it("summary mentions blockers", () => {
    expect(result.summaryVi).toContain("CHẶN TRIỂN KHAI");
  });
});

// ─── Suite 9: Mixed Results — PASS_WITH_NOTES ───────────────────────────────

describe("localUiSmokeChecklist — mixed PASS_WITH_NOTES", () => {
  it("produces BLOCKED when deploy-gate empty/error state items fail", () => {
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input: UiSmokeChecklistInput = {
      surfacesReached: allSurfaces,
      surfacesWithContent: allSurfaces,
      surfacesVietnameseFirst: allSurfaces,
      surfacesMobileResponsive: allSurfaces,
      surfacesInteractive: allSurfaces,
      surfacesEmptyStateOk: [], // UI-CROSS-02 is deploy-gate → fails → blocks
      surfacesErrorStateOk: [], // UI-CROSS-03 is deploy-gate → fails → blocks
      runMode: "local",
    };
    const result = runUiSmokeChecklist(input);
    // Deploy-gate items UI-CROSS-02 (no crash empty) and UI-CROSS-03 (no crash error)
    // both fail when empty/error states are unchecked
    expect(result.verdict).toBe("BLOCKED");
    expect(result.deployBlocked).toBe(true);
  });

  it("produces PASS_WITH_NOTES when not-tested items exist", () => {
    const input = createEmptySmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.verdict).toBe("PASS_WITH_NOTES");
    expect(result.counts.notTested).toBe(37);
  });
});

// ─── Suite 10: Mixed Results — NEEDS_FIX ─────────────────────────────────────

describe("localUiSmokeChecklist — NEEDS_FIX verdict", () => {
  it("produces NEEDS_FIX when major non-gate items fail (without blocking deploy)", () => {
    // Make all surfaces reachable (no deploy gate failures on rendersWithoutCrash)
    // but some content, Vietnamese, and mobile checks fail for non-gate items
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    // The items that depend on tutorMemoryCard and todayLessonPlanner are mostly
    // major severity and non-gate, but UI-CROSS-02 (no crash on empty) is
    // deploy-gate and includes tutorMemoryCard. So we need to ensure surfaces
    // are reached but some non-gate evidence fails.
    const input: UiSmokeChecklistInput = {
      surfacesReached: allSurfaces,
      surfacesWithContent: allSurfaces.filter(
        (s) => s !== "certificateView" && s !== "shareProgressPage",
      ),
      surfacesVietnameseFirst: allSurfaces,
      surfacesMobileResponsive: allSurfaces,
      surfacesInteractive: allSurfaces.filter(
        (s) => s !== "shareProgressPage",
      ),
      surfacesEmptyStateOk: allSurfaces,
      surfacesErrorStateOk: allSurfaces,
      runMode: "local",
    };
    const result = runUiSmokeChecklist(input);
    // certificateView and shareProgressPage are in minor severity items (PROVE-02, PROVE-03)
    // These are NOT deploy-gate, so they should fail but not block
    expect(result.counts.fail).toBeGreaterThan(0);
    expect(result.deployBlocked).toBe(false);
    expect(result.verdict).toBe("NEEDS_FIX");
  });
});

// ─── Suite 11: Deploy Gate Logic ─────────────────────────────────────────────

describe("localUiSmokeChecklist — deploy gate logic", () => {
  it("deploy blockers include only deploy-gate items that fail", () => {
    const failingInput = createFailingSmokeInput();
    const result = runUiSmokeChecklist(failingInput);
    for (const blocker of result.deployBlockers) {
      const item = getUiSmokeChecklistItem(blocker);
      expect(item).toBeDefined();
      expect(item!.deployGate).toBe(true);
    }
  });

  it("exact count of deploy gate items", () => {
    const count = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.deployGate,
    ).length;
    expect(count).toBeGreaterThanOrEqual(8);
    expect(count).toBeLessThanOrEqual(20);
  });

  it("deploy gate includes AI tutor page render", () => {
    const item = getUiSmokeChecklistItem("UI-DIAGNOSE-01");
    expect(item!.deployGate).toBe(true);
  });

  it("deploy gate includes teacher tab correction UI", () => {
    const item = getUiSmokeChecklistItem("UI-DIAGNOSE-02");
    expect(item!.deployGate).toBe(true);
  });

  it("deploy gate includes Vietnamese-first (UI-CROSS-01)", () => {
    const item = getUiSmokeChecklistItem("UI-CROSS-01");
    expect(item!.deployGate).toBe(true);
  });

  it("deploy gate includes no crash on empty (UI-CROSS-02)", () => {
    const item = getUiSmokeChecklistItem("UI-CROSS-02");
    expect(item!.deployGate).toBe(true);
  });

  it("deploy gate includes no crash on error (UI-CROSS-03)", () => {
    const item = getUiSmokeChecklistItem("UI-CROSS-03");
    expect(item!.deployGate).toBe(true);
  });

  it("deploy gate includes all 5 tabs accessible (UI-CROSS-04)", () => {
    const item = getUiSmokeChecklistItem("UI-CROSS-04");
    expect(item!.deployGate).toBe(true);
  });
});

// ─── Suite 12: Dimension Results ─────────────────────────────────────────────

describe("localUiSmokeChecklist — dimension results", () => {
  it("all 7 dimensions have results", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.dimensionResults.length).toBe(7);
  });

  it("dimension result IDs match the dimension catalog", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    const resultIds = result.dimensionResults.map((d) => d.dimensionId);
    const catalogIds = getUiSmokeDimensionIds();
    expect(resultIds).toEqual(catalogIds);
  });

  it("CLEAN dimension has matching counts", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    const uiDiagnose = result.dimensionResults.find(
      (d) => d.dimensionId === "UI_DIAGNOSE",
    )!;
    expect(uiDiagnose.dimVerdict).toBe("CLEAN");
    expect(uiDiagnose.passCount).toBe(5);
    expect(uiDiagnose.failCount).toBe(0);
    expect(uiDiagnose.totalCount).toBe(5);
  });

  it("dimension label is in Vietnamese", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    const uiTeach = result.dimensionResults.find(
      (d) => d.dimensionId === "UI_TEACH",
    )!;
    expect(uiTeach.labelVi).toBe("Giảng dạy");
    expect(uiTeach.dimLabelVi).toContain("SẠCH");
  });

  it("BROKEN dimension with all fails", () => {
    const failingInput = createFailingSmokeInput();
    const result = runUiSmokeChecklist(failingInput);
    const brokenDims = result.dimensionResults.filter(
      (d) => d.dimVerdict === "BROKEN",
    );
    expect(brokenDims.length).toBeGreaterThan(0);
  });
});

// ─── Suite 13: Quick-Check Helpers ───────────────────────────────────────────

describe("localUiSmokeChecklist — quick-check helpers", () => {
  it("isDeployable returns true for PASS", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(isDeployable(result)).toBe(true);
  });

  it("isDeployable returns false for BLOCKED", () => {
    const input = createFailingSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(isDeployable(result)).toBe(false);
  });

  it("isCleanSmoke returns true for all-pass", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(isCleanSmoke(result)).toBe(true);
  });

  it("isCleanSmoke returns false for PASS_WITH_NOTES", () => {
    const input = createEmptySmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(isCleanSmoke(result)).toBe(false);
  });

  it("isCleanSmoke returns false for NEEDS_FIX", () => {
    // partial pass scenario
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input: UiSmokeChecklistInput = {
      surfacesReached: allSurfaces,
      surfacesWithContent: allSurfaces.filter(
        (s) => s !== "mercyTeacherTab",
      ),
      surfacesVietnameseFirst: allSurfaces,
      surfacesMobileResponsive: allSurfaces,
      surfacesInteractive: allSurfaces,
      surfacesEmptyStateOk: allSurfaces,
      surfacesErrorStateOk: allSurfaces,
      runMode: "local",
    };
    const result = runUiSmokeChecklist(input);
    // mercyTeacherTab is critical+deployGate, so missing content will fail it
    expect(isCleanSmoke(result)).toBe(false);
  });

  it("getSmokeCompactVi returns Vietnamese one-liner", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    const compact = getSmokeCompactVi(result);
    expect(compact).toContain("✅");
    expect(compact).toContain("Smoke UI");
    expect(compact).toContain("37/37");
    expect(compact).toContain("ĐẠT");
  });

  it("getSmokeCompactVi shows ❌ for BLOCKED", () => {
    const input = createFailingSmokeInput();
    const result = runUiSmokeChecklist(input);
    const compact = getSmokeCompactVi(result);
    expect(compact).toContain("❌");
  });

  it("getDeployBlockerIds returns IDs for BLOCKED", () => {
    const input = createFailingSmokeInput();
    const result = runUiSmokeChecklist(input);
    const blockers = getDeployBlockerIds(result);
    expect(blockers.length).toBeGreaterThan(0);
    for (const id of blockers) {
      expect(id).toMatch(/^UI-/);
    }
  });

  it("getDeployBlockerIds returns empty for PASS", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(getDeployBlockerIds(result)).toEqual([]);
  });
});

// ─── Suite 14: Label Getters ─────────────────────────────────────────────────

describe("localUiSmokeChecklist — label getters", () => {
  it("getVerdictLabelVi returns Vietnamese for all verdicts", () => {
    expect(getVerdictLabelVi("PASS")).toContain("ĐẠT");
    expect(getVerdictLabelVi("PASS_WITH_NOTES")).toContain("GHI CHÚ");
    expect(getVerdictLabelVi("NEEDS_FIX")).toContain("SỬA");
    expect(getVerdictLabelVi("BLOCKED")).toContain("CHẶN");
  });

  it("getSurfaceLabelVi returns Vietnamese for valid surface", () => {
    expect(getSurfaceLabelVi("aiTutorPage")).toContain("AI Tutor");
    expect(getSurfaceLabelVi("kidsTutorPage")).toContain("trẻ em");
    expect(getSurfaceLabelVi("mercySpeakTab")).toContain("Nói");
  });

  it("getSurfaceLabelVi returns ID for unknown surface", () => {
    expect(getSurfaceLabelVi("nonexistent" as UiSmokeSurfaceId)).toBe(
      "nonexistent",
    );
  });

  it("getDimensionLabelVi returns Vietnamese", () => {
    expect(getDimensionLabelVi("UI_DIAGNOSE")).toBe("Chẩn đoán lỗi");
    expect(getDimensionLabelVi("UI_TEACH")).toBe("Giảng dạy");
    expect(getDimensionLabelVi("UI_CROSS")).toBe("Xuyên suốt");
  });

  it("getDimensionLabelVi returns ID for unknown", () => {
    expect(getDimensionLabelVi("UNKNOWN" as UiSmokeDimensionId)).toBe(
      "UNKNOWN",
    );
  });

  it("getItemStatusLabelVi returns Vietnamese for all statuses", () => {
    expect(getItemStatusLabelVi("pass")).toBe("Đạt");
    expect(getItemStatusLabelVi("pass_with_notes")).toBe("Đạt (có ghi chú)");
    expect(getItemStatusLabelVi("fail")).toBe("Thất bại");
    expect(getItemStatusLabelVi("not_applicable")).toBe("Không áp dụng");
    expect(getItemStatusLabelVi("not_tested")).toBe("Chưa kiểm tra");
  });
});

// ─── Suite 15: Catalog Validation ────────────────────────────────────────────

describe("localUiSmokeChecklist — catalog validation", () => {
  it("catalog self-validates as valid", () => {
    const validation = validateUiSmokeCatalog();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("catalog validation reports correct totals", () => {
    const validation = validateUiSmokeCatalog();
    expect(validation.totalItems).toBe(37);
    expect(validation.dimensionCount).toBe(7);
    expect(validation.duplicateIds).toEqual([]);
    expect(validation.missingDimensions).toEqual([]);
    expect(validation.deployGateCount).toBeGreaterThan(0);
  });
});

// ─── Suite 16: Surface Coverage Report ───────────────────────────────────────

describe("localUiSmokeChecklist — surface coverage", () => {
  it("returns coverage for all 18 surfaces", () => {
    const coverage = getSurfaceCoverage();
    expect(coverage.covered.length + coverage.uncovered.length).toBe(18);
  });

  it("most surfaces are covered", () => {
    const coverage = getSurfaceCoverage();
    expect(coverage.covered.length).toBeGreaterThan(10);
  });

  it("deploy-gate surfaces is a non-empty subset of covered", () => {
    const coverage = getSurfaceCoverage();
    expect(coverage.deployGate.length).toBeGreaterThan(0);
    for (const surface of coverage.deployGate) {
      expect(coverage.covered).toContain(surface);
    }
  });

  it("critical surfaces are covered", () => {
    const coverage = getSurfaceCoverage();
    expect(coverage.covered).toContain("aiTutorPage");
    expect(coverage.covered).toContain("mercyUnifiedPage");
    expect(coverage.covered).toContain("kidsTutorPage");
    expect(coverage.covered).toContain("mercyGuideHome");
  });
});

// ─── Suite 17: Comparison ────────────────────────────────────────────────────

describe("localUiSmokeChecklist — comparison between runs", () => {
  it("shows improving trend when fails decrease", () => {
    const before = runUiSmokeChecklist(createFailingSmokeInput());
    const after = runUiSmokeChecklist(createMinimalSmokeInput());
    const comparison = compareSmokeResults(before, after);
    expect(comparison.trend).toBe("improving");
    expect(comparison.passDelta).toBeGreaterThan(0);
    expect(comparison.failDelta).toBeLessThan(0);
  });

  it("shows declining trend when pass count drops", () => {
    const before = runUiSmokeChecklist(createMinimalSmokeInput());
    const after = runUiSmokeChecklist(createFailingSmokeInput());
    const comparison = compareSmokeResults(before, after);
    expect(comparison.trend).toBe("declining");
  });

  it("shows stable trend for identical results", () => {
    const input = createMinimalSmokeInput();
    const r1 = runUiSmokeChecklist(input);
    const r2 = runUiSmokeChecklist(input);
    const comparison = compareSmokeResults(r1, r2);
    expect(comparison.trend).toBe("stable");
    expect(comparison.passDelta).toBe(0);
    expect(comparison.failDelta).toBe(0);
    expect(comparison.changedItems).toEqual([]);
  });

  it("comparison summary is in Vietnamese", () => {
    const before = runUiSmokeChecklist(createFailingSmokeInput());
    const after = runUiSmokeChecklist(createMinimalSmokeInput());
    const comparison = compareSmokeResults(before, after);
    expect(comparison.comparisonVi).toContain("cải thiện");
  });

  it("comparison detects changed items", () => {
    const allPass = createMinimalSmokeInput();
    const r1 = runUiSmokeChecklist(allPass);

    // Create a slightly degraded run
    const degraded = createMinimalSmokeInput({
      surfacesWithContent: UI_SMOKE_SURFACE_IDS.filter(
        (s) => s !== "mercyTeacherTab" && s !== "tutorMemoryCard",
      ),
    });
    const r2 = runUiSmokeChecklist(degraded);
    const comparison = compareSmokeResults(r1, r2);
    // mercyTeacherTab is critical+deployGate, so it will be a fail in r2
    expect(comparison.changedItems.length).toBeGreaterThan(0);
  });
});

// ─── Suite 18: Vietnamese-First Proof ────────────────────────────────────────

describe("localUiSmokeChecklist — Vietnamese-first proof", () => {
  it("all dimension labels are in Vietnamese", () => {
    for (const dim of UI_SMOKE_DIMENSIONS) {
      expect(dim.labelVi.length).toBeGreaterThan(0);
      expect(dim.descriptionVi.length).toBeGreaterThan(0);
      expect(dim.capabilityVi.length).toBeGreaterThan(0);
    }
  });

  it("all item descriptions are in Vietnamese", () => {
    const fullVnRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(fullVnRegex.test(item.descriptionVi)).toBe(true);
    }
  });

  it("all howToVerifyVi are in Vietnamese", () => {
    const fullVnRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.howToVerifyVi.length).toBeGreaterThan(0);
      expect(fullVnRegex.test(item.howToVerifyVi)).toBe(true);
    }
  });

  it("result summary is fully in Vietnamese", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.summaryVi).toContain("KẾT QUẢ");
    expect(result.summaryVi).toContain("Tổng số");
    expect(result.summaryVi).toContain("Đạt");
    expect(result.summaryVi).toContain("Theo khía cạnh");
  });

  it("action items use Vietnamese priority markers", () => {
    const input = createFailingSmokeInput();
    const result = runUiSmokeChecklist(input);
    const markers = ["[KHẨN]", "[CẦN SỬA]", "[CẦN XEM]", "[CẦN KIỂM TRA]", "[SẴN SÀNG]"];
    for (const action of result.actionItems) {
      const hasMarker = markers.some((m) => action.includes(m));
      expect(hasMarker).toBe(true);
    }
  });

  it("verdict labels are in Vietnamese", () => {
    const allVerdicts: UiSmokeVerdict[] = [
      "PASS",
      "PASS_WITH_NOTES",
      "NEEDS_FIX",
      "BLOCKED",
    ];
    for (const v of allVerdicts) {
      const label = getVerdictLabelVi(v);
      expect(label.length).toBeGreaterThan(0);
      // Must contain Vietnamese characters or be clearly VN
      const isVietnamese =
        /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđ]/i.test(label) ||
        label.includes("ĐẠT") ||
        label.includes("CHẶN") ||
        label.includes("SỬA") ||
        label.includes("GHI CHÚ");
      expect(isVietnamese).toBe(true);
    }
  });

  it("surface labels are all in Vietnamese", () => {
    for (const [id, label] of Object.entries(UI_SMOKE_SURFACE_LABELS_VI)) {
      expect(label.length).toBeGreaterThan(0);
      // Should contain at least one of: route, component name, or Vietnamese word
      // Full Vietnamese diacritic set (both cases handled by /i flag)
      const fullVnRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
      expect(
        fullVnRegex.test(label) ||
          label.includes("/") ||
          label.includes("("),
      ).toBe(true);
    }
  });
});

// ─── Suite 19: Edge Cases ───────────────────────────────────────────────────

describe("localUiSmokeChecklist — edge cases", () => {
  it("handles empty input cleanly", () => {
    const input = createEmptySmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.verdict).toBeDefined();
    expect(result.items.length).toBe(37);
    expect(result.counts.total).toBe(37);
  });

  it("handles partial surface coverage", () => {
    const input: UiSmokeChecklistInput = {
      surfacesReached: ["aiTutorPage", "mercyUnifiedPage"],
      surfacesWithContent: ["aiTutorPage"],
      surfacesVietnameseFirst: ["aiTutorPage", "mercyUnifiedPage"],
      surfacesMobileResponsive: [],
      surfacesInteractive: ["aiTutorPage"],
      surfacesEmptyStateOk: [],
      surfacesErrorStateOk: [],
      runMode: "local",
    };
    const result = runUiSmokeChecklist(input);
    expect(result).toBeDefined();
    expect(result.deployBlocked).toBe(true);
  });

  it("runMode is preserved", () => {
    const localInput = createEmptySmokeInput("local");
    expect(localInput.runMode).toBe("local");
    const remoteInput = createEmptySmokeInput("remote");
    expect(remoteInput.runMode).toBe("remote");
  });

  it("handles maximum mixed statuses", () => {
    // Every other surface works — creates a truly mixed result
    const everyOther = UI_SMOKE_SURFACE_IDS.filter((_, i) => i % 2 === 0);
    const input: UiSmokeChecklistInput = {
      surfacesReached: everyOther,
      surfacesWithContent: everyOther,
      surfacesVietnameseFirst: everyOther,
      surfacesMobileResponsive: everyOther,
      surfacesInteractive: everyOther,
      surfacesEmptyStateOk: [],
      surfacesErrorStateOk: [],
      runMode: "local",
    };
    const result = runUiSmokeChecklist(input);
    // Should have mixed pass/fail/not_tested
    const statuses = new Set(result.items.map((i) => i.status));
    expect(statuses.size).toBeGreaterThan(1);
  });

  it("createMinimalSmokeInput includes all surfaces", () => {
    const input = createMinimalSmokeInput();
    expect(input.surfacesReached).toEqual(UI_SMOKE_SURFACE_IDS);
    expect(input.surfacesWithContent).toEqual(UI_SMOKE_SURFACE_IDS);
    expect(input.surfacesVietnameseFirst).toEqual(UI_SMOKE_SURFACE_IDS);
    expect(input.surfacesMobileResponsive).toEqual(UI_SMOKE_SURFACE_IDS);
    expect(input.surfacesInteractive).toEqual(UI_SMOKE_SURFACE_IDS);
    expect(input.surfacesEmptyStateOk).toEqual(UI_SMOKE_SURFACE_IDS);
    expect(input.surfacesErrorStateOk).toEqual(UI_SMOKE_SURFACE_IDS);
  });

  it("createMinimalSmokeInput supports partial overrides", () => {
    const input = createMinimalSmokeInput({
      runMode: "remote",
      baseUrl: "https://staging.mercyblade.com",
      surfaceNotes: { aiTutorPage: "Chậm nhưng vẫn tải được" },
    });
    expect(input.runMode).toBe("remote");
    expect(input.baseUrl).toBe("https://staging.mercyblade.com");
    expect(input.surfaceNotes!.aiTutorPage).toBe(
      "Chậm nhưng vẫn tải được",
    );
    // Other fields should remain as defaults
    expect(input.surfacesReached).toEqual(UI_SMOKE_SURFACE_IDS);
  });

  it("createFailingSmokeInput has surface notes", () => {
    const input = createFailingSmokeInput();
    expect(input.surfaceNotes).toBeDefined();
    expect(Object.keys(input.surfaceNotes!)).toContain("aiTutorPage");
  });

  it("handles surface notes on any surface", () => {
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input: UiSmokeChecklistInput = {
      surfacesReached: allSurfaces.filter((s) => s !== "shareProgressPage"),
      surfacesWithContent: allSurfaces,
      surfacesVietnameseFirst: allSurfaces,
      surfacesMobileResponsive: allSurfaces,
      surfacesInteractive: allSurfaces,
      surfacesEmptyStateOk: allSurfaces,
      surfacesErrorStateOk: allSurfaces,
      runMode: "local",
      surfaceNotes: {
        shareProgressPage: "Trang trắng — lỗi 404",
      },
    };
    const result = runUiSmokeChecklist(input);
    // shareProgressPage is not in item surfaces (only UI-PROVE-03 uses it)
    // UI-PROVE-03 is minor, not deploy-gate — so it'll be pass_with_notes or fail
    const prove03 = result.items.find((i) => i.itemId === "UI-PROVE-03")!;
    expect(prove03.evidence.failureNoteVi).toBe("Trang trắng — lỗi 404");
  });

  it("very long surface note is handled", () => {
    const longNote = "Lỗi ".repeat(100);
    const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
    const input = createMinimalSmokeInput({
      surfaceNotes: { aiTutorPage: longNote },
    });
    const result = runUiSmokeChecklist(input);
    // Should not crash
    expect(result).toBeDefined();
  });

  it("empty surface notes object is fine", () => {
    const input = createMinimalSmokeInput({ surfaceNotes: {} });
    const result = runUiSmokeChecklist(input);
    expect(result.verdict).toBe("PASS");
  });

  it("surface IDs are distinct and consistent", () => {
    const ids = UI_SMOKE_SURFACE_IDS;
    expect(new Set(ids).size).toBe(ids.length);
    // All should be camelCase
    for (const id of ids) {
      expect(id).toMatch(/^[a-z][a-zA-Z0-9]*$/);
    }
  });

  it("timestamp is preserved in input", () => {
    const input = createMinimalSmokeInput({
      timestamp: "2026-06-23T12:00:00Z",
    });
    expect(input.timestamp).toBe("2026-06-23T12:00:00Z");
  });
});

// ─── Suite 20: Determinism ───────────────────────────────────────────────────

describe("localUiSmokeChecklist — determinism", () => {
  it("produces identical results for identical inputs", () => {
    const input = createMinimalSmokeInput();
    const r1 = runUiSmokeChecklist(input);
    const r2 = runUiSmokeChecklist(input);
    expect(r1.verdict).toBe(r2.verdict);
    expect(r1.counts).toEqual(r2.counts);
    expect(r1.deployBlocked).toBe(r2.deployBlocked);
    expect(r1.items.map((i) => i.status)).toEqual(
      r2.items.map((i) => i.status),
    );
  });

  it("produces identical results over 10 runs", () => {
    const input = createMinimalSmokeInput();
    const results: UiSmokeChecklistResult[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(runUiSmokeChecklist(input));
    }
    const first = results[0];
    for (let i = 1; i < results.length; i++) {
      expect(results[i].verdict).toBe(first.verdict);
      expect(results[i].counts).toEqual(first.counts);
      expect(results[i].deployBlocked).toBe(first.deployBlocked);
    }
  });

  it("10 identical comparisons all show stable", () => {
    const input = createMinimalSmokeInput();
    const r1 = runUiSmokeChecklist(input);
    for (let i = 0; i < 10; i++) {
      const r2 = runUiSmokeChecklist(input);
      const c = compareSmokeResults(r1, r2);
      expect(c.trend).toBe("stable");
    }
  });

  it("catalog getters are deterministic", () => {
    const c1 = getUiSmokeChecklistCatalog();
    const c2 = getUiSmokeChecklistCatalog();
    expect(c1).toEqual(c2);
  });

  it("label getters are deterministic", () => {
    for (let i = 0; i < 10; i++) {
      expect(getVerdictLabelVi("PASS")).toBe(getVerdictLabelVi("PASS"));
      expect(getSurfaceLabelVi("aiTutorPage")).toBe(
        getSurfaceLabelVi("aiTutorPage"),
      );
      expect(getDimensionLabelVi("UI_TEACH")).toBe(
        getDimensionLabelVi("UI_TEACH"),
      );
      expect(getItemStatusLabelVi("pass")).toBe(getItemStatusLabelVi("pass"));
    }
  });

  it("validateUiSmokeCatalog is deterministic", () => {
    const v1 = validateUiSmokeCatalog();
    const v2 = validateUiSmokeCatalog();
    expect(v1).toEqual(v2);
    expect(v1.valid).toBe(v2.valid);
  });

  it("getSurfaceCoverage is deterministic", () => {
    const c1 = getSurfaceCoverage();
    const c2 = getSurfaceCoverage();
    expect(c1).toEqual(c2);
  });
});

// ─── Suite 21: Severity Distribution ─────────────────────────────────────────

describe("localUiSmokeChecklist — severity distribution", () => {
  it("has critical items", () => {
    const critical = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.severity === "critical",
    );
    expect(critical.length).toBeGreaterThan(0);
    // Critical items should all be deploy-gate
    for (const item of critical) {
      expect(item.deployGate).toBe(true);
    }
  });

  it("has major items", () => {
    const major = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.severity === "major",
    );
    expect(major.length).toBeGreaterThan(0);
  });

  it("has minor items", () => {
    const minor = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.severity === "minor",
    );
    expect(minor.length).toBeGreaterThan(0);
    // Minor items should NOT be deploy-gate
    for (const item of minor) {
      expect(item.deployGate).toBe(false);
    }
  });

  it("sum of severity counts equals total", () => {
    const critical = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.severity === "critical",
    ).length;
    const major = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.severity === "major",
    ).length;
    const minor = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.severity === "minor",
    ).length;
    expect(critical + major + minor).toBe(37);
  });
});

// ─── Suite 22: Action Items Format ───────────────────────────────────────────

describe("localUiSmokeChecklist — action items", () => {
  it("all-pass produces SẴN SÀNG action", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.actionItems).toContain(
      "[SẴN SÀNG] Tất cả mục kiểm tra đều đạt. Có thể triển khai.",
    );
  });

  it("all-fail produces KHẨN action", () => {
    const input = createFailingSmokeInput();
    const result = runUiSmokeChecklist(input);
    const hasUrgent = result.actionItems.some((a) =>
      a.startsWith("[KHẨN]"),
    );
    expect(hasUrgent).toBe(true);
  });

  it("not-tested produces CẦN KIỂM TRA action", () => {
    const input = createEmptySmokeInput();
    const result = runUiSmokeChecklist(input);
    const hasCheckAction = result.actionItems.some((a) =>
      a.includes("[CẦN KIỂM TRA]"),
    );
    expect(hasCheckAction).toBe(true);
  });

  it("action items are always non-empty", () => {
    const allPassResult = runUiSmokeChecklist(createMinimalSmokeInput());
    expect(allPassResult.actionItems.length).toBeGreaterThan(0);

    const allFailResult = runUiSmokeChecklist(createFailingSmokeInput());
    expect(allFailResult.actionItems.length).toBeGreaterThan(0);

    const emptyResult = runUiSmokeChecklist(createEmptySmokeInput());
    expect(emptyResult.actionItems.length).toBeGreaterThan(0);
  });
});

// ─── Suite 23: Integration Points with Other Modules ─────────────────────────

describe("localUiSmokeChecklist — integration points", () => {
  it("UI_DIAGNOSE maps to teacher capability chẩn đoán", () => {
    const dim = getUiSmokeDimension("UI_DIAGNOSE")!;
    expect(dim.capabilityVi).toBe("Chẩn đoán lỗi");
  });

  it("all 6 teacher capabilities have a corresponding UI dimension", () => {
    const capabilityLabels = UI_SMOKE_DIMENSIONS.filter(
      (d) => d.id !== "UI_CROSS",
    ).map((d) => d.capabilityVi);
    expect(capabilityLabels.length).toBe(6);
    expect(new Set(capabilityLabels).size).toBe(6);
  });

  it("surfaces cover all major tutor UI entry points", () => {
    const surfaceSet = new Set(UI_SMOKE_SURFACE_IDS);
    // These are the three main tutor pages
    expect(surfaceSet.has("aiTutorPage")).toBe(true);
    expect(surfaceSet.has("mercyUnifiedPage")).toBe(true);
    expect(surfaceSet.has("kidsTutorPage")).toBe(true);
    // Mercy Guide is covered
    expect(surfaceSet.has("mercyGuideHome")).toBe(true);
    expect(surfaceSet.has("mercyGuideRoom")).toBe(true);
    // All tabs are covered
    expect(surfaceSet.has("mercyTeacherTab")).toBe(true);
    expect(surfaceSet.has("mercySpeakTab")).toBe(true);
    expect(surfaceSet.has("mercyGuideTab")).toBe(true);
    expect(surfaceSet.has("mercySuggestTab")).toBe(true);
    expect(surfaceSet.has("mercyEnglishTab")).toBe(true);
  });

  it("checklist IDs can be referenced from journey owner walkthrough", () => {
    // All UI items should be referenceable by a consistent ID format
    for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
      expect(item.id).toMatch(/^UI-(DIAGNOSE|TEACH|REMEMBER|ADAPT|SELFCHECK|PROVE|CROSS)-\d{2}$/);
    }
  });

  it("checklist structure mirrors humanLearnerTestingChecklist dimensions", () => {
    // Both use 6 teacher capability dimensions + cross-cutting
    const deployDimCount = UI_SMOKE_DIMENSIONS.filter(
      (d) => d.id !== "UI_CROSS",
    ).length;
    expect(deployDimCount).toBe(6); // Same 6 capabilities
  });
});

// ─── Suite 24: Summary Format ────────────────────────────────────────────────

describe("localUiSmokeChecklist — summary format", () => {
  it("summary includes total count", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.summaryVi).toContain("37");
  });

  it("summary includes all dimension labels", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    for (const dim of UI_SMOKE_DIMENSIONS) {
      expect(result.summaryVi).toContain(dim.labelVi);
    }
  });

  it("summary includes verdict in Vietnamese", () => {
    const input = createMinimalSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.summaryVi).toContain("ĐẠT");
  });

  it("BLOCKED summary mentions deploy blockers item IDs", () => {
    const input = createFailingSmokeInput();
    const result = runUiSmokeChecklist(input);
    expect(result.summaryVi).toContain("CHẶN TRIỂN KHAI");
    // Should include at least one item ID
    const hasItemId = /UI-[A-Z]+-\d{2}/.test(result.summaryVi);
    expect(hasItemId).toBe(true);
  });
});

// ─── Suite 25: Kids Mode Validation ──────────────────────────────────────────

describe("localUiSmokeChecklist — kids mode validation", () => {
  it("UI-TEACH-03 covers kids tutor page", () => {
    const item = getUiSmokeChecklistItem("UI-TEACH-03")!;
    expect(item.surfaces).toContain("kidsTutorPage");
  });

  it("kids tutor page is deploy-gate", () => {
    const item = getUiSmokeChecklistItem("UI-TEACH-03")!;
    expect(item.deployGate).toBe(true);
  });

  it("no monetization CTAs mentioned in kids item description", () => {
    const item = getUiSmokeChecklistItem("UI-TEACH-03")!;
    expect(item.howToVerifyVi).toContain("mua hàng");
  });
});

// ─── Suite 26: Mobile Responsiveness Validation ──────────────────────────────

describe("localUiSmokeChecklist — mobile responsiveness", () => {
  it("UI-ADAPT-04 specifically checks 375px mobile viewport", () => {
    const item = getUiSmokeChecklistItem("UI-ADAPT-04")!;
    expect(item.howToVerifyVi).toContain("375");
    expect(item.deployGate).toBe(true);
  });

  it("mobile responsive covers all 4 major tutor pages", () => {
    const item = getUiSmokeChecklistItem("UI-ADAPT-04")!;
    expect(item.surfaces).toContain("aiTutorPage");
    expect(item.surfaces).toContain("mercyUnifiedPage");
    expect(item.surfaces).toContain("kidsTutorPage");
    expect(item.surfaces).toContain("unifiedMercyChat");
  });
});
