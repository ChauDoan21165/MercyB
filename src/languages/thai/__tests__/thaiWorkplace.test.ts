// src/languages/thai/__tests__/thaiWorkplace.test.ts
//
// Guards for the Thai workplace pack (workplace.ts): count and level spread,
// every required topic covered, Thai-with-bilingual-glosses on every item,
// a polite-vs-casual note everywhere, and at least one genuinely casual item
// so the register contrast is real (not all "polite").

import { describe, it, expect } from "vitest";
import workplaceItems, {
  workplaceItems as named,
  type ThaiWorkplaceItem,
} from "../workplace";

const THAI_RE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RE.test(s);

const ALL_LEVELS = ["A2", "B1", "B2", "C1", "C2"] as const;
const REQUIRED_TOPICS = [
  "first_day",
  "schedule",
  "task_clarification",
  "safety",
  "apology",
  "delay",
  "handoff",
  "supervisor",
  "customer",
  "disagreement",
  "meeting",
  "formal_email",
  "negotiation",
] as const;
const VALID_REGISTERS = new Set(["casual", "polite", "formal"]);

describe("Thai workplace — wiring & coverage", () => {
  it("default and named exports are the same array", () => {
    expect(workplaceItems).toBe(named);
    expect(Array.isArray(workplaceItems)).toBe(true);
  });

  it("ships 40–80 workplace items", () => {
    expect(workplaceItems.length).toBeGreaterThanOrEqual(40);
    expect(workplaceItems.length).toBeLessThanOrEqual(80);
  });

  it("every id is unique", () => {
    const ids = workplaceItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("spans levels within A2–C2", () => {
    const seen = new Set(workplaceItems.map((i) => i.level));
    for (const lvl of seen) expect(ALL_LEVELS).toContain(lvl);
    // At least A2, B1, B2, C1 are represented.
    for (const lvl of ["A2", "B1", "B2", "C1"] as const) expect(seen.has(lvl)).toBe(true);
  });

  it("covers every required workplace topic", () => {
    const seen = new Set(workplaceItems.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) expect(seen.has(t)).toBe(true);
  });

  it("includes both polite/formal and at least one casual item (register contrast)", () => {
    const registers = new Set(workplaceItems.map((i) => i.register));
    expect(registers.has("casual")).toBe(true);
    expect(registers.has("polite") || registers.has("formal")).toBe(true);
  });
});

describe("Thai workplace — every item is well-formed", () => {
  it.each(workplaceItems.map((i) => [i.id, i] as const))(
    "%s has Thai line, VI+EN glosses, valid register, and a polite/casual note",
    (_id, item: ThaiWorkplaceItem) => {
      expect(hasThai(item.th)).toBe(true);
      expect(item.vi.trim().length).toBeGreaterThan(0);
      expect(item.en.trim().length).toBeGreaterThan(0);
      expect(VALID_REGISTERS.has(item.register)).toBe(true);

      // The polite-vs-casual note is the heart of this pack — both languages.
      expect(item.note_vi.trim().length).toBeGreaterThan(0);
      expect(item.note_en.trim().length).toBeGreaterThan(0);

      // Romanization, when present, must not contain Thai script.
      if (item.romanization !== undefined) {
        expect(hasThai(item.romanization)).toBe(false);
        expect(item.romanization.trim().length).toBeGreaterThan(0);
      }
      // The alt-register variant, when present, is Thai.
      if (item.alt_th !== undefined) {
        expect(hasThai(item.alt_th)).toBe(true);
      }
    },
  );
});
