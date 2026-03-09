// supabase/functions/speech-analyze/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s']/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(input: string): string[] {
  const s = normalizeText(input);
  return s ? s.split(" ") : [];
}

function compareTargetToTranscript(targetText: string, transcript: string) {
  const normalizedTarget = normalizeText(targetText);
  const normalizedTranscript = normalizeText(transcript);

  const targetTokens = tokenize(targetText);
  const heardTokens = tokenize(transcript);

  const heardCounts = new Map<string, number>();
  for (const token of heardTokens) {
    heardCounts.set(token, (heardCounts.get(token) ?? 0) + 1);
  }

  const matched: string[] = [];
  const missingWords: string[] = [];

  for (const token of targetTokens) {
    const count = heardCounts.get(token) ?? 0;
    if (count > 0) {
      matched.push(token);
      heardCounts.set(token, count - 1);
    } else {
      missingWords.push(token);
    }
  }

  const extraWords: string[] = [];
  for (const [token, count] of heardCounts.entries()) {
    for (let i = 0; i < count; i += 1) extraWords.push(token);
  }

  const matchScore =
    targetTokens.length === 0 ? 0 : matched.length / targetTokens.length;

  return {
    normalizedTarget,
    normalizedTranscript,
    matchScore: Number(matchScore.toFixed(4)),
    missingWords,
    extraWords,
  };
}

function buildGentleFeedback(args: {
  score: number;
  missingWords: string[];
  extraWords: string[];
}): string {
  const { score, missingWords, extraWords } = args;

  if (score >= 0.9) {
    return "Beautiful. You were very close.";
  }

  if (score >= 0.75) {
    if (missingWords.length > 0) {
      return `Good attempt. Try once more slowly and include "${missingWords
        .slice(0, 2)
        .join(" ")}".`;
    }
    return "Good attempt. Try once more slowly and clearly.";
  }

  if (score >= 0.55) {
    if (missingWords.length > 0) {
      return `You're getting there. Read the sentence once, then try again with "${missingWords
        .slice(0, 2)
        .join(" ")}".`;
    }
    return "You're getting there. Read the sentence once, then try again.";
  }

  if (extraWords.length > 0) {
    return "Take a calm breath and try one short part at a time.";
  }

  return "Take a calm breath and try again slowly, one part at a time.";
}

serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await req.formData();

    const audio = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "").trim();
    const lineId = String(formData.get("lineId") ?? "").trim();
    const targetText = String(formData.get("targetText") ?? "").trim();

    if (!(audio instanceof File)) {
      return jsonResponse({ error: "Missing audio file" }, 400);
    }

    if (!roomId || !lineId || !targetText) {
      return jsonResponse({ error: "Missing roomId, lineId, or targetText" }, 400);
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const sttForm = new FormData();
    sttForm.append("file", audio, audio.name || "speech.webm");
    sttForm.append("model", "gpt-4o-mini-transcribe");
    sttForm.append("language", "en");
    sttForm.append(
      "prompt",
      "Transcribe the spoken English sentence clearly for an English learning app."
    );

    const sttRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
      },
      body: sttForm,
    });

    if (!sttRes.ok) {
      const text = await sttRes.text();
      return jsonResponse({ error: `OpenAI transcription error: ${text}` }, 500);
    }

    const sttJson = await sttRes.json();
    const transcript =
      typeof sttJson?.text === "string" ? sttJson.text.trim() : "";

    if (!transcript) {
      return jsonResponse({
        transcript: "",
        normalizedTranscript: "",
        normalizedTarget: normalizeText(targetText),
        matchScore: 0,
        missingWords: tokenize(targetText),
        extraWords: [],
        message:
          "We could not hear the sentence clearly. Try once more, slowly and close to the microphone.",
      });
    }

    const comparison = compareTargetToTranscript(targetText, transcript);
    const message = buildGentleFeedback({
      score: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
    });

    return jsonResponse({
      transcript,
      normalizedTranscript: comparison.normalizedTranscript,
      normalizedTarget: comparison.normalizedTarget,
      matchScore: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
      message,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Speech analysis failed";
    return jsonResponse({ error: message }, 500);
  }
});