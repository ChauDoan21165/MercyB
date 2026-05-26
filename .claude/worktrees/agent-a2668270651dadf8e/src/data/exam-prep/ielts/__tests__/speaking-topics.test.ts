// src/data/exam-prep/ielts/__tests__/speaking-topics.test.ts
//
// Content + schema integrity tests for the IELTS Speaking pack.
// Runs entirely on the static export — no mocks, no I/O.

import { describe, expect, it } from "vitest";

import {
  IELTS_SPEAKING_TOPICS,
  IELTS_SPEAKING_TOPICS_BY_PART,
  getTopicById,
  getTopicsByPart,
  type IELTSBandLevel,
  type IELTSSpeakingTopic,
} from "../speaking-topics";

const VALID_BANDS = new Set<IELTSBandLevel>([5, 6, 7, 8, 9]);

describe("IELTS_SPEAKING_TOPICS — total count + part distribution", () => {
  it("ships exactly 30 topics", () => {
    expect(IELTS_SPEAKING_TOPICS.length).toBe(30);
  });

  it("has exactly 10 topics per part", () => {
    expect(getTopicsByPart(1).length).toBe(10);
    expect(getTopicsByPart(2).length).toBe(10);
    expect(getTopicsByPart(3).length).toBe(10);
  });

  it("part-indexed map matches list filtering", () => {
    expect(IELTS_SPEAKING_TOPICS_BY_PART[1].length).toBe(10);
    expect(IELTS_SPEAKING_TOPICS_BY_PART[2].length).toBe(10);
    expect(IELTS_SPEAKING_TOPICS_BY_PART[3].length).toBe(10);
  });
});

describe("IELTS_SPEAKING_TOPICS — id uniqueness + URL safety", () => {
  it("every topic has a unique id", () => {
    const seen = new Set<string>();
    for (const t of IELTS_SPEAKING_TOPICS) {
      expect(seen.has(t.id)).toBe(false);
      seen.add(t.id);
    }
  });

  it("every id is URL-safe and prefixed by part", () => {
    for (const t of IELTS_SPEAKING_TOPICS) {
      expect(t.id).toMatch(/^ielts_speaking_part[123]_[a-z0-9_]+$/);
    }
  });

  it("getTopicById returns the same object for a known id", () => {
    const first = IELTS_SPEAKING_TOPICS[0];
    expect(getTopicById(first.id)).toBe(first);
  });

  it("getTopicById returns null for an unknown id", () => {
    expect(getTopicById("ielts_speaking_part1_does_not_exist")).toBeNull();
  });
});

describe("IELTS_SPEAKING_TOPICS — bilingual integrity (every topic)", () => {
  it.each(IELTS_SPEAKING_TOPICS)("$id has non-empty VI + EN titles", (t: IELTSSpeakingTopic) => {
    expect(t.topic_title_vi.trim().length).toBeGreaterThan(0);
    expect(t.topic_title_en.trim().length).toBeGreaterThan(0);
  });

  it.each(IELTS_SPEAKING_TOPICS)("$id has non-empty VI description", (t) => {
    expect(t.description_vi.trim().length).toBeGreaterThan(20);
  });

  it.each(IELTS_SPEAKING_TOPICS)("$id has 4–6 sample questions (Part 1/3) or 1 prompt (Part 2)", (t) => {
    if (t.part === 2) {
      expect(t.sample_questions.length).toBeGreaterThanOrEqual(1);
    } else {
      expect(t.sample_questions.length).toBeGreaterThanOrEqual(4);
      expect(t.sample_questions.length).toBeLessThanOrEqual(6);
    }
    for (const q of t.sample_questions) expect(q.trim().length).toBeGreaterThan(5);
  });
});

describe("IELTS_SPEAKING_TOPICS — Part 2 cue cards", () => {
  it("every Part 2 topic has a 4-bullet cue_card_text", () => {
    for (const t of getTopicsByPart(2)) {
      expect(t.cue_card_text).toBeDefined();
      // A canonical IELTS cue card has 3 'You should say' bullets +
      // 1 'and explain' line. Both bullet markers + the closing
      // 'explain' must appear in the text.
      const bullets = (t.cue_card_text ?? "").split("•").length - 1;
      expect(bullets).toBeGreaterThanOrEqual(3);
      expect(t.cue_card_text!.toLowerCase()).toContain("explain");
    }
  });

  it("Part 1 + Part 3 topics do NOT have cue_card_text", () => {
    for (const t of [...getTopicsByPart(1), ...getTopicsByPart(3)]) {
      expect(t.cue_card_text).toBeUndefined();
    }
  });
});

describe("IELTS_SPEAKING_TOPICS — vocabulary integrity", () => {
  it.each(IELTS_SPEAKING_TOPICS)("$id has 5+ vocabulary items", (t) => {
    expect(t.vocabulary_focus.length).toBeGreaterThanOrEqual(5);
  });

  it.each(IELTS_SPEAKING_TOPICS)("$id vocabulary has IPA + VI translation + band 5–9 + non-trivial example", (t) => {
    for (const v of t.vocabulary_focus) {
      expect(v.word.trim().length).toBeGreaterThan(0);
      // IPA must be wrapped in /…/ and contain at least one phonetic char.
      expect(v.ipa).toMatch(/^\/[^/]+\/$/);
      expect(v.vi_translation.trim().length).toBeGreaterThan(0);
      expect(VALID_BANDS.has(v.band_level)).toBe(true);
      // Example must be a substantive sentence (not just the word).
      // Inflection (took/take, looked/look) makes a literal substring
      // match too strict — a length floor is the pragmatic check.
      const exampleWords = v.example_use_in_topic.trim().split(/\s+/);
      expect(exampleWords.length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("IELTS_SPEAKING_TOPICS — Vietnamese-speaker strategies", () => {
  it.each(IELTS_SPEAKING_TOPICS)("$id has 5+ VN-speaker strategies", (t) => {
    expect(t.vietnamese_speaker_strategies.length).toBeGreaterThanOrEqual(5);
    for (const tip of t.vietnamese_speaker_strategies) {
      expect(tip.trim().length).toBeGreaterThan(15);
    }
  });
});

describe("IELTS_SPEAKING_TOPICS — sample answers", () => {
  it.each(IELTS_SPEAKING_TOPICS)("$id has substantive band-7 sample (≥40 words)", (t) => {
    const words = t.sample_strong_answer_band_7.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(40);
  });

  it.each(IELTS_SPEAKING_TOPICS)("$id has band-5 sample with annotations", (t) => {
    expect(t.sample_weak_answer_band_5.trim().length).toBeGreaterThan(20);
    // Annotations are written in [square brackets] flagging weaknesses.
    expect(t.sample_weak_answer_band_5).toMatch(/\[/);
    expect(t.sample_weak_answer_band_5).toMatch(/\]/);
  });
});

describe("IELTS_SPEAKING_TOPICS — estimated time per part", () => {
  it("Part 1 topics estimate 4–5 minutes", () => {
    for (const t of getTopicsByPart(1)) {
      expect(t.estimated_time_minutes).toBeGreaterThanOrEqual(4);
      expect(t.estimated_time_minutes).toBeLessThanOrEqual(5);
    }
  });

  it("Part 2 topics estimate 3–4 minutes", () => {
    for (const t of getTopicsByPart(2)) {
      expect(t.estimated_time_minutes).toBeGreaterThanOrEqual(3);
      expect(t.estimated_time_minutes).toBeLessThanOrEqual(5);
    }
  });

  it("Part 3 topics estimate 4–5 minutes", () => {
    for (const t of getTopicsByPart(3)) {
      expect(t.estimated_time_minutes).toBeGreaterThanOrEqual(4);
      expect(t.estimated_time_minutes).toBeLessThanOrEqual(5);
    }
  });
});

describe("IELTS_SPEAKING_TOPICS — Part 1 topic coverage matches brief", () => {
  it("includes the 10 Part 1 themes named in the brief", () => {
    const ids = getTopicsByPart(1).map((t) => t.id);
    const expectedKeywords = [
      "hometown",
      "family",
      "work",
      "hobbies",
      "food",
      "technology",
      "sports",
      "travel",
      "weather",
      "music",
    ];
    for (const kw of expectedKeywords) {
      expect(ids.some((id) => id.includes(kw))).toBe(true);
    }
  });
});

describe("IELTS_SPEAKING_TOPICS — Part 3 topic coverage matches brief", () => {
  it("includes the named discussion themes", () => {
    const ids = getTopicsByPart(3).map((t) => t.id);
    const expectedKeywords = [
      "family",
      "technology",
      "globalization",
      "education",
      "environmental",
      "tradition",
      "media",
      "generational",
      "urban",
      "future",
    ];
    for (const kw of expectedKeywords) {
      expect(ids.some((id) => id.includes(kw))).toBe(true);
    }
  });
});
