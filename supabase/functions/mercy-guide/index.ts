// PATH: supabase/functions/mercy-guide/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";
import { wrapHandler } from "../_shared/sentry.ts";

type ChatRequest = {
  message?: string;
  room?: {
    id?: string;
    title?: string;
    tier?: string;
    pathSlug?: string;
    tags?: string[];
  };
  user?: {
    englishLevel?: string | null;
    learningGoal?: string | null;
  };
  history?: Array<{
    role: "user" | "assistant";
    text: string;
    language?: "vi" | "en";
  }>;
};

type MercyResponse = {
  reply: string;
  language: "vi" | "en";
  suggestedAction: "none" | "open_speak";
  confidence: number;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    },
  });
}

function cleanText(value?: string | null) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function detectLanguage(text: string): "vi" | "en" {
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

function buildSystemPrompt(params: {
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
}) {
  const roomTitle = cleanText(params.roomTitle);
  const tier = cleanText(params.tier);
  const pathSlug = cleanText(params.pathSlug);
  const tags = (params.tags ?? []).map(cleanText).filter(Boolean).join(", ");
  const englishLevel = cleanText(params.englishLevel);
  const learningGoal = cleanText(params.learningGoal);

  return `
You are Mercy Host inside a learning app.

Your job:
- answer naturally, briefly, and concretely
- do not repeat generic filler like "you can ask anything" unless truly needed
- answer in the same language as the user
- if the user asks how to use the app, explain Guide, Teacher, English, and Speak clearly
- if the user asks how to use the room, explain using the room context below
- if the user asks for speaking or pronunciation correction, suggest Speak
- keep responses practical and non-robotic
- return JSON only

Room context:
- roomTitle: ${roomTitle || "unknown"}
- tier: ${tier || "unknown"}
- pathSlug: ${pathSlug || "unknown"}
- tags: ${tags || "unknown"}
- englishLevel: ${englishLevel || "unknown"}
- learningGoal: ${learningGoal || "unknown"}

Return exactly this JSON shape:
{
  "reply": "string",
  "language": "vi" | "en",
  "suggestedAction": "none" | "open_speak",
  "confidence": number
}
`.trim();
}

serve(wrapHandler("mercy-guide", async (req) => {
  if (req.method === "OPTIONS") {
    return json({});
  }

  try {
    const body = (await req.json()) as ChatRequest;
    const message = cleanText(body?.message);

    if (!message) {
      return json({ error: "Missing message" }, 400);
    }

    const language = detectLanguage(message);
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      return json({
        reply:
          language === "vi"
            ? "Mình chưa trả lời tốt câu này. Bạn nói rõ hơn một chút, hoặc thử hỏi ngắn hơn nhé."
            : "I could not answer this well yet. Please say it a little more clearly or ask in a shorter way.",
        language,
        suggestedAction: "none",
        confidence: 0.2,
      } satisfies MercyResponse);
    }

    const systemPrompt = buildSystemPrompt({
      roomTitle: body.room?.title,
      tier: body.room?.tier,
      pathSlug: body.room?.pathSlug,
      tags: body.room?.tags,
      englishLevel: body.user?.englishLevel,
      learningGoal: body.user?.learningGoal,
    });

    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    const messageHistory: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      { role: "system", content: systemPrompt },
      ...history.map((item) => ({
        role: item.role,
        content: cleanText(item.text),
      })),
      { role: "user", content: message },
    ];

    const result = await chatJsonWithFailover({
      systemPrompt,
      userMessage: message,
      messages: messageHistory,
      openaiModel: "gpt-4o-mini",
      temperature: 0.3,
    });

    console.log(
      "[mercy-guide] provider=",
      result.provider,
      "latencyMs=",
      result.latencyMs,
    );

    if (!result.ok) {
      return json({
        reply:
          language === "vi"
            ? "Mình chưa trả lời tốt câu này. Bạn thử lại nhé."
            : "I could not answer this well yet. Please try again.",
        language,
        suggestedAction: "none",
        confidence: 0.2,
      } satisfies MercyResponse);
    }

    const parsed = result.json as Partial<MercyResponse>;

    const reply = cleanText(parsed.reply);
    const outLanguage = parsed.language === "vi" ? "vi" : language;
    const suggestedAction =
      parsed.suggestedAction === "open_speak" ? "open_speak" : "none";

    const confidence =
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0.6;

    if (!reply) {
      return json({
        reply:
          outLanguage === "vi"
            ? "Mình hiểu ý rồi. Bạn nói rõ hơn một chút nhé."
            : "I understand. Please clarify a bit more.",
        language: outLanguage,
        suggestedAction: "none",
        confidence: 0.3,
      } satisfies MercyResponse);
    }

    return json({
      reply,
      language: outLanguage,
      suggestedAction,
      confidence,
    } satisfies MercyResponse);
  } catch (error) {
    console.error("Mercy Guide failed:", error);

    return json({
      reply: "I could not answer this well yet. Please try again.",
      language: "en",
      suggestedAction: "none",
      confidence: 0.1,
    } satisfies MercyResponse);
  }
}));