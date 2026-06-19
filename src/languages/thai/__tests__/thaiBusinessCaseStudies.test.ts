// src/languages/thai/__tests__/thaiBusinessCaseStudies.test.ts
//
// Guards for the Thai business case-study pack (businessCaseStudies.ts): count,
// all nine topics covered, and that every case study is a COMPLETE role-play —
// situation, task, useful phrases (Thai + bilingual), a Thai model answer, a
// register caution, and a common mistake — all in both VI and EN.

import { describe, it, expect } from "vitest";
import caseStudies, {
  caseStudies as named,
  type ThaiCaseStudy,
} from "../businessCaseStudies";

const THAI_RE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RE.test(s);

const REQUIRED_TOPICS = [
  "complaint",
  "delay",
  "negotiation",
  "supplier",
  "customer_service",
  "schedule_change",
  "invoice",
  "refund",
  "escalation",
] as const;

describe("Thai case studies — wiring & coverage", () => {
  it("default and named exports are the same array", () => {
    expect(caseStudies).toBe(named);
    expect(Array.isArray(caseStudies)).toBe(true);
  });

  it("ships 20–40 case studies", () => {
    expect(caseStudies.length).toBeGreaterThanOrEqual(20);
    expect(caseStudies.length).toBeLessThanOrEqual(40);
  });

  it("every id is unique", () => {
    const ids = caseStudies.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required topic", () => {
    const seen = new Set(caseStudies.map((c) => c.topic));
    for (const t of REQUIRED_TOPICS) expect(seen.has(t)).toBe(true);
  });
});

describe("Thai case studies — every study is a complete role-play", () => {
  it.each(caseStudies.map((c) => [c.id, c] as const))(
    "%s has situation, task, phrases, model, register caution & common mistake (VI+EN)",
    (_id, c: ThaiCaseStudy) => {
      // Bilingual situation + task.
      expect(c.situation_vi.trim().length).toBeGreaterThan(0);
      expect(c.situation_en.trim().length).toBeGreaterThan(0);
      expect(c.task_vi.trim().length).toBeGreaterThan(0);
      expect(c.task_en.trim().length).toBeGreaterThan(0);

      // Useful phrases: at least one, each Thai with VI + EN glosses.
      expect(c.useful_phrases.length).toBeGreaterThanOrEqual(1);
      for (const p of c.useful_phrases) {
        expect(hasThai(p.th)).toBe(true);
        expect(p.vi.trim().length).toBeGreaterThan(0);
        expect(p.en.trim().length).toBeGreaterThan(0);
        if (p.romanization !== undefined) {
          expect(hasThai(p.romanization)).toBe(false);
        }
      }

      // Model answer is Thai with VI + EN glosses.
      expect(hasThai(c.model_th)).toBe(true);
      expect(c.model_vi.trim().length).toBeGreaterThan(0);
      expect(c.model_en.trim().length).toBeGreaterThan(0);
      if (c.model_romanization !== undefined) {
        expect(hasThai(c.model_romanization)).toBe(false);
      }

      // Register caution + common mistake, both languages.
      expect(c.register_caution_vi.trim().length).toBeGreaterThan(0);
      expect(c.register_caution_en.trim().length).toBeGreaterThan(0);
      expect(c.common_mistake_vi.trim().length).toBeGreaterThan(0);
      expect(c.common_mistake_en.trim().length).toBeGreaterThan(0);
    },
  );
});
