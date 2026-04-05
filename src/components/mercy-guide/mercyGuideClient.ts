/**
 * Path: src/components/mercy-guide/mercyGuideClient.ts
 */

import { supabase } from "@/integrations/supabase/client";

export type MercyGuideLanguage = "vi" | "en";
export type MercyGuideSuggestedAction = "none" | "open_speak";

export interface MercyGuideHistoryItem {
  role: "user" | "assistant";
  text: string;
  language?: MercyGuideLanguage;
}

export interface MercyGuideRoomContext {
  id?: string;
  title?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
}

export interface MercyGuideUserContext {
  englishLevel?: string | null;
  learningGoal?: string | null;
}

export interface MercyGuideClientRequest {
  message: string;
  room?: MercyGuideRoomContext;
  user?: MercyGuideUserContext;
  history?: MercyGuideHistoryItem[];
}

export interface MercyGuideClientResponse {
  reply: string;
  language: MercyGuideLanguage;
  suggestedAction: MercyGuideSuggestedAction;
  confidence: number;
}

type MercyGuideFunctionResponse = Partial<MercyGuideClientResponse> & {
  error?: string;
};

function cleanText(value?: string | null): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeLanguage(value: unknown): MercyGuideLanguage {
  return value === "vi" ? "vi" : "en";
}

function normalizeSuggestedAction(value: unknown): MercyGuideSuggestedAction {
  return value === "open_speak" ? "open_speak" : "none";
}

function normalizeConfidence(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0.6;
  }

  return Math.max(0, Math.min(1, value));
}

function fallbackReply(language: MercyGuideLanguage): string {
  return language === "vi"
    ? "Mình chưa trả lời tốt câu này. Bạn nói rõ hơn một chút nhé."
    : "I could not answer this well yet. Please say it a little more clearly.";
}

function detectLanguage(text: string): MercyGuideLanguage {
  const lower = cleanText(text).toLowerCase();

  const viSignals = [
    "mình",
    "bạn",
    "giúp",
    "phòng",
    "học",
    "thế nào",
    "ở đâu",
    "phát âm",
    "luyện",
    "được không",
    "tiếng việt",
    "xin chào",
    "chào",
  ];

  return viSignals.some((signal) => lower.includes(signal)) ? "vi" : "en";
}

function sanitizeHistory(
  history?: MercyGuideHistoryItem[]
): MercyGuideHistoryItem[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item): item is MercyGuideHistoryItem =>
        !!item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.text === "string"
    )
    .map((item) => {
      const language: MercyGuideLanguage | undefined =
        item.language === "vi"
          ? "vi"
          : item.language === "en"
          ? "en"
          : undefined;

      return {
        role: item.role,
        text: cleanText(item.text),
        language,
      };
    })
    .filter((item) => item.text.length > 0)
    .slice(-6);
}

function sanitizeRequest(
  request: MercyGuideClientRequest
): MercyGuideClientRequest {
  return {
    message: cleanText(request.message),
    room: request.room
      ? {
          id: cleanText(request.room.id) || undefined,
          title: cleanText(request.room.title) || undefined,
          tier: cleanText(request.room.tier) || undefined,
          pathSlug: cleanText(request.room.pathSlug) || undefined,
          tags: Array.isArray(request.room.tags)
            ? request.room.tags.map((tag) => cleanText(tag)).filter(Boolean)
            : undefined,
        }
      : undefined,
    user: request.user
      ? {
          englishLevel: cleanText(request.user.englishLevel) || null,
          learningGoal: cleanText(request.user.learningGoal) || null,
        }
      : undefined,
    history: sanitizeHistory(request.history),
  };
}

function normalizeResponse(
  raw: MercyGuideFunctionResponse | null | undefined,
  requestedMessage: string
): MercyGuideClientResponse {
  const inferredLanguage = detectLanguage(requestedMessage);
  const reply = cleanText(raw?.reply) || fallbackReply(inferredLanguage);

  return {
    reply,
    language: normalizeLanguage(raw?.language ?? inferredLanguage),
    suggestedAction: normalizeSuggestedAction(raw?.suggestedAction),
    confidence: normalizeConfidence(raw?.confidence),
  };
}

export async function askMercyGuide(
  request: MercyGuideClientRequest
): Promise<MercyGuideClientResponse> {
  const safeRequest = sanitizeRequest(request);

  if (!safeRequest.message) {
    const language: MercyGuideLanguage = "en";
    return {
      reply: fallbackReply(language),
      language,
      suggestedAction: "none",
      confidence: 0.2,
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("mercy-guide", {
      body: safeRequest,
    });

    if (error) {
      console.error("askMercyGuide invoke error:", error);
      return normalizeResponse(undefined, safeRequest.message);
    }

    return normalizeResponse(
      (data ?? {}) as MercyGuideFunctionResponse,
      safeRequest.message
    );
  } catch (error) {
    console.error("askMercyGuide failed:", error);
    return normalizeResponse(undefined, safeRequest.message);
  }
}

export default askMercyGuide;