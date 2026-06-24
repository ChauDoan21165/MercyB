// src/languages/punjabi/__tests__/punjabiFinalOwnerReviewPacket.test.ts
//
// Guards the Punjabi Wave 22 final owner review packet. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_OWNER_REVIEW_AREAS,
  PUNJABI_FINAL_OWNER_REVIEW_PACKET,
  PUNJABI_FINAL_OWNER_REVIEW_PACKET_ROOT,
  PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE,
  PUNJABI_FINAL_OWNER_REVIEW_ROUTES,
  type PunjabiFinalOwnerReviewArea,
} from "../finalOwnerReviewPacket";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalOwnerReviewArea[] = [
  "completion",
  "gurmukhi_first",
  "learner_support",
  "canada_domain",
  "proof_pack",
  "final_qa",
  "deferred",
  "must_not_claim",
  "owner_exit",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_OWNER_REVIEW_PACKET_ROOT);
  return out;
}

describe("Punjabi final owner review packet - scope", () => {
  it("declares Wave 22 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.wave).toBe("Wave 22");
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.shahmukhi_note_en} ${PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not teach a full");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("must not be claimed");
  });

  it("excludes forbidden systems and deployment activity", () => {
    const text = PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE.excluded_en.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("auth");
    expect(text).toContain("billing");
    expect(text).toContain("rls");
    expect(text).toContain("supabase");
    expect(text).toContain("ci config");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
  });
});

describe("Punjabi final owner review packet - coverage", () => {
  it("declares all requested review areas", () => {
    expect(new Set(PUNJABI_FINAL_OWNER_REVIEW_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has packet items for every requested area", () => {
    const areas = new Set(PUNJABI_FINAL_OWNER_REVIEW_PACKET.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across packet items", () => {
    const levels = new Set(PUNJABI_FINAL_OWNER_REVIEW_PACKET.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("stays compact but useful", () => {
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_OWNER_REVIEW_PACKET.length).toBeLessThanOrEqual(14);
  });
});

describe("Punjabi final owner review packet - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_OWNER_REVIEW_PACKET) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.owner_summary_vi.length).toBeGreaterThan(0);
      expect(item.owner_summary_en.length).toBeGreaterThan(0);
      expect(item.review_prompt_vi.length).toBeGreaterThan(0);
      expect(item.review_prompt_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.evidence_modules.length).toBeGreaterThan(0);
      expect(item.proof_tags.length).toBeGreaterThan(0);
    }
  });

  it("includes owner decisions, traps, and must-not-claim markers", () => {
    const decisions = new Set(PUNJABI_FINAL_OWNER_REVIEW_PACKET.map((item) => item.decision));
    expect(decisions.has("ready_for_owner_review")).toBe(true);
    expect(decisions.has("review_before_a11")).toBe(true);
    expect(decisions.has("deferred_not_claimed")).toBe(true);

    const traps = PUNJABI_FINAL_OWNER_REVIEW_PACKET.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const forbidden = PUNJABI_FINAL_OWNER_REVIEW_PACKET.filter((item) => item.must_not_claim_vi && item.must_not_claim_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(forbidden.length).toBeGreaterThanOrEqual(4);
  });

  it("references the expected evidence modules", () => {
    const modules = PUNJABI_FINAL_OWNER_REVIEW_PACKET.flatMap((item) => item.evidence_modules).join(" ");
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

describe("Punjabi final owner review packet - owner boundaries", () => {
  it("covers Canada-practical survival/work/clinic/public-service domains", () => {
    const canada = PUNJABI_FINAL_OWNER_REVIEW_PACKET.filter((item) => item.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(2);
    const text = canada.map((item) => `${item.owner_summary_en} ${item.canada_practical}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("survival");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public service");
  });

  it("guards no native-review claim and no A11 integration", () => {
    const text = PUNJABI_FINAL_OWNER_REVIEW_PACKET.map((item) => `${item.owner_summary_en} ${item.review_prompt_en} ${item.must_not_claim_en} ${item.learner_trap_en}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("must not claim");
    expect(text).toContain("not claimed");
    expect(text).toContain("a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("guards forbidden audio/scoring/Azure/Supabase/deploy/push claims", () => {
    const item = PUNJABI_FINAL_OWNER_REVIEW_PACKET.find((entry) => entry.id === "owner-forbidden-claims");
    expect(item).toBeDefined();
    const text = `${item?.owner_summary_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text-only");
  });

  it("defines owner review routes for completion, learner path, and boundary exit", () => {
    expect(PUNJABI_FINAL_OWNER_REVIEW_ROUTES.length).toBe(3);
    for (const route of PUNJABI_FINAL_OWNER_REVIEW_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final owner review packet - no unrelated scripts", () => {
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
