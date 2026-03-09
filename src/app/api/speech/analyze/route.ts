// src/app/api/speech/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  buildGentleFeedback,
  compareTargetToTranscript,
  normalizeText,
  tokenize,
} from "@/lib/speech/speechCompare";
import { transcribeAudio } from "@/lib/speech/transcribeAudio";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const audio = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "");
    const lineId = String(formData.get("lineId") ?? "");
    const targetText = String(formData.get("targetText") ?? "");

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
      return NextResponse.json({
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