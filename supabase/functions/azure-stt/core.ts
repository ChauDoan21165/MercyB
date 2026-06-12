// supabase/functions/azure-stt/core.ts
//
// LADDER / voice-lane Step — FREE-FORM Azure speech-to-text (no referenceText).
//
// WHY: the free-answer mic ('Nhập bằng giọng nói') uses the browser Web Speech
// API, which mishears VN-accented English ('hat' -> 'head'). This calls Azure's
// short-audio REST recognition (no Pronunciation-Assessment, no ReferenceText)
// to get a far better transcript. azure-phoneme is referenceText-only (PA), so
// it cannot serve this path — hence a dedicated, lean function.
//
// SCOPE (Phase A): free-form recognition only. PhraseList biasing requires the
// Speech SDK (PhraseListGrammar), which the REST endpoint does not support — a
// separate Phase-B follow-up.
//
// CONTRACT: fail-soft. On any error / non-Success status / missing key, returns
// HTTP 200 { ok:false, use_local:true, reason } so the caller silently falls
// back to the browser STT it already has. The recognition NEVER throws upward.
//
// The split (core.ts + index.ts) mirrors azure-phoneme so vitest can exercise
// handleRequest() under Node with fake deps.

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export type SttReason =
  | "missing_audio"
  | "empty_audio"
  | "azure_unconfigured"
  | "azure_failed"
  | "no_speech"
  | "bad_request";

export type SttSuccess = { ok: true; transcript: string };
export type SttFallback = { ok: false; use_local: true; reason: SttReason };

/** Injected dependencies — production wires real fetch/env; tests fake them. */
export type Deps = {
  fetch: (input: string, init: RequestInit) => Promise<Response>;
  azureKey: string;
  /** Build the Azure recognition URL for a BCP-47 language (region pre-baked). */
  azureUrlForLanguage: (language: string) => string;
};

const MIN_AUDIO_BYTES = 1024;
const DEFAULT_LANGUAGE = "en-US";

type AzureRecognition = { RecognitionStatus?: string; DisplayText?: string };

export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Fail-soft sentinel: HTTP 200 so the client treats it as "use browser STT". */
function fallback(reason: SttReason): Response {
  return json({ ok: false, use_local: true, reason } satisfies SttFallback, 200);
}

function normalizeLanguage(raw: unknown): string {
  const v = typeof raw === "string" ? raw.trim() : "";
  // Accept BCP-47-ish tags only; default otherwise (never trust arbitrary input).
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(v) ? v : DEFAULT_LANGUAGE;
}

export async function handleRequest(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") return fallback("bad_request");

  let audioBytes: ArrayBuffer;
  let language = DEFAULT_LANGUAGE;
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    language = normalizeLanguage(formData.get("language"));
    if (!audio || typeof audio === "string") return fallback("missing_audio");
    audioBytes = await (audio as Blob).arrayBuffer();
  } catch {
    return fallback("bad_request");
  }

  if (!audioBytes || audioBytes.byteLength < MIN_AUDIO_BYTES) return fallback("empty_audio");
  if (!deps.azureKey) return fallback("azure_unconfigured");

  let recognition: AzureRecognition | null = null;
  try {
    const response = await deps.fetch(deps.azureUrlForLanguage(language), {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": deps.azureKey,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        Accept: "application/json",
      },
      body: audioBytes,
    });
    if (!response.ok) return fallback("azure_failed");
    recognition = (await response.json()) as AzureRecognition;
  } catch {
    return fallback("azure_failed");
  }

  if (!recognition || recognition.RecognitionStatus !== "Success") {
    // NoMatch / InitialSilenceTimeout / BabbleTimeout → no usable speech.
    return fallback("no_speech");
  }
  const transcript = typeof recognition.DisplayText === "string" ? recognition.DisplayText.trim() : "";
  if (!transcript) return fallback("no_speech");

  return json({ ok: true, transcript } satisfies SttSuccess, 200);
}
