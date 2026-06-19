// src/languages/thai/__tests__/thaiDialogues.test.ts
//
// Guards the Thai dialogue/roleplay batch. Proves:
//   • a healthy count (40–80) of compact dialogues,
//   • every line carries Thai script + romanization,
//   • every dialogue has VI + EN titles and roleplay prompts,
//   • each has roleplay prompts AND an example expected learner response,
//   • all 12 required topics are covered,
//   • levels are valid CEFR values,
//   • NO CJK / Hangul / Japanese-kana / Cyrillic assumptions anywhere.

import { describe, it, expect } from "vitest";

import {
  thaiDialogues,
  THAI_DIALOGUE_TOPICS,
  type ThaiDialogueTopic,
} from "../dialogues";

const THAI = /[฀-๿]/;
const CJK = /[一-鿿]/;
const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const VALID_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const REQUIRED_TOPICS: ThaiDialogueTopic[] = [
  "greetings",
  "food",
  "taxi",
  "hotel",
  "pharmacy",
  "police_lost_item",
  "work_first_day",
  "shopping",
  "immigration",
  "phone_call",
  "workplace_disagreement",
  "formal_meeting",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(thaiDialogues);
  return out;
}

describe("Thai dialogues — batch shape", () => {
  it("ships 40–80 compact dialogues", () => {
    expect(thaiDialogues.length).toBeGreaterThanOrEqual(40);
    expect(thaiDialogues.length).toBeLessThanOrEqual(80);
  });

  it("has unique ids", () => {
    const ids = thaiDialogues.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only valid CEFR levels", () => {
    for (const d of thaiDialogues) expect(VALID_LEVELS.has(d.level)).toBe(true);
  });

  it("spans a range of levels (A1 … C2 represented)", () => {
    const levels = new Set(thaiDialogues.map((d) => d.level));
    expect(levels.has("A1")).toBe(true);
    expect(levels.has("B1")).toBe(true);
    expect(levels.has("C1")).toBe(true);
  });
});

describe("Thai dialogues — topic coverage", () => {
  it("covers all 12 required topics", () => {
    const present = new Set(thaiDialogues.map((d) => d.topic));
    for (const t of REQUIRED_TOPICS) expect(present.has(t)).toBe(true);
  });

  it("THAI_DIALOGUE_TOPICS lists exactly the required topics", () => {
    expect(new Set(THAI_DIALOGUE_TOPICS)).toEqual(new Set(REQUIRED_TOPICS));
  });
});

describe("Thai dialogues — Thai script + romanization", () => {
  it("every line has Thai script and a romanization", () => {
    for (const d of thaiDialogues) {
      expect(d.lines.length).toBeGreaterThan(0);
      for (const line of d.lines) {
        expect(line.thai).toMatch(THAI);
        expect(line.romanization.length).toBeGreaterThan(0);
        expect(line.speaker.length).toBeGreaterThan(0);
      }
    }
  });

  it("every line carries VI + EN glosses", () => {
    for (const d of thaiDialogues) {
      for (const line of d.lines) {
        expect(line.vi.length).toBeGreaterThan(0);
        expect(line.en.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("Thai dialogues — VI + EN explanations", () => {
  it("every dialogue has VI and EN titles", () => {
    for (const d of thaiDialogues) {
      expect(d.title_vi.length).toBeGreaterThan(0);
      expect(d.title_en.length).toBeGreaterThan(0);
    }
  });

  it("every dialogue has VI and EN roleplay prompts", () => {
    for (const d of thaiDialogues) {
      expect(d.roleplay_prompt_vi.length).toBeGreaterThan(0);
      expect(d.roleplay_prompt_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai dialogues — roleplay + expected response", () => {
  it("every dialogue has a complete expected_response example", () => {
    for (const d of thaiDialogues) {
      expect(d.expected_response).toBeTruthy();
      expect(d.expected_response.thai).toMatch(THAI);
      expect(d.expected_response.romanization.length).toBeGreaterThan(0);
      expect(d.expected_response.vi.length).toBeGreaterThan(0);
      expect(d.expected_response.en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai dialogues — no CJK/Hangul/Japanese/Russian assumptions", () => {
  const strings = allStrings();

  it("contains no Chinese/Japanese kanji", () => {
    for (const s of strings) expect(s).not.toMatch(CJK);
  });
  it("contains no Korean Hangul", () => {
    for (const s of strings) expect(s).not.toMatch(HANGUL);
  });
  it("contains no Japanese kana", () => {
    for (const s of strings) expect(s).not.toMatch(KANA);
  });
  it("contains no Cyrillic (Russian etc.)", () => {
    for (const s of strings) expect(s).not.toMatch(CYRILLIC);
  });
});
