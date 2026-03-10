// FILE: src/lib/speech/sendSpeechForAnalysis.ts
// VERSION: MB-SPEECH-1.1-sendSpeechForAnalysis — 2026-03-09
// PURPOSE: Client helper to send recorded audio to the Supabase Edge Function
//          "speech-analyze" and return a typed SpeechAnalysisResponse.
// NOTES:
// - Uses the project's canonical Supabase client: "@/lib/supabaseClient"
// - Sends audio + roomId + lineId + targetText via FormData
// - Handles Edge Function errors and normalizes the response for callers.

import { supabase } from "@/lib/supabaseClient";
import type { SpeechAnalysisResponse } from "./speechTypes";

type SendSpeechForAnalysisInput = {
  audioBlob: Blob;
  roomId: string;
  lineId: string;
  targetText: string;
};

export async function sendSpeechForAnalysis({
  audioBlob,
  roomId,
  lineId,
  targetText,
}: SendSpeechForAnalysisInput): Promise<SpeechAnalysisResponse> {
  const fileExtension = getFileExtensionFromMimeType(audioBlob.type);

  const file = new File([audioBlob], `speech-input.${fileExtension}`, {
    type: audioBlob.type || "audio/webm",
  });

  const formData = new FormData();
  formData.append("audio", file);
  formData.append("roomId", roomId);
  formData.append("lineId", lineId);
  formData.append("targetText", targetText);

  const { data, error } = await supabase.functions.invoke("speech-analyze", {
    body: formData,
  });

  if (error) {
    throw new Error(error.message || "Speech analysis failed.");
  }

  if (!data) {
    throw new Error("Speech analysis returned no data.");
  }

  if ((data as any).error) {
    throw new Error(String((data as any).error));
  }

  return data as SpeechAnalysisResponse;
}

function getFileExtensionFromMimeType(mimeType: string): string {
  const type = String(mimeType || "").toLowerCase();

  if (type.includes("ogg")) return "ogg";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("mpeg")) return "mp3";
  if (type.includes("wav")) return "wav";

  return "webm";
}