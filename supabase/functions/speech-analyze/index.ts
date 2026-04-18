// Path: supabase/functions/speech-analyze/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAiApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

type ComparisonResult = {
  normalizedTranscript: string;
  normalizedTarget: string;
  matchScore: number; // 0..100 for UI
  missingWords: string[];
  extraWords: string[];
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();

    const audio = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "").trim();
    const lineId = String(formData.get("lineId") ?? "").trim();
    const targetText = String(formData.get("targetText") ?? "").trim();
    const userIdRaw = String(formData.get("userId") ?? "").trim();
    const userId = userIdRaw || null;

    if (!(audio instanceof File)) {
      return json({ error: "Missing audio file" }, 400);
    }

    if (!roomId || !lineId || !targetText) {
      return json({ error: "Missing roomId, lineId, or targetText" }, 400);
    }

    const arrayBuffer = await audio.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const transcript = await transcribeAudio(fileBuffer, audio.type);

    if (!transcript.trim()) {
      const noSpeechResponse = {
        transcript: "",
        normalizedTranscript: "",
        normalizedTarget: normalizeText(targetText),
        matchScore: 0,
        missingWords: tokenize(targetText),
        extraWords: [],
        message:
          "We could not hear the sentence clearly. Try once more, slowly and close to the microphone.",
      };

      await logAttempt({
        userId,
        roomId,
        targetText,
        matchScore: 0,
        missingWords: noSpeechResponse.missingWords,
        extraWords: [],
        transcript: "",
      });

      return json(noSpeechResponse, 200);
    }

    const comparison = compareTargetToTranscript(targetText, transcript);
    const message = buildGentleFeedback({
      score: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
    });

    await logAttempt({
      userId,
      roomId,
      targetText,
      matchScore: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
      transcript,
    });

    return json(
      {
        transcript,
        normalizedTranscript: comparison.normalizedTranscript,
        normalizedTarget: comparison.normalizedTarget,
        matchScore: comparison.matchScore,
        missingWords: comparison.missingWords,
        extraWords: comparison.extraWords,
        message,
      },
      200,
    );
  } catch (err) {
    console.error("speech-analyze error", err);

    const message =
      err instanceof Error ? err.message : "Speech analysis failed";

    return json({ error: message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeText(input: string): string {
  return String(input ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

function compareTargetToTranscript(
  targetText: string,
  transcript: string,
): ComparisonResult {
  const normalizedTarget = normalizeText(targetText);
  const normalizedTranscript = normalizeText(transcript);

  const targetTokens = tokenize(targetText);
  const transcriptTokens = tokenize(transcript);

  const transcriptCounts = new Map<string, number>();
  for (const token of transcriptTokens) {
    transcriptCounts.set(token, (transcriptCounts.get(token) ?? 0) + 1);
  }

  const missingWords: string[] = [];
  let matchedCount = 0;

  for (const token of targetTokens) {
    const count = transcriptCounts.get(token) ?? 0;
    if (count > 0) {
      transcriptCounts.set(token, count - 1);
      matchedCount += 1;
    } else {
      missingWords.push(token);
    }
  }

  const extraWords: string[] = [];
  const targetCounts = new Map<string, number>();
  for (const token of targetTokens) {
    targetCounts.set(token, (targetCounts.get(token) ?? 0) + 1);
  }

  for (const token of transcriptTokens) {
    const count = targetCounts.get(token) ?? 0;
    if (count > 0) {
      targetCounts.set(token, count - 1);
    } else {
      extraWords.push(token);
    }
  }

  const denominator = Math.max(targetTokens.length, 1);
  const rawScore = (matchedCount / denominator) * 100;
  const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    normalizedTranscript,
    normalizedTarget,
    matchScore,
    missingWords,
    extraWords,
  };
}

function buildGentleFeedback(params: {
  score: number;
  missingWords: string[];
  extraWords: string[];
}): string {
  const { score, missingWords, extraWords } = params;

  if (score >= 95) {
    return "Excellent. You said the sentence very clearly.";
  }

  if (score >= 80) {
    return "Good job. Try once more to make it even smoother.";
  }

  if (score >= 60) {
    if (missingWords.length > 0) {
      return `Good try. Listen again and include these words: ${missingWords
        .slice(0, 3)
        .join(", ")}.`;
    }
    return "Good try. Say it again slowly and keep the same word order.";
  }

  if (missingWords.length > 0) {
    return `Try again slowly. Focus on these words: ${missingWords
      .slice(0, 4)
      .join(", ")}.`;
  }

  if (extraWords.length > 0) {
    return "Try again using only the target sentence.";
  }

  return "Try once more, slowly and clearly.";
}

async function transcribeAudio(
  audioBytes: Uint8Array,
  mimeType: string,
): Promise<string> {
  if (!openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing for speech-analyze.");
  }

  const fileExtension = getFileExtensionFromMimeType(mimeType);
  const audioBlob = new Blob([audioBytes], {
    type: mimeType || "audio/webm",
  });

  const form = new FormData();
  form.append(
    "file",
    new File([audioBlob], `speech-input.${fileExtension}`, {
      type: mimeType || "audio/webm",
    }),
  );
  form.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI transcription error: ${errText}`);
  }

  const data = (await response.json()) as { text?: string };
  return String(data?.text ?? "").trim();
}

function getFileExtensionFromMimeType(mimeType: string): string {
  const type = String(mimeType || "").toLowerCase();

  if (type.includes("ogg")) return "ogg";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("mpeg")) return "mp3";
  if (type.includes("wav")) return "wav";

  return "webm";
}

async function logAttempt(params: {
  userId: string | null;
  roomId: string;
  targetText: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
  transcript: string;
}) {
  if (!params.userId) return;

  const payload = {
    user_id: params.userId,
    room_id: params.roomId,
    sentence: params.targetText,
    overall_score: Number((params.matchScore / 100).toFixed(4)),
    phoneme_accuracy: null,
    corrections_count: params.missingWords.length + params.extraWords.length,
    org_id: params.userId,
    improvement_score: null,
    prompt_text: params.targetText,
  };

  const { error } = await supabase.from("mb_pronunciation_attempts").insert(payload);

  if (error) {
    console.error("insert attempt error", error);
  }
}