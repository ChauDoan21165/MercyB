// src/languages/punjabi/__tests__/punjabiFinalIntegrationRiskRegister.test.ts
//
// Guards the Punjabi Wave 23 final integration risk register. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_INTEGRATION_RISK_AREAS,
  PUNJABI_FINAL_INTEGRATION_RISK_REGISTER,
  PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_ROOT,
  PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE,
  PUNJABI_FINAL_INTEGRATION_RISK_ROUTES,
  type PunjabiFinalIntegrationRiskArea,
} from "../finalIntegrationRiskRegister";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalIntegrationRiskArea[] = [
  "module_duplication",
  "missing_exports",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "stress_test",
  "deferred_review",
  "forbidden_claim",
  "final_qa",
  "owner_exit",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_ROOT);
  return out;
}

describe("Punjabi final integration risk register - scope", () => {
  it("declares Wave 23 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.wave).toBe("Wave 23");
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.script_note_en} ${PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE.excluded_en.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("auth");
    expect(text).toContain("billing");
    expect(text).toContain("rls");
    expect(text).toContain("supabase");
    expect(text).toContain("ci");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
  });
});

describe("Punjabi final integration risk register - coverage", () => {
  it("declares all requested risk areas", () => {
    expect(new Set(PUNJABI_FINAL_INTEGRATION_RISK_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has register items for all requested areas", () => {
    const areas = new Set(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across register items", () => {
    const levels = new Set(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the risk register compact but useful", () => {
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.length).toBeLessThanOrEqual(14);
  });
});

describe("Punjabi final integration risk register - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_INTEGRATION_RISK_REGISTER) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.risk_vi.length).toBeGreaterThan(0);
      expect(item.risk_en.length).toBeGreaterThan(0);
      expect(item.stress_test_vi.length).toBeGreaterThan(0);
      expect(item.stress_test_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.reviewed_modules.length).toBeGreaterThan(0);
      expect(item.risk_tags.length).toBeGreaterThan(0);
    }
  });

  it("includes all risk statuses and the boundary markers", () => {
    const statuses = new Set(PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.map((item) => item.status));
    expect(statuses.has("watch_required")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes owner actions and learner traps where expected", () => {
    const traps = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const actions = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.filter((item) => item.owner_action_vi && item.owner_action_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(actions.length).toBeGreaterThanOrEqual(8);
  });

  it("references the expected modules for final review and integration readiness", () => {
    const modules = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.flatMap((item) => item.reviewed_modules).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("lessons-a1");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalCanDoIndex");
    expect(modules).toContain("finalQaInventory");
    expect(modules).toContain("preMrAuditChecklist");
    expect(modules).toContain("preIntegrationHandoffMap");
    expect(modules).toContain("finalNavigationMap");
    expect(modules).toContain("finalQualityGates");
    expect(modules).toContain("finalContentManifest");
    expect(modules).toContain("finalSmokeChecklist");
    expect(modules).toContain("finalIntegrationEvidenceMap");
    expect(modules).toContain("finalPreIntegrationSummary");
    expect(modules).toContain("finalOwnerReviewPacket");
  });
});

describe("Punjabi final integration risk register - risk boundaries", () => {
  it("covers duplication, exports, Gurmukhi-first, VI/EN support, Canada, QA, and exit risks", () => {
    const text = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.map((item) => `${item.risk_en} ${item.stress_test_en} ${item.owner_action_en ?? ""}`).join(" ").toLowerCase();
    expect(text).toContain("duplicate");
    expect(text).toContain("export");
    expect(text).toContain("gurmukhi");
    expect(text).toContain("romanization");
    expect(text).toContain("vietnamese");
    expect(text).toContain("english");
    expect(text).toContain("canada");
    expect(text).toContain("final qa");
    expect(text).toContain("owner exit");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.find((entry) => entry.id === "risk-forbidden-claims");
    expect(item).toBeDefined();
    const text = `${item?.risk_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text only");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_INTEGRATION_RISK_REGISTER.map((item) => `${item.risk_en} ${item.owner_action_en ?? ""} ${item.must_not_claim_en ?? ""}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines risk routes for registry, script/support, and boundary checks", () => {
    expect(PUNJABI_FINAL_INTEGRATION_RISK_ROUTES.length).toBe(3);
    for (const route of PUNJABI_FINAL_INTEGRATION_RISK_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final integration risk register - no unrelated scripts", () => {
  const strings = allStrings();

  it("does not include Shahmukhi-script content", () => {
    for (const s of strings) expect(s).not.toMatch(SHAHMUKHI);
  });

  it("contains no CJK, Hangul, kana, or Cyrillic script", () => {
    for (const s of strings) {
      expect(s).not.toMatch(CJK);
      expect(s).not.toMatch(HANGUL);
      expect(s).not.toMatch(KANA);
      expect(s).not.toMatch(CYRILLIC);
    }
  });
});
