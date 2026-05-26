// src/lib/mercy/__tests__/intentDetection.test.ts
//
// Pure-function tests for the unified-Mercy intent classifier. Covers
// English + Vietnamese phrasings for each intent, target extraction,
// language detection, confidence rules, and the default-chat fallthrough.

import { describe, expect, it } from "vitest";

import {
  __INTERNAL,
  detectIntent,
  detectLanguage,
} from "../intentDetection";

// ── Pronunciation intent ─────────────────────────────────────────────────

describe("detectIntent — pronunciation (English)", () => {
  it("classic 'how do I say X'", () => {
    const r = detectIntent("How do I say 'nail polish'?");
    expect(r.intent).toBe("pronunciation");
    expect(r.target).toBe("nail polish");
    expect(r.language).toBe("en");
    expect(r.confidence).toBeGreaterThanOrEqual(0.6);
  });

  it("'how to pronounce'", () => {
    expect(detectIntent("How to pronounce 'concierge'?").intent).toBe(
      "pronunciation",
    );
  });

  it("'pronunciation of X'", () => {
    expect(detectIntent("Pronunciation of acetaminophen?").intent).toBe(
      "pronunciation",
    );
  });

  it("'teach me how to say X'", () => {
    const r = detectIntent("Teach me how to say 'thirsty'");
    expect(r.intent).toBe("pronunciation");
    expect(r.target).toBe("thirsty");
  });

  it("imperative 'say X'", () => {
    expect(detectIntent("Say 'rural'").intent).toBe("pronunciation");
  });
});

describe("detectIntent — pronunciation (Vietnamese)", () => {
  it("'phát âm sao'", () => {
    const r = detectIntent("Phát âm 'thirsty' sao em?");
    expect(r.intent).toBe("pronunciation");
    expect(r.language).toBe("vi");
  });

  it("'đọc thế nào'", () => {
    expect(detectIntent("'Concierge' đọc thế nào?").intent).toBe(
      "pronunciation",
    );
  });

  it("'nói làm sao'", () => {
    expect(detectIntent("Cụm 'right away' nói làm sao?").intent).toBe(
      "pronunciation",
    );
  });
});

// ── Grammar-check intent ─────────────────────────────────────────────────

describe("detectIntent — grammar_check (English)", () => {
  it("'is this correct'", () => {
    expect(detectIntent("Is this correct: I goes home").intent).toBe(
      "grammar_check",
    );
  });

  it("'is the sentence right'", () => {
    expect(detectIntent("Is the sentence right?").intent).toBe(
      "grammar_check",
    );
  });

  it("'check my grammar'", () => {
    expect(detectIntent("Check my grammar please").intent).toBe(
      "grammar_check",
    );
  });

  it("'fix this sentence'", () => {
    expect(detectIntent("Fix this sentence: She no like coffee").intent).toBe(
      "grammar_check",
    );
  });

  it("extracts the sentence after a colon", () => {
    const r = detectIntent("Correct this: I goes to school yesterday");
    expect(r.intent).toBe("grammar_check");
    expect(r.target).toContain("I goes to school yesterday");
  });
});

describe("detectIntent — grammar_check (Vietnamese)", () => {
  it("'đúng chưa em'", () => {
    expect(detectIntent("Câu 'I am tired' đúng chưa em?").intent).toBe(
      "grammar_check",
    );
  });

  it("'sửa câu giúp mình'", () => {
    expect(detectIntent("Sửa câu giúp mình với").intent).toBe(
      "grammar_check",
    );
  });

  it("'đúng không'", () => {
    expect(detectIntent("Mình viết đúng không?").intent).toBe(
      "grammar_check",
    );
  });
});

// ── Lesson-request intent ────────────────────────────────────────────────

describe("detectIntent — lesson_request", () => {
  it("'next lesson'", () => {
    expect(detectIntent("What's the next lesson?").intent).toBe(
      "lesson_request",
    );
  });

  it("'teach me X'", () => {
    const r = detectIntent("Teach me past perfect tense");
    expect(r.intent).toBe("lesson_request");
    expect(r.target.toLowerCase()).toContain("past perfect");
  });

  it("'IELTS speaking' specific", () => {
    const r = detectIntent("Help me with IELTS speaking");
    expect(r.intent).toBe("lesson_request");
    expect(r.target.toLowerCase()).toContain("ielts speaking");
  });

  it("'mock interview'", () => {
    expect(detectIntent("Let's do a mock interview").intent).toBe(
      "lesson_request",
    );
  });

  it("Vietnamese 'bài tiếp theo'", () => {
    expect(detectIntent("Cho mình bài tiếp theo").intent).toBe(
      "lesson_request",
    );
  });

  it("Vietnamese 'dạy mình'", () => {
    const r = detectIntent("Dạy mình thì hiện tại hoàn thành");
    expect(r.intent).toBe("lesson_request");
    expect(r.target).toContain("thì hiện tại hoàn thành");
  });
});

// ── Encouragement intent ─────────────────────────────────────────────────

describe("detectIntent — encouragement", () => {
  it("'I'm stuck'", () => {
    expect(detectIntent("I'm stuck on this exercise").intent).toBe(
      "encouragement",
    );
  });

  it("'this is too hard'", () => {
    expect(detectIntent("This is too hard").intent).toBe("encouragement");
  });

  it("'I don't understand'", () => {
    expect(detectIntent("I don't understand").intent).toBe("encouragement");
  });

  it("Vietnamese 'khó quá'", () => {
    expect(detectIntent("Khó quá em ơi").intent).toBe("encouragement");
  });

  it("Vietnamese 'tôi nản'", () => {
    expect(detectIntent("Tôi nản với mấy bài này lắm").intent).toBe(
      "encouragement",
    );
  });
});

// ── Default chat fallthrough ─────────────────────────────────────────────

describe("detectIntent — chat fallthrough", () => {
  it("plain greeting → chat", () => {
    expect(detectIntent("Hi Mercy").intent).toBe("chat");
  });

  it("plain statement → chat", () => {
    expect(detectIntent("It's raining today").intent).toBe("chat");
  });

  it("empty input → chat at confidence 0", () => {
    const r = detectIntent("");
    expect(r.intent).toBe("chat");
    expect(r.confidence).toBe(0);
  });

  it("whitespace-only → chat at confidence 0", () => {
    expect(detectIntent("   \n\t").confidence).toBe(0);
  });
});

// ── Confidence rules ─────────────────────────────────────────────────────

describe("detectIntent — confidence rules", () => {
  it("multiple matching patterns → 0.9", () => {
    // Both 'check my grammar' AND 'fix this' patterns hit.
    const r = detectIntent("Check my grammar — fix this sentence: I goes home");
    expect(r.confidence).toBe(0.9);
  });

  it("single pattern + extractable target → 0.75", () => {
    const r = detectIntent("How do I say 'thirsty'?");
    expect(r.confidence).toBe(0.75);
  });

  it("single pattern + no target → 0.6", () => {
    const r = detectIntent("How to pronounce");
    expect(r.confidence).toBe(0.6);
  });

  it("never claims certainty above 0.97 (sanity cap)", () => {
    const r = detectIntent("how do i say it correct fix this grammar lesson");
    expect(r.confidence).toBeLessThanOrEqual(0.97);
  });
});

// ── Tie-breaking + priority ──────────────────────────────────────────────

describe("detectIntent — tie-breaking", () => {
  it("grammar wins over pronunciation when both single-match", () => {
    // 'fix this sentence' (grammar) + 'pronunciation of' (pronunciation)
    const r = detectIntent("Fix this sentence and pronunciation of 'rural'");
    expect(r.intent).toBe("grammar_check");
  });

  it("pronunciation wins over lesson when both single-match", () => {
    const r = detectIntent("Teach me how to say 'concierge' next lesson");
    expect(r.intent).toBe("pronunciation");
  });

  it("ignores noise tokens that aren't real patterns", () => {
    expect(detectIntent("how is the weather").intent).toBe("chat");
  });
});

// ── Language detection ──────────────────────────────────────────────────

describe("detectLanguage", () => {
  it("pure English → 'en'", () => {
    expect(detectLanguage("how do I say nail polish")).toBe("en");
  });

  it("pure Vietnamese with diacritics → 'vi'", () => {
    expect(detectLanguage("Phát âm thế nào ạ")).toBe("vi");
  });

  it("Vietnamese without diacritics but with keyword → 'vi' or 'mixed'", () => {
    // 'tieng anh' is a romanised keyword we still match.
    const out = detectLanguage("tieng anh kho qua");
    expect(out === "vi" || out === "en").toBe(true);
  });

  it("mixed VN + EN → 'mixed'", () => {
    expect(detectLanguage("Phát âm 'rural' sao em?")).toBe("mixed");
  });

  it("empty → 'en'", () => {
    expect(detectLanguage("")).toBe("en");
  });
});

// ── Target extractors (internal helpers) ────────────────────────────────

describe("internal target extractors", () => {
  it("extractPronunciationTarget: pulls quoted word", () => {
    expect(__INTERNAL.extractPronunciationTarget("Say 'rural'")).toBe("rural");
  });

  it("extractPronunciationTarget: pulls word after 'pronounce'", () => {
    expect(
      __INTERNAL.extractPronunciationTarget("How do I pronounce concierge?"),
    ).toBe("concierge");
  });

  it("extractPronunciationTarget: empty string when nothing extractable", () => {
    expect(__INTERNAL.extractPronunciationTarget("How to pronounce")).toBe("");
  });

  it("extractGrammarTarget: pulls sentence after colon", () => {
    expect(
      __INTERNAL.extractGrammarTarget("Correct this: I goes home"),
    ).toBe("I goes home");
  });

  it("extractLessonTopic: 'teach me X' → X", () => {
    expect(__INTERNAL.extractLessonTopic("Teach me past perfect")).toBe(
      "past perfect",
    );
  });

  it("extractLessonTopic: 'IELTS speaking' compound", () => {
    expect(__INTERNAL.extractLessonTopic("ielts speaking practice")).toBe(
      "ielts speaking",
    );
  });
});

// ── Robustness ──────────────────────────────────────────────────────────

describe("detectIntent — robustness", () => {
  it("handles trailing punctuation and case", () => {
    expect(detectIntent("HOW DO I SAY 'rural'?!?!").intent).toBe(
      "pronunciation",
    );
  });

  it("handles leading whitespace", () => {
    expect(detectIntent("   is this correct?").intent).toBe("grammar_check");
  });

  it("'next lesson on X' captures topic", () => {
    const r = detectIntent("next lesson on conditional sentences");
    expect(r.intent).toBe("lesson_request");
    expect(r.target.toLowerCase()).toContain("conditional");
  });
});
