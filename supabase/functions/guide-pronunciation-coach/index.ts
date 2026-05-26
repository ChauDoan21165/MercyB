// supabase/functions/guide-pronunciation-coach/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.68.4";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "../_shared/rateLimit.ts";
import {
  aiDisabledResponse,
  isAiEnabled,
  isUserAiEnabled,
  logAiUsage,
} from "../_shared/aiUsage.ts";
import {
  buildPronunciationAnalysisResult,
  clamp,
  dedupeStrings,
  estimateSpeechTiming,
  normalizeText,
  safeString,
  type AccentPattern,
  type PronunciationAnalysisResult,
  type PronunciationCategory,
  type PronunciationEvidence,
} from "../_shared/pronunciationAnalysis.ts";

type FocusItem = {
  word: string;
  tip_en: string;
  tip_vi: string;
  category: PronunciationCategory;
  accentPattern: AccentPattern;
};

type Feedback = {
  praise_en: string;
  praise_vi: string;
  focus_items: FocusItem[];
  encouragement_en: string;
  encouragement_vi: string;
};

type SuccessResponse = {
  ok: true;
  targetText: string;
  transcribedText: string;
  score: number;
  feedback: Feedback;
  meta?: {
    expectedDurationMs: number;
    accentPatterns: {
      final_consonant_drop: number;
      vowel_confusion: number;
      stress_shift: number;
      consonant_substitution: number;
    };
    suggestedPractice: string[];
  };
};

type FailureResponse = {
  ok: false;
  error: string;
};

type RequestBody = {
  audioBase64?: unknown;
  targetText?: unknown;
  englishLevel?: unknown;
  preferredName?: unknown;
};

type AuthContext = {
  userId: string | null;
};

type AiCoachingFocusItem = {
  word: string;
  tip_en: string;
  tip_vi: string;
};

type AiCoaching = {
  praise_en: string;
  praise_vi: string;
  focus_items: AiCoachingFocusItem[];
  encouragement_en: string;
  encouragement_vi: string;
};

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const clientIP = getClientIP(req) ?? "unknown";
    const rateLimitOk = await safeCheckRateLimit(clientIP);

    if (!rateLimitOk) {
      return rateLimitResponse(corsHeaders);
    }

    const globallyEnabled = await safeIsAiEnabled();
    if (!globallyEnabled) {
      return aiDisabledResponse(corsHeaders);
    }

    const authContext = await resolveAuthContext(req);

    if (authContext.userId) {
      const userEnabled = await safeIsUserAiEnabled(authContext.userId);
      if (!userEnabled) {
        return aiDisabledResponse(corsHeaders);
      }
    }

    const openAiApiKey = Deno.env.get("OPENAI_API_KEY")?.trim() ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim() ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim() ?? "";

    if (!openAiApiKey) {
      console.error("guide-pronunciation-coach: missing OPENAI_API_KEY");
      return jsonResponse(
        { ok: false, error: "AI service is not configured" },
        500,
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "guide-pronunciation-coach: missing SUPABASE_URL or SUPABASE_ANON_KEY",
      );
      return jsonResponse(
        { ok: false, error: "Server configuration is incomplete" },
        500,
      );
    }

    const body = await safeParseJson<RequestBody>(req);
    if (!body) {
      return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400);
    }

    const audioBase64 = safeString(body.audioBase64);
    const targetText = safeString(body.targetText).slice(0, 120).trim();
    const englishLevel = safeString(body.englishLevel);
    const preferredName = safeString(body.preferredName);

    if (!audioBase64) {
      return jsonResponse({ ok: false, error: "audioBase64 is required" }, 400);
    }

    if (!targetText) {
      return jsonResponse({ ok: false, error: "targetText is required" }, 400);
    }

    if (containsCrisisContent(targetText)) {
      const safeRedirect: SuccessResponse = {
        ok: true,
        targetText,
        transcribedText: "",
        score: 0,
        feedback: {
          praise_en: "Thanks for sharing that.",
          praise_vi: "Cảm ơn bạn đã chia sẻ.",
          focus_items: [],
          encouragement_en:
            "This phrase may need care beyond pronunciation practice. Please reach out to a trusted person or local emergency support right away if someone may be in danger.",
          encouragement_vi:
            "Câu này có thể cần được hỗ trợ ngoài việc luyện phát âm. Nếu có ai đang gặp nguy hiểm, bạn hãy liên hệ ngay với người tin cậy hoặc dịch vụ khẩn cấp tại nơi bạn sống nhé.",
        },
        // Crisis responses use a simple text-based timing estimate because
        // full pronunciation analysis is intentionally skipped for safety.
        meta: {
          expectedDurationMs: estimateSpeechTiming(targetText),
          accentPatterns: {
            final_consonant_drop: 0,
            vowel_confusion: 0,
            stress_shift: 0,
            consonant_substitution: 0,
          },
          suggestedPractice: [],
        },
      };

      return jsonResponse(safeRedirect, 200);
    }

    const audioConversion = base64ToAudioFile(audioBase64);
    if (!audioConversion) {
      return jsonResponse(
        { ok: false, error: "Invalid audioBase64 payload" },
        400,
      );
    }

    const openai = new OpenAI({ apiKey: openAiApiKey });
    const transcribedText = await transcribeAudio(
      openai,
      audioConversion.file,
      targetText,
    );

    const evidence: PronunciationEvidence = {
      targetText,
      transcribedText,
      inputDurationMs: estimateApproxInputDurationMs(audioConversion.bytes),
    };

    const analysisResult = buildPronunciationAnalysisResult(evidence);

    // Skip the extra coaching round-trip only when the attempt is clearly correct.
    // Borderline attempts still go through AI coaching for more helpful feedback.
    const shouldSkipAiCoaching =
      analysisResult.analysis.closenessRatio >= 0.985 &&
      analysisResult.analysis.mismatchCount === 0;

    const coachingResult = shouldSkipAiCoaching
      ? { coaching: null as AiCoaching | null }
      : await generateCoaching(openai, {
        evidence,
        analysisResult,
        englishLevel,
        preferredName,
      });

    const responseBody = mergeAnalysisWithCoaching({
      evidence,
      analysisResult,
      coaching: coachingResult.coaching,
    });

    const response = jsonResponse(responseBody, 200);

    if (authContext.userId) {
      Promise.all([
        coachingResult?.usage
          ? Promise.resolve(
            logAiUsage({
              userId: authContext.userId,
              feature: "guide_pronunciation_coach",
              model: "gpt-4.1-mini",
              usage: coachingResult.usage,
              metadata: {
                targetText,
                transcribedText,
                score: analysisResult.score,
                expectedDurationMs: analysisResult.expectedDurationMs,
                accentPatterns: analysisResult.accentPatterns,
                suggestedPractice: analysisResult.suggestedPractice,
              },
            } as Record<string, unknown>),
          )
          : Promise.resolve(),
        updateCompanionState(supabaseUrl, supabaseAnonKey, req, authContext.userId),
      ]).catch((error) => {
        console.error("Background task error:", error);
      });
    }

    return response;
  } catch (error) {
    console.error("guide-pronunciation-coach: unhandled error", error);
    return jsonResponse(
      { ok: false, error: "Unable to process pronunciation coaching request" },
      500,
    );
  }
});

function jsonResponse(body: SuccessResponse | FailureResponse, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

async function resolveAuthContext(req: Request): Promise<AuthContext> {
  try {
    const authHeader = req.headers.get("Authorization")?.trim() ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim() ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim() ?? "";

    if (!authHeader || !supabaseUrl || !supabaseAnonKey) {
      return { userId: null };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("guide-pronunciation-coach: auth lookup failed", error);
      return { userId: null };
    }

    return { userId: data.user?.id ?? null };
  } catch (error) {
    console.error("guide-pronunciation-coach: resolveAuthContext failed", error);
    return { userId: null };
  }
}

async function updateCompanionState(
  supabaseUrl: string,
  supabaseAnonKey: string,
  req: Request,
  userId: string,
): Promise<void> {
  try {
    const authHeader = req.headers.get("Authorization")?.trim() ?? "";

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: authHeader
        ? {
          headers: {
            Authorization: authHeader,
          },
        }
        : undefined,
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("companion_state")
      .upsert(
        {
          user_id: userId,
          last_english_activity: now,
          last_active_at: now,
        },
        { onConflict: "user_id" },
      );

    if (error) {
      console.error(
        "guide-pronunciation-coach: companion_state update failed",
        error,
      );
    }
  } catch (error) {
    console.error("guide-pronunciation-coach: companion state error", error);
  }
}

async function safeCheckRateLimit(clientIP: string): Promise<boolean> {
  try {
    const result = await Promise.resolve(
      checkRateLimit({
        key: `guide-pronunciation-coach:${clientIP}`,
        limit: 10,
        windowMs: 60_000,
      } as Record<string, unknown>),
    );

    if (typeof result === "boolean") return result;
    if (result && typeof (result as { allowed?: unknown }).allowed === "boolean") {
      return Boolean((result as { allowed: boolean }).allowed);
    }
    return true;
  } catch (error) {
    console.error("guide-pronunciation-coach: rate limit check failed", error);
    return true;
  }
}

async function safeIsAiEnabled(): Promise<boolean> {
  try {
    const result = await Promise.resolve(isAiEnabled() as unknown);
    return typeof result === "boolean" ? result : true;
  } catch (error) {
    console.error("guide-pronunciation-coach: isAiEnabled failed", error);
    return true;
  }
}

async function safeIsUserAiEnabled(userId: string): Promise<boolean> {
  try {
    const result = await Promise.resolve(isUserAiEnabled(userId) as unknown);
    return typeof result === "boolean" ? result : true;
  } catch (error) {
    console.error("guide-pronunciation-coach: isUserAiEnabled failed", error);
    return true;
  }
}

async function safeParseJson<T>(req: Request): Promise<T | null> {
  try {
    return await req.json() as T;
  } catch {
    return null;
  }
}

function parseDataUrlAudio(input: string): { mimeType: string; base64: string } {
  const raw = safeString(input);
  const match = raw.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) {
    return {
      mimeType: safeString(match[1]) || "audio/webm",
      base64: safeString(match[2]),
    };
  }

  return {
    mimeType: "audio/webm",
    base64: raw,
  };
}

function mimeTypeToExtension(mimeType: string): string {
  const normalized = safeString(mimeType).toLowerCase();
  if (normalized.includes("webm")) return "webm";
  if (normalized.includes("wav")) return "wav";
  if (normalized.includes("mpeg") || normalized.includes("mp3")) return "mp3";
  if (normalized.includes("mp4") || normalized.includes("m4a")) return "m4a";
  if (normalized.includes("ogg")) return "ogg";
  return "webm";
}

function decodeBase64(base64: string): Uint8Array | null {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function base64ToAudioFile(
  audioBase64: string,
): { file: File; bytes: Uint8Array; mimeType: string } | null {
  const { mimeType, base64 } = parseDataUrlAudio(audioBase64);
  if (!base64) return null;

  const bytes = decodeBase64(base64);
  if (!bytes || bytes.byteLength === 0) return null;

  const extension = mimeTypeToExtension(mimeType);
  return {
    bytes,
    mimeType,
    file: new File([bytes], `speech.${extension}`, {
      type: mimeType || "audio/webm",
    }),
  };
}

// Rough byte-size-based duration estimate only.
// Useful as soft metadata, not as a precise timing source.
function estimateApproxInputDurationMs(bytes: Uint8Array): number | undefined {
  if (!bytes.byteLength) return undefined;
  const estimated = Math.round((bytes.byteLength / 16000) * 1000);
  return estimated > 0 ? estimated : undefined;
}

async function transcribeAudio(
  openai: OpenAI,
  audioFile: File,
  targetText: string,
): Promise<string> {
  try {
    const result = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
      language: "en",
      prompt: targetText,
    });

    return safeString(result?.text);
  } catch (error) {
    console.error("guide-pronunciation-coach: transcription failed", error);
    return "";
  }
}

async function generateCoaching(
  openai: OpenAI,
  input: {
    evidence: PronunciationEvidence;
    analysisResult: PronunciationAnalysisResult;
    englishLevel: string;
    preferredName: string;
  },
): Promise<{ coaching: AiCoaching | null; usage?: unknown }> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You generate short bilingual pronunciation coaching in Mercy style.",
            "Return JSON only.",
            "Use exactly these top-level keys: praise_en, praise_vi, focus_items, encouragement_en, encouragement_vi.",
            "Each focus_items object must contain exactly: word, tip_en, tip_vi.",
            "Do not generate score.",
            "Do not generate extra keys.",
            "Do not invent unsupported analysis.",
            "Do not contradict deterministic focus items.",
            "If deterministic focus items exist, prefer those words first.",
            "Do not introduce different focus words when deterministic focus items are already provided.",
            "Keep the same ranking and order as deterministic focus items when possible.",
            "Use focus words only from candidateFocusWords, missingWords, or substitution targets in the supplied analysis.",
            "If deterministic analysis suggests ending_sound, give a practical tip about releasing the ending sound gently and clearly.",
            "If deterministic analysis suggests vowel_length, give a practical tip about holding the vowel a little longer or making it clearer.",
            "If deterministic analysis suggests word_stress, give a practical tip about rhythm or emphasis.",
            "Vietnamese learners often soften or drop final consonants, but keep coaching gentle and only mention what is supported here.",
            "Keep the tone calm, supportive, concise, practical, and non-judgmental.",
            "Do not use technical phonetics jargon.",
            "Prefer one strong tip over several weak tips.",
            "Return at most 3 focus items.",
            "If the phrase is very close, return an empty focus_items array.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            targetText: input.evidence.targetText,
            transcribedText: input.evidence.transcribedText,
            englishLevel: input.englishLevel || null,
            preferredName: input.preferredName || null,
            analysis: {
              missingWords: input.analysisResult.analysis.missingWords,
              substitutedPairs: input.analysisResult.analysis.substitutedPairs,
              candidateFocusWords: input.analysisResult.analysis.candidateFocusWords,
              closenessRatio: input.analysisResult.analysis.closenessRatio,
              mismatchCount: input.analysisResult.analysis.mismatchCount,
              deterministicFocusItems: input.analysisResult.focusItems.map((item) => ({
                word: item.word,
                category: item.category,
                accentPattern: item.accentPattern,
              })),
            },
          }),
        },
      ],
    });

    const content = safeString(completion.choices?.[0]?.message?.content);
    const parsed = tryParseJson(content);

    if (!parsed || typeof parsed !== "object") {
      return { coaching: null, usage: completion.usage };
    }

    const record = parsed as Record<string, unknown>;
    const coaching: AiCoaching = {
      praise_en: safeString(record.praise_en),
      praise_vi: safeString(record.praise_vi),
      encouragement_en: safeString(record.encouragement_en),
      encouragement_vi: safeString(record.encouragement_vi),
      focus_items: Array.isArray(record.focus_items)
        ? record.focus_items.map((item) => {
          const row = (item ?? {}) as Record<string, unknown>;
          return {
            word: safeString(row.word),
            tip_en: safeString(row.tip_en),
            tip_vi: safeString(row.tip_vi),
          };
        })
        : [],
    };

    return {
      coaching,
      usage: completion.usage,
    };
  } catch (error) {
    console.error("guide-pronunciation-coach: coaching generation failed", error);
    return { coaching: null };
  }
}

function buildFallbackCoaching(
  evidence: PronunciationEvidence,
  analysisResult: PronunciationAnalysisResult,
): AiCoaching {
  const closeEnough =
    analysisResult.analysis.closenessRatio >= 0.9 &&
    analysisResult.analysis.mismatchCount <= 1;

  const focus_items = closeEnough
    ? []
    : analysisResult.focusItems.slice(0, 3).map((item) => ({
      word: item.word,
      tip_en:
        item.category === "ending_sound"
          ? "Try releasing the ending sound a little more clearly."
          : item.category === "vowel_length"
          ? "Try holding the vowel a little longer and more clearly."
          : item.category === "word_stress"
          ? "Try saying this word with a steadier rhythm."
          : "Try saying this word a little more clearly.",
      tip_vi:
        item.category === "ending_sound"
          ? "Bạn thử nhả âm cuối rõ hơn và nhẹ hơn một chút nhé."
          : item.category === "vowel_length"
          ? "Bạn thử giữ âm nguyên âm lâu hơn và rõ hơn một chút nhé."
          : item.category === "word_stress"
          ? "Bạn thử giữ nhịp từ này đều hơn một chút nhé."
          : "Bạn thử đọc rõ từ này hơn một chút nhé.",
    }));

  return {
    praise_en: evidence.transcribedText
      ? analysisResult.score >= 85
        ? "Nice work. That was close and clear."
        : "Nice try. You are getting close."
      : "Thanks for trying that phrase.",
    praise_vi: evidence.transcribedText
      ? analysisResult.score >= 85
        ? "Bạn đọc khá rõ và rất gần đúng rồi."
        : "Bạn đã cố gắng tốt. Mình đang tiến gần hơn rồi."
      : "Cảm ơn bạn đã thử đọc câu này nhé.",
    focus_items,
    encouragement_en: closeEnough
      ? "You're doing well. Keep the same steady pace."
      : focus_items.length > 0
      ? "Let’s adjust one small part and try again."
      : "Take it slowly and try the full phrase once more.",
    encouragement_vi: closeEnough
      ? "Bạn làm tốt lắm. Giữ nhịp đọc đều như vậy nhé."
      : focus_items.length > 0
      ? "Mình chỉnh một chút thôi, rồi bạn thử lại nhé."
      : "Bạn đọc chậm lại một chút và thử lại cả câu nhé.",
  };
}

function normalizeAiCoaching(coaching: AiCoaching | null | undefined): AiCoaching | null {
  if (!coaching) return null;

  const focus_items = Array.isArray(coaching.focus_items)
    ? coaching.focus_items
      .map((item) => ({
        word: safeString(item?.word),
        tip_en: safeString(item?.tip_en),
        tip_vi: safeString(item?.tip_vi),
      }))
      .filter((item) => item.word)
      .slice(0, 3)
    : [];

  return {
    praise_en: safeString(coaching.praise_en),
    praise_vi: safeString(coaching.praise_vi),
    encouragement_en: safeString(coaching.encouragement_en),
    encouragement_vi: safeString(coaching.encouragement_vi),
    focus_items,
  };
}

function buildCoachingMap(
  coaching: AiCoaching | null,
): Map<string, AiCoachingFocusItem> {
  const map = new Map<string, AiCoachingFocusItem>();
  if (!coaching) return map;

  for (const item of coaching.focus_items) {
    const key = normalizeText(item.word);
    if (!key || map.has(key)) continue;
    map.set(key, item);
  }

  return map;
}

function mergeAnalysisWithCoaching(input: {
  evidence: PronunciationEvidence;
  analysisResult: PronunciationAnalysisResult;
  coaching: AiCoaching | null | undefined;
}): SuccessResponse {
  const { evidence, analysisResult } = input;

  const normalizedCoaching = normalizeAiCoaching(input.coaching);
  const fallbackCoaching = buildFallbackCoaching(evidence, analysisResult);
  const coachingMap = buildCoachingMap(normalizedCoaching);

  const closeEnough =
    analysisResult.analysis.closenessRatio >= 0.92 &&
    analysisResult.analysis.mismatchCount <= 1;

  const focus_items: FocusItem[] = closeEnough
    ? []
    : analysisResult.focusItems
      .slice(0, 3)
      .map((analysisItem) => {
        const coachingItem = coachingMap.get(normalizeText(analysisItem.word));
        const fallbackItem = fallbackCoaching.focus_items.find((item) =>
          normalizeText(item.word) === normalizeText(analysisItem.word)
        );

        return {
          word: analysisItem.word,
          category: analysisItem.category,
          accentPattern: analysisItem.accentPattern,
          tip_en:
            safeString(coachingItem?.tip_en) ||
            safeString(fallbackItem?.tip_en) ||
            "Try saying this word a little more clearly.",
          tip_vi:
            safeString(coachingItem?.tip_vi) ||
            safeString(fallbackItem?.tip_vi) ||
            "Bạn thử đọc rõ từ này hơn một chút nhé.",
        };
      })
      .filter((item) => item.word && (item.tip_en || item.tip_vi));

  return {
    ok: true,
    targetText: safeString(evidence.targetText),
    transcribedText: safeString(evidence.transcribedText),
    score: clamp(analysisResult.score, 0, 100),
    feedback: {
      praise_en:
        safeString(normalizedCoaching?.praise_en) || fallbackCoaching.praise_en,
      praise_vi:
        safeString(normalizedCoaching?.praise_vi) || fallbackCoaching.praise_vi,
      focus_items,
      encouragement_en:
        safeString(normalizedCoaching?.encouragement_en) ||
        fallbackCoaching.encouragement_en,
      encouragement_vi:
        safeString(normalizedCoaching?.encouragement_vi) ||
        fallbackCoaching.encouragement_vi,
    },
    meta: {
      expectedDurationMs: analysisResult.expectedDurationMs,
      accentPatterns: analysisResult.accentPatterns,
      suggestedPractice: dedupeStrings(analysisResult.suggestedPractice).slice(0, 3),
    },
  };
}

function tryParseJson(input: string): unknown | null {
  const raw = safeString(input);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function containsCrisisContent(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  const phrases = [
    "kill myself",
    "end my life",
    "want to die",
    "suicide",
    "self harm",
    "hurt myself",
    "overdose",
    "stop breathing",
    "chest pain",
    "heart attack",
    "stroke",
    "bleeding heavily",
    "medical emergency",
    "call an ambulance",
    "go to the emergency room",
    "go to the hospital now",
    "not breathing",
    "unconscious",
    "i want to die",
    "toi muon chet",
    "tu tu",
    "tu sat",
    "cap cuu",
    "ngung tho",
    "dau tim",
    "dot quy",
    "mat nhieu mau",
  ];

  return phrases.some((phrase) => normalized.includes(phrase));
}