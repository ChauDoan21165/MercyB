import { describe, expect, it } from "vitest";
import {
  buildConversationTurn,
  buildCorrectionTurn,
  getSpeakableText,
  sanitizeSpeakableText,
  validateTutorTurn,
} from "@/lib/tutor/tutorEngine";
import type { TutorTurn } from "@/lib/tutor/tutorTypes";

describe("tutorEngine", () => {
  it("reads the corrected English sentence, not raw incorrect input", () => {
    const { turn } = buildCorrectionTurn({
      id: "turn-1",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I buy a hat yesterday.",
      correctedText: "I bought a hat yesterday.",
      explanation: "Use past tense with yesterday.",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(validateTutorTurn(turn)).toBe(true);
    expect(getSpeakableText(turn)).toBe("I bought a hat yesterday.");
    expect(getSpeakableText(turn)).not.toBe("I buy a hat yesterday.");
  });

  it("conversation turn includes one next question", () => {
    const { turn } = buildConversationTurn({
      id: "turn-2",
      targetLanguage: "fr",
      explainLanguage: "vi",
      userText: "Je suis aller au marche",
      correctedText: "Je suis alle au marche.",
      explanation: "Use alle with etre in passe compose.",
      naturalReply: "Tres bien.",
      nextQuestion: "Qu'est-ce que tu fais apres ca ? Et demain ?",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(turn.nextQuestion).toBe("Qu'est-ce que tu fais apres ca ?");
    expect(validateTutorTurn(turn)).toBe(true);
  });

  it("conversation turn strips preamble labels before keeping one next question", () => {
    const { turn } = buildConversationTurn({
      id: "turn-preamble",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I cooked dinner.",
      correctedText: "I cooked dinner.",
      explanation: "Short explanation.",
      naturalReply: "Nice.",
      nextQuestion: "Next question: What did you cook? Did your family like it?",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(turn.nextQuestion).toBe("What did you cook?");
    expect(getSpeakableText(turn)).toBe("Nice. What did you cook?");
  });

  it("conversation turn without a question mark is invalid", () => {
    const { turn } = buildConversationTurn({
      id: "turn-no-question",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I cooked dinner.",
      correctedText: "I cooked dinner.",
      explanation: "Short explanation.",
      naturalReply: "Nice.",
      nextQuestion: "Tell me about dinner",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(validateTutorTurn(turn)).toBe(false);
    expect(getSpeakableText(turn)).toBe("");
  });

  it("speakable text excludes incorrect user text", () => {
    const { turn } = buildConversationTurn({
      id: "turn-3",
      targetLanguage: "fr",
      explainLanguage: "vi",
      userText: "Je suis aller au marche",
      correctedText: "Je suis alle au marche.",
      explanation: "Short explanation.",
      naturalReply: "Bonne phrase.",
      nextQuestion: "Qu'est-ce que tu fais apres ca ?",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    const speakable = getSpeakableText(turn);
    expect(speakable).toContain("Bonne phrase.");
    expect(speakable).toContain("Qu'est-ce que tu fais apres ca ?");
    expect(speakable).not.toContain("Je suis alle au marche.");
    expect(speakable).not.toContain("Je suis aller au marche");
  });

  it("malformed turns fail safe instead of reading raw user input", () => {
    const malformed: TutorTurn = {
      id: "bad-turn",
      mode: "correction",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I buy a hat yesterday.",
      correctedText: "",
      explanation: "Short explanation.",
      shouldReadAloudText: "I buy a hat yesterday.",
      createdAt: "2026-05-24T00:00:00.000Z",
    };

    expect(validateTutorTurn(malformed)).toBe(false);
    expect(getSpeakableText(malformed)).toBe("");
  });

  it("malformed conversation turns fail safe when raw user text differs only by case or punctuation", () => {
    const malformed: TutorTurn = {
      id: "bad-conversation",
      mode: "conversation",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "i buy a hat yesterday",
      correctedText: "I bought a hat yesterday.",
      explanation: "Use past tense with yesterday.",
      naturalReply: "I buy a hat yesterday!",
      nextQuestion: "What did you buy?",
      shouldReadAloudText: "I buy a hat yesterday! What did you buy?",
      createdAt: "2026-05-24T00:00:00.000Z",
    };

    expect(validateTutorTurn(malformed)).toBe(false);
    expect(getSpeakableText(malformed)).toBe("");
  });

  it("rejects unchanged wrong correction text", () => {
    const { turn } = buildCorrectionTurn({
      id: "turn-4",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I buy a hat yesterday.",
      correctedText: "I buy a hat yesterday.",
      explanation: "Short explanation.",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(validateTutorTurn(turn)).toBe(false);
    expect(getSpeakableText(turn)).toBe("");
  });

  it("truncates long explanations without replacement characters or trailing combining marks", () => {
    const { turn } = buildCorrectionTurn({
      id: "turn-long-explanation",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I buy a hat yesterday.",
      correctedText: "I bought a hat yesterday.",
      explanation: `${"a".repeat(238)}e\u0301 more explanation`,
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(turn.explanation).toHaveLength(240);
    expect(turn.explanation).not.toContain("\uFFFD");
    expect(/\p{M}\.\.\.$/u.test(turn.explanation)).toBe(false);
  });

  it("falls back to a valid ISO createdAt when input date is invalid", () => {
    const { turn } = buildCorrectionTurn({
      id: "turn-invalid-date",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I buy a hat yesterday.",
      correctedText: "I bought a hat yesterday.",
      explanation: "Use past tense with yesterday.",
      createdAt: "not-a-date",
    });

    expect(Number.isNaN(new Date(turn.createdAt).getTime())).toBe(false);
    expect(validateTutorTurn(turn)).toBe(true);
  });

  it("generates a mode-prefixed id when caller id is empty", () => {
    const { turn } = buildConversationTurn({
      id: "   ",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "I cooked dinner.",
      correctedText: "I cooked dinner.",
      explanation: "Short explanation.",
      naturalReply: "Nice.",
      nextQuestion: "What did you cook?",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(turn.id).toMatch(/^conversation-/);
    expect(validateTutorTurn(turn)).toBe(true);
  });

  it("sanitizes UI labels, markdown, control characters, and repeated speech fragments", () => {
    expect(
      sanitizeSpeakableText(
        "Teacher Mercy: **Câu trả lời tự nhiên**\u0000 What do you usually do in the morning? What do you usually do in the morning?",
      ),
    ).toBe("What do you usually do in the morning?");
  });

  it("removes simple markup tags before text is spoken aloud", () => {
    expect(sanitizeSpeakableText("<strong>Natural reply:</strong> What do you usually do?")).toBe(
      "What do you usually do?",
    );
  });

  it("removes bracketed UI labels without stripping ordinary bracketed speech", () => {
    expect(sanitizeSpeakableText("[Corrected] I bought a hat. Please say [the blue one].")).toBe(
      "I bought a hat. Please say [the blue one].",
    );
  });

  it("normalizes basic HTML entity noise before text is spoken aloud", () => {
    expect(sanitizeSpeakableText("Natural reply:&nbsp;Fish &amp; chips&nbsp;today?")).toBe(
      "Fish and chips today?",
    );
  });

  it("removes script and style markup content before text is spoken aloud", () => {
    expect(
      sanitizeSpeakableText(
        "<style>.hidden { color: red; }</style><script>alert('x')</script>Natural reply: What did you do?",
      ),
    ).toBe("What did you do?");
  });

  it("dedupes repeated speech fragments separated by semicolons or colons", () => {
    expect(sanitizeSpeakableText("Good answer; Good answer: What did you do next?")).toBe(
      "Good answer; What did you do next?",
    );
  });

  it("removes role labels from each line before text is spoken aloud", () => {
    expect(
      sanitizeSpeakableText(
        "Natural reply: Good answer.\nLearner: I go yesterday.\nNext question: What did you do next?",
      ),
    ).toBe("Good answer. I go yesterday. What did you do next?");
  });

  it("opening starter question speakable text excludes empty-state labels", () => {
    const { turn } = buildConversationTurn({
      id: "turn-5",
      targetLanguage: "en",
      explainLanguage: "vi",
      userText: "",
      correctedText: "",
      explanation: "",
      naturalReply: "",
      nextQuestion: "What do you usually do in the morning?",
      createdAt: "2026-05-24T00:00:00.000Z",
    });

    expect(getSpeakableText(turn)).toBe("What do you usually do in the morning?");
  });
});
