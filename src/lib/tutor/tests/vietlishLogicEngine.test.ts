import { describe, expect, it } from "vitest";
import {
  diagnoseVietlishLogic,
  diagnoseVietlishLogicWithMatch,
  getSupportedVietlishLogicPatterns,
  getPatternsByCategory,
} from "@/lib/tutor/vietlishLogicEngine";

describe("vietlishLogicEngine", () => {
  // ── missing_word patterns ──────────────────────────────────────────────

  it("explains missing to before a destination (go-school)", () => {
    const result = diagnoseVietlishLogicWithMatch("I go school");
    expect(result.patternId).toBe("go-school");
    expect(result.isKnownPattern).toBe(true);
    expect(result.category).toBe("missing_word");
    expect(result.correctedExample).toBe("I go to school.");
    expect(result.vietnameseThinking).toContain("không cần từ nối");
    expect(result.englishLogic).toContain("giới từ");
    expect(result.rememberRule).toContain("to");
  });

  it("explains missing article for singular countable nouns", () => {
    const result = diagnoseVietlishLogicWithMatch("I bought hat yesterday.");
    expect(result.patternId).toBe("missing-article");
    expect(result.category).toBe("missing_word");
    expect(result.correctedExample).toBe("I bought a hat yesterday. / She is a teacher.");
    expect(result.vietnameseThinking).toContain("Tiếng Việt không có hệ thống mạo từ");
    expect(result.englishLogic).toContain("a/an/the");
    expect(result.rememberRule).toContain("a/an trước danh từ");
  });

  it("does not match missing-article when article IS present", () => {
    expect(diagnoseVietlishLogicWithMatch("I bought a hat yesterday.")).toMatchObject({
      patternId: expect.any(String),
      isKnownPattern: true,
    });
    // Should match the pronunciation nudge, not missing-article
    expect(diagnoseVietlishLogicWithMatch("I bought a hat yesterday.").patternId)
      .toBe("l4-pronunciation-final-sound-nudge");
  });

  // ── verb_form patterns ─────────────────────────────────────────────────

  it("explains yesterday with present tense", () => {
    const result = diagnoseVietlishLogicWithMatch("I buy a hat yesterday");
    expect(result.patternId).toBe("yesterday-present");
    expect(result.category).toBe("verb_form");
    expect(result.correctedExample).toBe("I bought a hat yesterday.");
    expect(result.vietnameseThinking).toContain("ngôn ngữ đơn lập");
    expect(result.vietnameseThinking).toContain("không biến hình");
    expect(result.englishLogic).toContain("quá khứ");
    expect(result.rememberRule).toContain("V2/V-ed");
  });

  it("explains unmarked past with ago / this morning", () => {
    const result = diagnoseVietlishLogicWithMatch("I go to the market this morning");
    expect(result.patternId).toBe("unmarked-past-common");
    expect(result.category).toBe("verb_form");
    expect(result.englishLogic).toContain("Ago");
    expect(result.rememberRule).toContain("quá khứ");
  });

  // ── noun_form patterns ─────────────────────────────────────────────────

  it("explains plural -s after quantity words", () => {
    const result = diagnoseVietlishLogicWithMatch("I have two book.");
    expect(result.patternId).toBe("plural-after-quantity");
    expect(result.category).toBe("noun_form");
    expect(result.correctedExample).toBe("I have two books. / Many students like English.");
    expect(result.vietnameseThinking).toContain("không có phạm trù số nhiều");
    expect(result.rememberRule).toContain("-s/-es");
  });

  it("does not match plural when quantity is one", () => {
    expect(diagnoseVietlishLogicWithMatch("I have one book.")).toMatchObject({
      patternId: null,
      isKnownPattern: false,
    });
  });

  it("explains countable/uncountable noun confusion", () => {
    const result = diagnoseVietlishLogicWithMatch("She gave me an advice.");
    expect(result.patternId).toBe("countable-uncountable");
    expect(result.category).toBe("noun_form");
    expect(result.correctedExample).toContain("some advice");
    expect(result.vietnameseThinking).toContain("không phân biệt danh từ đếm được");
  });

  // ── word_order patterns ────────────────────────────────────────────────

  it("explains Vietnamese topic-comment word order transfer", () => {
    const result = diagnoseVietlishLogicWithMatch("This book I like.");
    expect(result.patternId).toBe("topic-comment-word-order");
    expect(result.category).toBe("word_order");
    expect(result.correctedExample).toBe("I like this book. / I study English every day.");
    expect(result.vietnameseThinking).toContain("chủ đề nổi bật");
    expect(result.englishLogic).toContain("chủ ngữ");
    expect(result.englishLogic).toContain("động từ");
    expect(result.englishLogic).toContain("tân ngữ");
    expect(result.rememberRule).toContain("Chủ ngữ");
    expect(result.rememberRule).toContain("Động từ");
    expect(result.rememberRule).toContain("Tân ngữ");
  });

  it("does not match topic-comment when it has comma separation", () => {
    const result = diagnoseVietlishLogicWithMatch("This book, I like it.");
    expect(result.patternId).toBeNull();
  });

  it("explains adverb placement errors", () => {
    const result = diagnoseVietlishLogicWithMatch("I in the morning usually drink coffee.");
    expect(result.patternId).toBe("adverb-placement");
    expect(result.category).toBe("word_order");
    expect(result.correctedExample).toContain("I usually drink coffee in the morning");
    expect(result.vietnameseThinking).toContain("trật tự từ khá linh hoạt");
    expect(result.rememberRule.toLowerCase()).toContain("trạng từ tần suất");
  });

  // ── word_choice patterns ───────────────────────────────────────────────

  it("explains very before like", () => {
    const result = diagnoseVietlishLogicWithMatch("I very like English.");
    expect(result.patternId).toBe("very-like");
    expect(result.category).toBe("word_choice");
    expect(result.correctedExample).toBe("I really like English. / I like English very much.");
    expect(result.vietnameseThinking).toContain("rất");
    expect(result.englishLogic).toContain("very");
    expect(result.rememberRule).toContain("really");
  });

  it("explains interested versus interesting", () => {
    const result = diagnoseVietlishLogicWithMatch("I am interesting in English.");
    expect(result.patternId).toBe("interesting-interested");
    expect(result.category).toBe("word_choice");
    expect(result.correctedExample).toBe("I am interested in English.");
    expect(result.vietnameseThinking).toContain("thú vị");
    expect(result.englishLogic).toContain("-ing");
    expect(result.rememberRule).toContain("Người → -ed");
  });

  it("explains say vs tell confusion", () => {
    const result = diagnoseVietlishLogicWithMatch("She said me the truth.");
    expect(result.patternId).toBe("say-tell-confusion");
    expect(result.category).toBe("word_choice");
    expect(result.correctedExample).toBe("She told me the truth.");
    expect(result.vietnameseThinking).toContain("nói");
    expect(result.rememberRule).toContain("tell me");
  });

  it("explains age with have → be", () => {
    const result = diagnoseVietlishLogicWithMatch("I have 20 years old.");
    expect(result.patternId).toBe("age-have-be");
    expect(result.category).toBe("word_choice");
    expect(result.correctedExample).toBe("I am 20 years old.");
    expect(result.vietnameseThinking).toContain("có");
    expect(result.rememberRule).toContain("be");
  });

  it("explains open → turn on for electrical devices", () => {
    const result = diagnoseVietlishLogicWithMatch("Can you open the light?");
    expect(result.patternId).toBe("open-turn-on");
    expect(result.category).toBe("word_choice");
    expect(result.correctedExample).toBe("Can you turn on the light?");
    expect(result.vietnameseThinking).toContain("mở");
    expect(result.rememberRule).toContain("turn on");
  });

  // ── extra_word patterns ────────────────────────────────────────────────

  it("explains discuss without about", () => {
    const result = diagnoseVietlishLogicWithMatch("We discussed about the plan.");
    expect(result.patternId).toBe("discuss-about");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("We discussed the plan.");
    expect(result.vietnameseThinking).toContain("thảo luận về");
    expect(result.rememberRule).toContain("không about");
  });

  it("explains mention without about", () => {
    const result = diagnoseVietlishLogicWithMatch("She mentioned about the schedule.");
    expect(result.patternId).toBe("mention-about");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("She mentioned the schedule.");
  });

  it("explains go home without to", () => {
    const result = diagnoseVietlishLogicWithMatch("I went to home after class.");
    expect(result.patternId).toBe("go-to-home");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("I went home after class.");
    expect(result.vietnameseThinking).toContain("về nhà");
    expect(result.rememberRule).toContain("không 'to'");
  });

  it("explains marry without with", () => {
    const result = diagnoseVietlishLogicWithMatch("She married with her classmate.");
    expect(result.patternId).toBe("marry-with");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("She married her classmate.");
  });

  it("explains contact without with", () => {
    const result = diagnoseVietlishLogicWithMatch("Please contact with the manager.");
    expect(result.patternId).toBe("contact-with");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("Please contact the manager.");
  });

  it("explains double comparative (more + -er)", () => {
    const result = diagnoseVietlishLogicWithMatch("This exercise is more easier than the last one.");
    expect(result.patternId).toBe("double-comparative");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("This exercise is easier than the last one.");
    expect(result.vietnameseThinking).toContain("hơn");
    expect(result.rememberRule).toContain("MỘT");
  });

  it("explains explain something to someone", () => {
    const result = diagnoseVietlishLogicWithMatch("Can you explain me the rule?");
    expect(result.patternId).toBe("explain-to-me");
    expect(result.category).toBe("extra_word");
    expect(result.correctedExample).toBe("Can you explain the rule to me?");
  });

  it("explains since vs for duration", () => {
    const result = diagnoseVietlishLogicWithMatch("I have lived here since two years.");
    expect(result.patternId).toBe("since-for-duration");
    expect(result.category).toBe("word_choice");
    expect(result.correctedExample).toBe("I have lived here for two years.");
    expect(result.vietnameseThinking).toContain("từ");
  });

  // ── L4 pronunciation nudge ─────────────────────────────────────────────

  it("adds a light final-sound pronunciation nudge", () => {
    const result = diagnoseVietlishLogicWithMatch("I bought a hat yesterday.");
    expect(result.patternId).toBe("l4-pronunciation-final-sound-nudge");
    expect(result.category).toBe("other");
    expect(result.correctedExample).toContain("Practice the final sound");
    expect(result.vietnameseThinking).toContain("âm tiết mở");
    expect(result.rememberRule).toContain("gợi ý luyện phát âm");
  });

  // ── Fallback and unknown patterns ──────────────────────────────────────

  it("returns a helpful Vietnamese fallback for unknown patterns", () => {
    const diagnosis = diagnoseVietlishLogic("My brother want learn more better English.");

    expect(diagnosis.originalPattern).toContain("chưa có trong thư viện");
    expect(diagnosis.vietnameseThinking).toContain("ngôn ngữ đơn lập");
    expect(diagnosis.vietnameseThinking).toContain("biến hình");
    expect(diagnosis.englishLogic).toContain("chủ ngữ");
    expect(diagnosis.rememberRule).toContain("Kiểm tra 4 thứ");
    expect(diagnosis.retryPrompt).toContain("ai làm gì");
  });

  it("marks known and unknown patterns for structured Logic UI", () => {
    expect(diagnoseVietlishLogicWithMatch("I go school")).toMatchObject({
      patternId: "go-school",
      isKnownPattern: true,
      correctedExample: "I go to school.",
    });

    const unknown = diagnoseVietlishLogicWithMatch("This sentence is not in the beginner list.");
    expect(unknown.patternId).toBeNull();
    expect(unknown.isKnownPattern).toBe(false);
    expect(unknown.fallbackMessage).toContain("Mercy vẫn có thể giải thích");
  });

  // ── Pattern registry ───────────────────────────────────────────────────

  it("exposes stable supported pattern ids for lesson planners", () => {
    const ids = getSupportedVietlishLogicPatterns();
    // Step 007: expanded from 8 to 22 patterns
    expect(ids).toHaveLength(22);
    // Core patterns must be present (original 8, with renamed IDs)
    expect(ids).toContain("very-like");
    expect(ids).toContain("go-school");
    expect(ids).toContain("yesterday-present");
    expect(ids).toContain("l4-pronunciation-final-sound-nudge");
    expect(ids).toContain("missing-article");
    expect(ids).toContain("plural-after-quantity");
    expect(ids).toContain("topic-comment-word-order");
    expect(ids).toContain("interesting-interested");
    // New patterns from Step 007
    expect(ids).toContain("unmarked-past-common");
    expect(ids).toContain("countable-uncountable");
    expect(ids).toContain("adverb-placement");
    expect(ids).toContain("say-tell-confusion");
    expect(ids).toContain("age-have-be");
    expect(ids).toContain("open-turn-on");
    expect(ids).toContain("discuss-about");
    expect(ids).toContain("mention-about");
    expect(ids).toContain("go-to-home");
    expect(ids).toContain("marry-with");
    expect(ids).toContain("contact-with");
    expect(ids).toContain("double-comparative");
    expect(ids).toContain("explain-to-me");
    expect(ids).toContain("since-for-duration");
  });

  it("groups patterns by interference category", () => {
    const byCategory = getPatternsByCategory();

    expect(byCategory.missing_word).toContain("go-school");
    expect(byCategory.missing_word).toContain("missing-article");

    expect(byCategory.verb_form).toContain("yesterday-present");
    expect(byCategory.verb_form).toContain("unmarked-past-common");

    expect(byCategory.noun_form).toContain("plural-after-quantity");
    expect(byCategory.noun_form).toContain("countable-uncountable");

    expect(byCategory.word_order).toContain("topic-comment-word-order");
    expect(byCategory.word_order).toContain("adverb-placement");

    expect(byCategory.word_choice).toContain("very-like");
    expect(byCategory.word_choice).toContain("interesting-interested");
    expect(byCategory.word_choice).toContain("say-tell-confusion");
    expect(byCategory.word_choice).toContain("age-have-be");
    expect(byCategory.word_choice).toContain("open-turn-on");
    expect(byCategory.word_choice).toContain("since-for-duration");

    expect(byCategory.extra_word).toContain("discuss-about");
    expect(byCategory.extra_word).toContain("mention-about");
    expect(byCategory.extra_word).toContain("go-to-home");
    expect(byCategory.extra_word).toContain("marry-with");
    expect(byCategory.extra_word).toContain("contact-with");
    expect(byCategory.extra_word).toContain("double-comparative");
    expect(byCategory.extra_word).toContain("explain-to-me");

    expect(byCategory.other).toContain("l4-pronunciation-final-sound-nudge");

    // Total count check
    const total = Object.values(byCategory).reduce((sum, ids) => sum + ids.length, 0);
    expect(total).toBe(22);
  });

  // ── diagnoseVietlishLogic (non-match variant) ──────────────────────────

  it("diagnoseVietlishLogic includes category field", () => {
    const result = diagnoseVietlishLogic("I go school");
    expect(result.category).toBe("missing_word");
    expect(result.originalPattern).toBe("I go school.");
    expect(result.vietnameseThinking).toContain("không cần từ nối");
  });

  it("diagnoseVietlishLogic fallback also has category", () => {
    const result = diagnoseVietlishLogic("Something completely unrecognized here.");
    expect(result.category).toBe("other");
    expect(result.originalPattern).toContain("chưa có trong thư viện");
  });
});
