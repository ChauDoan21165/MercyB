import type { CefrLevel, ConversationPhase, MercyTurn } from "./types";

export const MERCY_PERSONA_SUMMARY = [
  "Mercy is a warm, professional English teacher for Vietnamese learners.",
  "She is curious about the learner's real life and Vietnamese context.",
  "She never announces scores, CEFR levels, rubrics, or per-turn judgments.",
  "She uses Vietnamese only for A1-A2 confusion repair, never as the default.",
  "She ends with dignity: the learner should finish feeling capable, not exposed.",
].join(" ");

const VI_REPAIR = "Nếu câu hỏi hơi khó, em có thể trả lời bằng một câu tiếng Anh ngắn thôi.";

export function buildPersonaSystemPrompt(): string {
  return [
    MERCY_PERSONA_SUMMARY,
    "Keep each turn 1-3 sentences.",
    "Ask exactly one main question.",
    "Do not reveal that you are testing subskills.",
    "Do not say 'your level is', 'CEFR', 'score', 'grade', or 'assessment'.",
    "Prefer concrete Vietnamese-life topics: family, school, work, Tet, motorbike commutes, cafes, study goals.",
  ].join("\n");
}

export function openingTurn(name?: string): MercyTurn {
  const greeting = name ? `Hi ${name},` : "Hi,";
  return {
    text:
      `${greeting} I'm Mercy. We will just have a natural English conversation for a few minutes, not a stressful test. ` +
      "To start, tell me a little about your day in Vietnam or wherever you are now.",
    phase: "probe",
    targetCefr: "B1",
    targetSubskill: "fluency",
    internal_note: "Opening: warm frame, conversation-not-test, Vietnam-aware topic.",
    shouldEndSession: false,
  };
}

export function wrapTurn(): MercyTurn {
  return {
    text:
      "Thank you for talking with me today. You gave me enough to understand how you use English in a real conversation, and I will prepare the next steps for you now.",
    phase: "complete",
    targetCefr: "A2",
    internal_note: "Wrap: warm close without revealing assessment.",
    shouldEndSession: true,
  };
}

export function comfortQuestion(level: CefrLevel): string {
  if (level === "A1" || level === "A2") {
    return "Before we finish, tell me one small thing you enjoy doing after school or work.";
  }
  return "Before we finish, what is one English goal you would feel proud to reach this year?";
}

export function repairQuestion(level: CefrLevel): string {
  if (level === "A1" || level === "A2") {
    return `That's okay. ${VI_REPAIR} What food or place in Vietnam do you like?`;
  }
  return "No problem. Let me ask it more simply: what is one thing you do almost every day, and why?";
}

export function enforcePersona(text: string, level: CefrLevel, phase: ConversationPhase): string {
  let cleaned = text.trim().replace(/\s+/g, " ");
  cleaned = cleaned.replace(/\b(CEFR|A1|A2|B1|B2|C1|C2|score|grade|assessment|rubric)\b[^.?!]*[.?!]?/gi, "");
  cleaned = cleaned.replace(/\b(wrong|bad|poor|failed|weak student)\b/gi, "not clear yet");
  if (!cleaned) cleaned = phase === "wrap" ? wrapTurn().text : fallbackQuestion(level, "fluency");

  const hasVi = /[ăâêôơưđáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(cleaned);
  if (hasVi && level !== "A1" && level !== "A2") {
    cleaned = cleaned.replace(/[^.!?]*(?:em|không|tiếng|việt|khó|ạ)[^.!?]*[.!?]?/gi, "").trim();
  }
  if (!/[?]$/.test(cleaned) && phase !== "wrap" && phase !== "complete") {
    cleaned += " What do you think?";
  }
  return cleaned;
}

export function fallbackQuestion(level: CefrLevel, subskill?: string): string {
  if (level === "A1") return "Tell me about one person in your family. What is that person like?";
  if (level === "A2") return "Tell me about a place in Vietnam you know well. What can people do there?";
  if (level === "B1") return "Tell me about a time you had to learn something difficult. What helped you keep going?";
  if (level === "B2") return "Some Vietnamese students study English for exams, while others study for work. Which goal changes learning more, and why?";
  if (level === "C1") {
    return subskill === "grammar"
      ? "If English classes in Vietnam had been designed differently when you were younger, what would have changed for you?"
      : "What is one belief about learning English in Vietnam that you think is partly true but often misunderstood?";
  }
  return "How do language, opportunity, and confidence influence each other for Vietnamese learners trying to work or study abroad?";
}

export function containsPersonaViolation(text: string): boolean {
  return /\b(CEFR|your level is|you are A[12]|you are B[12]|you are C[12]|score|grade|rubric|failed|bad English)\b/i.test(text);
}
