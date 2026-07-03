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
