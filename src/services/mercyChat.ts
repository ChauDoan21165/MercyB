/**
 * File: mercyChat.ts
 * Path: src/services/mercyChat.ts
 *
 * Hardened Mercy entry point for Guide / Mercy Host surfaces.
 * * - Preserves all original logic.
 * - Adds defensive null-checks and normalization.
 * - Ensures a fallback is ALWAYS returned even on library failure.
 */

import {
  buildMercyContext,
  getCalmReplyId,
  getEndSessionReplyId,
  getEnglishCoachReplyId,
  getGreetingReplyId,
  getPraiseReplyId,
  getPronunciationPraiseReplyId,
  getSuggestionReplyId,
  getTeacherReplyId,
} from "@/mercy";
import {
  getMercyReply,
  getMercyRepliesByCategory,
  preloadMercyLibrary,
  type MercyReply,
} from "@/mercy";

export type MercySurface = "mercy_host" | "guide";
export type MercyRole = "teacher" | "janitor";
export type MercyMood = "light" | "ok" | "heavy" | "anxious" | null;

export interface AskMercyInput {
  surface: MercySurface;
  role: MercyRole;
  message?: string;

  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;

  profile?: {
    preferredName?: string | null;
    englishLevel?: string | null;
    lastEnglishActivity?: string | null;
  };

  signals?: {
    lastActiveAt?: string | Date | null; // Added for internal consistency
    isFirstVisit?: boolean;
    studiedToday?: boolean;
    studiedYesterday?: boolean;
    consecutiveDays?: number;
    currentMood?: MercyMood;
    recentHeavyMoods?: boolean;
    completedSession?: boolean;
    completedPath?: boolean;
    hasIncompletePath?: boolean;
    pronunciationScore?: number;
  };
}

export interface AskMercyOutput {
  text: string;
  textEn?: string;
  textVi?: string;
  replyId?: string | null;
  source: "prepared" | "fallback";
  category?: string | null;
}

type GuideIntent =
  | "greeting"
  | "use-app"
  | "use-room"
  | "where-am-i"
  | "next-step"
  | "pricing"
  | "paths"
  | "resume"
  | "mercy"
  | "mood-support"
  | "teacher"
  | "english"
  | "pronunciation"
  | "praise"
  | "end-session"
  | "fallback";

/**
 * Normalization Helpers
 */
function cleanText(value?: string | null): string {
  if (!value) return "";
  return value.trim().replace(/\s+/g, " ");
}

function sentenceCase(value?: string | null): string {
  const text = cleanText(value);
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function stripHtml(value?: string | null): string {
  if (!value) return "";
  // More robust regex for HTML stripping
  return cleanText(value.replace(/<[^>]*>?/gm, ' '));
}

function truncateWords(value?: string | null, maxWords = 18): string {
  const text = cleanText(value);
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function humanizeSlug(value?: string | null): string {
  const text = cleanText(value);
  if (!text) return "";
  return sentenceCase(text.replace(/[-_/]+/g, " "));
}

function deriveTopicLabel(tags?: string[], contentEn?: string): string | null {
  const usableTags = (tags ?? [])
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 3);

  if (usableTags.length > 0) {
    return usableTags.join(", ");
  }

  const content = stripHtml(contentEn);
  if (!content) return null;

  const firstSentence =
    content
      .split(/[.!?]/)
      .map((part) => cleanText(part))
      .find(Boolean) ?? "";

  return truncateWords(firstSentence, 10) || null;
}

type RoomContextSummary = {
  hasRoomContext: boolean;
  roomName: string;
  tierLabel: string | null;
  topicLabel: string | null;
  shortSummary: string | null;
};

function deriveRoomContextSummary(input: AskMercyInput): RoomContextSummary {
  const safeRoomTitle = cleanText(input.roomTitle);
  const safeTier = cleanText(input.tier);
  const safeSlug = humanizeSlug(input.pathSlug);
  const topicLabel = deriveTopicLabel(input.tags, input.contentEn);
  const contentSummary = truncateWords(stripHtml(input.contentEn), 18);

  const roomName =
    safeRoomTitle || safeSlug || (safeTier ? `${safeTier} room` : "this room");

  const hasRoomContext = Boolean(
    safeRoomTitle || safeTier || safeSlug || topicLabel || contentSummary
  );

  return {
    hasRoomContext,
    roomName,
    tierLabel: safeTier || null,
    topicLabel,
    shortSummary: contentSummary || null,
  };
}

function pickReplyText(reply: MercyReply | null | undefined, surface: MercySurface): string {
  if (!reply) return "";
  // Preference mapping: Guide gets English, Mercy Host gets Vietnamese (if available)
  return surface === "guide"
    ? cleanText(reply.textEn || reply.textVi || "")
    : cleanText(reply.textVi || reply.textEn || "");
}

function buildFallbackGuideReply(
  intent: GuideIntent,
  roomSummary: RoomContextSummary
): string {
  switch (intent) {
    case "use-app":
      return [
        "Use the app like this:",
        "1. Start from Home.",
        "2. Open one room.",
        "3. Read or listen slowly.",
        "4. Speak, reflect, or continue.",
        "5. Come back later and keep the streak small and steady.",
      ].join("\n");

    case "use-room":
      return [
        roomSummary.hasRoomContext
          ? `Use ${roomSummary.roomName} like this:`
          : "Use a room like this:",
        "1. Enter the room.",
        "2. Read the prompt or listen first.",
        "3. Take one small action: think, speak, or answer.",
        "4. Do not rush. One useful response is enough.",
        "5. When finished, continue to the next room or return Home.",
      ].join("\n");

    case "where-am-i":
      return roomSummary.hasRoomContext
        ? `You are in ${roomSummary.roomName}.${roomSummary.tierLabel ? ` Tier: ${roomSummary.tierLabel}.` : ""}${roomSummary.topicLabel ? ` Topic: ${truncateWords(roomSummary.topicLabel, 8)}.` : ""}`
        : "You are on Home right now.";

    case "next-step":
      return roomSummary.hasRoomContext
        ? `Best next step: stay in ${roomSummary.roomName}, finish one small action, then use “Open this room” or “Resume this room”.`
        : "Best next step: open one room, spend a few minutes there, then come back only after you complete one small action.";

    case "pricing":
      return "Use the Pricing button. That opens the plans page so you can compare access and decide later.";

    case "paths":
      return "Use Learning paths. That shows the available paths or tiers so you can choose the right route.";

    case "resume":
      return roomSummary.hasRoomContext
        ? "Use “Resume this room” or “Open this room”."
        : "Use “Go to rooms”, then open the room you want to continue.";

    case "mercy":
      return "Guide is for practical help. Teacher Mercy is for deeper guidance inside the learning experience.";

    default:
      return [
        "I can help with simple practical questions.",
        "Try asking:",
        "• how do I use the app?",
        "• how do I use the room?",
        "• where am I?",
        "• what should I do next?",
      ].join("\n");
  }
}

function matchGuideIntent(message?: string): GuideIntent {
  const q = cleanText(message).toLowerCase();

  if (!q) return "greeting";

  // Navigation & Usage
  if (/\b(how|use|work|workings)\b.*\bapp\b/.test(q)) return "use-app";
  if (/\b(how|use|work|action)\b.*\broom\b/.test(q)) return "use-room";
  if (/\b(where am i|current place|what room)\b/.test(q)) return "where-am-i";
  if (/\b(start|next|begin|do next|step)\b/.test(q)) return "next-step";
  if (/\b(price|pricing|plan|subscription|cost)\b/.test(q)) return "pricing";
  if (/\b(path|paths|tier|tiers|curriculum)\b/.test(q)) return "paths";
  if (/\b(resume|continue|back)\b/.test(q)) return "resume";
  
  // Mercy Branding
  if (/\b(teacher|mercy|talk to mercy)\b/.test(q)) return "mercy";

  // Mood & Support
  if (/\b(anxious|heavy|overwhelmed|calm|stress|scared)\b/.test(q)) return "mood-support";

  // Educational Specifics
  if (/\b(yesterday|today summary|what did i do)\b/.test(q)) return "teacher";
  if (/\b(english|coach|help|grammar|vocabulary)\b/.test(q)) return "english";
  if (/\b(pronunciation|speak score|did i say|accent)\b/.test(q)) return "pronunciation";
  if (/\b(good job|praise|encourage|proud)\b/.test(q)) return "praise";
  if (/\b(finished|done|completed|end|stop)\b/.test(q)) return "end-session";

  return "fallback";
}

function getGuideGreeting(roomSummary: RoomContextSummary): string {
  return roomSummary.hasRoomContext
    ? `Hi. I’m Guide. You are in ${roomSummary.roomName}. Ask me practical things like “how do I use this room?”, “where do I go next?”, or “open pricing”.`
    : "Hi. I’m Guide. Ask me practical things like “how do I use the app?”, “where do I start?”, or “how do I use a room?”.";
}

function findPreparedReplyByKeyword(
  keywords: string[],
  category?: Parameters<typeof getMercyRepliesByCategory>[0]
): MercyReply | null {
  try {
    const pool = category ? getMercyRepliesByCategory(category) : [];
    if (!pool || pool.length === 0) return null;

    const loweredKeywords = keywords.map((k) => k.toLowerCase());

    for (const reply of pool) {
      const haystack = `${reply.id} ${reply.textEn ?? ""} ${reply.textVi ?? ""}`.toLowerCase();
      if (loweredKeywords.some((keyword) => haystack.includes(keyword))) {
        return reply;
      }
    }
    return pool[0] ?? null;
  } catch (e) {
    console.error("MercyChat: Error in keyword search", e);
    return null;
  }
}

function buildContext(input: AskMercyInput) {
  // Defensive normalization of signals
  const signals = input.signals ?? {};
  return buildMercyContext({
    lastActiveAt: signals.lastActiveAt ?? input.profile?.lastEnglishActivity ?? null,
    isFirstVisit: !!signals.isFirstVisit,
    studiedToday: !!signals.studiedToday,
    studiedYesterday: !!signals.studiedYesterday,
    consecutiveDays: signals.consecutiveDays ?? 0,
    currentMood: signals.currentMood ?? null,
    recentHeavyMoods: !!signals.recentHeavyMoods,
    completedSession: !!signals.completedSession,
    completedPath: !!signals.completedPath,
    hasIncompletePath: !!signals.hasIncompletePath,
  });
}

function makePreparedOutput(
  reply: MercyReply,
  surface: MercySurface,
  category?: string | null
): AskMercyOutput {
  return {
    text: pickReplyText(reply, surface),
    textEn: reply.textEn ?? "",
    textVi: reply.textVi ?? "",
    replyId: reply.id ?? null,
    source: "prepared",
    category: category ?? reply.category ?? null,
  };
}

function makeFallbackOutput(text: string): AskMercyOutput {
  return {
    text: text || "I’m here.",
    textEn: text,
    textVi: text,
    replyId: null,
    source: "fallback",
    category: null,
  };
}

function resolveGuidePreparedReply(
  intent: GuideIntent,
  input: AskMercyInput,
  roomSummary: RoomContextSummary
): AskMercyOutput | null {
  const ctx = buildContext(input);

  try {
    switch (intent) {
      case "greeting": {
        const reply = getMercyReply(getGreetingReplyId(ctx));
        return reply ? makePreparedOutput(reply, "guide", "greeting") : null;
      }

      case "mood-support": {
        const reply = getMercyReply(getCalmReplyId(ctx));
        return reply ? makePreparedOutput(reply, "guide", "calm") : null;
      }

      case "teacher": {
        const reply = getMercyReply(getTeacherReplyId(ctx));
        return reply ? makePreparedOutput(reply, "guide", "teacher") : null;
      }

      case "english": {
        const reply = getMercyReply(getEnglishCoachReplyId());
        return reply ? makePreparedOutput(reply, "guide", "english_coach") : null;
      }

      case "pronunciation": {
        const score = input.signals?.pronunciationScore;
        const reply = getMercyReply(getPronunciationPraiseReplyId(score));
        return reply ? makePreparedOutput(reply, "guide", "pronunciation_praise") : null;
      }

      case "praise": {
        const reply = getMercyReply(getPraiseReplyId(ctx));
        return reply ? makePreparedOutput(reply, "guide", "praise") : null;
      }

      case "end-session": {
        const reply = getMercyReply(getEndSessionReplyId(ctx));
        return reply ? makePreparedOutput(reply, "guide", "end_session") : null;
      }

      case "next-step": {
        const reply = getMercyReply(getSuggestionReplyId(ctx));
        if (reply) return makePreparedOutput(reply, "guide", "suggestion");
        return makeFallbackOutput(buildFallbackGuideReply(intent, roomSummary));
      }

      case "use-app": {
        const prepared =
          findPreparedReplyByKeyword(["start", "first step", "begin"], "suggestion") ??
          findPreparedReplyByKeyword(["gently", "small step"], "encouragement");
        if (prepared) return makePreparedOutput(prepared, "guide", prepared.category);
        return makeFallbackOutput(buildFallbackGuideReply(intent, roomSummary));
      }

      case "use-room": {
        const prepared =
          findPreparedReplyByKeyword(["read", "listen", "slowly"], "study_guidance") ??
          findPreparedReplyByKeyword(["small step", "gently"], "encouragement");
        if (prepared) return makePreparedOutput(prepared, "guide", prepared.category);
        return makeFallbackOutput(buildFallbackGuideReply(intent, roomSummary));
      }

      default:
        return makeFallbackOutput(buildFallbackGuideReply(intent, roomSummary));
    }
  } catch (e) {
    console.error("MercyChat: Error resolving prepared reply", e);
    return makeFallbackOutput(buildFallbackGuideReply(intent, roomSummary));
  }
}

/**
 * Shared Mercy entry point.
 */
export async function askMercy(
  input: AskMercyInput
): Promise<AskMercyOutput> {
  // Critical error boundary
  try {
    await preloadMercyLibrary();
  } catch (e) {
    console.error("MercyChat: Library preload failed", e);
    return makeFallbackOutput("I'm having trouble thinking clearly. Please try again in a moment.");
  }

  const roomSummary = deriveRoomContextSummary(input);

  // Surface check
  if (input.surface === "guide") {
    const intent = matchGuideIntent(input.message);
    const prepared = resolveGuidePreparedReply(intent, input, roomSummary);
    if (prepared) return prepared;

    return makeFallbackOutput(
      intent === "greeting"
        ? getGuideGreeting(roomSummary)
        : buildFallbackGuideReply(intent, roomSummary)
    );
  }

  // Mercy Host Path (Teacher Mode)
  try {
    const ctx = buildContext(input);
    const message = cleanText(input.message);

    // 1. Silent/Greeting trigger
    if (!message) {
      const greeting = getMercyReply(getGreetingReplyId(ctx));
      if (greeting) return makePreparedOutput(greeting, "mercy_host", "greeting");
    }

    // 2. Session Completion
    if (input.signals?.completedSession || input.signals?.completedPath) {
      const reply = getMercyReply(getEndSessionReplyId(ctx));
      if (reply) return makePreparedOutput(reply, "mercy_host", "end_session");
    }

    // 3. Emotional/Crisis Support
    if (
      input.signals?.currentMood === "heavy" ||
      input.signals?.currentMood === "anxious" ||
      input.signals?.recentHeavyMoods
    ) {
      const reply = getMercyReply(getCalmReplyId(ctx));
      if (reply) return makePreparedOutput(reply, "mercy_host", "calm");
    }

    // 4. Default Teacher Guidance
    const teacher = getMercyReply(getTeacherReplyId(ctx));
    if (teacher) return makePreparedOutput(teacher, "mercy_host", "teacher");

    const greetingAlt = getMercyReply(getGreetingReplyId(ctx));
    if (greetingAlt) return makePreparedOutput(greetingAlt, "mercy_host", "greeting");

    return makeFallbackOutput("I’m here with you. One small step is enough for now.");
  } catch (e) {
    console.error("MercyChat: Mercy Host path failed", e);
    return makeFallbackOutput("I’m here. Let’s take a deep breath and take one step at a time.");
  }
}

// Ensure module consistency for default imports
export default askMercy;