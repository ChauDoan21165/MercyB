import { guideAnswers, GuideAnswerKey } from "./guideAnswers";

export type GuideReply =
  | { type: "local"; message: string; key?: GuideAnswerKey }
  | { type: "redirect_host"; message: string }
  | { type: "redirect_speak"; message: string };

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

export function resolveGuideReply(input: string): GuideReply {
  const text = normalize(input);

  if (!text) {
    return { type: "local", message: guideAnswers.fallback, key: "fallback" };
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
    return { type: "local", message: guideAnswers.greeting, key: "greeting" };
  }

  if (
    includesAny(text, [
      "guide me",
      "help me start",
      "where should i start",
      "what should i do first",
      "i am new",
      "new here",
      "how do i start",
    ])
  ) {
    return { type: "local", message: guideAnswers.onboarding, key: "onboarding" };
  }

  if (
    includesAny(text, [
      "how do i use this",
      "how to use this",
      "how do i use the app",
      "how does this work",
      "what can i do here",
      "how do i use mercy",
      "what is this app",
    ])
  ) {
    return { type: "local", message: guideAnswers.app_usage, key: "app_usage" };
  }

  if (
    includesAny(text, [
      "which room",
      "where do i go",
      "what room should i use",
      "where should i go",
      "which one should i use",
      "which box should i use",
      "what is mercy host",
      "what is guide",
      "what is speak",
    ])
  ) {
    return { type: "local", message: guideAnswers.room_usage, key: "room_usage" };
  }

  if (
    includesAny(text, [
      "pronounce",
      "pronunciation",
      "how do i say",
      "how to say",
      "say this word",
      "sound this out",
    ])
  ) {
    return { type: "redirect_speak", message: guideAnswers.speak_redirect };
  }

  if (
    includesAny(text, [
      "grammar",
      "check this sentence",
      "correct this",
      "rewrite this",
      "simplify this",
      "summarize this",
      "why is this wrong",
      "analyze this",
      "compare these",
      "reading comprehension",
      "extract vocabulary",
      "improve this",
      "explain this",
      "check my writing",
      "fix my writing",
    ])
  ) {
    return { type: "redirect_host", message: guideAnswers.host_redirect };
  }

  return { type: "local", message: guideAnswers.fallback, key: "fallback" };
}