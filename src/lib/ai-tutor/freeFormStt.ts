// src/lib/ai-tutor/freeFormStt.ts
//
// Client for the free-form Azure STT edge function (supabase/functions/azure-stt).
// The free-answer mic uses the browser Web Speech API live (instant, but mishears
// VN-accented English: 'hat' -> 'head'). On mic stop we send the recorded audio
// to Azure for a far more accurate transcript and prefer it when it returns.
//
// FAIL-SOFT: returns null on any error / not-configured / use_local sentinel /
// missing auth, so the caller keeps the browser-STT transcript it already has.
// The Azure endpoint itself also fails soft (HTTP 200 {use_local:true}).

import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";

export type TranscribeDeps = {
  fetch: typeof fetch;
  supabaseUrl: string;
  toWav: (blob: Blob) => Promise<Blob>;
};

function defaultDeps(): TranscribeDeps {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
  return {
    fetch: (...args) => fetch(...args),
    supabaseUrl: env.VITE_SUPABASE_URL ?? "",
    toWav: blobToWavPcm16k,
  };
}

/**
 * Transcribe a recorded audio blob via the azure-stt edge function. Returns the
 * trimmed transcript, or null to signal "keep the browser STT result".
 */
export async function transcribeWithAzure(
  blob: Blob | null | undefined,
  language: string,
  accessToken: string | null | undefined,
  deps: TranscribeDeps = defaultDeps(),
): Promise<string | null> {
  if (!blob || !accessToken || !deps.supabaseUrl) return null;
  try {
    const wav = await deps.toWav(blob);
    const formData = new FormData();
    formData.append("audio", wav, "recording.wav");
    formData.append("language", language || "en-US");
    const response = await deps.fetch(`${deps.supabaseUrl}/functions/v1/azure-stt`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { ok?: boolean; transcript?: unknown };
    if (data?.ok !== true || typeof data.transcript !== "string") return null;
    const transcript = data.transcript.trim();
    return transcript || null;
  } catch {
    return null;
  }
}
