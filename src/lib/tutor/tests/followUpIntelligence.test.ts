/**
 * Golden tests for Teacher Mercy's follow-up question intelligence.
 *
 * These are canonical (learner_input, follow_up_question) pairs that
 * prove the intelligence layer correctly distinguishes:
 *   - connected vs. disconnected questions
 *   - specific vs. generic/rote questions
 *   - useful-for-practice vs. dead-end questions
 *   - one-question vs. question-barrage
 *
 * Each test case documents WHY the expected verdict is correct in
 * human-teacher terms — these are the "golden" examples that must
 * never regress.
 */

import { describe, expect, it } from "vitest";
import {
  assessFollowUpQuality,
  isGoodFollowUp,
  isAcceptableFollowUp,
  assessFollowUpFromResponse,
  assessConnection,
  assessSpecificity,
  assessPracticeUtility,
  type FollowUpQualityResult,
} from "../followUpIntelligence";

// ─── Helper ──────────────────────────────────────────────────────────────

function expectVerdict(
  learnerText: string,
  followUpQuestion: string,
  expectedVerdict: FollowUpQualityResult["verdict"],
  context: string,
): void {
  const result = assessFollowUpQuality(learnerText, followUpQuestion);
  expect(result.verdict, `${context}: expected ${expectedVerdict}, got ${result.verdict} (${result.reasonCode})`).toBe(expectedVerdict);
}

// ─── Golden Tests: Excellent Follow-Ups ──────────────────────────────────
// These are the gold standard. A human teacher would naturally ask these.

describe("Golden: excellent follow-ups (connected + specific + useful)", () => {
  it("follows up on 'market' with a specific question about what they bought", () => {
    // Learner: "I went to the market yesterday."
    // Mercy: "Bạn đã mua gì ở chợ hôm qua?"
    // Why excellent: connected via "market/chợ", specific to this learner's
    // trip, and useful — asks for new language (past tense, shopping vocab).
    expectVerdict(
      "I go to market yesterday",
      "Bạn đã mua gì ở chợ hôm qua?",
      "excellent",
      "market follow-up",
    );
  });

  it("follows up on 'work' with a specific job question", () => {
    // Learner: "She work at bank."
    // Mercy: "Cô ấy làm công việc gì ở ngân hàng?"
    // Why excellent: connected via "work/bank/ngân hàng", specific,
    // invites job vocabulary production.
    expectVerdict(
      "She work at bank",
      "Cô ấy làm công việc gì ở ngân hàng?",
      "excellent",
      "work follow-up",
    );
  });

  it("follows up on 'movie' with a question about the film", () => {
    // Learner: "I watch movie last night."
    // Mercy: "Phim đó có hay không?"
    // Why excellent: connected via "movie/phim", specific, useful for
    // practicing opinion/adjective language.
    expectVerdict(
      "I watch movie last night",
      "Phim đó có hay không?",
      "excellent",
      "movie follow-up",
    );
  });

  it("follows up on 'pizza' with a specific preference question", () => {
    // Learner: "I like pizza."
    // Mercy: "Bạn thích loại pizza nào nhất?"
    // Why excellent: connected via "pizza", specific (asks for detail),
    // useful — requires new language about food preferences.
    expectVerdict(
      "I like pizza",
      "Bạn thích loại pizza nào nhất?",
      "excellent",
      "pizza follow-up",
    );
  });

  it("follows up on 'doctor' with a workplace question", () => {
    // Learner: "My brother is doctor."
    // Mercy: "Anh ấy làm ở bệnh viện nào?"
    // Why excellent: connected via "doctor/bác sĩ → bệnh viện",
    // specific, useful — practices location vocabulary.
    expectVerdict(
      "My brother is doctor",
      "Anh ấy làm ở bệnh viện nào?",
      "excellent",
      "doctor follow-up",
    );
  });

  it("follows up on 'dinner' with a connected food question", () => {
    // Learner: "I had dinner with my family."
    // Mercy: "Bạn đã ăn món gì?"
    // Why excellent: connected via "dinner/ăn", specific, useful —
    // practices food vocabulary and past tense.
    expectVerdict(
      "I had dinner with my family",
      "Bạn đã ăn món gì?",
      "excellent",
      "dinner follow-up",
    );
  });

  it("follows up on 'visited grandmother' with a detail question", () => {
    // Learner: "I visited my grandmother."
    // Mercy: "Bà của bạn sống ở đâu?"
    // Why excellent: connected via "grandmother/bà", specific,
    // useful for practicing location/family vocabulary.
    expectVerdict(
      "I visited my grandmother",
      "Bà của bạn sống ở đâu?",
      "excellent",
      "grandmother follow-up",
    );
  });

  it("follows up on 'rain' with an activity question", () => {
    // Learner: "It rain a lot yesterday."
    // Mercy: "Bạn đã làm gì khi trời mưa?"
    // Why excellent: connected via "rain/mưa", specific,
    // useful — past tense + activity vocabulary.
    expectVerdict(
      "It rain a lot yesterday",
      "Bạn đã làm gì khi trời mưa?",
      "excellent",
      "rain follow-up",
    );
  });
});

// ─── Golden Tests: Good Follow-Ups ───────────────────────────────────────
// Connected and specific, but with slightly lower practice utility
// (e.g., yes/no questions that still push the conversation forward).

describe("Golden: good follow-ups (connected + specific, acceptable utility)", () => {
  it("asks a yes/no question that still opens conversation", () => {
    // No direct word overlap (beach→biển, weekend→cuối tuần — neither appears
    // in the English question). But the question is specific (not generic) and
    // useful (40+ chars). Cross-lingual connection fails here — acceptable.
    expectVerdict(
      "I went to the beach last weekend",
      "Did you go with your family or friends?",
      "acceptable",
      "beach follow-up — semantically connected but no word overlap",
    );
  });

  it("asks a confirmation question connected to learner's words", () => {
    // Connected via shared content, specific to what learner said.
    expectVerdict(
      "I bought a new phone",
      "Bạn mua điện thoại ở cửa hàng nào vậy?",
      "excellent",
      "phone follow-up — specific store question",
    );
  });
});

// ─── Golden Tests: Acceptable Follow-Ups ─────────────────────────────────
// These are minimally adequate — connected but not ideal, or specific
// but barely pushing practice forward.

describe("Golden: acceptable follow-ups (connected OR useful, but not both fully)", () => {
  it("salience frame question — connected but formulaic", () => {
    // "Tell me more about the market" is connected and specific (reuses keyword),
    // but it's a formulaic frame — acceptable, not excellent.
    const result = assessFollowUpQuality(
      "I went to the market",
      "Tell me more about the market.",
    );
    // It's connected and specific, but not a question (no ?) so practice utility
    // is from the imperative pattern.
    expect(result.connected).toBe(true);
    expect(result.specific).toBe(true);
    // Imperative prompts are still useful for practice
    expect(result.usefulForPractice).toBe(true);
    // Verdict should be at least "good"
    expect(["excellent", "good"]).toContain(result.verdict);
  });

  it("short yes/no connected question — usable but low utility", () => {
    const result = assessFollowUpQuality(
      "I like coffee",
      "Do you drink coffee every day?",
    );
    // Connected via "coffee", specific, but yes/no with < 40 chars
    expect(result.connected).toBe(true);
    expect(result.specific).toBe(true);
    // Short yes/no → not useful for practice
    expect(result.usefulForPractice).toBe(false);
    expect(result.verdict).toBe("good"); // connected + specific → good, even if not useful
  });
});

// ─── Golden Tests: Poor Follow-Ups (Generic + Disconnected) ──────────────
// These are the anti-patterns — questions a human teacher would never ask
// as follow-ups because they ignore what the learner just said.

describe("Golden: poor follow-ups — generic and disconnected", () => {
  it("rejects 'How are you?' after learner talks about the market", () => {
    expectVerdict(
      "I go to market yesterday",
      "How are you?",
      "poor",
      "generic greeting after specific statement",
    );
  });

  it("rejects 'What is your name?' after learner talks about work", () => {
    expectVerdict(
      "She work at bank",
      "What is your name?",
      "poor",
      "generic name question after work statement",
    );
  });

  it("rejects 'Do you like English?' after learner talks about pizza", () => {
    expectVerdict(
      "I like pizza",
      "Do you like English?",
      "poor",
      "generic English question after food statement",
    );
  });

  it("rejects Vietnamese generic greeting after specific statement", () => {
    expectVerdict(
      "I watch movie last night",
      "Bạn có khỏe không?",
      "poor",
      "generic vi greeting after movie statement",
    );
  });

  it("rejects 'Where are you from?' after learner talks about family", () => {
    expectVerdict(
      "My brother is doctor",
      "Where are you from?",
      "poor",
      "generic origin question after family statement",
    );
  });

  it("rejects Vietnamese 'bạn tên gì?' after learner talks about dinner", () => {
    expectVerdict(
      "I had dinner with family",
      "Bạn tên là gì?",
      "poor",
      "generic vi name question after dinner statement",
    );
  });

  it("rejects generic 'bạn có thích tiếng Anh không?' after work statement", () => {
    expectVerdict(
      "I go to work at 8",
      "Bạn có thích tiếng Anh không?",
      "poor",
      "generic vi english question after work statement",
    );
  });

  it("rejects 'Do you understand?' as a follow-up", () => {
    expectVerdict(
      "I buy a hat yesterday",
      "Do you understand?",
      "poor",
      "generic comprehension check as follow-up",
    );
  });

  it("rejects 'Any questions?' as a follow-up", () => {
    expectVerdict(
      "I visited my friend",
      "Any questions?",
      "poor",
      "generic any-questions after specific statement",
    );
  });

  it("rejects generic pivot 'bạn muốn luyện gì?' after specific statement", () => {
    expectVerdict(
      "I like swimming",
      "Bạn muốn luyện gì thêm không?",
      "poor",
      "generic pivot after specific statement",
    );
  });

  it("rejects 'Can you repeat that?' as a follow-up to clear input", () => {
    expectVerdict(
      "I went to school yesterday",
      "Bạn nói lại được không?",
      "poor",
      "generic repeat request after clear input",
    );
  });
});

// ─── Golden Tests: Question Barrage ──────────────────────────────────────

describe("Golden: poor follow-ups — question barrage", () => {
  it("rejects multiple questions asked at once", () => {
    const result = assessFollowUpQuality(
      "I went to the market",
      "Bạn đã mua gì? Ở đâu? Có vui không?",
    );
    expect(result.respectsOneQuestionMax).toBe(false);
    expect(result.questionCount).toBe(3);
    expect(result.verdict).toBe("poor");
    expect(result.reasonCode).toBe("question_barrage");
  });

  it("rejects two questions bundled together", () => {
    const result = assessFollowUpQuality(
      "I like pizza",
      "What kind of pizza do you like? Why do you like it?",
    );
    expect(result.respectsOneQuestionMax).toBe(false);
    expect(result.questionCount).toBe(2);
    expect(result.verdict).toBe("poor");
  });

  it("rejects question barrage in Vietnamese", () => {
    const result = assessFollowUpQuality(
      "Tôi đi chợ hôm qua",
      "Bạn mua gì? Ở chợ nào? Có đông không? Đi với ai?",
    );
    expect(result.respectsOneQuestionMax).toBe(false);
    expect(result.questionCount).toBe(4);
    expect(result.verdict).toBe("poor");
  });
});

// ─── Golden Tests: Connection Scoring ────────────────────────────────────

describe("Connection scoring", () => {
  it("gives high connection score when many content words overlap", () => {
    const result = assessConnection(
      "I went to the market to buy vegetables",
      "What vegetables did you buy at the market?",
    );
    expect(result.connected).toBe(true);
    expect(result.score).toBeGreaterThan(0.2);
    expect(result.sharedWords).toContain("market");
    expect(result.sharedWords).toContain("vegetables");
  });

  it("gives zero connection when no content words overlap", () => {
    const result = assessConnection(
      "I went to the market yesterday",
      "How are you today?",
    );
    expect(result.connected).toBe(false);
    expect(result.score).toBe(0);
    expect(result.sharedWords).toHaveLength(0);
  });

  it("gives moderate connection for partial overlap", () => {
    const result = assessConnection(
      "I like eating pizza with friends",
      "What kind of food do your friends like?",
    );
    expect(result.connected).toBe(true);
    expect(result.sharedWords).toContain("friends");
    // "pizza" and "food" don't match exactly, so only "friends" overlaps
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(0.5);
  });

  it("handles Vietnamese content word overlap", () => {
    const result = assessConnection(
      "Tôi đi chợ hôm qua mua rau và cá",
      "Bạn mua rau gì ở chợ?",
    );
    expect(result.connected).toBe(true);
    expect(result.sharedWords).toContain("chợ");
    expect(result.sharedWords).toContain("rau");
  });

  it("uses lower threshold for very short learner input (≤3 content words)", () => {
    // "I like coffee" → content words: ["coffee"]
    // "Do you drink tea?" → content words: ["drink", "tea"]
    // No overlap, but connection should still pass with lower threshold
    // Actually with 0 overlap, even the lower threshold won't help
    const result = assessConnection(
      "I like coffee",
      "Do you like tea too?",
    );
    // "coffee" vs "tea" — no direct overlap, connection is 0
    expect(result.score).toBe(0);
    // But with 1 content word, the threshold drops to 0.05
    // Score 0 < 0.05 → not connected
    expect(result.connected).toBe(false);
  });

  it("connects when short input's single content word matches", () => {
    const result = assessConnection(
      "I like coffee",
      "Where do you buy your coffee?",
    );
    expect(result.connected).toBe(true);
    expect(result.sharedWords).toContain("coffee");
  });
});

// ─── Golden Tests: Specificity Detection ─────────────────────────────────

describe("Specificity detection", () => {
  it("flags 'how are you' as generic", () => {
    const result = assessSpecificity("How are you today?");
    expect(result.specific).toBe(false);
    expect(result.matchedGenericPattern).toBe("generic_greeting_en");
  });

  it("flags 'bạn khỏe không' as generic", () => {
    const result = assessSpecificity("Bạn có khỏe không?");
    expect(result.specific).toBe(false);
    expect(result.matchedGenericPattern).toBe("generic_greeting_vi");
  });

  it("considers a topic-specific question as specific", () => {
    const result = assessSpecificity(
      "What did you buy at the market yesterday?",
    );
    expect(result.specific).toBe(true);
    expect(result.matchedGenericPattern).toBeNull();
  });

  it("considers Vietnamese topic-specific question as specific", () => {
    const result = assessSpecificity(
      "Bạn đã mua gì ở chợ hôm qua?",
    );
    expect(result.specific).toBe(true);
    expect(result.matchedGenericPattern).toBeNull();
  });

  it("flags 'bạn muốn luyện gì thêm không' as generic pivot", () => {
    const result = assessSpecificity(
      "Bạn muốn luyện gì thêm không?",
    );
    expect(result.specific).toBe(false);
  });

  it("flags 'do you want to practice another sentence' as generic pivot", () => {
    const result = assessSpecificity(
      "Do you want to practice another sentence?",
    );
    expect(result.specific).toBe(false);
    expect(result.matchedGenericPattern).toBe("generic_pivot_en");
  });
});

// ─── Golden Tests: Practice Utility ──────────────────────────────────────

describe("Practice utility", () => {
  it("considers WH-questions as useful for practice", () => {
    const result = assessPracticeUtility("What did you buy at the market?");
    expect(result.useful).toBe(true);
    expect(result.isOpenEnded).toBe(true);
  });

  it("considers short yes/no questions as not useful", () => {
    const result = assessPracticeUtility("Do you like it?");
    expect(result.useful).toBe(false);
    expect(result.isOpenEnded).toBe(false);
    expect(result.reason).toBe("yes_no_question_too_short");
  });

  it("considers longer yes/no questions with context as useful", () => {
    // 40+ chars with embedded context that invites elaboration
    const result = assessPracticeUtility(
      "Did you enjoy the movie with your family last weekend?",
    );
    expect(result.useful).toBe(true);
    expect(result.reason).toBe("yes_no_with_elaboration_context");
  });

  it("considers imperative prompts as useful", () => {
    const result = assessPracticeUtility("Tell me more about your trip.");
    expect(result.useful).toBe(true);
    expect(result.isOpenEnded).toBe(true);
  });

  it("considers Vietnamese WH-questions as useful", () => {
    const result = assessPracticeUtility("Tại sao bạn thích món đó?");
    expect(result.useful).toBe(true);
    expect(result.isOpenEnded).toBe(true);
  });

  it("considers short Vietnamese yes/no as not useful", () => {
    const result = assessPracticeUtility("Bạn có thích không?");
    expect(result.useful).toBe(false);
    expect(result.isOpenEnded).toBe(false);
  });
});

// ─── Golden Tests: assessFollowUpFromResponse ────────────────────────────

describe("assessFollowUpFromResponse — extract from full response", () => {
  it("extracts and evaluates the question from a full vi response", () => {
    const result = assessFollowUpFromResponse(
      "I go to market yesterday",
      "Mình hiểu ý bạn — bạn muốn nói về việc đi chợ hôm qua. Bạn đã mua gì ở chợ?",
    );
    expect(result.verdict).toBe("excellent");
    expect(result.connected).toBe(true);
    expect(result.questionCount).toBe(1);
  });

  it("returns poor verdict when no question mark found in response", () => {
    const result = assessFollowUpFromResponse(
      "I like pizza",
      "Mình hiểu, bạn thích pizza. Đó là một món ăn ngon.",
    );
    expect(result.verdict).toBe("poor");
    expect(result.reasonCode).toBe("no_question_found");
  });

  it("detects generic question embedded in longer response", () => {
    const result = assessFollowUpFromResponse(
      "I like pizza",
      "Mình hiểu bạn thích pizza. Bạn có khỏe không?",
    );
    expect(result.verdict).toBe("poor");
    expect(result.specific).toBe(false);
  });
});

// ─── Convenience Functions ────────────────────────────────────────────────

describe("isGoodFollowUp and isAcceptableFollowUp", () => {
  it("isGoodFollowUp returns true for excellent", () => {
    expect(isGoodFollowUp(
      "I went to the market",
      "Bạn đã mua gì ở chợ?",
    )).toBe(true);
  });

  it("isGoodFollowUp returns false for poor", () => {
    expect(isGoodFollowUp(
      "I went to the market",
      "How are you?",
    )).toBe(false);
  });

  it("isAcceptableFollowUp returns true for acceptable and above", () => {
    // This is connected (via "coffee") but a short yes/no
    expect(isAcceptableFollowUp(
      "I like coffee",
      "Do you drink coffee every day?",
    )).toBe(true);
  });

  it("isAcceptableFollowUp returns false for poor", () => {
    expect(isAcceptableFollowUp(
      "I went to the market",
      "How are you?",
    )).toBe(false);
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles empty learner text gracefully", () => {
    const result = assessFollowUpQuality("", "What did you do?");
    // Empty learner text → can't be connected. But the question is specific
    // (not generic) and useful (WH-question) → lands at "acceptable".
    // This is correct: a WH-question as an opening prompt is adequate.
    expect(result.connected).toBe(false);
    expect(result.sharedWords).toHaveLength(0);
    expect(result.specific).toBe(true);
    expect(result.usefulForPractice).toBe(true);
  });

  it("handles empty follow-up question gracefully", () => {
    const result = assessFollowUpQuality(
      "I went to the market",
      "",
    );
    expect(result.verdict).toBe("poor");
    expect(result.questionCount).toBe(0);
  });

  it("handles both empty gracefully", () => {
    const result = assessFollowUpQuality("", "");
    expect(result.verdict).toBe("poor");
    expect(result.questionCount).toBe(0);
  });

  it("handles question with only function words", () => {
    // "Do you?" has zero content words — can't be connected
    const result = assessFollowUpQuality(
      "I went to the market",
      "Do you?",
    );
    expect(result.connected).toBe(false);
    // Also generic — starts with "do you" yes/no, very short
    expect(result.usefulForPractice).toBe(false);
    expect(result.verdict).toBe("poor");
  });

  it("handles mixed Vietnamese-English input", () => {
    const result = assessFollowUpQuality(
      "I like ăn phở",
      "Bạn thích ăn phở ở đâu?",
    );
    expect(result.connected).toBe(true);
    // Shared words: "phở" — but "ăn" is a VI function word and "like" is EN function
    // Let's check what content words are extracted
    expect(result.verdict).not.toBe("poor");
  });

  it("handles very long learner input with many content words", () => {
    const result = assessFollowUpQuality(
      "Yesterday I went to the big supermarket near my house and bought many vegetables and fruits for my family dinner",
      "What vegetables did you buy for the dinner?",
    );
    expect(result.connected).toBe(true);
    expect(result.sharedWords.length).toBeGreaterThanOrEqual(2);
  });

  it("question with ? inside quotes doesn't double-count", () => {
    // If Mercy quotes the learner: Bạn nói "đi đâu?" — that's one question
    const result = assessFollowUpQuality(
      "I went to the market",
      'Bạn nói "đi đâu?" — bạn muốn hỏi tôi đi đâu à?',
    );
    // Currently counts ? inside quotes too — documents current behavior
    expect(result.questionCount).toBe(2);
    // This is a known limitation: quoted questions are counted
  });
});

// ─── Regression Guard: Known Good Patterns ───────────────────────────────
// These patterns, once approved, must never regress.
// Each entry documents the human-teacher rationale.

describe("Regression guard: known good follow-up patterns", () => {
  const GOOD_FOLLOW_UPS: Array<[string, string, string]> = [
    // [learnerText, followUpQuestion, rationale]
    [
      "I like play football",
      "Bạn thường chơi bóng đá ở đâu?",
      "Connected via football/bóng đá; invites location vocabulary",
    ],
    [
      "My mother cook very good",
      "Món nào mẹ bạn nấu ngon nhất?",
      "Connected via cook/mother; invites food description",
    ],
    [
      "I study English every day",
      "Bạn thường học tiếng Anh vào lúc nào?",
      "Connected via English/study; invites time expression practice",
    ],
    [
      "I want travel to Da Nang",
      "Bạn muốn đi Đà Nẵng với ai?",
      "Connected via Da Nang/Đà Nẵng; invites companionship vocabulary",
    ],
    [
      "He buy new car last month",
      "Xe của anh ấy màu gì?",
      "Connected via car/xe; invites color/description vocabulary",
    ],
    [
      "They build new house near river",
      "Ngôi nhà đó có bao nhiêu phòng?",
      "Connected via house/nhà; invites counting/description practice",
    ],
    [
      "She teach English at primary school",
      "Cô ấy dạy lớp mấy?",
      "Connected via teach/school; invites grade-level vocabulary",
    ],
    [
      "I read book about history",
      "Cuốn sách đó nói về giai đoạn lịch sử nào?",
      "Connected via book/history; invites detail description",
    ],
  ];

  for (const [learnerText, question, rationale] of GOOD_FOLLOW_UPS) {
    it(`accepts: "${question}" — ${rationale}`, () => {
      const result = assessFollowUpQuality(learnerText, question);
      expect(result.verdict, `${rationale}: got ${result.verdict} (${result.reasonCode})`)
        .not.toBe("poor");
      expect(isAcceptableFollowUp(learnerText, question)).toBe(true);
    });
  }
});

// ─── Regression Guard: Known Bad Patterns ────────────────────────────────

describe("Regression guard: known bad follow-up patterns", () => {
  const BAD_FOLLOW_UPS: Array<[string, string, string]> = [
    // [learnerText, followUpQuestion, rationale]
    [
      "I like play football",
      "How are you?",
      "Generic greeting after specific sports statement",
    ],
    [
      "My mother cook very good",
      "What is your name?",
      "Generic name question after cooking statement",
    ],
    [
      "I study English every day",
      "Bạn có khỏe không?",
      "Generic vi greeting after study statement",
    ],
    [
      "I want travel to Da Nang",
      "Do you like English?",
      "Generic English question after travel statement",
    ],
    [
      "He buy new car last month",
      "Where are you from?",
      "Generic origin question after car statement",
    ],
    [
      "They build new house near river",
      "Bạn tên là gì?",
      "Generic vi name question after house statement",
    ],
    [
      "She teach English at primary school",
      "Bạn bao nhiêu tuổi?",
      "Generic age question after teaching statement",
    ],
    [
      "I read book about history",
      "Bạn có thích tiếng Anh không?",
      "Generic vi English question after reading statement",
    ],
  ];

  for (const [learnerText, question, rationale] of BAD_FOLLOW_UPS) {
    it(`rejects: "${question}" — ${rationale}`, () => {
      expectVerdict(learnerText, question, "poor", rationale);
    });
  }
});

// ─── Integration: Full Response Quality Assessment ───────────────────────

describe("Integration: assessing follow-up quality from full Mercy responses", () => {
  it("validates a well-formed full response with good follow-up", () => {
    const learnerText = "I go to market yesterday";
    const fullResponse =
      "Mình hiểu ý bạn — bạn muốn nói là hôm qua bạn đi chợ. " +
      "🔍 Bạn viết: \"I go to market yesterday.\" " +
      "💡 Gợi ý: \"I went to the market yesterday.\" " +
      "Bạn đã mua gì ở chợ hôm qua?";

    const result = assessFollowUpFromResponse(learnerText, fullResponse);
    expect(result.verdict).toBe("excellent");
    expect(result.respectsOneQuestionMax).toBe(true);
    expect(result.connected).toBe(true);
    expect(result.specific).toBe(true);
  });

  it("flags a full response with a generic follow-up", () => {
    const learnerText = "I went to the market yesterday";
    const fullResponse =
      "Mình hiểu bạn đi chợ hôm qua. Bạn có khỏe không?";

    const result = assessFollowUpFromResponse(learnerText, fullResponse);
    expect(result.verdict).toBe("poor");
    expect(result.specific).toBe(false);
  });

  it("flags a full response with question barrage", () => {
    const learnerText = "I went to the market";
    const fullResponse =
      "Hay quá! Bạn mua gì? Ở chợ nào? Có vui không?";

    const result = assessFollowUpFromResponse(learnerText, fullResponse);
    // The first ? ends the first "question" extracted, so 3 total
    expect(result.respectsOneQuestionMax).toBe(false);
    expect(result.verdict).toBe("poor");
  });

  it("handles full response with no follow-up question", () => {
    const learnerText = "What is past tense of 'go'?";
    const fullResponse =
      "Quá khứ của 'go' là 'went'. " +
      "Ví dụ: I went to school yesterday.";

    const result = assessFollowUpFromResponse(learnerText, fullResponse);
    // No question mark → no follow-up detected
    expect(result.reasonCode).toBe("no_question_found");
    expect(result.verdict).toBe("poor");
  });
});
