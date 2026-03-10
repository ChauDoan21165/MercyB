// src/speech/speech-service.ts

import { supabase } from "@/lib/supabaseClient";

type AnalyzeSpeechArgs = {
  audioBlob: Blob;
  roomId: string;
  lineId: string;
  targetText: string;
};

export type AnalyzeSpeechResult = {
  transcript: string;
  normalizedTranscript: string;
  normalizedTarget: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
  intent?: string;
  message: string;
};

function getFunctionsBaseUrl(): string {
  return String(import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || "")
    .trim()
    .replace(/\/+$/, "");
}

function pickFileNameFromBlob(blob: Blob): string {
  const type = String(blob.type || "").toLowerCase();

  if (type.includes("webm")) return "speech.webm";
  if (type.includes("ogg")) return "speech.ogg";
  if (type.includes("wav")) return "speech.wav";
  if (type.includes("mp4")) return "speech.mp4";
  if (type.includes("mpeg")) return "speech.mp3";
  return "speech.webm";
}

export async function analyzeSpeech({
  audioBlob,
  roomId,
  lineId,
  targetText,
}: AnalyzeSpeechArgs): Promise<AnalyzeSpeechResult> {
  const functionsBaseUrl = getFunctionsBaseUrl();

  if (!functionsBaseUrl) {
    throw new Error("Missing VITE_SUPABASE_FUNCTIONS_URL");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("Not signed in");
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, pickFileNameFromBlob(audioBlob));
  formData.append("roomId", roomId);
  formData.append("lineId", lineId);
  formData.append("targetText", targetText);

  const response = await fetch(`${functionsBaseUrl}/speech-analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(String(json?.error || `Analyze failed: ${response.status}`));
  }

  return json as AnalyzeSpeechResult;
}