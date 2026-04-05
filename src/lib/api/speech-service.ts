// PATH: src/lib/api/speech-service.ts

import { supabase } from "@/lib/supabaseClient";

export type SpeechUserOrigin = "HANOI" | "SAIGON" | "OTHER";
export type SpeechTierLevel = "FREE" | "VIP1" | "VIP2" | "VIP3";

export interface SpeechAnalysisRequest {
  blob: Blob;
  roomId: string;
  lineId: string;
  targetText: string;
  userOrigin: SpeechUserOrigin;
  tierLevel: SpeechTierLevel;
}

export interface SpeechAnalysisResponse {
  ok?: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  transcript?: string;
  normalizedTranscript?: string;
  comparison?: unknown;
  feedback?: unknown;
  score?: number | null;
  accuracy?: number | null;
  [key: string]: unknown;
}

type ErrorPayload = {
  error?: unknown;
  message?: unknown;
  detail?: unknown;
};

function getSupabaseUrl(): string {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();

  if (!url) {
    throw new Error("VITE_SUPABASE_URL is missing.");
  }

  return url;
}

function getErrorMessage(payload: ErrorPayload | null | undefined): string {
  if (!payload) return "Speech analysis failed";

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  return "Speech analysis failed";
}

/**
 * Sends audio blob and metadata to the `speech-analyze` Edge Function.
 */
export async function analyzeSpeech({
  blob,
  roomId,
  lineId,
  targetText,
  userOrigin,
  tierLevel,
}: SpeechAnalysisRequest): Promise<SpeechAnalysisResponse> {
  if (!(blob instanceof Blob)) {
    throw new Error("A valid audio blob is required.");
  }

  if (!roomId.trim()) {
    throw new Error("roomId is required.");
  }

  if (!lineId.trim()) {
    throw new Error("lineId is required.");
  }

  if (!targetText.trim()) {
    throw new Error("targetText is required.");
  }

  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");
  formData.append("roomId", roomId);
  formData.append("lineId", lineId);
  formData.append("targetText", targetText);
  formData.append("userOrigin", userOrigin);
  formData.append("tierLevel", tierLevel);

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message || "Failed to get auth session.");
  }

  if (!session?.access_token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${getSupabaseUrl()}/functions/v1/speech-analyze`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    },
  );

  const raw = (await response.json().catch(() => null)) as
    | SpeechAnalysisResponse
    | ErrorPayload
    | null;

  if (!response.ok) {
    throw new Error(getErrorMessage(raw as ErrorPayload | null));
  }

  return (raw ?? {}) as SpeechAnalysisResponse;
}

export default analyzeSpeech;