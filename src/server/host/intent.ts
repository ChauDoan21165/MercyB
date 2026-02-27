// src/server/host/intent.ts

export type HostIntent =
  | "pronunciation"
  | "grammar_fix"
  | "meaning_explain"
  | "translation"
  | "repeat_practice"
  | "general_question";

export function detectIntent(
  text: string,
  uiState?: { repeatModeActive?: boolean }
): HostIntent {
  const t = text.toLowerCase();

  // 🔥 Pronunciation must override repeat mode
  if (
    t.includes("pronunciation") ||
    t.includes("pronounce") ||
    t.includes("accent") ||
    t.includes("stress") ||
    t.includes("intonation") ||
    t.includes("can you hear me") ||
    t.includes("correct my pronunciation") ||
    t.includes("phát âm")
  ) {
    return "pronunciation";
  }

  if (
    t.includes("correct my grammar") ||
    t.startsWith("fix grammar")
  ) {
    return "grammar_fix";
  }

  if (
    t.includes("meaning of") ||
    t.includes("what does")
  ) {
    return "meaning_explain";
  }

  if (t.includes("translate")) {
    return "translation";
  }

  if (uiState?.repeatModeActive) {
    return "repeat_practice";
  }

  return "general_question";
}