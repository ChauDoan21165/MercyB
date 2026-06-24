import { describe, expect, it } from "vitest";

import punjabiReadinessGateB2, {
  punjabiReadinessGateB2 as named,
  type PunjabiReadinessGateB2Item,
} from "../readinessGateB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_AREAS = [
  "structured_opinion",
  "counterpoint",
  "public_issue_discussion",
  "workplace_fairness",
  "register_aware_communication",
] as const;

const REQUIRED_TOPICS = ["settlement", "work", "education", "healthcare", "public_service"] as const;

const REQUIRED_REGISTERS = ["neutral", "polite_formal", "workplace_professional"] as const;

const serialized = JSON.stringify(punjabiReadinessGateB2);

describe("Punjabi B2 readiness gate", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiReadinessGateB2).toBe(named);
    expect(Array.isArray(punjabiReadinessGateB2)).toBe(true);
  });

  it("ships compact but useful B2 readiness items", () => {
    expect(punjabiReadinessGateB2.length).toBeGreaterThanOrEqual(16);
    expect(punjabiReadinessGateB2.length).toBeLessThanOrEqual(32);
    expect(punjabiReadinessGateB2.every((item) => item.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required readiness areas, topics, and registers", () => {
    const ids = punjabiReadinessGateB2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const areas = new Set(punjabiReadinessGateB2.map((item) => item.gateArea));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);

    const topics = new Set(punjabiReadinessGateB2.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) expect(topics.has(topic)).toBe(true);

    const registers = new Set(punjabiReadinessGateB2.map((item) => item.register));
    for (const register of REQUIRED_REGISTERS) expect(registers.has(register)).toBe(true);
  });

  it.each(punjabiReadinessGateB2.map((item) => [item.id, item] as const))(
    "%s includes Gurmukhi prompt, romanization, response frame, routing, bilingual model, and traps",
    (_id, item: PunjabiReadinessGateB2Item) => {
      expect(item.checkpointTitle_vi.trim().length).toBeGreaterThan(8);
      expect(item.checkpointTitle_en.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.prompt_gurmukhi)).toBe(true);
      expect(item.prompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.prompt_romanization)).toBe(false);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(8);
      expect(item.prompt_en.trim().length).toBeGreaterThan(8);

      expect(item.responseFrame.length).toBeGreaterThanOrEqual(3);
      for (const phrase of item.responseFrame) {
        expect(hasGurmukhi(phrase.phrase_gurmukhi)).toBe(true);
        expect(phrase.romanization.trim().length).toBeGreaterThan(4);
        expect(phrase.vi.trim().length).toBeGreaterThan(4);
        expect(phrase.en.trim().length).toBeGreaterThan(4);
      }

      expect(item.expectedEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.expectedEvidence_en.length).toBe(item.expectedEvidence_vi.length);
      expect(item.readinessRoute.ifReady_vi.trim().length).toBeGreaterThan(10);
      expect(item.readinessRoute.ifReady_en.trim().length).toBeGreaterThan(10);
      expect(item.readinessRoute.ifPracticeNeeded_vi.trim().length).toBeGreaterThan(10);
      expect(item.readinessRoute.ifPracticeNeeded_en.trim().length).toBeGreaterThan(10);

      expect(hasGurmukhi(item.modelResponse_gurmukhi)).toBe(true);
      expect(item.modelResponse_romanization.trim().length).toBeGreaterThan(30);
      expect(item.modelResponse_vi.trim().length).toBeGreaterThan(30);
      expect(item.modelResponse_en.trim().length).toBeGreaterThan(30);
      expect(item.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(item.learnerTraps_en.length).toBe(item.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiReadinessGateB2.filter((item) => item.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(6);
  });

  it("includes readiness, checkpoint, and routing style content", () => {
    expect(serialized).toMatch(/Readiness checkpoint/i);
    expect(serialized).toMatch(/Route to|Chuyển sang|Review|Ôn/i);
    expect(serialized).toMatch(/register|formal|professional|lịch sự|chuyên nghiệp/i);
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
