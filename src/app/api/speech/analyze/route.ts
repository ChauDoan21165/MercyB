// Path: src/app/api/speech/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  buildGentleFeedback,
  compareTargetToTranscript,
  normalizeText,
  tokenize,
} from "@/lib/speech/speechCompare";
import { transcribeAudio } from "@/lib/speech/transcribeAudio";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function logPronunciationAttempt(params: {
  userId: string | null;
  roomId: string;
  targetText: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
  transcript: string;
}) {
  if (!params.userId) return;

  const supabase = getServerSupabase();
  if (!supabase) return;

  const notesParts: string[] = [];

  if (params.transcript.trim()) {
    notesParts.push(`transcript=${params.transcript.trim()}`);
  }

  if (params.missingWords.length > 0) {
    notesParts.push(`missing=${params.missingWords.join(", ")}`);
  }

  if (params.extraWords.length > 0) {
    notesParts.push(`extra=${params.extraWords.join(", ")}`);
  }

  const payload = {
    user_id: params.userId,
    room_id: params.roomId,
    sentence: params.targetText,
    overall_score: params.matchScore,
    phoneme_accuracy: null,
    corrections_count: params.missingWords.length + params.extraWords.length,
    org_id: params.userId,
    improvement_score: null,
    prompt_text: params.targetText,
  };

  const { error } = await supabase.from("mb_pronunciation_attempts").insert(payload);

  if (error) {
    console.error("speech analyze route attempt log error", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const audio = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "").trim();
    const lineId = String(formData.get("lineId") ?? "").trim();
    const targetText = String(formData.get("targetText") ?? "").trim();
    const userIdRaw = String(formData.get("userId") ?? "").trim();
    const userId = userIdRaw || null;

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
    }

    if (!roomId || !lineId || !targetText) {
      return NextResponse.json(
        { error: "Missing roomId, lineId, or targetText" },
        { status: 400 }
      );
    }

    const arrayBuffer = await audio.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

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

      await logPronunciationAttempt({
        userId,
        roomId,
        targetText,
        matchScore: 0,
        missingWords: noSpeechResponse.missingWords,
        extraWords: [],
        transcript: "",
      });

      return NextResponse.json(noSpeechResponse);
    }

    const comparison = compareTargetToTranscript(targetText, transcript);
    const message = buildGentleFeedback({
      score: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
    });

    await logPronunciationAttempt({
      userId,
      roomId,
      targetText,
      matchScore: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
      transcript,
    });

    return NextResponse.json({
      transcript,
      normalizedTranscript: comparison.normalizedTranscript,
      normalizedTarget: comparison.normalizedTarget,
      matchScore: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
      message,
    });
  } catch (error) {
    console.error("speech analyze route error", error);

    const message =
      error instanceof Error ? error.message : "Speech analysis failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}