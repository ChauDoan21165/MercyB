import { describe, expect, it } from "vitest";
import {
  IELTS_LISTENING_BY_SECTION,
  IELTS_LISTENING_ITEMS,
  getIELTSListeningItemById,
  listeningRawToBand,
} from "../listening-items";

describe("IELTS_LISTENING_ITEMS catalogue", () => {
  it("ships exactly 30 items distributed 8/8/8/6 across sections", () => {
    expect(IELTS_LISTENING_ITEMS).toHaveLength(30);
    expect(IELTS_LISTENING_BY_SECTION[1]).toHaveLength(8);
    expect(IELTS_LISTENING_BY_SECTION[2]).toHaveLength(8);
    expect(IELTS_LISTENING_BY_SECTION[3]).toHaveLength(8);
    expect(IELTS_LISTENING_BY_SECTION[4]).toHaveLength(6);
  });

  it("every item id is unique and prefixed correctly", () => {
    const ids = new Set<string>();
    for (const item of IELTS_LISTENING_ITEMS) {
      expect(item.id).toMatch(/^ielts_listening_section[1-4]_/);
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    }
  });

  it("every item carries bilingual title + non-empty script", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      expect(item.topic_title_vi.trim().length).toBeGreaterThan(0);
      expect(item.topic_title_en.trim().length).toBeGreaterThan(0);
      expect(item.audio_script.trim().length).toBeGreaterThan(100);
    }
  });

  it("every item provides at least 4 questions with explanations", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      expect(item.questions.length).toBeGreaterThanOrEqual(4);
      for (const q of item.questions) {
        expect(q.question_text.trim().length).toBeGreaterThan(0);
        expect(q.correct_answer.trim().length).toBeGreaterThan(0);
        expect(q.explanation_vi.trim().length).toBeGreaterThan(0);
        if (q.type === "multiple_choice") {
          expect(q.options).toBeDefined();
          expect(q.options!.length).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it("every vocab entry has bilingual fields, IPA, and a valid band level", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      expect(item.vocabulary_focus.length).toBeGreaterThanOrEqual(3);
      for (const v of item.vocabulary_focus) {
        expect(v.word.trim().length).toBeGreaterThan(0);
        expect(v.vi_translation.trim().length).toBeGreaterThan(0);
        expect(v.ipa).toMatch(/^\/.+\/$/);
        expect([5, 6, 7, 8, 9]).toContain(v.band_level);
        expect(v.context_use.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every item provides at least 4 VN strategies and 3 common mistakes", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      expect(item.vietnamese_speaker_strategies.length).toBeGreaterThanOrEqual(4);
      expect(item.common_mistakes_vi.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("estimated time matches section convention (1-3: 8 min, 4: 10 min)", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      const expected = item.section === 4 ? 10 : 8;
      expect(item.estimated_time_minutes).toBe(expected);
    }
  });

  it("difficulty bands are valid IELTS half-band values", () => {
    const valid = [5.5, 6.5, 7.5, 8.5];
    for (const item of IELTS_LISTENING_ITEMS) {
      expect(valid).toContain(item.difficulty_band);
    }
  });

  it("question types are limited to the documented union", () => {
    const valid = [
      "multiple_choice",
      "matching",
      "form_completion",
      "note_completion",
      "plan_labelling",
      "short_answer",
    ];
    for (const item of IELTS_LISTENING_ITEMS) {
      for (const q of item.questions) {
        expect(valid).toContain(q.type);
      }
    }
  });

  it("question numbers are 1-based and ascending within an item", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      for (let i = 0; i < item.questions.length; i++) {
        expect(item.questions[i].number).toBe(i + 1);
      }
    }
  });

  it("Section 3 + 4 items use academic context", () => {
    for (const item of IELTS_LISTENING_ITEMS) {
      if (item.section === 3 || item.section === 4) {
        expect(item.context).toBe("academic");
      } else {
        expect(item.context).toBe("social");
      }
    }
  });
});

describe("getIELTSListeningItemById", () => {
  it("returns the item when id exists", () => {
    const item = getIELTSListeningItemById("ielts_listening_section1_hotel_booking");
    expect(item).toBeDefined();
    expect(item?.section).toBe(1);
  });

  it("returns undefined for unknown id", () => {
    expect(getIELTSListeningItemById("ielts_listening_nope")).toBeUndefined();
  });
});

describe("listeningRawToBand", () => {
  it("maps perfect / near-perfect raw scores to band 9", () => {
    expect(listeningRawToBand(40)).toBe(9.0);
    expect(listeningRawToBand(39)).toBe(9.0);
  });

  it("maps mid-range scores to expected half-bands", () => {
    expect(listeningRawToBand(30)).toBe(7.0);
    expect(listeningRawToBand(26)).toBe(6.5);
    expect(listeningRawToBand(23)).toBe(6.0);
  });

  it("clamps out-of-range and NaN inputs", () => {
    expect(listeningRawToBand(-5)).toBe(0);
    expect(listeningRawToBand(99)).toBe(9.0);
    expect(listeningRawToBand(NaN)).toBe(0);
  });

  it("monotonic — higher raw yields equal or higher band", () => {
    let last = 0;
    for (let r = 0; r <= 40; r++) {
      const b = listeningRawToBand(r);
      expect(b).toBeGreaterThanOrEqual(last);
      last = b;
    }
  });
});
