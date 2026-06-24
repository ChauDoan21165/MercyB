import { describe, expect, it } from "vitest";

import punjabiCanDoStatementsB2, {
  punjabiCanDoStatementsB2 as named,
  type PunjabiCanDoB2Statement,
} from "../canDoStatementsB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_DOMAINS = [
  "structured_opinion",
  "counterpoint",
  "comparison",
  "public_issue",
  "workplace_fairness",
  "settlement",
  "education",
  "healthcare_access",
  "public_service",
] as const;

const serialized = JSON.stringify(punjabiCanDoStatementsB2);

describe("Punjabi B2 can-do statements", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiCanDoStatementsB2).toBe(named);
    expect(Array.isArray(punjabiCanDoStatementsB2)).toBe(true);
  });

  it("ships compact but useful B2 can-do items", () => {
    expect(punjabiCanDoStatementsB2.length).toBeGreaterThanOrEqual(16);
    expect(punjabiCanDoStatementsB2.length).toBeLessThanOrEqual(32);
    expect(punjabiCanDoStatementsB2.every((item) => item.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required B2 domains", () => {
    const ids = punjabiCanDoStatementsB2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const domains = new Set(punjabiCanDoStatementsB2.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) expect(domains.has(domain)).toBe(true);

    const checkpoints = new Set(punjabiCanDoStatementsB2.map((item) => item.checkpoint));
    expect(checkpoints).toEqual(new Set(["readiness", "can_do", "capstone"]));
  });

  it.each(punjabiCanDoStatementsB2.map((item) => [item.id, item] as const))(
    "%s includes Gurmukhi, romanization, bilingual support, evidence, task, and traps",
    (_id, item: PunjabiCanDoB2Statement) => {
      expect(hasGurmukhi(item.canDo_gurmukhi)).toBe(true);
      expect(item.canDo_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.canDo_romanization)).toBe(false);
      expect(item.canDo_vi.trim().length).toBeGreaterThan(8);
      expect(item.canDo_en.trim().length).toBeGreaterThan(8);
      expect(item.evidence_gurmukhi.length).toBeGreaterThanOrEqual(3);
      expect(item.evidence_romanization.length).toBe(item.evidence_gurmukhi.length);
      expect(item.evidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.evidence_en.length).toBe(item.evidence_vi.length);
      expect(item.evidence_gurmukhi.every(hasGurmukhi)).toBe(true);
      expect(hasGurmukhi(item.miniTask_gurmukhi)).toBe(true);
      expect(item.miniTask_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.miniTask_romanization)).toBe(false);
      expect(item.miniTask_vi.trim().length).toBeGreaterThan(8);
      expect(item.miniTask_en.trim().length).toBeGreaterThan(8);
      expect(item.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(item.learnerTraps_en.length).toBe(item.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiCanDoStatementsB2.filter((item) => item.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
  });

  it("includes can-do, checkpoint, and readiness style content", () => {
    expect(serialized).toMatch(/can|Tôi có thể|I can/i);
    expect(serialized).toMatch(/readiness|capstone|can_do/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review without claiming it", () => {
    const shahmukhiMatches = serialized.match(/Shahmukhi/g) ?? [];
    expect(shahmukhiMatches.length).toBeLessThanOrEqual(1);
    expect(serialized).toMatch(/awareness only/i);
    expect(serialized).toMatch(/deferred/i);
    expect(serialized).not.toMatch(/native[- ](?:certified|verified|approved|reviewed)|verified by native|native speaker approved/i);
  });

  it("does not include unrelated product claims", () => {
    expect(serialized).not.toMatch(/pronunciation score|Azure|Supabase|billing|RLS|auth|audio/i);
  });
});
